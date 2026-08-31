-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- blackouts table — date/time ranges the recurring-jobs generator
-- (/api/cron/generate-recurring) must not schedule occurrences into (vacations,
-- holidays, etc). Admin-only table, same RLS pattern as admin_access.sql.

create table blackouts (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

alter table blackouts enable row level security;

create policy "Admin can view blackouts"
  on blackouts for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can insert blackouts"
  on blackouts for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can update blackouts"
  on blackouts for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');

create policy "Admin can delete blackouts"
  on blackouts for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'aiden.seccombe@gmail.com');
