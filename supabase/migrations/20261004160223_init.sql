-- ECSC Albania Wiki — database schema
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

-- ──────────────────────────────────────────────────────────────────────────
-- Tables
-- ──────────────────────────────────────────────────────────────────────────

-- Extra categories added by the team (the 5 seeded ones live in the code).
create table if not exists public.categories (
  slug        text primary key,
  label       text not null,
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now()
);

-- Challenge types added by the team (seeded ones live in the code as pages).
create table if not exists public.challenge_types (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  slug        text not null,
  title       text not null,
  description text not null default '',
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now(),
  unique (category, slug)
);

-- About / Analyze / Solution / Script entries.
-- "about" = one shared, editable doc per challenge.
-- analyze/solution/script = many entries, each owned by its author.
create table if not exists public.contributions (
  id            uuid primary key default gen_random_uuid(),
  challenge_key text not null,                 -- e.g. "pwn/got-overwrite"
  kind          text not null check (kind in ('about','analyze','solution','script')),
  label         text not null default '',
  body          text not null default '',
  author        uuid references auth.users (id),
  author_name   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists contributions_challenge_idx
  on public.contributions (challenge_key, kind);

-- Solved challenges log, optionally linked to one of the entries above.
create table if not exists public.solved (
  id             uuid primary key default gen_random_uuid(),
  challenge_key  text not null,
  name           text not null,
  event          text,
  year           int,
  difficulty     text,
  author         uuid references auth.users (id),
  author_name    text,
  writeup        text,
  linked_id      uuid references public.contributions (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index if not exists solved_challenge_idx
  on public.solved (challenge_key);

-- ──────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- Any signed-in team member can read everything and add content.
-- Edits/deletes of analyze/solution/script are limited to the author;
-- the shared "about" doc and the categories/challenge types are team-editable.
-- ──────────────────────────────────────────────────────────────────────────

alter table public.categories      enable row level security;
alter table public.challenge_types enable row level security;
alter table public.contributions   enable row level security;
alter table public.solved          enable row level security;

-- categories
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories
  for select to authenticated using (true);
drop policy if exists categories_write on public.categories;
create policy categories_write on public.categories
  for all to authenticated using (true) with check (true);

-- challenge_types
drop policy if exists challenge_types_read on public.challenge_types;
create policy challenge_types_read on public.challenge_types
  for select to authenticated using (true);
drop policy if exists challenge_types_write on public.challenge_types;
create policy challenge_types_write on public.challenge_types
  for all to authenticated using (true) with check (true);

-- contributions
drop policy if exists contributions_read on public.contributions;
create policy contributions_read on public.contributions
  for select to authenticated using (true);

drop policy if exists contributions_insert on public.contributions;
create policy contributions_insert on public.contributions
  for insert to authenticated with check (auth.uid() = author);

-- about is shared/editable by anyone; others only by their author
drop policy if exists contributions_update on public.contributions;
create policy contributions_update on public.contributions
  for update to authenticated
  using (kind = 'about' or auth.uid() = author)
  with check (kind = 'about' or auth.uid() = author);

drop policy if exists contributions_delete on public.contributions;
create policy contributions_delete on public.contributions
  for delete to authenticated
  using (kind = 'about' or auth.uid() = author);

-- solved
drop policy if exists solved_read on public.solved;
create policy solved_read on public.solved
  for select to authenticated using (true);
drop policy if exists solved_insert on public.solved;
create policy solved_insert on public.solved
  for insert to authenticated with check (auth.uid() = author);
drop policy if exists solved_modify on public.solved;
create policy solved_modify on public.solved
  for all to authenticated using (auth.uid() = author) with check (auth.uid() = author);
