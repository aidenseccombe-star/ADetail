-- Run this once in the Supabase SQL editor (Project > SQL Editor) to support
-- the restructured /admin dashboard: adds archived_at ("Trash") to all three
-- public-submittable tables, admin DELETE policies for "Delete Permanently"
-- (none existed before this), and excludes archived bookings from the public
-- availability calendar so trashing a spam booking doesn't permanently block
-- its time slot for real customers.

alter table booking_requests add column archived_at timestamptz;
alter table consultation_requests add column archived_at timestamptz;
alter table fleet_inquiries add column archived_at timestamptz;

create policy "Admin can delete booking requests"
  on booking_requests for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete consultation requests"
  on consultation_requests for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete fleet inquiries"
  on fleet_inquiries for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create or replace function get_busy_slots(p_start_date date, p_end_date date)
returns table (
  preferred_date date,
  preferred_time text,
  service_tier text,
  add_ons text[],
  vehicle_type text
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select preferred_date, preferred_time, service_tier, add_ons, vehicle_type
  from booking_requests
  where preferred_date between p_start_date and least(p_end_date, p_start_date + 45)
    and status in ('pending', 'confirmed')
    and archived_at is null
$$;

grant execute on function get_busy_slots(date, date) to anon, authenticated;
