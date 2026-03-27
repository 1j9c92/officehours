-- ============================================================
-- OfficeHours Foundation Schema
-- Run this in: Supabase dashboard → SQL Editor → New query
-- ============================================================

-- ========================
-- PROFILES (extends auth.users)
-- ========================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null check (role in ('mentor', 'mentee')),
  is_admin     boolean not null default false,
  full_name    text not null,
  email        text not null,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ========================
-- MENTOR PROFILES
-- ========================
create table public.mentor_profiles (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  linkedin_url     text not null,
  job_function     text,
  industry         text,
  years_experience int,
  bio              text,
  pricing_tier     int check (pricing_tier in (50, 75, 100, 125)),
  approval_status  text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ========================
-- MENTEE PROFILES
-- ========================
create table public.mentee_profiles (
  user_id       uuid primary key references public.profiles(id) on delete cascade,
  career_stage  text check (career_stage in ('student', 'recent_grad', 'entry_level', 'career_pivot', 'other')),
  school_or_role text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ========================
-- TRIGGER: auto-update updated_at
-- ========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger mentor_profiles_updated_at
  before update on public.mentor_profiles
  for each row execute function public.set_updated_at();

create trigger mentee_profiles_updated_at
  before update on public.mentee_profiles
  for each row execute function public.set_updated_at();

-- ========================
-- TRIGGER: auto-assign pricing_tier from years_experience
-- Client never writes pricing_tier directly.
-- ========================
create or replace function public.assign_pricing_tier()
returns trigger language plpgsql as $$
begin
  new.pricing_tier =
    case
      when new.years_experience is null then null
      when new.years_experience <= 2    then 50
      when new.years_experience <= 4    then 75
      when new.years_experience <= 9    then 100
      else 125
    end;
  return new;
end;
$$;

create trigger mentor_profiles_pricing_tier
  before insert or update of years_experience on public.mentor_profiles
  for each row execute function public.assign_pricing_tier();

-- ========================
-- TRIGGER: auto-reset approval_status to 'pending' on meaningful profile edit
-- ========================
create or replace function public.reset_approval_on_edit()
returns trigger language plpgsql as $$
begin
  -- Only reset if a meaningful profile field changed (not approval/rejection fields)
  if (
    new.linkedin_url     is distinct from old.linkedin_url or
    new.job_function     is distinct from old.job_function or
    new.industry         is distinct from old.industry or
    new.years_experience is distinct from old.years_experience or
    new.bio              is distinct from old.bio
  ) then
    new.approval_status = 'pending';
    new.rejection_reason = null;
  end if;
  return new;
end;
$$;

create trigger mentor_profiles_reset_approval
  before update on public.mentor_profiles
  for each row execute function public.reset_approval_on_edit();

-- ========================
-- TRIGGER: create profile row when a new user signs up
-- This fires when Supabase Auth creates a new auth.users row.
-- The role and full_name are passed via signUp options.data.
-- Default role fallback to 'mentee' is a safety net, not an intended path.
-- ========================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'mentee')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========================
-- ROW LEVEL SECURITY
-- ========================
alter table public.profiles        enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentee_profiles enable row level security;

-- profiles: own row read/update
create policy "profiles: own row select"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: own row update"
  on public.profiles for update
  using (id = auth.uid());

-- profiles: admins can read all
create policy "profiles: admin read all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- mentor_profiles: own row
create policy "mentor_profiles: own row select"
  on public.mentor_profiles for select
  using (user_id = auth.uid());

create policy "mentor_profiles: own row insert"
  on public.mentor_profiles for insert
  with check (user_id = auth.uid());

create policy "mentor_profiles: own row update"
  on public.mentor_profiles for update
  using (user_id = auth.uid());

-- mentor_profiles: admins can read and update all
create policy "mentor_profiles: admin select all"
  on public.mentor_profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy "mentor_profiles: admin update all"
  on public.mentor_profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- mentee_profiles: own row
create policy "mentee_profiles: own row select"
  on public.mentee_profiles for select
  using (user_id = auth.uid());

create policy "mentee_profiles: own row insert"
  on public.mentee_profiles for insert
  with check (user_id = auth.uid());

create policy "mentee_profiles: own row update"
  on public.mentee_profiles for update
  using (user_id = auth.uid());
