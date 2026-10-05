-- Connect solution/script contributions (and solved) to an analysis entry.
alter table public.contributions
  add column if not exists linked_id uuid
  references public.contributions (id) on delete set null;

create index if not exists contributions_linked_idx
  on public.contributions (linked_id);
