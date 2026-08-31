-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- recurring_schedules table — the source patterns the /api/cron/generate-recurring
-- route materializes into real booking_requests rows. Admin-only table (no public
-- insert/select), same RLS pattern as admin_access.sql / admin_email_update.sql.
--
-- Column mapping notes vs. the spec this was built from:
--   - vehicle (make/model, e.g. "2020 Honda Civic") was added beyond the original
--     spec: booking_requests.vehicle is NOT NULL free text and recurring_schedules
--     had no equivalent field. Required here so every generated occurrence can
--     satisfy that constraint.
--   - client_email / client_phone are NOT NULL here (the original spec had them
--     nullable) because booking_requests.email / .phone are both NOT NULL — every
--     schedule needs real contact info before it can generate anything.
--   - service_type is intentionally a distinct name from booking_requests'
--     service_tier column (see booking_requests_recurring.sql) — the generator
--     copies this value directly into that column. If you want a recurring job to
--     block the correct amount of time on the public booking calendar's
--     availability check (get_busy_slots / booking-availability.ts), set this to
--     an exact package name from src/lib/site-config.ts (e.g. "Full Detail") and
--     vehicle_type to "sedan-coupe" or "suv-truck" — anything else falls back to
--     the safe-but-imprecise global-max-duration block, same as any other row.

create table recurring_schedules (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  address text not null,
  vehicle text not null,
  service_type text not null,
  vehicle_type text,
  interval_weeks int not null check (interval_weeks > 0),
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  duration_minutes int not null default 120,
  price_cents int not null,
  start_date date not null,
  end_date date,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Shared trigger function — reusable by any future table that has an
-- updated_at column, not just this one.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recurring_schedules_set_updated_at
  before update on recurring_schedules
  for each row
  execute function set_updated_at();

alter table recurring_schedules enable row level security;

create policy "Admin can view recurring schedules"
  on recurring_schedules for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can insert recurring schedules"
  on recurring_schedules for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can update recurring schedules"
  on recurring_schedules for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete recurring schedules"
  on recurring_schedules for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');
