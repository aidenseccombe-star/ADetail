-- Run this once in the Supabase SQL editor (Project > SQL Editor) to record
-- Terms & Conditions / Privacy Policy agreement on booking and consultation
-- requests. Nullable, same pattern as other fields in these tables:
-- "required" for new submissions is enforced at the application layer
-- (src/lib/actions/bookings.ts, src/lib/actions/consultations.ts).

alter table booking_requests
  add column agreed_to_terms boolean,
  add column agreed_to_terms_at timestamptz;

alter table consultation_requests
  add column agreed_to_terms boolean,
  add column agreed_to_terms_at timestamptz;
