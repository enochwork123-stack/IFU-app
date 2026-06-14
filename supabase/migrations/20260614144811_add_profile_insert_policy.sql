-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Backfill profiles for any existing users in auth.users
insert into public.profiles (id, display_name, avatar_url, email, role)
select 
  id,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'New disciple'),
  coalesce(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', null),
  email,
  'member'
from auth.users
on conflict (id) do nothing;
