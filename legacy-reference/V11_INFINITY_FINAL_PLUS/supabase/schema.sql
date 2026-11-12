-- UPS Creator Studio starter schema
-- Run in Supabase SQL Editor. Review before applying to an existing project.
create extension if not exists pgcrypto;

create table if not exists public.ups_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  mode text not null default 'HYBRID' check (mode in ('AUTO','HYBRID','MANUAL')),
  category text,
  topic text,
  brief text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ups_projects_user_created_idx
  on public.ups_projects(user_id, created_at desc);

alter table public.ups_projects enable row level security;

drop policy if exists "Users can read own UPS projects" on public.ups_projects;
create policy "Users can read own UPS projects"
  on public.ups_projects for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own UPS projects" on public.ups_projects;
create policy "Users can create own UPS projects"
  on public.ups_projects for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own UPS projects" on public.ups_projects;
create policy "Users can update own UPS projects"
  on public.ups_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own UPS projects" on public.ups_projects;
create policy "Users can delete own UPS projects"
  on public.ups_projects for delete
  using (auth.uid() = user_id);

-- Optional profile table. Users may read/update only their own profile.
create table if not exists public.ups_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  workspace_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.ups_profiles enable row level security;

drop policy if exists "Users can view own UPS profile" on public.ups_profiles;
create policy "Users can view own UPS profile" on public.ups_profiles for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own UPS profile" on public.ups_profiles;
create policy "Users can insert own UPS profile" on public.ups_profiles for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own UPS profile" on public.ups_profiles;
create policy "Users can update own UPS profile" on public.ups_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
