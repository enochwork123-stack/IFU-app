-- Create Feature Wishes Table
create table if not exists public.feature_wishes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  completed boolean default false not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.feature_wishes enable row level security;

-- Row Level Security Policies
create policy "Anyone can insert feature wishes"
  on public.feature_wishes for insert
  with check (true);

create policy "Admins can select feature wishes"
  on public.feature_wishes for select
  using (public.is_admin());

create policy "Admins can update feature wishes"
  on public.feature_wishes for update
  using (public.is_admin());

create policy "Admins can delete feature wishes"
  on public.feature_wishes for delete
  using (public.is_admin());
