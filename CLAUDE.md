@AGENTS.md

# A Detail — project notes

Mobile car detailing site. Next.js (App Router) + TypeScript + Supabase (Postgres, auth, RLS) + Stripe + Resend + Google Calendar, deployed on Vercel.

## Key files

- `src/lib/site-config.ts` — business info, pricing, packages, `adminEmail`, `businessTimeZone` ("America/Los_Angeles").
- `src/lib/admin.ts` — `isAdmin(email)`, gates `/admin` at the app layer.
- `src/lib/booking-availability.ts` — pure scheduling logic (business hours, duration lookup, conflict detection) for the public booking calendar. No I/O.
- `src/lib/supabase/{client,server,service-role}.ts` — three Supabase clients: browser, session-bound server (cookies, respects RLS), and service-role (bypasses RLS, server-only, never import into client code).
- `src/lib/actions/{bookings,consultations,fleet,payments,auth,admin}.ts` — server actions behind the public forms and admin page.
- `src/lib/google/calendar.ts` — Calendar OAuth client + `createCalendarEvent`. Own OAuth client, separate from the "Sign in with Google" one.
- `src/app/api/cron/generate-recurring/route.ts` — daily cron, materializes `recurring_schedules` into real `booking_requests` rows 90 days out, LA-time, DST-safe. Bearer-auth via `CRON_SECRET`.
- `src/app/api/admin/google-calendar/{connect,callback}/route.ts` — admin-only, one-time (or re-run-anytime) OAuth grant flow, stores the refresh token in Supabase.
- `src/app/admin/page.tsx` — read-only dashboard (bookings/consultations/fleet/Calendar status). No admin write UI yet beyond status updates in the row components.
- `supabase/*.sql` — every schema change as a standalone script, in the order they were written. No CLI migrations setup; see "Supabase" below.

## Supabase tables

`booking_requests`, `consultation_requests`, `fleet_inquiries` — public-submittable (anon insert), admin-readable.
`recurring_schedules`, `blackouts`, `payments`, `expenses`, `google_calendar_tokens` — admin-only, no public policy at all.

`booking_requests.source` is `'web' | 'manual' | 'recurring'` — `web` for the public form, `recurring` for cron-generated rows, `manual` default (reserved for a future admin-created-booking flow).

## RLS convention

Every admin policy uses the exact pattern:
```sql
using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com')
```
That email is the source of truth for admin access at the database layer — keep it in sync with `adminEmail` in `site-config.ts` (app-layer gate) if it ever changes; they are two independent checks and both must be updated.

Public insert policies only grant INSERT, not SELECT. This matters: Supabase's `.insert().select()` performs a real SELECT under the hood, which RLS enforces separately from the INSERT policy. An anonymous visitor has no SELECT policy on `booking_requests`, so chaining `.select()` after an anon insert fails with `42501`.

## Service-role pattern

`createBookingRequest` (`bookings.ts`) uses `createServiceRoleClient()` for the insert, not the session-bound client — specifically to read the new row's `id` back (needed to attach the Google Calendar event id afterward) without hitting the RLS gap above. This is safe because every field in that insert is already validated server-side before the call; nothing unsafe is being trusted from the client. The same service-role client is reused for the later `google_event_id` update rather than creating a second instance.

The cron route and the Google Calendar token read/write also go through the service-role client — those contexts have no user session to run RLS checks against at all.

## Env vars

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — one Supabase project, shared by local dev and production.
`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Supabase "Sign in with Google" (customer auth). Configured in the Supabase dashboard, not read directly by app code.
`GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` / `GOOGLE_CALENDAR_REDIRECT_URI` — separate OAuth client for Calendar event creation. Never reuse the sign-in credentials here.
`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe. No webhook route exists yet; `STRIPE_WEBHOOK_SECRET` is unused by any code today. Payment flow is client-confirmed + server-reverified (`paymentIntents.retrieve`), not webhook-driven.
`RESEND_API_KEY`, `RESEND_FROM_EMAIL` — booking/consultation/fleet notification emails.
`CRON_SECRET` — bearer token the cron route requires.

## Running and testing locally

`npm run dev` — Turbopack dev server on :3000, same Supabase project as production.
`npx tsc --noEmit -p .` and `npx eslint <files>` before calling anything done.
No automated test suite — verify through the actual browser flow.

Dry-run the cron generator: `GET /api/cron/generate-recurring?dryRun=true` with `Authorization: Bearer $CRON_SECRET`. Writes nothing; returns the same summary shape as a real run plus a per-occurrence breakdown.

## Gotchas hit in this repo

- **Test booking/consultation/fleet forms signed OUT, not just in a fresh tab.** The dev server keeps Supabase auth cookies across navigations; a "fresh" tab can still be an authenticated admin session. Anonymous-only bugs (like the RLS select-back issue) won't reproduce while signed in. Clear the `sb-*` cookie explicitly to be sure.
- **SQL scripts in `supabase/` are run manually in the Supabase SQL editor** — there is no CLI/migrations setup, nothing applies them automatically from this repo. After writing one, the schema isn't live until someone pastes it in and runs it. Don't assume a table/column exists because the `.sql` file exists — verify directly against the database (service-role client can check: insufficient-privilege vs. `42P01`/`42703` tells you table/column existence) when it matters.
- **Env var changes require a restart (local) or redeploy (Vercel) to take effect.** `next dev` reads `.env.local` once at startup; editing it does nothing until the process restarts. Same for Vercel — updating a project env var doesn't affect the currently-deployed instance until the next deploy.
- **Turbopack on this machine occasionally wedges** (`0xc0000142` native process-spawn failure, usually after a long-running dev session with many edits). Symptom: blank page, "Turbopack error" in console. Fix: kill the process, `rm -rf .next`, restart — not a code issue.
- **Partial unique indexes don't work as Supabase `.upsert()` `onConflict` targets.** Postgres only uses a partial index as an ON CONFLICT arbiter if the conflict clause repeats its exact WHERE predicate, which the Supabase JS client can't express. Use a plain (non-partial) unique index; NULL-distinctness already gives the same practical guarantee for nullable FK-style columns.
