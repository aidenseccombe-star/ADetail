-- Run this once in the Supabase SQL editor to fix a bug found while testing
-- /api/cron/generate-recurring: the original booking_requests_recurrence_instance_idx
-- (in booking_requests_recurring.sql) was a PARTIAL unique index
-- (where recurrence_id is not null). Postgres will only use a partial index as
-- an ON CONFLICT target if the ON CONFLICT clause repeats that exact WHERE
-- predicate — but the Supabase JS client's upsert(..., { onConflict:
-- 'recurrence_id,recurrence_date' }) has no way to express a predicate, so
-- every upsert failed with 42P10: "there is no unique or exclusion
-- constraint matching the ON CONFLICT specification".
--
-- The fix is a plain (non-partial) unique index. This is not a weaker
-- guarantee: Postgres already treats NULL as distinct from NULL in unique
-- indexes by default, so manual/web booking_requests rows (recurrence_id
-- always NULL) can still repeat freely — the WHERE clause was solving a
-- problem that didn't exist, while breaking ON CONFLICT inference.

drop index if exists booking_requests_recurrence_instance_idx;

create unique index booking_requests_recurrence_instance_idx
  on booking_requests (recurrence_id, recurrence_date);
