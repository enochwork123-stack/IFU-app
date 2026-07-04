-- Create User Responses table
create table if not exists public.user_responses (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_responses enable row level security;

-- Policies
create policy "Users can read their own responses"
  on public.user_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own responses"
  on public.user_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own responses"
  on public.user_responses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
