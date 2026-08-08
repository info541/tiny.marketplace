-- Moon Juice brand seed + supplements category + placed_by = catoegy

-- NOTE: Run 01_schema.sql alone first (enum add), then the rest.

-- Moon Juice schema extras: supplements category + placed_by
-- Run this FIRST and alone, then continue.
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

alter type public.product_category add value if not exists 'supplements';

insert into public.categories (id, slug, name) values
  ('c1000000-0000-0000-0000-000000000008', 'supplements', 'Supplements')
on conflict (slug) do nothing;

alter table public.products add column if not exists placed_by text;


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


insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    'b0000000-0000-0000-0000-000000000001',
    $mj$neuro-magnesi-om$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Neuro Magnesi-Om$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    51.8,
    $mj$Cognitive speed + brain longevity$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/neuro-magnesi-om$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Ecom-Neuro_Matcha_Mag.png?v=1779567262&width=800$mj$,
    4.7,
    35,
    $mj$30 servings$mj$,
    $mj$Blend 1 rounded tsp in 6oz hot or cold water or milk, up to 2x a day. Neuro Magnesi-Om contains caffeine; it's best taken in the morning---or at least not so late in the day that it'll affect your sleep.$mj$,
    $mj$Short-term memory + cognitive speed; Mental stamina + alertness; Neuroplasticity + synaptic density$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000002',
    $mj$magnesi-om$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Magnesi-Om$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    30.8,
    $mj$Rest, relaxation + regularity$mj$,
    $mj$#5E4B45$mj$,
    $mj$Best seller$mj$,
    $mj$https://moonjuice.com/products/magnesi-om-magnesium-supplement$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Mag_New_800x800_4dbf7a23-5fdf-4b50-81ee-e0618d9f8c2b.png?v=1782516533&width=800$mj$,
    4.8,
    3853,
    $mj$30 servings$mj$,
    $mj$Mix 1 tsp of our magnesium powder in water every night or when you need to chill. Or mix one serving size with Tart Cherry Juice + sparkling water to make your own Sleepy Girl Mocktail.$mj$,
    $mj$Relaxation: Enhances feelings of calm, improves mood, reduces muscle aches; Brain Health: Supports healthy cognitive aging and brain function; Regularity: Supports regular bowel movement, soothes and$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000003',
    $mj$sleepy-magnesi-om$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Sleepy Magnesi-Om$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    34.3,
    $mj$Plant melatonin + magnesium for deep sleep$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/sleepy-magnesiom-magnesium-powder-with-melatonin-for-sleep$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/9_SleepyMag.png?v=1782413613&width=800$mj$,
    4.7,
    323,
    $mj$35 servings$mj$,
    $mj$Mix in 10oz water before bed as needed. This Magnesium and Melatonin powder for sleep is great for travel, shift work, and nights you have trouble falling asleep. Friendly for adults and kids 9+.$mj$,
    $mj$Sleep:Supports slumber without the hangover, decreases duration to fall asleep, supports sleep quality; Relaxation:Supports the body's stress response and muscle relaxation$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000004',
    $mj$superyou$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$SuperYou$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    37.8,
    $mj$Daily cortisol management. Energy, mood + focus$mj$,
    $mj$#5E4B45$mj$,
    $mj$Best seller$mj$,
    $mj$https://moonjuice.com/products/superyou$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/SuperYou_800x800_9fa65f73-f367-4e26-bf80-88b4ef9aff53.png?v=1762198134&width=800$mj$,
    4.8,
    3220,
    $mj$30 servings$mj$,
    $mj$Take 2 caps every morning, with or without food.$mj$,
    $mj$reduce physical, mental and emotional fatigue; reduce cortisol by 24%; boost energy and mood$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000005',
    $mj$superhair$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$SuperHair$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    46.2,
    $mj$Healthier, stronger, thicker hair$mj$,
    $mj$#5E4B45$mj$,
    $mj$Best seller$mj$,
    $mj$https://moonjuice.com/products/superhair$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/SuperHair_800x800_1e036d6d-c5a7-4bc3-ada4-58fb5e0c09bc.png?v=1762198161&width=800$mj$,
    4.7,
    2106,
    $mj$30 servings$mj$,
    $mj$Take 4 caps of SuperHair every morning, with or without food, for healthier, thicker, stronger hair.*$mj$,
    $mj$Helps balance stress hormones and reduce the effects of oxidative stress, which can contribute to hair loss; Help inhibit the hair-destructive hormone, DHT, to support healthy hair follicles and promo$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000006',
    $mj$superbeauty$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$SuperBeauty$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    46.2,
    $mj$Cellular skin care. Collagen, elasticity + cell vitality$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/superbeauty$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/SuperBeauty_800x800_a9883c0f-7510-4398-9bf3-1514540ce66e.png?v=1762198217&width=800$mj$,
    4.9,
    678,
    $mj$30 servings$mj$,
    $mj$Take 2 caps every morning, with or without food.$mj$,
    $mj$minimize the appearance of fine lines; promote collagen and elasticity; protect protein, lipids and DNA from oxidative damage* †$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000007',
    $mj$superpower$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$SuperPower$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    29.4,
    $mj$Radical immune support$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/superpower$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/SuperPower800x800.png?v=1762198322&width=800$mj$,
    4.7,
    200,
    $mj$10 servings$mj$,
    $mj$For daily maintenance, take 1 capsule. If you need extra support or feel your system is compromised, take 3 capsules every day for 10 days.$mj$,
    $mj$Support healthy immunity; Activate cells for a quick response; Balance an overactive immune system$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000008',
    $mj$sex-dust$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Sex Dust$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    26.6,
    $mj$Adaptogens for fire + creative energy$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/sex-dust$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Sex_Dust_ecom.png?v=1762198103&width=800$mj$,
    4.5,
    904,
    $mj$14 servings$mj$,
    $mj$Using a milk frother or blender, mix 1 tsp of this natural libido supplement into coffee, black tea, hot water with a splash of milk, or cocoa. Commit daily for maximum benefits.$mj$,
    $mj$LIBIDO + HORMONAL BALANCE; Shown to help:; Shatavarisupports healthy hormonal balance and juiciness$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000009',
    $mj$brain-dust$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Brain Dust$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    26.6,
    $mj$Mental stamina, alertness + concentration$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/brain-dust$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Brain_dust_ecom.png?v=1762198100&width=800$mj$,
    4.7,
    736,
    $mj$14 servings$mj$,
    $mj$Malty & bitter -- pairs well with tea, coffee, chocolate & milk; or add to any smoothie. Blend 1 tsp per serving.$mj$,
    $mj$Organic Lion's Mane:Known to be neuroprotective; Ginkgo:Supports speedy processing; Rhodiola:Promotes alertness and concentration$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000010',
    $mj$spirit-dust$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Spirit Dust$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    26.6,
    $mj$Relief of tension + irritability$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/spirit-dust$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Spirit_dust_ecom.png?v=1762198101&width=800$mj$,
    4.8,
    473,
    $mj$14 servings$mj$,
    $mj$Sweet & nutty -- pairs well with tea, coffee, chocolate & milk; or add to any smoothie. Blend 1 tsp per serving.$mj$,
    $mj$Traditionally used to help:; Organic Reishi:Known to nourish and calm, providing a sense of joy and peace; Organic Ashwagandha:Helps promote emotional wellbeing$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000011',
    $mj$beauty-dust$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Beauty Dust$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    26.6,
    $mj$Skin clarity + protection from accelerated aging$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/beauty-dust$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Beauty_dust_ecom.png?v=1762198098&width=800$mj$,
    4.7,
    410,
    $mj$30 servings$mj$,
    $mj$Tart, berry flavor -- pairs well with matcha, water & lemonade; or add to any smoothie. Blend 1 tsp per serving. Our berry-heavy blend Beauty Dust can clump or harden if not used regularly. This does not affect the potency. If you are a casual Duster, Beauty Dust is also available in a boxed set of 12 single serving sachets.$mj$,
    $mj$Traditionally used to help:; Organic Amla:Helps protect the skin from oxidative stress; Organic Schisandra:Traditionally used for its hydrating properties and to promote skin clarity$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000012',
    $mj$power-dust$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Power Dust$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    26.6,
    $mj$Adaptogens for energy. Stamina, recovery + healthy immunity$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/power-dust$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Power_dust_ecom.png?v=1762198106&width=800$mj$,
    4.8,
    321,
    $mj$14 servings$mj$,
    $mj$Bright & earthy -- pairs well with citrus, tea, milk & coffee; or add to any smoothie. Blend 1 tsp per serving.$mj$,
    $mj$Traditionally used to help:; Organic Cordyceps:Traditionally used to support healthy lung capacity; Organic Ginseng:Known to help rejuvenate energy$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000013',
    $mj$ting$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Ting$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    29.4,
    $mj$Caffeine-free pick-me-up. Energy, metabolism + mood$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/ting$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Ting_800x800_69845d2f-7a2c-41e0-881b-30dce02dc809.png?v=1762198447&width=800$mj$,
    4.8,
    674,
    $mj$25 servings$mj$,
    $mj$½ tsp to 12oz of water daily. Tips: + Dissolves best when added to glass before water. + Store in the fridge for warmer months or climates. Our Tulsi and Guava plant-based B Complex can get sticky. Since we don't add any flow agents, fillers, or unwanted additives, keeping it in the fridge can help prevent any clumping.$mj$,
    $mj$Metabolism: Converts fat, protein, and carbs into cellular currency; Energy: Enhances performance; Mood: Supports normal serotonin production, brain function, and short-term memory$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000014',
    $mj$mini-dew$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Mini Dew$mj$,
    'electrolytes',
    (select id from public.categories where slug = 'electrolytes'),
    30.8,
    $mj$Hydration + mineralization$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/mini-dew-electrolyte-powder-mix$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Mini_Dew_SFP_800x800_0fae2dde-03ee-45de-b9b5-9a0382b371d9.png?v=1762198818&width=800$mj$,
    4.6,
    442,
    $mj$30 servings$mj$,
    $mj$Mix 1 tsp of this electrolyte drink powder in 12oz of water every day. Also great for saunas, exercise, travel, or when you're feeling blah. Friendly for adults and kids 4+.$mj$,
    $mj$Hydration supports optimal hydration by maintaining water balance in and around cells; Brain enhances memory and cognitive performance, helps reduce brain fog and mental fatigue; Hormones can reduce P$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000015',
    $mj$cellular-waters-sticks$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Cellular Waters Sticks$mj$,
    'electrolytes',
    (select id from public.categories where slug = 'electrolytes'),
    26.6,
    $mj$Ting, Mini Dew & Magnesi-Om for energy, hydration & sleep. 15 sticks.$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/cellular-waters-sticks$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Cellular-Water-Sticks.png?v=1762198958&width=800$mj$,
    4.9,
    31,
    $mj$15 sticks$mj$,
    $mj$Ting 1 stick in water every day Mini Dew 1 stick in 12 oz water every day Magnesi-Om 1 stick in water every night$mj$,
    $mj$Ting:; * + Metabolismconverts fat, protein, and carbs into cellular currency; * + Energyenhances performance$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000016',
    $mj$cosmic-cocoa$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Cosmic Cocoa$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    30.8,
    $mj$Hot chocolate for libido, mood + skin$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/cosmic-cocoa$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Cosmic-COCOA-new-label.png?v=1782322781&width=800$mj$,
    4.8,
    726,
    $mj$14 servings$mj$,
    $mj$Add 2 tbsp of this adaptogen + mushroom hot chocolate blend to 8 oz hot water or hot milk of choice (almond milk, coconut milk). Blend on high. Sip in bliss.$mj$,
    $mj$Traditionally used to help:; Organic cacao:Antioxidant arousal food; Vegan creamer for skin, hair + nails.$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000017',
    $mj$collagen-protect$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Collagen Protect$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    40.6,
    $mj$Minimize fine lines + deep skin hydration$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/beauty-shroom-vegan-collagen-protection$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Collagen_Protect_Bag_800x800_1.png?v=1766547630&width=800$mj$,
    4.7,
    928,
    $mj$30 servings$mj$,
    $mj$Collagen Protect is a vegan collagen supplement. Add 1 rounded tbsp of this skin-protecting creamer to coffee or smoothies to promote healthy skin. Our plant-based collagen powder is a collagen builder that contains no additives, so it may clump. Blend for maximum yum.$mj$,
    $mj$preserve your natural collagen production; hydrate skin; improve skin elasticity$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000018',
    $mj$plump-jelly$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Plump Jelly$mj$,
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    40.6,
    $mj$A glass of water for your face$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/beauty-shroom-plumping-jelly-serum$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Plump_Jelly_New_800x800_e3f92bf7-9fcd-417b-b30d-ddfe337fcbdd.png?v=1762198144&width=800$mj$,
    4.8,
    823,
    $mj$$mj$,
    $mj$AM + PM. Apply 3 pumps onto damp skin. Use after in the PM. Follow with . Hydrates lips too. Tips + Cherub facial: apply 6 pumps to soaking wet face/neck + Use as a primer (let it sink in)$mj$,
    $mj$Shown to help:; hydrate in and around the cells; preserve elasticity and bounce$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000019',
    $mj$acid-potion$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Acid Potion$mj$,
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    29.4,
    $mj$Quickie liquid facial. Exfoliate, unclog + soothe$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/beauty-shroom-exfoliating-acid-potion$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Acid_Potion_New_800x800_ecfe112d-af61-458c-a2b6-1564d1282f9f.png?v=1762198144&width=800$mj$,
    4.8,
    867,
    $mj$$mj$,
    $mj$PM. Use 3 nights a week. Shake a quarter sized amount into palm and pat into clean face/neck with fingertips. Don't rinse! Follow with and . Tips + Ditch the cotton round, apply directly with palms + Use multiple nights in a row to penetrate stubborn pores + Target a specificskin concernorproblem area (doesn't have to be your full face)$mj$,
    $mj$Shown to help:; resurface skin and unclog pores; stimulate collagen production$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000020',
    $mj$acid-potion-travel-size$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Acid Potion Travel Size$mj$,
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    18,
    $mj$Quickie liquid facial. Exfoliate, unclog & soothe.$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/acid-potion-travel-size$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/220801_MJ_Capture_22-08-01_046.png?v=1762198641&width=800$mj$,
    4.7,
    36,
    $mj$$mj$,
    $mj$PM. Use 3 nights a week. Shake a quarter sized amount into palm and pat into clean face/neck with fingertips. Don't rinse! Follow with and .$mj$,
    $mj$Helps:; * + resurface skin and unclog pores; * + stimulate collagen production$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000021',
    $mj$cosmic-cream$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Cosmic Cream$mj$,
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    40.6,
    $mj$Moisturize + replenish$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/cosmic-cream$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Cosmic_Cream_New_800x800_2d7fc7cb-584d-4bee-b1ba-20cd19f3e92f.png?v=1762198193&width=800$mj$,
    4.8,
    398,
    $mj$$mj$,
    $mj$AM + PM. Swipe onto face/neck after applying or other serums. Leaves a dewy finish.$mj$,
    $mj$Shown to help:; Seal in moisture.; Improve skin's natural elasticity and firmness.$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000022',
    $mj$milk-cleanse$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Milk Cleanse$mj$,
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    22.4,
    $mj$Cleanse, soothe + nourish$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/milk-cleanse$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Milk_Cleanse_New_800x800_cc1149bb-cc99-4ac2-8678-021068b2016e.png?v=1762198193&width=800$mj$,
    4.9,
    359,
    $mj$$mj$,
    $mj$Massage onto wet skin and rinse. AM, follow with and . PM, follow with , , and . Tips + Safe as a double cleanser + Use as a vulva wash (it's pH balanced)$mj$,
    $mj$Shown to help:; match skin's pH and never strip; hydrate and nourish$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000023',
    $mj$ashwagandha$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Ashwagandha$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    26.6,
    $mj$15:1 full-spectrum root extract$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/ashwagandha-root-extract$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Ashwagandha_New_800x800_cfb8d640-1544-44b1-bd66-733000f40682.png?v=1762197951&width=800$mj$,
    4.8,
    421,
    $mj$58 servings$mj$,
    $mj$A dark, brown organic Ashwagandha root powder with a bitter, molasses-like flavor. Pairs well with chocolate, coffee, maple, and baked goods. The suggested use is between 1/4--1/2 tsp daily to experience optimal Ashwagandha benefits.$mj$,
    $mj$reduce stress and regulate cortisol levels; enhance focus and mental stamina; reduce irritability and stress-related cravings$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000024',
    $mj$pearl$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Pearl$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    37.8,
    $mj$Beauty gem for collagen hair + nails$mj$,
    $mj$#5E4B45$mj$,
    $mj$Popular$mj$,
    $mj$https://moonjuice.com/products/pearl$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Pearl_800x800_3431461e-5e0e-4bfe-b903-f39c29de3809.png?v=1762197964&width=800$mj$,
    4.8,
    564,
    $mj$30 servings$mj$,
    $mj$Pairs well with everything---smoothies, coffee, tea, tonics, milks, and baking. Add a pinch to your moisturizer or raw honey for a mask, or brush directly onto skin before bed. Use 1/2 tsp daily.$mj$,
    $mj$stimulate the body's natural collagen; even skin tone; strengthen hair, skin, and nails$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000025',
    $mj$cordyceps$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Cordyceps$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    43.2,
    $mj$Energy, stamina + lung capacity$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/cordyceps$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Cordyceps_800x800_08ab29c6-1823-4d35-bc4f-f6e481feaf62.png?v=1762197958&width=800$mj$,
    4.9,
    179,
    $mj$36 servings$mj$,
    $mj$A golden powder with a slightly sweet anise-y, woody flavor. Pairs well with tropical fruits, citrus, ginger, chocolate, and coffee. Use between 1--3 tsp of this dietary supplement daily. Our Cordyceps mushroom extract is a key ingredient in Milk Chocolate Momentum. Find the recipe in$mj$,
    $mj$Traditionally used to help:; Sustain energy and stamina.; Encourage healthy lung capacity.$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000026',
    $mj$reishi$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Reishi$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    33.6,
    $mj$Nootropic mushroom. Mood + concentration$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/reishi$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/Reishi_800x800_27ba2f24-b43a-4be7-bd5e-a280927ee0ee.png?v=1762197965&width=800$mj$,
    4.9,
    188,
    $mj$14 servings$mj$,
    $mj$A dark brown powder with a strong, botanical aroma and an intensely tannic taste with some bitterness. Pairs well with chocolate and coffee. Use between 1--4 tsp daily. Reishi is a key ingredient in Queen Healer Bread. Find the recipe in .$mj$,
    $mj$Traditionally used to help:; Balance mood and support concentration.; Crowned Queen Healer in TCM because of its ability to strengthen the heart and mind.$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000027',
    $mj$chaga$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$Chaga$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    33.6,
    $mj$Protective mushroom. Energy + immunity$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/chaga$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/products/Chaga_800x800_1b367417-2355-4347-8401-7cd972bed033.png?v=1762197955&width=800$mj$,
    4.9,
    155,
    $mj$13 servings$mj$,
    $mj$This organic Chaga supplement is a dark, brown powder with a very mild and palatable earthy flavor, perfect for pairing with smoothies, lattes, coffee, andherbal tea. Use 1 tsp daily.$mj$,
    $mj$Support healthy immune system.; Balance energy.; Reduce fatigue.$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000028',
    $mj$supersex$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$SuperSex$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    54,
    $mj$Adaptogens for Fire. Libido, Hormonal Balance & Creative Energy.$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/supersex$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/MoonJuice_PPage_SuperSex_1_V2.png?v=1762199763&width=800$mj$,
    5,
    5,
    $mj$20 servings$mj$,
    $mj$Take 3 caps of SuperSex every morning, with or without food.$mj$,
    $mj$Libido:; Helps ignite desire and strengthen sensation; Hormonal Balance:$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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
    'b0000000-0000-0000-0000-000000000029',
    $mj$superbrain$mj$,
    (select id from public.brands where slug = 'moon-juice'),
    $mj$SuperBrain$mj$,
    'supplements',
    (select id from public.categories where slug = 'supplements'),
    54,
    $mj$Adaptogens for focus. Mental stamina, alertness & concentration.$mj$,
    $mj$#5E4B45$mj$,
    null,
    $mj$https://moonjuice.com/products/super-brain$mj$,
    'direct',
    $mj$https://moonjuice.com/cdn/shop/files/MoonJuice_PPage_SuperBrain_V2.png?v=1762199756&width=800$mj$,
    4.8,
    4,
    $mj$14 servings$mj$,
    $mj$Take 4 caps of SuperBrain every morning, with or without food.*$mj$,
    $mj$Mental Stamina:; Targets stress to promote mental stamina and clarity; Alertness:$mj$,
    $mj$$mj$,
    $mj$$mj$,
    array[$f$100% Traceable$f$, $f$Clinically Proven Potency$f$, $f$3rd Party Tested$f$, $f$Vegan$f$, $f$No Fillers or Junk$f$, $f$Bioavailable$f$]::text[],
    true,
    $mj$catoegy$mj$
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



-- Moon Juice ingredients
-- Uses kind = 'contains' | 'free_from' (no position column)

insert into public.ingredients (slug, name) values ($s$magtein-magnesium-l-threonate$s$, $n$Magtein Magnesium L-threonate$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-lions-mane$s$, $n$Organic Lion's Mane$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-caffeine$s$, $n$Organic Caffeine$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$l-theanine$s$, $n$L-theanine$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$fillers$s$, $n$Fillers$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$junk$s$, $n$Junk$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$animal-products$s$, $n$Animal products$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$magnesium-chelate-blend-citrate-gluconate-and-acetyl-taurinate$s$, $n$Magnesium Chelate Blend (Citrate, Gluconate, and Acetyl Taurinate)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$magnesium-chelate-blend-bisglycinate-and-gluconate$s$, $n$Magnesium Chelate Blend (Bisglycinate and Gluconate)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$phytomelatonin$s$, $n$Phytomelatonin$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-ashwagandha$s$, $n$Organic Ashwagandha$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-amla$s$, $n$Organic Amla$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organically-grown-shatavari$s$, $n$Organically Grown Shatavari$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$wildcrafted-rhodiola$s$, $n$Wildcrafted Rhodiola$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$multivitamin-complex-a$s$, $n$Multivitamin Complex A$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$b12$s$, $n$B12$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$horsetail$s$, $n$Horsetail$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$wildcrafted-saw-palmetto$s$, $n$Wildcrafted Saw Palmetto$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$iodine-from-wild-harvested-kelp$s$, $n$Iodine from Wild Harvested Kelp$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-ashwagandha-root-extract-ksm66$s$, $n$Organic Ashwagandha Root Extract (KSM66)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-astaxanthin$s$, $n$Organic Astaxanthin$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$liposomal-glutathione$s$, $n$Liposomal Glutathione$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$vitamin-c-from-organic-acerola$s$, $n$Vitamin C from Organic Acerola$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$silica$s$, $n$Silica$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$liposomal-vitamin-c$s$, $n$Liposomal Vitamin C$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$vitamin-d2$s$, $n$Vitamin D2$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$chelated-zinc$s$, $n$Chelated Zinc$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$beta-glucan$s$, $n$Beta-Glucan$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-lions-mane-mushroom-extract$s$, $n$Organic Lion's Mane Mushroom Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-maca-root-extract$s$, $n$Organic Maca Root Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-astragalus-root-extract$s$, $n$Organic Astragalus Root Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$rhodiola-root-extract$s$, $n$Rhodiola root extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$ginkgo-leaf-extract$s$, $n$Ginkgo Leaf Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-ashwagandha-root-and-leaf-extract$s$, $n$Organic Ashwagandha Root and Leaf Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-reishi-mushroom-extract$s$, $n$Organic Reishi Mushroom Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-schisandra-berry-powder$s$, $n$Organic Schisandra Berry Powder$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-amla-berry-extract$s$, $n$Organic Amla Berry Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$pearl-extract$s$, $n$Pearl Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$cordyceps$s$, $n$Cordyceps$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$vitamin-b-complex-vitamin-b1-b2-b3-niacin-b5-b6-b9$s$, $n$Vitamin B Complex (Vitamin B1 B2 B3 Niacin B5 B6 B9)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$vitamin-b12-methylcobalamin$s$, $n$Vitamin B12 (Methylcobalamin)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$adaptogenic-ginseng$s$, $n$Adaptogenic Ginseng$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$folate-metafolin-vitamin-b9$s$, $n$Folate (Metafolin Vitamin B9)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$fermented-l-glutamine$s$, $n$Fermented L-Glutamine$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$himalayan-pink-salt-electrolyte$s$, $n$Himalayan Pink Salt Electrolyte$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$chelated-essential-minerals$s$, $n$Chelated Essential Minerals$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$ionic-trace-minerals$s$, $n$Ionic Trace Minerals$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$ting$s$, $n$Ting$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$b-complex-from-blend-of-psidium-guajava-ocimum-sanctum-citrus-limon-extracts$s$, $n$B complex (from Blend of Psidium Guajava, Ocimum Sanctum, Citrus Limon Extracts)$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$mini-dew$s$, $n$Mini Dew$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$magnesi-om$s$, $n$Magnesi-Om$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-cacao-powder$s$, $n$Organic Cacao Powder$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$shatavari-root-extract$s$, $n$Shatavari root extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$tocos$s$, $n$Tocos$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$hyaluronic-acid$s$, $n$Hyaluronic Acid$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$silver-ear-mushroom$s$, $n$Silver Ear Mushroom$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$beet-amino-acid$s$, $n$Beet Amino Acid$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$reishi$s$, $n$Reishi$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$25-aha-bha-complex$s$, $n$25% AHA + BHA Complex$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$niacinamide$s$, $n$Niacinamide$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$ashwagandha$s$, $n$Ashwagandha$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$schisandra$s$, $n$Schisandra$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$coconut-ferment$s$, $n$Coconut Ferment$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$sourcing$s$, $n$Sourcing$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$our-ingredients-are-100-traceable$s$, $n$Our ingredients are 100% traceable$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$unadulterated$s$, $n$unadulterated$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$and-sustainably-sourced$s$, $n$and sustainably sourced.$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-chaga-sclerotia-extract$s$, $n$Organic Chaga Sclerotia Extract$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$purified-shilajit$s$, $n$Purified shilajit$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$shatavari$s$, $n$Shatavari$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-epimedium$s$, $n$Organic epimedium$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-schisandra$s$, $n$Organic Schisandra$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-maca$s$, $n$Organic maca$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$lions-mane$s$, $n$Lion's Mane$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-rhodiola$s$, $n$Organic rhodiola$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$ginkgo$s$, $n$Ginkgo$n$) on conflict (slug) do nothing;
insert into public.ingredients (slug, name) values ($s$organic-astragalus$s$, $n$Organic astragalus$n$) on conflict (slug) do nothing;

insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$magtein-magnesium-l-threonate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$organic-lions-mane$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$organic-caffeine$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$l-theanine$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$neuro-magnesi-om$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$magnesi-om$ps$ and ing.slug = $is$magnesium-chelate-blend-citrate-gluconate-and-acetyl-taurinate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$magnesi-om$ps$ and ing.slug = $is$l-theanine$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$magnesi-om$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$magnesi-om$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$magnesi-om$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sleepy-magnesi-om$ps$ and ing.slug = $is$l-theanine$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sleepy-magnesi-om$ps$ and ing.slug = $is$magnesium-chelate-blend-bisglycinate-and-gluconate$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sleepy-magnesi-om$ps$ and ing.slug = $is$phytomelatonin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sleepy-magnesi-om$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sleepy-magnesi-om$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sleepy-magnesi-om$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$organic-ashwagandha$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$organic-amla$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$organically-grown-shatavari$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$wildcrafted-rhodiola$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superyou$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$multivitamin-complex-a$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$b12$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$horsetail$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$wildcrafted-saw-palmetto$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$iodine-from-wild-harvested-kelp$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$organic-ashwagandha-root-extract-ksm66$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superhair$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$organic-astaxanthin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$liposomal-glutathione$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$vitamin-c-from-organic-acerola$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$silica$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbeauty$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$liposomal-vitamin-c$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$vitamin-d2$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$chelated-zinc$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$beta-glucan$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superpower$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sex-dust$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sex-dust$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$sex-dust$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$organic-lions-mane-mushroom-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$organic-maca-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$organic-astragalus-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$rhodiola-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$ginkgo-leaf-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$organic-ashwagandha-root-and-leaf-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$brain-dust$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$spirit-dust$ps$ and ing.slug = $is$organic-reishi-mushroom-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$spirit-dust$ps$ and ing.slug = $is$organic-ashwagandha-root-and-leaf-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$spirit-dust$ps$ and ing.slug = $is$organic-astragalus-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$spirit-dust$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$spirit-dust$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$spirit-dust$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$organic-schisandra-berry-powder$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$organic-ashwagandha-root-and-leaf-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$organic-amla-berry-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$pearl-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$beauty-dust$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$cordyceps$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$organic-schisandra-berry-powder$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$rhodiola-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$organic-astragalus-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$organic-ashwagandha-root-and-leaf-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$power-dust$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$vitamin-b-complex-vitamin-b1-b2-b3-niacin-b5-b6-b9$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$vitamin-b12-methylcobalamin$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$adaptogenic-ginseng$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$folate-metafolin-vitamin-b9$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$fermented-l-glutamine$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ting$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$mini-dew$ps$ and ing.slug = $is$himalayan-pink-salt-electrolyte$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$mini-dew$ps$ and ing.slug = $is$chelated-essential-minerals$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$mini-dew$ps$ and ing.slug = $is$ionic-trace-minerals$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$mini-dew$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$mini-dew$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$mini-dew$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$ting$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$b-complex-from-blend-of-psidium-guajava-ocimum-sanctum-citrus-limon-extracts$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$mini-dew$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$magnesi-om$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cellular-waters-sticks$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$organic-cacao-powder$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$organic-ashwagandha-root-extract-ksm66$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$shatavari-root-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$organic-reishi-mushroom-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cocoa$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$collagen-protect$ps$ and ing.slug = $is$tocos$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$collagen-protect$ps$ and ing.slug = $is$hyaluronic-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$collagen-protect$ps$ and ing.slug = $is$silver-ear-mushroom$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$collagen-protect$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$collagen-protect$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$collagen-protect$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$hyaluronic-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$silver-ear-mushroom$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$tocos$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$beet-amino-acid$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$reishi$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$plump-jelly$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion$ps$ and ing.slug = $is$25-aha-bha-complex$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion$ps$ and ing.slug = $is$niacinamide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion$ps$ and ing.slug = $is$reishi$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion-travel-size$ps$ and ing.slug = $is$25-aha-bha-complex$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion-travel-size$ps$ and ing.slug = $is$niacinamide$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion-travel-size$ps$ and ing.slug = $is$reishi$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion-travel-size$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion-travel-size$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$acid-potion-travel-size$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cream$ps$ and ing.slug = $is$ashwagandha$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cream$ps$ and ing.slug = $is$schisandra$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cream$ps$ and ing.slug = $is$reishi$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cream$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cream$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cosmic-cream$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$milk-cleanse$ps$ and ing.slug = $is$coconut-ferment$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$milk-cleanse$ps$ and ing.slug = $is$silver-ear-mushroom$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$milk-cleanse$ps$ and ing.slug = $is$reishi$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$milk-cleanse$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$milk-cleanse$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$milk-cleanse$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ashwagandha$ps$ and ing.slug = $is$organic-ashwagandha-root-extract-ksm66$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ashwagandha$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ashwagandha$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$ashwagandha$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$pearl$ps$ and ing.slug = $is$pearl-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$pearl$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$pearl$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$pearl$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$cordyceps$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$sourcing$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$our-ingredients-are-100-traceable$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$unadulterated$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$and-sustainably-sourced$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$cordyceps$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$organic-reishi-mushroom-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$sourcing$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$our-ingredients-are-100-traceable$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$unadulterated$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$and-sustainably-sourced$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$reishi$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$chaga$ps$ and ing.slug = $is$organic-chaga-sclerotia-extract$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$chaga$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$chaga$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$chaga$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$purified-shilajit$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$shatavari$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$organic-epimedium$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$organic-schisandra$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$organic-maca$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$supersex$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$lions-mane$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$organic-rhodiola$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$ginkgo$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$organic-astragalus$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$organic-maca$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'contains'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$ashwagandha$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$fillers$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$junk$is$
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select pr.id, ing.id, 'free_from'
from public.products pr, public.ingredients ing
where pr.slug = $ps$superbrain$ps$ and ing.slug = $is$animal-products$is$
on conflict do nothing;
