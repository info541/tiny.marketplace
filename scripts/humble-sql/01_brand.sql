-- Humble Brands seed
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

insert into public.brands (id, slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values (
  '00000000-0000-0000-0000-000000000002',
  'humble-brands',
  'Humble Brands',
  'Aluminum-free deodorant with real essential oil scents',
  'Santa Fe-born clean deodorant built around essential oils, baking soda and baking-soda-free formulas, plus plastic-free paperboard options - everyday odor protection without aluminum.',
  'Santa Fe, NM',
  2015,
  '#6A7F5C',
  4.7,
  6756,
  0,
  'https://humblebrands.com'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  accent = excluded.accent,
  rating = excluded.rating,
  review_count = excluded.review_count,
  website_url = excluded.website_url;

insert into public.brand_categories (brand_id, category_id)
select b.id, c.id
from public.brands b
join public.categories c on c.slug in ('deodorant', 'skincare')
where b.slug = 'humble-brands'
on conflict do nothing;
