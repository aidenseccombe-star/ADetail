-- Scratch script for manually verifying /api/cron/generate-recurring.
-- Everything here uses client names starting with "TEST -" so it's easy to
-- find and delete afterward (see the DELETE block at the bottom, or
-- cleanup_test_recurring.sql).
--
-- Both schedules start 2026-07-27 (a Monday, 5 weeks before "today" =
-- 2026-08-31) with day_of_week = 3 (Wednesday), so their first occurrence is
-- 2026-07-29 — well before the generator's window starts. This is what lets
-- you confirm the generator does not backfill history: nothing before today
-- should ever appear in booking_requests, no matter how far in the past
-- start_date is.
--
--   Weekly   (interval_weeks 1): occurrences every Wed from 2026-07-29 —
--             first one on/after today is 2026-09-02.
--   Biweekly (interval_weeks 2): occurrences every 14 days from 2026-07-29 —
--             first one on/after today is 2026-09-09, then 2026-09-23,
--             2026-10-07, etc. Consecutive dates should be exactly 14 days
--             apart.
--
-- The blackout below covers 2026-09-16, a Wednesday that only the WEEKLY
-- schedule lands on (the biweekly schedule's dates are 09-09 / 09-23 / ...,
-- never 09-16) — so it's a clean way to confirm blackout filtering only
-- drops the one occurrence it should.

insert into recurring_schedules (
  client_name, client_email, client_phone, address, vehicle,
  service_type, vehicle_type, interval_weeks, day_of_week, start_time,
  duration_minutes, price_cents, start_date, status, notes
) values (
  'TEST - Weekly Wash', 'test-weekly@example.com', '555-0100',
  '123 Test St, Costa Mesa, CA', '2020 Honda Civic',
  'Maintenance Wash', 'sedan-coupe', 1, 3, '09:00',
  45, 10500, '2026-07-27', 'active', 'TEST row — safe to delete'
);

insert into recurring_schedules (
  client_name, client_email, client_phone, address, vehicle,
  service_type, vehicle_type, interval_weeks, day_of_week, start_time,
  duration_minutes, price_cents, start_date, status, notes
) values (
  'TEST - Biweekly Wash', 'test-biweekly@example.com', '555-0101',
  '456 Test Ave, Costa Mesa, CA', '2019 Toyota RAV4',
  'Maintenance Wash', 'suv-truck', 2, 3, '11:00',
  60, 10500, '2026-07-27', 'active', 'TEST row — safe to delete'
);

insert into blackouts (start_at, end_at, reason)
values (
  '2026-09-16 00:00:00'::timestamp at time zone 'America/Los_Angeles',
  '2026-09-17 00:00:00'::timestamp at time zone 'America/Los_Angeles',
  'TEST - blackout over the weekly schedule''s 2026-09-16 occurrence'
);
