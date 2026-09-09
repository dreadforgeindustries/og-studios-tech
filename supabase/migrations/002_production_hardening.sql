-- Production hardening: explicit project publishing and atomic workshop registration.

alter table public.projects
  add column if not exists status text not null default 'draft';

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check check (status in ('draft', 'published'));

create index if not exists projects_status_featured_idx
  on public.projects(status, featured, created_at desc);

-- Public visitors can only read published projects. Admins using the service role
-- remain able to manage drafts from the dashboard.
drop policy if exists "public can read projects" on public.projects;
create policy "public can read published projects"
on public.projects for select to anon, authenticated
using (status = 'published');

-- Prevent the same email from registering twice for the same workshop.
create unique index if not exists registrations_workshop_email_uidx
  on public.registrations(workshop_id, lower(email));

-- Reserve a seat and insert a registration under one row lock/transaction.
create or replace function public.register_for_workshop(
  p_workshop_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_education_level text,
  p_message text default null
) returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  w public.workshops;
  r public.registrations;
begin
  select * into w from public.workshops where id = p_workshop_id for update;
  if not found or w.status <> 'Open' then raise exception 'WORKSHOP_NOT_OPEN'; end if;
  if w.date is not null and w.date < now() then raise exception 'WORKSHOP_PAST'; end if;
  if w.registered_count >= w.seats then raise exception 'WORKSHOP_FULL'; end if;

  insert into public.registrations(workshop_id, name, email, phone, education_level, message)
  values (p_workshop_id, trim(p_name), lower(trim(p_email)), trim(p_phone), trim(p_education_level), nullif(trim(coalesce(p_message, '')), ''))
  returning * into r;

  update public.workshops
  set registered_count = registered_count + 1, updated_at = now()
  where id = p_workshop_id;

  return r;
exception
  when unique_violation then raise exception 'ALREADY_REGISTERED';
end;
$$;

revoke all on function public.register_for_workshop(uuid,text,text,text,text,text) from public, anon, authenticated;
