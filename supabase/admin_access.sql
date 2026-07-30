-- Run this once in the Supabase SQL editor (Project > SQL Editor) to support
-- the /admin dashboard: adds a 'completed' status for finished jobs, and lets
-- the owner (identified by email) view and update every booking/consultation
-- request instead of just their own.
--
-- Keep the email below in sync with siteConfig.email in src/lib/site-config.ts
-- if the owner's email ever changes.

-- Find and drop whatever check constraint currently governs booking_requests.status
-- (rather than assuming its auto-generated name) before widening it.
do $$
declare
  constraint_name text;
begin
  select con.conname into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'booking_requests'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%status%pending%confirmed%declined%';

  if constraint_name is not null then
    execute format('alter table booking_requests drop constraint %I', constraint_name);
  end if;
end $$;

alter table booking_requests
  add constraint booking_requests_status_check
  check (status in ('pending', 'confirmed', 'declined', 'completed'));

create policy "Admin can view all booking requests"
  on booking_requests for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aidenseccombe@amobiledetail.com');

create policy "Admin can update all booking requests"
  on booking_requests for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aidenseccombe@amobiledetail.com');

create policy "Admin can view all consultation requests"
  on consultation_requests for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aidenseccombe@amobiledetail.com');

create policy "Admin can update all consultation requests"
  on consultation_requests for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aidenseccombe@amobiledetail.com');
