-- Moon Juice schema extras: supplements category + placed_by
-- Run this FIRST and alone, then continue.
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

alter type public.product_category add value if not exists 'supplements';

insert into public.categories (id, slug, name) values
  ('c1000000-0000-0000-0000-000000000008', 'supplements', 'Supplements')
on conflict (slug) do nothing;

alter table public.products add column if not exists placed_by text;
