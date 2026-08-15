-- All4One: diario allenamenti e serie.

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  performed_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_name text not null check (char_length(trim(exercise_name)) between 1 and 120),
  muscle_group text not null check (char_length(trim(muscle_group)) between 1 and 80),
  set_number smallint not null check (set_number > 0 and set_number <= 100),
  reps smallint not null check (reps > 0 and reps <= 1000),
  weight_kg numeric(7,2) not null default 0 check (weight_kg >= 0 and weight_kg <= 10000),
  rpe numeric(3,1) check (rpe between 1 and 10),
  created_at timestamptz not null default now(),
  unique (workout_id, exercise_name, set_number)
);

create index workouts_client_performed_at_idx on public.workouts (client_id, performed_at desc);
create index workout_sets_workout_idx on public.workout_sets (workout_id);

create or replace function public.owns_workout(target_workout_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workouts where id = target_workout_id and client_id = auth.uid());
$$;

alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;

create policy "client reads own workouts" on public.workouts for select using (client_id = auth.uid());
create policy "client creates own workouts" on public.workouts for insert with check (client_id = auth.uid());
create policy "client updates own workouts" on public.workouts for update using (client_id = auth.uid()) with check (client_id = auth.uid());
create policy "client deletes own workouts" on public.workouts for delete using (client_id = auth.uid());

create policy "client reads own workout sets" on public.workout_sets for select using (public.owns_workout(workout_id));
create policy "client creates own workout sets" on public.workout_sets for insert with check (public.owns_workout(workout_id));
create policy "client updates own workout sets" on public.workout_sets for update using (public.owns_workout(workout_id)) with check (public.owns_workout(workout_id));
create policy "client deletes own workout sets" on public.workout_sets for delete using (public.owns_workout(workout_id));
