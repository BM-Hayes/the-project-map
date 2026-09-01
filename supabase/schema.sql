-- The Project Map — v1 schema stub
-- Separate Supabase project from weekend-atlas. Do not reuse listings.

create extension if not exists "pgcrypto";

create type site_type as enum ('solar', 'bess', 'data_center', 'large_load', 'generation', 'transmission', 'other');
create type site_stage as enum ('rumor', 'application', 'hearing', 'approved', 'under_construction', 'operating', 'withdrawn');
create type source_badge as enum ('official', 'verified', 'community', 'unverified');

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  site_type site_type not null,
  stage site_stage not null default 'rumor',
  badge source_badge not null default 'unverified',
  county text not null default 'darlington',
  state text not null default 'SC',
  mw numeric,
  acres numeric,
  applicant text,
  utility_territory text,
  geom_geojson jsonb,
  lat double precision,
  lng double precision,
  source_url text,
  next_event_on date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete set null,
  title text not null,
  body_name text,
  starts_at timestamptz not null,
  agenda_url text,
  video_url text,
  plain_summary text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  title text not null,
  source_url text not null,
  posted_on date,
  created_at timestamptz not null default now()
);

create table public.signals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  signal_type text not null,
  county text,
  lat double precision,
  lng double precision,
  source_url text,
  note text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.review_queue (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'suggest',
  payload jsonb not null,
  source_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.sites enable row level security;
alter table public.events enable row level security;
alter table public.documents enable row level security;
alter table public.signals enable row level security;
alter table public.review_queue enable row level security;

create policy "public read published sites" on public.sites for select using (published = true);
create policy "public read published events" on public.events for select using (published = true);
create policy "public read published signals" on public.signals for select using (published = true);
create policy "public read documents of published sites" on public.documents
  for select using (exists (select 1 from public.sites s where s.id = site_id and s.published = true));
