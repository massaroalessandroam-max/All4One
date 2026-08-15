-- All4One: creazione automatica del profilo al momento della registrazione.
-- Applicare dopo 202608140001_initial_foundations.sql.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Nuovo utente'),
    'cliente'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Un cliente può aggiornare il proprio nome, ma non può auto-promuoversi a PT, nutrizionista o admin.
drop policy "profile self update" on public.profiles;
create policy "profile self update without role change" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

create or replace function public.validate_care_team_roles()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select role from public.profiles where id = new.client_id) <> 'cliente' then
    raise exception 'client_id must have cliente role';
  end if;
  if (select role from public.profiles where id = new.personal_trainer_id) <> 'pt' then
    raise exception 'personal_trainer_id must have pt role';
  end if;
  if (select role from public.profiles where id = new.nutritionist_id) <> 'nutrizionista' then
    raise exception 'nutritionist_id must have nutrizionista role';
  end if;
  return new;
end;
$$;

create trigger validate_care_team_roles_before_write
  before insert or update on public.client_care_teams
  for each row execute procedure public.validate_care_team_roles();
