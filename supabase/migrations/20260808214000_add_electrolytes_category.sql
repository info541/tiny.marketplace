-- Add electrolytes category
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

alter type public.product_category add value if not exists 'electrolytes';

insert into public.categories (id, slug, name) values
  ('c1000000-0000-0000-0000-000000000007', 'electrolytes', 'Electrolytes')
on conflict (slug) do nothing;
