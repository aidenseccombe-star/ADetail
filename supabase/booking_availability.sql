-- Run this once in the Supabase SQL editor (Project > SQL Editor) to support
-- the real-availability booking calendar. Adds a SECURITY DEFINER function
-- that returns only the date/time/duration-relevant fields of active
-- bookings — never name, email, phone, or address — so the public booking
-- page can compute real availability without any new RLS read policy and
-- without exposing customer data. Callable by anyone (anon or signed in),
-- same as booking submission itself already is.

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
$$;

grant execute on function get_busy_slots(date, date) to anon, authenticated;
