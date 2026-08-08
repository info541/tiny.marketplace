-- Freaks of Nature seed (editor-safe)
-- No apostrophes, editor-safe copy, no multi-line strings.
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_categories (
  brand_id uuid not null references public.brands (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (brand_id, category_id)
);

create index if not exists brand_categories_category_id_idx on public.brand_categories (category_id);

alter table public.categories enable row level security;
alter table public.brand_categories enable row level security;

do $policy$ begin
  create policy "Public read categories" on public.categories for select using (true);
exception when duplicate_object then null; end $policy$;
do $policy$ begin
  create policy "Public read brand categories" on public.brand_categories for select using (true);
exception when duplicate_object then null; end $policy$;

insert into public.categories (id, slug, name) values
  ('c1000000-0000-0000-0000-000000000001', 'sunscreen', 'Sunscreen'),
  ('c1000000-0000-0000-0000-000000000002', 'deodorant', 'Deodorant'),
  ('c1000000-0000-0000-0000-000000000003', 'protein', 'Protein'),
  ('c1000000-0000-0000-0000-000000000004', 'skincare', 'Skincare'),
  ('c1000000-0000-0000-0000-000000000005', 'hair', 'Hair care'),
  ('c1000000-0000-0000-0000-000000000006', 'oral', 'Oral care'),
  ('c1000000-0000-0000-0000-000000000007', 'electrolytes', 'Electrolytes')
on conflict (slug) do nothing;

alter table public.products add column if not exists category_id uuid references public.categories (id);
alter table public.products add column if not exists size text;
alter table public.products add column if not exists how_to_use text not null default '';
alter table public.products add column if not exists good_for text not null default '';
alter table public.products add column if not exists smells_like text not null default '';
alter table public.products add column if not exists finish text not null default '';
alter table public.products add column if not exists features text[] not null default '{}';
