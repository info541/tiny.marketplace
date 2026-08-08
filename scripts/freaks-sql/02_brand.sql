insert into public.brands (id, slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values (
  '00000000-0000-0000-0000-000000000001',
  'freaks-of-nature',
  'Freaks of Nature',
  'Mineral protection for skin that actually lives outside',
  'Clean, 100% mineral formulas built for real life outside — sunscreen, barrier care, and everyday essentials without chemical filters or greasy residue.',
  'United States',
  2020,
  '#2F6F5E',
  4.8,
  444,
  0,
  'https://freaksofnature.com'
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
join public.categories c on c.slug in ('sunscreen', 'deodorant', 'skincare')
where b.slug = 'freaks-of-nature'
on conflict do nothing;
