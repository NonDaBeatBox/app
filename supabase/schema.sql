-- ===========================================================================
-- Circle — Postgres schema + Row Level Security for the Supabase backend.
-- Run this in the Supabase SQL editor. RLS is enabled so a user can only ever
-- read the circles they belong to (no stranger discovery, ever).
--
-- Auth: magic-link email (supabase.auth). A `users` row is created on first
-- sign-in by the client (see src/lib/store/supabaseStore.ts → ensureProfile).
-- Storage: create a public bucket named `proofs` for check-in uploads.
-- ===========================================================================

-- ---- tables ---------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  handle text not null,
  avatar_color text not null default '#FF6A5D',
  phone text
);

create table if not exists public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.users (id),
  member_cap int not null default 6
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  circle_id uuid not null references public.circles (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'founder')),
  backs_user_id uuid references public.users (id),
  unique (user_id, circle_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  circle_id uuid not null references public.circles (id) on delete cascade,
  title text not null,
  category text not null check (category in ('sat','school','skill','mindset','character','other')),
  kind text not null default 'concrete' check (kind in ('concrete','fuzzy')),
  status text not null default 'pending_approval' check (status in ('pending_approval','active','paused'))
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  proof_method text not null check (proof_method in ('screenshot','photo','video','voice_note','focus_session','link','honest_checkin')),
  frequency text not null check (frequency in ('daily','weekdays')),
  consequence text not null check (consequence in ('meter_hit','streak_break','forfeit')),
  forfeit_text text,
  approved_by_circle boolean not null default false
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  approved boolean not null default true,
  unique (goal_id, user_id)
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  date date not null,
  status text not null check (status in ('done','missed')),
  proof_url text,
  note text,
  unique (goal_id, date)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  body text not null,
  kind text not null default 'text' check (kind in ('text','checkin_event','nudge','system')),
  ref_goal_id uuid references public.goals (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.nudges (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.users (id) on delete cascade,
  to_user_id uuid not null references public.users (id) on delete cascade,
  goal_id uuid not null references public.goals (id) on delete cascade,
  level text not null check (level in ('ping','you_good','call')),
  created_at timestamptz not null default now()
);

-- 👏 counts for check-in event cards (not a core spec table, but needed for them)
create table if not exists public.cheers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  message_id uuid not null references public.messages (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, message_id)
);

-- ---- helper: is the current user a member of a circle? --------------------

create or replace function public.is_member(cid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.memberships m
    where m.circle_id = cid and m.user_id = auth.uid()
  );
$$;

-- ---- enable RLS -----------------------------------------------------------

alter table public.users        enable row level security;
alter table public.circles      enable row level security;
alter table public.memberships  enable row level security;
alter table public.goals        enable row level security;
alter table public.contracts    enable row level security;
alter table public.approvals    enable row level security;
alter table public.checkins     enable row level security;
alter table public.messages     enable row level security;
alter table public.nudges       enable row level security;
alter table public.cheers       enable row level security;

-- users: anyone signed in can read profiles (needed to render circle members);
-- you can only write your own row.
create policy users_read on public.users for select to authenticated using (true);
create policy users_upsert on public.users for insert to authenticated with check (id = auth.uid());
create policy users_update on public.users for update to authenticated using (id = auth.uid());

-- circles: read a circle only if you're a member (or you just created it).
create policy circles_read on public.circles for select to authenticated
  using (public.is_member(id) or created_by = auth.uid());
create policy circles_insert on public.circles for insert to authenticated
  with check (created_by = auth.uid());

-- memberships: read memberships of circles you belong to; insert your own.
create policy memberships_read on public.memberships for select to authenticated
  using (public.is_member(circle_id) or user_id = auth.uid());
create policy memberships_insert on public.memberships for insert to authenticated
  with check (user_id = auth.uid());
create policy memberships_update on public.memberships for update to authenticated
  using (user_id = auth.uid());
create policy memberships_delete on public.memberships for delete to authenticated
  using (user_id = auth.uid());

-- goals: read all goals in your circles; write your own.
create policy goals_read on public.goals for select to authenticated using (public.is_member(circle_id));
create policy goals_insert on public.goals for insert to authenticated
  with check (user_id = auth.uid() and public.is_member(circle_id));
create policy goals_update on public.goals for update to authenticated using (public.is_member(circle_id));

-- contracts: readable/writable within your circles (via the goal's circle).
create policy contracts_all on public.contracts for all to authenticated
  using (exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)))
  with check (exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)));

-- approvals: members of the goal's circle can read/cast.
create policy approvals_read on public.approvals for select to authenticated
  using (exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)));
create policy approvals_write on public.approvals for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)));
create policy approvals_update on public.approvals for update to authenticated using (user_id = auth.uid());

-- checkins: readable across the circle; only the owner writes.
create policy checkins_read on public.checkins for select to authenticated
  using (exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)));
create policy checkins_write on public.checkins for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)));

-- messages: circle-level only (no DMs).
create policy messages_read on public.messages for select to authenticated using (public.is_member(circle_id));
create policy messages_insert on public.messages for insert to authenticated
  with check (public.is_member(circle_id) and (user_id = auth.uid() or user_id is null));

-- nudges: within the goal's circle.
create policy nudges_read on public.nudges for select to authenticated
  using (exists (select 1 from public.goals g where g.id = goal_id and public.is_member(g.circle_id)));
create policy nudges_insert on public.nudges for insert to authenticated
  with check (from_user_id = auth.uid());

-- cheers: within circles you belong to (via the message).
create policy cheers_read on public.cheers for select to authenticated
  using (exists (select 1 from public.messages m where m.id = message_id and public.is_member(m.circle_id)));
create policy cheers_write on public.cheers for insert to authenticated
  with check (user_id = auth.uid());

-- ---- realtime -------------------------------------------------------------
-- Add these tables to the `supabase_realtime` publication so chat + pulse are live:
--   alter publication supabase_realtime add table
--     public.messages, public.checkins, public.goals, public.approvals,
--     public.nudges, public.cheers, public.memberships;

-- ---- storage --------------------------------------------------------------
-- Create a bucket named `proofs` (public read is fine for demo). Example policy:
--   insert into storage.buckets (id, name, public) values ('proofs','proofs', true);
