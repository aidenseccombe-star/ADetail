-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- consultation_requests table used by the Ceramic Coating "Request a Consultation"
-- flow. Kept separate from booking_requests so these leads are unmistakably
-- distinct from real booking requests when browsing the database.

create table consultation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'closed')),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  vehicle text not null,
  notes text
);

alter table consultation_requests enable row level security;

create policy "Anyone can submit a consultation request"
  on consultation_requests for insert
  with check (user_id is null or user_id = auth.uid());

create policy "Users can view their own consultation requests"
  on consultation_requests for select
  to authenticated
  using (user_id = auth.uid());
