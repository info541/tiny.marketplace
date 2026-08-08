-- Moon Juice brand
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

insert into public.brands (id, slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values (
  '00000000-0000-0000-0000-000000000003',
  $mj$moon-juice$mj$,
  $mj$Moon Juice$mj$,
  $mj$Adaptogens, minerals + beauty for cosmic wellness$mj$,
  $mj$LA-born adaptogen and mineral brand blending clinically-backed botanicals into daily powders and capsules — magnesium, cortisol support, beauty, and brain rituals without the junk.$mj$,
  $mj$Los Angeles, CA$mj$,
  2011,
  $mj$#5E4B45$mj$,
  4.8,
  20059,
  0,
  $mj$https://moonjuice.com$mj$
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
join public.categories c on c.slug in ('supplements', 'electrolytes', 'skincare')
where b.slug = 'moon-juice'
on conflict do nothing;
