-- Run this once in the Supabase SQL editor (Project > SQL Editor) to add the
-- vehicle-size service tier field to booking_requests.
-- Nullable: real rows already exist without this field, and "required" for
-- new submissions is enforced at the application layer (src/lib/actions/bookings.ts),
-- same as other fields in this table.

alter table booking_requests add column service_tier text;
