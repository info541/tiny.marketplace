-- Tom's of Maine brand
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

insert into public.brands (id, slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values (
  '00000000-0000-0000-0000-000000000004',
  $tm$toms-of-maine$tm$,
  $tm$Tom's of Maine$tm$,
  $tm$Naturally sourced oral care since 1970$tm$,
  $tm$Kennebunk-born natural toothpaste and everyday care — fluoride and fluoride-free formulas without artificial flavors, dyes, or animal testing, made so you can choose what goes in (and what stays out).$tm$,
  $tm$Kennebunk, Maine$tm$,
  1970,
  $tm$#2D6A4F$tm$,
  4.7,
  0,
  0,
  $tm$https://www.tomsofmaine.com$tm$
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
join public.categories c on c.slug in ('oral', 'deodorant', 'skincare')
where b.slug = 'toms-of-maine'
on conflict do nothing;
