-- All4One: fondazioni, ruoli, relazione di cura e consensi.
-- Applicare nel SQL Editor di un progetto Supabase nuovo.

create type public.app_role as enum ('cliente', 'pt', 'nutrizionista', 'admin');
create type public.shared_data_type as enum ('allenamenti_aggregati', 'alimentazione_aggregata');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  role public.app_role not null default 'cliente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professional_contacts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  whatsapp_number text,
  public_email text,
  updated_at timestamptz not null default now()
);

create table public.client_care_teams (
  client_id uuid primary key references public.profiles(id) on delete cascade,
  personal_trainer_id uuid not null references public.profiles(id) on delete restrict,
  nutritionist_id uuid not null references public.profiles(id) on delete restrict,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (client_id <> personal_trainer_id and client_id <> nutritionist_id and personal_trainer_id <> nutritionist_id)
);

create table public.sharing_consents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  shared_data public.shared_data_type not null,
  recipient_role public.app_role not null check (recipient_role in ('pt', 'nutrizionista')),
  active boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (client_id, shared_data, recipient_role)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  client_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_care_team_member(target_client_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() = target_client_id or exists (
    select 1 from public.client_care_teams t
    where t.client_id = target_client_id and t.active
      and auth.uid() in (t.personal_trainer_id, t.nutritionist_id)
  );
$$;

alter table public.profiles enable row level security;
alter table public.professional_contacts enable row level security;
alter table public.client_care_teams enable row level security;
alter table public.sharing_consents enable row level security;
alter table public.audit_log enable row level security;

create policy "profile self or care team" on public.profiles for select using (
  auth.uid() = id or public.is_care_team_member(id)
);
create policy "profile self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "professional owns contact" on public.professional_contacts for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "care team can read own relation" on public.client_care_teams for select using (public.is_care_team_member(client_id));
create policy "client reads and updates own consent" on public.sharing_consents for select using (auth.uid() = client_id);
create policy "client updates own consent" on public.sharing_consents for update using (auth.uid() = client_id) with check (auth.uid() = client_id);
create policy "client creates own consent" on public.sharing_consents for insert with check (auth.uid() = client_id);
create policy "audit visible to the client" on public.audit_log for select using (auth.uid() = client_id);

-- Le creazioni di profili professionali e le relazioni di cura sono affidate a una funzione/admin server-side,
-- mai direttamente al browser. Questo evita che un utente si assegni un ruolo professionale.
