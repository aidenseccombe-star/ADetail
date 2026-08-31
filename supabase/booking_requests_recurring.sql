-- Run this once in the Supabase SQL editor (Project > SQL Editor) to extend
-- booking_requests for the recurring-jobs generator (see recurring_schedules.sql
-- and /api/cron/generate-recurring). No RLS changes needed — existing policies
-- are row-scoped (or admin-by-email) and automatically cover the new columns.
--
-- Column mapping notes:
--   - source distinguishes web (booked through the public form), manual (entered
--     by hand, e.g. in a future admin UI), and recurring (materialized by the
--     cron generator) rows. Existing rows are backfilled to 'manual' below —
--     they predate this column and weren't submitted through the current web
--     flow's automated path in a way this column existed to track.
--   - duration_minutes / buffer_minutes are new, explicit per-row values. Note
--     they are NOT currently read by the public availability calendar —
--     get_busy_slots() and src/lib/booking-availability.ts still derive duration
--     from service_tier + vehicle_type + add_ons, and hardcode a 30-minute
--     buffer. Wiring the calendar to prefer these columns when present is a
--     follow-up, not part of this migration.
--   - The status check constraint already had 'completed' added by
--     admin_access.sql (originally pending/confirmed/declined only, per that
--     file's own comment) — this migration widens it further to add
--     'cancelled' and 'no_show', not starting fresh from the three the task
--     spec assumed. All existing rows and values are preserved; only the
--     constraint changes.

alter table booking_requests
  add column recurrence_id uuid references recurring_schedules(id) on delete set null,
  add column recurrence_date date,
  add column source text not null default 'manual' check (source in ('web', 'manual', 'recurring')),
  -- NOT YET WIRED INTO AVAILABILITY: get_busy_slots() (booking_availability.sql)
  -- and src/lib/booking-availability.ts still derive a job's blocked duration
  -- from service_tier + vehicle_type + add_ons, and hardcode a 30-minute buffer
  -- (BUFFER_MINUTES). These two columns are stored for every row starting now,
  -- but the calendar conflict check does not read them yet. Making the
  -- availability engine prefer these columns when present is follow-up work,
  -- not part of this migration.
  add column duration_minutes int not null default 120,
  add column buffer_minutes int not null default 45,
  add column price_cents int,
  add column completed_at timestamptz;

-- Find and drop whatever check constraint currently governs
-- booking_requests.status (rather than assuming its name — admin_access.sql
-- named it booking_requests_status_check, but don't assume that survived
-- unmodified) before widening it.
do $$
declare
  constraint_name text;
begin
  select con.conname into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'booking_requests'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%status%pending%confirmed%declined%';

  if constraint_name is not null then
    execute format('alter table booking_requests drop constraint %I', constraint_name);
  end if;
end $$;

alter table booking_requests
  add constraint booking_requests_status_check
  check (status in ('pending', 'confirmed', 'declined', 'completed', 'cancelled', 'no_show'));

-- Makes the generator safely re-runnable: .upsert(..., { onConflict:
-- 'recurrence_id,recurrence_date', ignoreDuplicates: true }) relies on this
-- exact index existing as its ON CONFLICT target. Deliberately NOT a partial
-- index (a `where recurrence_id is not null` version was tried first and
-- rejected — see fix_recurrence_instance_index.sql for why: Postgres will
-- only use a partial index as an ON CONFLICT arbiter if the ON CONFLICT
-- clause repeats its exact WHERE predicate, which the Supabase JS client has
-- no way to express). A plain index works just as well here: Postgres
-- already treats NULL as distinct from NULL in unique indexes, so
-- manual/web rows (recurrence_id always NULL) can still repeat freely.
create unique index booking_requests_recurrence_instance_idx
  on booking_requests (recurrence_id, recurrence_date);
