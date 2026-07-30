-- Run this once in the Supabase SQL editor (Project > SQL Editor) to add the
-- columns needed for Stripe deposit collection on Paint Correction bookings.
-- booking_requests already exists (see booking_requests.sql), so this is an
-- ALTER rather than a fresh CREATE TABLE. No RLS changes needed — existing
-- policies are row-scoped and automatically cover the new columns.

alter table booking_requests
  add column stripe_payment_intent_id text,
  add column deposit_amount_cents integer;
