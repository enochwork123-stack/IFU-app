-- 1. Update existing profiles to admin for specified emails
update public.profiles
set role = 'admin'
where email in ('enochwork123@gmail.com', 'lawfelix2002@gmail.com');

-- 2. Modify the new user trigger function to automatically assign 'admin' role
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
      when new.email in ('enochwork123@gmail.com', 'lawfelix2002@gmail.com') then 'admin'
      else 'member'
    end
  );
  return new;
end;
$$ language plpgsql security definer;
