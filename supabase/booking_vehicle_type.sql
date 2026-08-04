-- Run this once in the Supabase SQL editor (Project > SQL Editor) to add the
-- vehicle-type field (now chosen separately from the package/service tier)
-- and the Maintenance Wash gate question to booking_requests.
-- Nullable, same pattern as service_tier: "required" for new submissions is
-- enforced at the application layer (src/lib/actions/bookings.ts).

alter table booking_requests
  add column vehicle_type text,
  add column last_detailed_note text;
