-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create
-- the google_calendar_tokens table — holds the single OAuth refresh token
-- that lets the server create (and later read free/busy from) your Google
-- Calendar, without putting it in a Vercel env var (so you can re-authorize
-- from /admin at any time without a redeploy).
--
-- Singleton by design: `check (id = 1)` plus always upserting onConflict:
-- 'id' with id: 1 means re-authorizing replaces the one row instead of
-- accumulating old tokens. Admin-only table, same RLS pattern as
-- admin_access.sql — added for defense-in-depth / manual inspection, but the
-- application code always reads/writes this table through the service role
-- client in src/lib/google/calendar.ts, the same way cron already does for
-- recurring_schedules/blackouts, because the callers (anonymous website
-- visitors booking, and the cron route) have no admin session to satisfy
-- these policies.
--
-- reuses the set_updated_at() trigger function already created by
-- recurring_schedules.sql — not redefined here.

create table google_calendar_tokens (
  id int primary key default 1,
  refresh_token text not null,
  scope text not null,
  updated_at timestamptz not null default now(),
  check (id = 1)
);

create trigger google_calendar_tokens_set_updated_at
  before update on google_calendar_tokens
  for each row
  execute function set_updated_at();

alter table google_calendar_tokens enable row level security;

create policy "Admin can view google calendar tokens"
  on google_calendar_tokens for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can insert google calendar tokens"
  on google_calendar_tokens for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can update google calendar tokens"
  on google_calendar_tokens for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete google calendar tokens"
  on google_calendar_tokens for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');
