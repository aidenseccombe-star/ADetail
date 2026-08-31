-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- payments table — one or more payment rows per booking_requests row (e.g. a
-- Stripe deposit row plus a cash/Zelle/etc. balance row). Admin-only table,
-- same RLS pattern as admin_access.sql.
--
-- DUAL LEDGER, TEMPORARY: booking_requests already has its own
-- stripe_payment_intent_id and deposit_amount_cents columns
-- (booking_requests_deposit.sql), used today by the Paint Correction 50%
-- deposit flow in src/lib/actions/bookings.ts. This table is separate and
-- additive for now — it does not replace those columns, and this migration
-- does not backfill existing deposits into it.
--
-- Phase 3 will make `payments` the single source of truth for all payment
-- data and backfill booking_requests.stripe_payment_intent_id /
-- deposit_amount_cents into it (one payments row per existing deposit), at
-- which point those two booking_requests columns become read-only history or
-- get dropped. Until then, a booking's full payment status requires checking
-- both places.

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references booking_requests(id) on delete cascade,
  amount_cents int not null,
  method text not null check (method in ('stripe', 'cash', 'venmo', 'zelle', 'check', 'other')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'partial', 'refunded', 'void')),
  paid_at timestamptz,
  stripe_payment_intent_id text unique,
  notes text,
  created_at timestamptz not null default now()
);

create index payments_booking_id_idx on payments (booking_id);

alter table payments enable row level security;

create policy "Admin can view payments"
  on payments for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can insert payments"
  on payments for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can update payments"
  on payments for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete payments"
  on payments for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');
