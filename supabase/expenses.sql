-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- expenses table for basic bookkeeping (mileage, supplies, etc), optionally
-- linked to the job that caused them. Admin-only table, same RLS pattern as
-- admin_access.sql.

create table expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  category text not null,
  amount_cents int not null,
  vendor text,
  notes text,
  receipt_url text,
  booking_id uuid references booking_requests(id) on delete set null,
  miles numeric(6, 1),
  created_at timestamptz not null default now()
);

alter table expenses enable row level security;

create policy "Admin can view expenses"
  on expenses for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can insert expenses"
  on expenses for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can update expenses"
  on expenses for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete expenses"
  on expenses for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');
