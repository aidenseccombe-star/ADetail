-- Run this once in the Supabase SQL editor (Project > SQL Editor) to support
-- the consultation form now covering both Paint Correction and Ceramic
-- Coating. Nullable, same pattern as other fields in this table: "required"
-- for new submissions is enforced at the application layer
-- (src/lib/actions/consultations.ts).

alter table consultation_requests add column interested_in text;
