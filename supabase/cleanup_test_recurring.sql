-- Run after you're done verifying the generator, to remove everything
-- test_recurring_generator.sql created. booking_requests rows generated from
-- the TEST schedules are removed first via recurrence_id, then the schedules
-- and blackout themselves.

delete from booking_requests
where recurrence_id in (
  select id from recurring_schedules where client_name like 'TEST - %'
);

delete from recurring_schedules where client_name like 'TEST - %';

delete from blackouts where reason like 'TEST - %';
