-- Run this once in the Supabase SQL editor (Project > SQL Editor).
--
-- The app-layer admin check (src/lib/admin.ts) now gates /admin on
-- aiden.seccombe@gmail.com instead of aidenseccombe@amobiledetail.com.
-- These 6 RLS policies are a separate, independent gate — Postgres has no
-- idea what src/lib/admin.ts checks — and until this script runs they
-- still only grant "view/update all rows" access to the old business
-- email. Without this, signing into /admin with the new address loads
-- the page (app-layer check passes) but every query silently returns
-- either nothing or just the signed-in user's own rows (RLS check
-- fails), which looks exactly like the "admin dashboard shows 0 rows"
-- bug this project has hit before.

alter policy "Admin can view all booking requests"
  on booking_requests
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

alter policy "Admin can update all booking requests"
  on booking_requests
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

alter policy "Admin can view all consultation requests"
  on consultation_requests
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

alter policy "Admin can update all consultation requests"
  on consultation_requests
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

alter policy "Admin can view all fleet inquiries"
  on fleet_inquiries
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

alter policy "Admin can update all fleet inquiries"
  on fleet_inquiries
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');
