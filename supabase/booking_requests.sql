-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- booking_requests table used by the manual booking request flow.
-- There is no Supabase CLI/migrations setup in this repo, so this file is a
-- reference script rather than an applied migration.

create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  vehicle text not null,
  add_ons text[] not null default '{}',
  preferred_date date not null,
  preferred_time text not null,
  notes text
);

alter table booking_requests enable row level security;

create policy "Anyone can submit a booking request"
  on booking_requests for insert
  with check (user_id is null or user_id = auth.uid());

create policy "Users can view their own booking requests"
  on booking_requests for select
  to authenticated
  using (user_id = auth.uid());
