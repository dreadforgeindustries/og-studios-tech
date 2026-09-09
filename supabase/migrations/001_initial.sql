create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  overview text,
  problem text,
  solution text,
  architecture text,
  challenges text,
  outcome text,
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  images text[] not null default '{}',
  demo_url text,
  github_url text,
  featured boolean not null default false,
  is_concept boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_featured_idx on public.projects(featured, created_at desc);

create table if not exists public.project_enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  project_name text not null,
  description text not null,
  features text not null,
  technology text,
  timeline text not null,
  name text not null,
  email text not null,
  whatsapp text not null,
  attachment_path text,
  status text not null default 'New' check(status in ('New','Contacted','In Discussion','In Progress','Completed','Archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists project_enquiries_status_idx on public.project_enquiries(status, created_at desc);
create index if not exists project_enquiries_email_idx on public.project_enquiries(email);

create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  topics text[] not null default '{}',
  level text not null,
  date timestamptz,
  duration text not null,
  seats integer not null default 20 check(seats > 0),
  registered_count integer not null default 0 check(registered_count >= 0),
  status text not null default 'Draft' check(status in ('Draft','Open','Closed','Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workshops_status_date_idx on public.workshops(status, date);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  education_level text not null,
  message text,
  created_at timestamptz not null default now()
);
create index if not exists registrations_workshop_idx on public.registrations(workshop_id, created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages(created_at desc);

create table if not exists public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.project_enquiries enable row level security;
alter table public.workshops enable row level security;
alter table public.registrations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.settings enable row level security;

create policy "admins can read own record" on public.admins for select to authenticated using (auth.uid() = user_id);
create policy "public can read projects" on public.projects for select to anon, authenticated using (true);
create policy "public can read open workshops" on public.workshops for select to anon, authenticated using (status = 'Open');
create policy "admins can manage projects" on public.projects for all to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "admins can manage workshops" on public.workshops for all to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "admins can read enquiries" on public.project_enquiries for select to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "admins can update enquiries" on public.project_enquiries for update to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "admins can read registrations" on public.registrations for select to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "admins can read settings" on public.settings for select to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "admins can manage settings" on public.settings for all to authenticated using (exists(select 1 from public.admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.admins a where a.user_id=auth.uid()));

insert into storage.buckets (id,name,public) values ('project-attachments','project-attachments',false) on conflict (id) do nothing;
create policy "admins can read project attachments" on storage.objects for select to authenticated using (bucket_id='project-attachments' and exists(select 1 from public.admins a where a.user_id=auth.uid()));

-- After creating the first Supabase Auth user, add their UUID here:
-- insert into public.admins(user_id) values ('YOUR-AUTH-USER-UUID');
