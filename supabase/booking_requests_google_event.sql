-- Run this once in the Supabase SQL editor (Project > SQL Editor) to add the
-- column that links a booking_requests row to the Google Calendar event
-- created for it (see src/lib/google/calendar.ts), so a future cancel or
-- reschedule flow can find and update/delete the right event. Nullable:
-- rows created before this feature existed have no event, and the Calendar
-- call is allowed to fail without blocking the booking itself (see
-- createBookingRequest / the cron generator) — a null here just means
-- nothing was ever synced, not an error state.

alter table booking_requests
  add column google_event_id text;
