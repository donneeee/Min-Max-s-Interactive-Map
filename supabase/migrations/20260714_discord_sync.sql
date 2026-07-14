-- Run this migration in the Supabase SQL editor before enabling Discord sync.
-- RLS ensures a signed-in Discord account can access only its own records.

create table if not exists public.map_user_tracking (
  user_id uuid not null references auth.users (id) on delete cascade,
  marker_id text not null,
  map_id text not null,
  map_label text not null default '',
  scene_id text not null default '',
  item_id text not null,
  display_name text not null,
  icon text not null default '',
  coordinate_key text not null default '',
  x double precision,
  y double precision,
  area_name text not null default '',
  respawn_seconds integer not null check (respawn_seconds > 0),
  respawn_label text not null default '',
  started_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, marker_id)
);

create table if not exists public.map_user_completed_markers (
  user_id uuid not null references auth.users (id) on delete cascade,
  marker_id text not null,
  map_id text not null,
  scene_id text not null default '',
  item_id text not null,
  marker_type text not null default 'collect_item',
  display_name text not null,
  coordinate_key text not null default '',
  x double precision,
  y double precision,
  completed_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, marker_id)
);

create or replace function public.map_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists map_user_tracking_set_updated_at on public.map_user_tracking;
create trigger map_user_tracking_set_updated_at
before update on public.map_user_tracking
for each row execute function public.map_set_updated_at();

alter table public.map_user_tracking enable row level security;
alter table public.map_user_completed_markers enable row level security;

grant select, insert, update, delete on public.map_user_tracking to authenticated;
grant select, insert, update, delete on public.map_user_completed_markers to authenticated;

drop policy if exists "Users manage their own map tracking" on public.map_user_tracking;
create policy "Users manage their own map tracking"
on public.map_user_tracking
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users manage their own completed markers" on public.map_user_completed_markers;
create policy "Users manage their own completed markers"
on public.map_user_completed_markers
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
