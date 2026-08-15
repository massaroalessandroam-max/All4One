-- All4One: catalogo personale di esercizi aggiunti dal cliente.

create table public.custom_exercises (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  muscle_group text not null check (char_length(trim(muscle_group)) between 2 and 80),
  created_at timestamptz not null default now(),
  unique (client_id, name)
);

alter table public.custom_exercises enable row level security;
create policy "client reads own custom exercises" on public.custom_exercises for select using (client_id = auth.uid());
create policy "client creates own custom exercises" on public.custom_exercises for insert with check (client_id = auth.uid());
create policy "client updates own custom exercises" on public.custom_exercises for update using (client_id = auth.uid()) with check (client_id = auth.uid());
create policy "client deletes own custom exercises" on public.custom_exercises for delete using (client_id = auth.uid());
