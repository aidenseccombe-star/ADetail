-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create the
-- fleet_inquiries table used by the "Commercial & Fleet" inquiry flow.
-- Every policy (including admin access) is in this one script, unlike the
-- earlier tables — forgetting the admin policies in a separate follow-up file
-- caused two real bugs this session ("admin dashboard shows 0 rows" and
-- "Confirm/Decline buttons silently do nothing").

create table fleet_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'closed')),
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  fleet_info text not null,
  notes text
);

alter table fleet_inquiries enable row level security;

create policy "Anyone can submit a fleet inquiry"
  on fleet_inquiries for insert
  with check (user_id is null or user_id = auth.uid());

create policy "Users can view their own fleet inquiries"
  on fleet_inquiries for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admin can view all fleet inquiries"
  on fleet_inquiries for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'aidenseccombe@amobiledetail.com');

create policy "Admin can update all fleet inquiries"
  on fleet_inquiries for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'aidenseccombe@amobiledetail.com');
