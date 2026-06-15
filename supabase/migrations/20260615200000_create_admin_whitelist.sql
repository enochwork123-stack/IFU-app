-- Create admin whitelist table
create table if not exists public.admin_whitelist (
  email text primary key,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.admin_whitelist enable row level security;

-- Policies for admin_whitelist
create policy "Admins can read admin whitelist"
  on public.admin_whitelist for select
  using (public.is_admin());

create policy "Admins can insert into admin whitelist"
  on public.admin_whitelist for insert
  with check (public.is_admin());

create policy "Admins can delete from admin whitelist"
  on public.admin_whitelist for delete
  using (public.is_admin());

-- Seed default admins
insert into public.admin_whitelist (email)
values ('enochwork123@gmail.com'), ('lawfelix2002@gmail.com')
on conflict (email) do nothing;

-- Modify trigger function to also check admin_whitelist
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url, email, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      'New disciple'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    new.email,
    case 
      when new.email in ('enochwork123@gmail.com', 'lawfelix2002@gmail.com') or 
           exists (select 1 from public.admin_whitelist where email = new.email) then 'admin'
      else 'member'
    end
  );
  return new;
end;
$$ language plpgsql security definer;
