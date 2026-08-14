-- Tom's of Maine brand seed

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


insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000001',
    $tm$adult-holiday-brush-and-rinse-bundle$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Adult Holiday Brush & Rinse Bundle$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    17.99,
    $tm$1x Fluoride-Free Antiplaque & Whitening Fennel Toothpaste 1x Fresh Mint Whole Care Anticavity Natural Mouthwash 1x Naturally Clean Soft Toothbrush Twin Pack This set brings together three everyday essentials to help support a simple and consistent oral care routine during a busy…$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/adult-holiday-brush-and-rinse-bundle$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_adult-holiday.jpg?v=1762891861&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$Anticavity; Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Anticavity$f$, $f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000002',
    $tm$kids-holiday-brush-and-rine-kids-bundle$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Kids Holiday Brush & Rinse Bundle$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    28.99,
    $tm$The holiday season is filled with treats and routines that look a little different. This bundle helps support healthy habits for small smiles with Silly Strawberry toothpaste, rinse, and extra-soft brushes.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/kids-holiday-brush-and-rine-kids-bundle$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms-halloween-bundle-kids_pdp.jpg?v=1759350912&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000003',
    $tm$whiten-plus-deep-clean-whitening-toothpaste-peppermint$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whiten Plus Deep Clean Natural Whitening Peppermint Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Discover a whiter smile with Tom’s of Maine Whiten Plus Deep Clean Whitening Toothpaste. This enamel safe whitening toothpaste helps whiten without causing sensitivity, removes up to 95% of surface stains* and doubles as an anticavity toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.amazon.com/Toms-Maine-Anticavity-Peppermint-Toothpaste/dp/B0D9BZR3P5?linkCode=ll2&tag=22258941-20&linkId=1be33af783eeae19d31151e794f7bac3&language=en_US&ref_=as_li_ss_tl$tm$,
    'amazon',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61046078_Packshot_Front_In_Package_8aaf5813-1ca7-49bd-b286-c5fcbba483c6.jpg?v=1744048285&width=800$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Anticavity; Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Anticavity$f$, $f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000004',
    $tm$whiten-plus-deep-clean-whitening-toothpaste-spearmint$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whiten Plus Deep Clean Whitening Spearmint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Discover a whiter smile with Tom’s of Maine Whiten Plus Deep Clean Whitening Toothpaste. This enamel-safe whitening toothpaste helps whiten without causing sensitivity, removes up to 95% of surface stains*, and doubles as an anticavity toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whiten-plus-deep-clean-whitening-toothpaste-spearmint$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61046077_Packshot_Front_In_Package_288df438-66ca-48c5-9f75-75d4d09e24a2.jpg?v=1744048284&width=800$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Whitening; Removes Stains; Clinically Proven Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$, $f$Removes Stains$f$, $f$Clinically Proven Whitening$f$, $f$Natural Oral Care$f$, $f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000005',
    $tm$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whiten Plus Coconut Oil Fluoride Free Gentle Mint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Discover a whiter smile with Tom’s of Maine Whiten Plus Coconut Oil Fluoride Free Toothpaste. This fluoride free, enamel safe whitening toothpaste helps whiten without causing sensitivity and removes up to 95% of surface stains*.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61046035_Packshot_Front_In_Package_d21a438e-d9a6-44c6-bba5-2e4a104d1d24.jpg?v=1744048288&width=800$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Whitening; Removes Stains; Clinically Proven Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$, $f$Removes Stains$f$, $f$Clinically Proven Whitening$f$, $f$Natural Oral Care$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000006',
    $tm$everyday-essentials-starter-pack$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Everyday Essentials Starter Pack$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    27.99,
    $tm$The perfect way to start fresh. This Starter Pack includes everything you need for a natural, well-rounded routine—from oral care to body care.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/everyday-essentials-starter-pack$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_adultstarterkit.jpg?v=1744392342&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000007',
    $tm$best-sellers-toothpaste-trio$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Best Sellers Toothpaste Trio$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    16.99,
    $tm$Get a complete clean with this carefully curated toothpaste bundle. Featuring Whole Care, Antiplaque & Whitening, and Fluoride-Free formulas, this set is designed to support a healthy mouth with every brush.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/best-sellers-toothpaste-trio$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_pastekit_2026-update.jpg?v=1768587725&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$Anticavity; Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Anticavity$f$, $f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000008',
    $tm$fresh-start-bundle$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fresh Start Bundle$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    17.99,
    $tm$A fresh start from head to toe. This bundle brings together Clean Coast Deodorant, Lemon Bergamot Natural Beauty Bar, and Fluoride-Free Antiplaque & Whitening Peppermint Toothpaste—a collection designed to cleanse, refresh, and invigorate your daily routine.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fresh-start-bundle$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_freshkit_april-2026-update.jpg?v=1775232646&width=800$tm$,
    4.6,
    0,
    $tm$4.5 oz, 3.25 oz, 5 oz$tm$,
    $tm$$tm$,
    $tm$Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000009',
    $tm$kids-natural-toothpaste-variety-pack$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Kids Natural Toothpaste Variety Pack$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    14.99,
    $tm$Make brushing fun and help fight cavities with the Tom’s of Maine Anticavity Kids Toothpaste Variety Pack. This colorful anticavity kids toothpaste pack comes with 3 delightful kid toothpaste flavors including Silly Strawberry, Outrageous Orange Mango, and Watermelon Wiggle.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/kids-natural-toothpaste-variety-pack$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61046079_Hero_Enhanced.jpg?v=1774625376&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$Anticavity$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000010',
    $tm$silly-strawberry-kids-fluoride-free-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Silly Strawberry Kids Fluoride-Free Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    6.49,
    $tm$Goodbye artificial sparkles and bubble gum flavors.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/silly-strawberry-kids-fluoride-free-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US06380A_Packshot_Front_In_Package.jpg?v=1744656695&width=800$tm$,
    4.6,
    0,
    $tm$5.1 oz$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000011',
    $tm$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Wicked Cool! Natural Mild Mint Toothpaste for Kids with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    6.49,
    $tm$Too old for fruity flavors. Not ready for the strong taste of mint. Make one part of the transition to adulthood a little easier with Tom's of Maine Wicked Cool! Natural Toothpaste for Kids.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US06382A_primary_4fc1ec06-2a0d-4ce4-a551-ddac10ebda3b.jpg?v=1774554889&width=600$tm$,
    4.6,
    0,
    $tm$5.1 oz$tm$,
    $tm$$tm$,
    $tm$Contains Fluoride; Anticavity; Recyclable/100% Recyclable$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Contains Fluoride$f$, $f$Anticavity$f$, $f$Recyclable/100% Recyclable$f$, $f$WHAT YOU'LL GET$f$, $f$FIGHT CAVITIES$f$, $f$TASTE THEY LOVE$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000012',
    $tm$whole-care-natural-peppermint-toothpaste-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whole Care Peppermint Natural Toothpaste with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Promote a clean, bright, healthy smile with the Tom’s of Maine Whole Care Natural Toothpaste with Fluoride. The fluoride toothpaste prevents cavities, strengthens enamel, and whitens teeth by removing surface stains.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whole-care-natural-peppermint-toothpaste-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US05800A_primary_68e21c98-e274-4cd1-87cd-a71f70e2807c.jpg?v=1744048214&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Anticavity$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000013',
    $tm$whole-care-natural-wintermint-toothpaste-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whole Care Wintermint Natural Toothpaste with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Promote a clean, bright, healthy smile with the Tom’s of Maine Whole Care Natural Toothpaste with Fluoride. The fluoride toothpaste prevents cavities, strengthens enamel, and whitens teeth by removing surface stains.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whole-care-natural-wintermint-toothpaste-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US05803A_primary_8b7d9d9a-7e25-44aa-b556-304383de4d52.jpg?v=1744048217&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Contains Fluoride; Anticavity; Vegan$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Contains Fluoride$f$, $f$Anticavity$f$, $f$Vegan$f$, $f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000014',
    $tm$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whole Care Cinnamon Clove Natural Toothpaste with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Promote a clean, bright, healthy smile with the Tom’s of Maine Whole Care Natural Toothpaste with Fluoride. The fluoride toothpaste prevents cavities, strengthens enamel, and whitens teeth by removing surface stains.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US05802A_primary_26b5263f-3fe2-45af-956e-f99eeb506c42.jpg?v=1744136172&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Contains Fluoride; Whitening; Vegan$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Contains Fluoride$f$, $f$Whitening$f$, $f$Vegan$f$, $f$No Animal Testing/Cruelty-Free$f$, $f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000015',
    $tm$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Grab n' Go Travel Size Fluoride-Free Fresh Mint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    4.49,
    $tm$Take Tom's on the road. This great-tasting, everyday natural toothpaste whitens teeth with naturally sourced silicas and freshens breath with pure peppermint leaf oil. And it's fluoride-free. Comes in a 3. ounce, TSA Accepted Travel size, making it the perfect travel companion.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/683260_primary_84b730af-012f-4750-9a6d-b76569bb78b0.jpg?v=1744048228&width=600$tm$,
    4.6,
    0,
    $tm$3 oz$tm$,
    $tm$$tm$,
    $tm$Travel Size/ TSA Accepted; Whitening; Vegan$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Travel Size/ TSA Accepted$f$, $f$Whitening$f$, $f$Vegan$f$, $f$Fluoride-free$f$, $f$No artificial flavors, colors, or preservatives$f$, $f$Vegan - no animal ingredient$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000016',
    $tm$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Grab n' Go Travel Size Anticavity Fresh Mint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    4.49,
    $tm$Take Tom's on the road. This great-tasting, everyday natural toothpaste whitens teeth with naturally sourced silicas, helps fight cavities with naturally derived fluoride, and freshens breath with pure peppermint leaf oil. Comes in a 3.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/683259_primary_8abf8ec3-b4a8-4223-b18e-4e15f3774995.jpg?v=1744048229&width=600$tm$,
    4.6,
    0,
    $tm$3 oz$tm$,
    $tm$$tm$,
    $tm$Anticavity$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000017',
    $tm$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Wicked Fresh! Spearmint Ice Fluoride Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Fresh breath is only a brush away with Tom’s of Maine Wicked Fresh! Natural Fluoride Toothpaste. This natural toothpaste with fluoride is a bad breath toothpaste that is clinically proven to help freshen breath and comes in a refreshing Spearmint Ice flavor.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61038013_primary_e7d8578b-32d6-4197-98e0-8a6f202577a7.jpg?v=1744048256&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Contains Fluoride; Anticavity; Vegan$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Contains Fluoride$f$, $f$Anticavity$f$, $f$Vegan$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000018',
    $tm$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Antiplaque & Whitening Spearmint Natural Toothpaste Gel$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Experience a bright smile using naturally derived and sourced ingredients with Tom’s of Maine Antiplaque and Whitening Fluoride Free Toothpaste Gel.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61038011_primary_72dd8366-1bad-42aa-aca1-cacbc8e801e2.jpg?v=1744048265&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000019',
    $tm$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Activated Charcoal Peppermint Natural Toothpaste with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Experience a bright smile and help prevent cavities with the Tom’s of Maine Natural Activated Charcoal Toothpaste with Fluoride. This fluoride toothpaste uses naturally sourced and derived ingredients and comes in a refreshing Peppermint flavor to keep your breath minty fresh.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/natural-activated-charcoal-peppermint-toothpaste-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61038016_primary_ce2e18f7-0547-413e-ad85-882c14106d39.jpg?v=1744048269&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Contains Fluoride; Anticavity; Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Contains Fluoride$f$, $f$Anticavity$f$, $f$Whitening$f$, $f$<br />$f$, $f$Made with naturally sourced and derived ingredients$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000020',
    $tm$whole-care-natural-spearmint-toothpaste-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whole Care Spearmint Natural Toothpaste with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Promote a clean, bright, healthy smile with the Tom’s of Maine Whole Care Natural Toothpaste with Fluoride. The fluoride toothpaste prevents cavities, strengthens enamel, and whitens teeth by removing surface stains.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whole-care-natural-spearmint-toothpaste-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US05801A_primary_248d4e9a-bf57-4203-8305-fbd60e0df73b.jpg?v=1744048273&width=600$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$Contains Fluoride; Whitening; Vegan$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Contains Fluoride$f$, $f$Whitening$f$, $f$Vegan$f$, $f$No Animal Testing/Cruelty-Free$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000021',
    $tm$natural-fluoride-free-toddler-training-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Toddler Training Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    4.99,
    $tm$Introduce your little one to good brushing habits with the Tom’s of Maine Fluoride Free Toddler Training Toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/natural-fluoride-free-toddler-training-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/683435_primary_cbabcf4d-e577-42e7-b409-138700b1629f.jpg?v=1744048226&width=600$tm$,
    4.6,
    0,
    $tm$1.75 oz$tm$,
    $tm$$tm$,
    $tm$Gluten Free; No Artificial Sweeteners$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Gluten Free$f$, $f$No Artificial Sweeteners$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000022',
    $tm$outrageous-orange-mango-kids-fluoride-natural-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Outrageous Orange Mango Kids Fluoride Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    6.49,
    $tm$Goodbye artificial sparkles and bubble gum flavors. Hello natural cavity protection! Tom's of Maine Natural Kids Fluoride Toothpaste uses calcium and silica to gently clean your little one's teeth.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/outrageous-orange-mango-kids-fluoride-natural-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US06381A_primary_d92d7b8a-6273-4c4b-9641-d88f0238c018.jpg?v=1774623673&width=600$tm$,
    4.6,
    0,
    $tm$5.1 oz$tm$,
    $tm$$tm$,
    $tm$WHAT YOU'LL GET; FIGHT CAVITIES; TASTE THEY LOVE$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$WHAT YOU'LL GET$f$, $f$FIGHT CAVITIES$f$, $f$TASTE THEY LOVE$f$, $f$RECYCLABLE TUBE$f$, $f$TAKE CARE OF YOURSELF NATURALLY$f$, $f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000023',
    $tm$watermelon-wiggle-kids-toothpaste-with-fluoride$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Watermelon Wiggle Natural Kids Toothpaste with Fluoride$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    6.49,
    $tm$Tom’s of Maine Watermelon Wiggle Kids Toothpaste is a natural kids toothpaste with fluoride for children ages 2 and up that makes brushing fun and helps fight cavities.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/watermelon-wiggle-kids-toothpaste-with-fluoride$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61040113_primary_fab8dace-c537-4e7a-9b6f-ee1aa405b127.jpg?v=1744048276&width=600$tm$,
    4.6,
    0,
    $tm$5.1 oz$tm$,
    $tm$$tm$,
    $tm$WHAT YOU'LL GET; FIGHT CAVITIES; TASTE THEY LOVE$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$WHAT YOU'LL GET$f$, $f$FIGHT CAVITIES$f$, $f$TASTE THEY LOVE$f$, $f$RECYCLABLE TUBE$f$, $f$TAKE CARE OF YOURSELF NATURALLY$f$, $f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000024',
    $tm$silly-strawberry-kids-anticavity-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Silly Strawberry Anticavity Kids Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    6.49,
    $tm$Goodbye artificial sparkles and bubble gum flavors. Hello natural cavity protection! Tom's of Maine Natural Kids Fluoride Toothpaste uses calcium and silica to gently clean your little one's teeth.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/silly-strawberry-kids-anticavity-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/US06379A_primary_a0bd2b03-0454-461d-8720-3583cf036b90.jpg?v=1774888541&width=600$tm$,
    4.6,
    0,
    $tm$5.1 oz$tm$,
    $tm$$tm$,
    $tm$WHAT YOU'LL GET; FIGHT CAVITIES; TASTE THEY LOVE$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$WHAT YOU'LL GET$f$, $f$FIGHT CAVITIES$f$, $f$TASTE THEY LOVE$f$, $f$RECYCLABLE TUBE$f$, $f$TAKE CARE OF YOURSELF NATURALLY$f$, $f$Anticavity$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000025',
    $tm$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Antiplaque & Whitening Peppermint Natural Toothpaste (2 Pack)$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    11.99,
    $tm$Experience a bright smile using naturally derived and sourced ingredients with the Tom’s of Maine Antiplaque and Whitening Fluoride Free Toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61040164_primary_e2076125-8cef-4650-a42f-fc2b0824c034.jpg?v=1744048320&width=600$tm$,
    4.6,
    0,
    $tm$9 oz$tm$,
    $tm$$tm$,
    $tm$Whitening; No Animal Testing/Cruelty-Free$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$, $f$No Animal Testing/Cruelty-Free$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000026',
    $tm$fluoride-free-antiplaque-whitening-fennel-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Antiplaque & Whitening Fennel Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Experience a bright smile using naturally derived and sourced ingredients with the Tom’s of Maine Antiplaque and Whitening Fluoride Free Toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fluoride-free-antiplaque-whitening-fennel-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/61038022_primary_11203e4f-3449-49db-b226-21e776e42294.jpg?v=1744136172&width=600$tm$,
    4.6,
    0,
    $tm$4.5 oz$tm$,
    $tm$$tm$,
    $tm$Whitening$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000027',
    $tm$wicked-fresh-essentials-bundle$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Wicked Fresh Essentials Bundle$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    11.99,
    $tm$A duo that brings next-level freshness. This Wicked Fresh! bundle features Cool Mountain Mint Fluoride-Free Mouthwash and Cool Peppermint Fluoride Toothpaste, two minty essentials designed to keep your routine fresh.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/wicked-fresh-essentials-bundle$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_wickedfreshkit_2026-update.jpg?v=1775831882&width=800$tm$,
    4.6,
    0,
    $tm$16 oz, 4.0 oz$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000028',
    $tm$sensitive-skin-smile-bundle$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Sensitive Skin & Smile Bundle$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    22.99,
    $tm$A bundle designed for care from head to toe.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/sensitive-skin-smile-bundle$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_sensitivekit.jpg?v=1775694443&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000029',
    $tm$whole-care-oral-health-bundle$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whole Care Oral Health Bundle$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    15.99,
    $tm$Everything you need for a fresh, complete clean—morning and night.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whole-care-oral-health-bundle$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/toms_pdp-hero_wholecarekit.jpg?v=1744392267&width=800$tm$,
    4.6,
    0,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000030',
    $tm$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Rapid Relief Sensitive Gentle Mint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Experience clinically proven rapid sensitivity relief in 1 minute* with Tom’s of Maine Rapid Relief Sensitive Toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/Yd4QDBt6bccRXSdq7IWIt_1.png?v=1775490921&width=800$tm$,
    4.6,
    0,
    $tm$4.5 oz$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000031',
    $tm$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Sensitive + Whitening Fluoride-Free Refreshing Mint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$For a sensitive toothpaste that helps whiten teeth, choose the Tom’s of Maine Sensitive and Whitening Toothpaste. This natural fluoride free toothpaste comes in a Refreshing Mint flavor and offers clinically proven sensitivity relief in 60 seconds.*$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/sSdmBvJF6DiT336Ujchd1.png?v=1775492451&width=800$tm$,
    4.6,
    0,
    $tm$4.5 oz$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000032',
    $tm$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Antiplaque & Whitening Peppermint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Experience a bright smile using naturally derived and sourced ingredients with the Tom’s of Maine Antiplaque and Whitening Fluoride Free Toothpaste.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/00827854011644PackshotBackInPackageAdditional1GTINunderTom_sAPandWhiteningPeppermintFFTP_Context1.png?v=1768587364&width=800$tm$,
    4.6,
    0,
    $tm$4.5 oz$tm$,
    $tm$$tm$,
    $tm$No SLS, artificial flavors, sweeteners, or dyes$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$No SLS, artificial flavors, sweeteners, or dyes$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000033',
    $tm$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Wicked Fresh! Cool Peppermint Fluoride Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Fresh breath is only a brush away with Tom’s of Maine Wicked Fresh! Natural Anticavity Toothpaste with Fluoride. The Toothpaste features an updated formula that tastes great and leaves your mouth clean and fresh with its Cool Peppermint flavor.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/4y7UkF114qOtJnGiWtA3n.png?v=1772123177&width=800$tm$,
    4.6,
    0,
    $tm$4 oz$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000034',
    $tm$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Fluoride-Free Antiplaque & Whitening Spearmint Natural Toothpaste$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    7.99,
    $tm$Enjoy a naturally radiant smile with Tom’s of Maine Antiplaque and Whitening Fluoride Free Toothpaste, an SLS free toothpaste that features an improved formula* for a better brushing experience.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/ORbvOd_bmE5FV9cBiZd_l.png?v=1772133346&width=800$tm$,
    4.6,
    0,
    $tm$4.5 oz$tm$,
    $tm$$tm$,
    $tm$Whitening; No Animal Testing/Cruelty-Free$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[$f$Whitening$f$, $f$No Animal Testing/Cruelty-Free$f$]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'c0000000-0000-0000-0000-000000000035',
    $tm$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$tm$,
    (select id from public.brands where slug = 'toms-of-maine'),
    $tm$Whole Care Peppermint Natural Toothpaste with Fluoride (2-Pack)$tm$,
    'oral',
    (select id from public.categories where slug = 'oral'),
    11.99,
    $tm$Promote a clean, bright, healthy smile with the Tom’s of Maine Whole Care Natural Toothpaste with Fluoride. The fluoride toothpaste pack prevents cavities, strengthens enamel, and whitens teeth by removing surface stains.$tm$,
    $tm$#2D6A4F$tm$,
    null,
    $tm$https://www.tomsofmaine.com/products/whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$tm$,
    'direct',
    $tm$https://www.tomsofmaine.com/cdn/shop/files/2cTcrHWsr0DJKKWXCkNWj.png?v=1772209278&width=800$tm$,
    4.6,
    0,
    $tm$8 oz$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    $tm$$tm$,
    array[]::text[],
    true,
    $tm$catoegy$tm$
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;


-- Tom's of Maine ingredients
-- Uses kind = 'contains' | 'free_from'

insert into public.ingredients (slug, name) values ($s$aloe-barbadensis-leaf-juice-organic$s$, $n$Aloe Barbadensis Leaf Juice (Organic)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$ananas-sativus-pineapple-fruit-juice$s$, $n$Ananas Sativus (Pineapple) Fruit Juice$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$animal-products$s$, $n$Animal products$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$arginine-bicarbonate$s$, $n$Arginine Bicarbonate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$artificial-flavors$s$, $n$Artificial Flavors$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$benzoic-acid$s$, $n$Benzoic Acid$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$benzyl-alcohol$s$, $n$Benzyl Alcohol$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$butylene-glycol$s$, $n$Butylene Glycol$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$butyrospermum-parkii-shea-butter$s$, $n$Butyrospermum Parkii (Shea) Butter$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$calcium-carbonate$s$, $n$Calcium Carbonate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$carrageenan$s$, $n$Carrageenan$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$charcoal-powder$s$, $n$Charcoal Powder$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$citric-acid$s$, $n$Citric Acid$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$citrus-aurantium-dulcis-orange-juice$s$, $n$Citrus Aurantium Dulcis (Orange) Juice$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$citrus-limon-lemon-juice$s$, $n$Citrus Limon (Lemon) Juice$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$cocos-nucifera-coconut-oil-organic$s$, $n$Cocos Nucifera (Coconut) Oil (Organic)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$disodium-cocoyl-glutamate$s$, $n$Disodium Cocoyl Glutamate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$disodium-phosphate$s$, $n$Disodium Phosphate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$fluoride$s$, $n$Fluoride$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$fragaria-ananassa-strawberry-fruit-juice$s$, $n$Fragaria Ananassa (Strawberry) Fruit Juice$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$glycerin$s$, $n$Glycerin$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$glyceryl-laurate$s$, $n$Glyceryl Laurate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$glycyrrhiza-uralensis-licorice-root-extract$s$, $n$Glycyrrhiza Uralensis (Licorice) Root Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$hydrated-silica$s$, $n$Hydrated Silica$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$lauryl-glucoside$s$, $n$Lauryl Glucoside$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$mangifera-indica-mango-juice$s$, $n$Mangifera Indica (Mango) Juice$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$mentha-piperita-peppermint-oil$s$, $n$Mentha Piperita (Peppermint) Oil$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$menthol$s$, $n$Menthol$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$methylheptyl-glycerin$s$, $n$Methylheptyl Glycerin$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$natural-flavor$s$, $n$Natural Flavor$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$natural-fragrance$s$, $n$Natural Fragrance$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$phosphoric-acid$s$, $n$Phosphoric Acid$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$potassium-hydroxide$s$, $n$Potassium Hydroxide$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$propanediol-vegetable-derived$s$, $n$Propanediol (Vegetable derived)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$propylene-glycol$s$, $n$Propylene Glycol$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$rebaudioside-a$s$, $n$Rebaudioside A$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sls$s$, $n$SLS$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-bicarbonate$s$, $n$Sodium Bicarbonate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-chloride$s$, $n$Sodium Chloride$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-cocoate$s$, $n$Sodium Cocoate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-fluoride$s$, $n$Sodium Fluoride$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-gluconate$s$, $n$Sodium Gluconate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-hydroxide$s$, $n$Sodium Hydroxide$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-lauryl-sulfate$s$, $n$Sodium Lauryl Sulfate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-monofluorophosphate$s$, $n$Sodium Monofluorophosphate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-palm-kernelate$s$, $n$Sodium Palm Kernelate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-palmate$s$, $n$Sodium Palmate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-phosphate$s$, $n$Sodium Phosphate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sodium-stearate$s$, $n$Sodium Stearate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sorbitol$s$, $n$Sorbitol$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$tetrasodium-pyrophosphate$s$, $n$Tetrasodium Pyrophosphate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$titanium-dioxide$s$, $n$Titanium Dioxide$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$water$s$, $n$Water$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$xanthan-gum$s$, $n$Xanthan Gum$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$xylitol$s$, $n$Xylitol$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$zinc-citrate$s$, $n$Zinc Citrate$n$) on conflict (slug) do nothing;

insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$benzoic-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$disodium-phosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$adult-holiday-brush-and-rinse-bundle$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$citrus-limon-lemon-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$mangifera-indica-mango-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$citrus-aurantium-dulcis-orange-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$sodium-phosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$benzoic-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$phosphoric-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$menthol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-holiday-brush-and-rine-kids-bundle$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-peppermint$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$tetrasodium-pyrophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-deep-clean-whitening-toothpaste-spearmint$ps$ and ing.slug = $is$potassium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$cocos-nucifera-coconut-oil-organic$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whiten-plus-coconut-oil-fluoride-free-toothpaste-gentle-mint$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$aloe-barbadensis-leaf-juice-organic$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$benzoic-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$disodium-phosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$propylene-glycol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$butylene-glycol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-stearate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$glyceryl-laurate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$methylheptyl-glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-palmate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-cocoate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-palm-kernelate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$natural-fragrance$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-gluconate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$butyrospermum-parkii-shea-butter$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$everyday-essentials-starter-pack$ps$ and ing.slug = $is$sodium-chloride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$sodium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$best-sellers-toothpaste-trio$ps$ and ing.slug = $is$mentha-piperita-peppermint-oil$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$propylene-glycol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$butylene-glycol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-stearate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$aloe-barbadensis-leaf-juice-organic$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$methylheptyl-glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$glyceryl-laurate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$natural-fragrance$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-palmate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-cocoate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-palm-kernelate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-gluconate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-chloride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$butyrospermum-parkii-shea-butter$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$sodium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fresh-start-bundle$ps$ and ing.slug = $is$mentha-piperita-peppermint-oil$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$citrus-limon-lemon-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$mangifera-indica-mango-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$citrus-aurantium-dulcis-orange-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$ananas-sativus-pineapple-fruit-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$fragaria-ananassa-strawberry-fruit-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$kids-natural-toothpaste-variety-pack$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$citrus-limon-lemon-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$mangifera-indica-mango-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$citrus-aurantium-dulcis-orange-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$ananas-sativus-pineapple-fruit-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$fragaria-ananassa-strawberry-fruit-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-fluoride-free-toothpaste$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-cool-natural-mild-mint-toothpaste-for-kids-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$titanium-dioxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-wintermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-cinnamon-clove-toothpaste-with-fluoride$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$titanium-dioxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$artificial-flavors$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-fluoride-free-fresh-mint-toothpaste$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$grab-n-go-travel-size-anticavity-fresh-mint-toothpaste$ps$ and ing.slug = $is$titanium-dioxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$glycyrrhiza-uralensis-licorice-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$sodium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-spearmint-ice-natural-fluoride-toothpaste$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-toothpaste-gel$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$charcoal-powder$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-activated-charcoal-peppermint-toothpaste-with-fluoride$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$charcoal-powder$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-natural-spearmint-toothpaste-with-fluoride$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$citric-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$natural-fluoride-free-toddler-training-toothpaste$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$citrus-limon-lemon-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$mangifera-indica-mango-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$citrus-aurantium-dulcis-orange-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$ananas-sativus-pineapple-fruit-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$outrageous-orange-mango-kids-fluoride-natural-toothpaste$ps$ and ing.slug = $is$fragaria-ananassa-strawberry-fruit-juice$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$watermelon-wiggle-kids-toothpaste-with-fluoride$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$silly-strawberry-kids-anticavity-toothpaste$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-toothpaste-2-pack$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-fennel-toothpaste$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$aloe-barbadensis-leaf-juice-organic$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-essentials-bundle$ps$ and ing.slug = $is$glycyrrhiza-uralensis-licorice-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$propylene-glycol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$butylene-glycol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-stearate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$aloe-barbadensis-leaf-juice-organic$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$glyceryl-laurate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$methylheptyl-glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-palmate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-cocoate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-palm-kernelate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$natural-fragrance$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-gluconate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-chloride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$butyrospermum-parkii-shea-butter$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$arginine-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$mentha-piperita-peppermint-oil$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$titanium-dioxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-skin-smile-bundle$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$sodium-fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$aloe-barbadensis-leaf-juice-organic$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$propanediol-vegetable-derived$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$benzoic-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$disodium-phosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-oral-health-bundle$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$arginine-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$titanium-dioxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-rapid-relief-sensitive-fresh-mint-natural-toothpaste-new-sku$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$arginine-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$mentha-piperita-peppermint-oil$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$sorbitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$titanium-dioxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$xanthan-gum$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sensitive-whitening-fluoride-free-soothing-mint-natural-toothpaste-copy$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$sodium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$mentha-piperita-peppermint-oil$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$sls$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-peppermint-natural-toothpaste$ps$ and ing.slug = $is$artificial-flavors$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$glycyrrhiza-uralensis-licorice-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$sodium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$wicked-fresh-cool-peppermint-fluoride-natural-toothpaste-new-sku$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$lauryl-glucoside$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$disodium-cocoyl-glutamate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$sodium-hydroxide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$rebaudioside-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$fluoride-free-antiplaque-whitening-spearmint-natural-toothpaste$ps$ and ing.slug = $is$fluoride$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$sodium-monofluorophosphate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$glycerin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$water$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$calcium-carbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$hydrated-silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$xylitol$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$natural-flavor$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$sodium-lauryl-sulfate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$zinc-citrate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$sodium-bicarbonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$carrageenan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$whole-care-peppermint-natural-toothpaste-with-fluoride-2-pack-new-sku$ps$ and ing.slug = $is$benzyl-alcohol$is$
on conflict do nothing;
