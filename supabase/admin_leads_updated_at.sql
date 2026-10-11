-- Run this once in the Supabase SQL editor (Project > SQL Editor) to support
-- "last updated" staleness tracking on the In Progress section of /admin.
-- Adds updated_at to consultation_requests and fleet_inquiries (bookings
-- weren't asked for and already carry their own date fields) with a trigger
-- that keeps it current on every update — status changes and archiving both
-- count as activity on the lead.

alter table consultation_requests add column updated_at timestamptz not null default now();
alter table fleet_inquiries add column updated_at timestamptz not null default now();

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger consultation_requests_set_updated_at
  before update on consultation_requests
  for each row
  execute function set_updated_at();

create trigger fleet_inquiries_set_updated_at
  before update on fleet_inquiries
  for each row
  execute function set_updated_at();
