-- Humble Brands seed (editor-safe)
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

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


insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000001',
    'palo-santo-frankincense-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Palo Santo & Frankincense Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 5/5 - Bold Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/palo-santo-frankincense-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-PaloSanto_Frankincense-Front-WEB.jpg?v=1762360667&width=800',
    4.7,
    672,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Bold Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000002',
    'patchouli-copal-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Patchouli & Copal Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 4/5 - Full Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/patchouli-copal-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-Patchouli_Copal-Front-WEB.jpg?v=1762360667&width=800',
    4.7,
    329,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000003',
    'palo-santo-frankincense-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Palo Santo & Frankincense Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 5/5 - Bold Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/plastic-free-natural-deodorant-palo-santo-frankincense',
    'direct',
    'https://humblebrands.com/cdn/shop/files/122222_Palo_Santo_Frankincense_Front_Web.jpg?v=1782335013&width=800',
    4.7,
    668,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Bold Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000004',
    'moroccan-rose-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Moroccan Rose Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 3/5 - Balanced Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/moroccan-rose-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OF_Full-Moroccan_Rose-Front-WEB.jpg?v=1762360667&width=800',
    4.5,
    238,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000005',
    'black-spruce-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Black Spruce Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 4/5 - Full Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/black-spruce-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-BlackSpruce-Front-WEB.jpg?v=1762360667&width=800',
    4.7,
    145,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000006',
    'patchouli-copal-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Patchouli & Copal Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 4/5 - Full Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/plastic-free-natural-deodorant-patchouli-copal',
    'direct',
    'https://humblebrands.com/cdn/shop/files/122222_Patchouli_Copal_Front_Web.jpg?v=1782335013&width=800',
    4.8,
    182,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000007',
    'mountain-lavender-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Mountain Lavender Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 2/5 - Light Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/mountain-lavender-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-MountainLavender-Front-WEB.jpg?v=1775084023&width=800',
    4.6,
    209,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Light Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000008',
    'bergamot-ginger-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Bergamot & Ginger Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 2/5 - Light Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/bergamot-ginger-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-Bergamot_Ginger-Front-WEB.jpg?v=1762298058&width=800',
    4.6,
    180,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Light Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000009',
    'rosemary-mint-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Rosemary & Mint Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 3/5 - Balanced Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/natural-deodorant-rosemary-mint',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-Rosemary_Mint-Front-WEB.jpg?v=1762360667&width=800',
    4.7,
    118,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000010',
    'moroccan-rose-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Moroccan Rose Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 3/5 - Balanced Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/plastic-free-natural-deodorant-moroccan-rose',
    'direct',
    'https://humblebrands.com/cdn/shop/files/122222_Moroccan_Rose_Front_Web_5a02bdaf-80e8-4bf2-a8ce-3662523d7ffc.jpg?v=1782335725&width=800',
    4.7,
    668,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000011',
    'bergamot-ginger-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Bergamot & Ginger Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 2/5 - Light Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/plastic-free-natural-deodorant-bergamot-ginger',
    'direct',
    'https://humblebrands.com/cdn/shop/files/122222_Bergamont_Ginger_Front_Web.jpg?v=1782324071&width=800',
    4.7,
    138,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Light Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000012',
    'rockrose-cedar-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Rockrose & Cedar Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 5/5 - Bold Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/plastic-free-natural-deodorant-rockrose-cedar-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/082224_Rockrose_Cedar_Front_Web.jpg?v=1782331812&width=800',
    4.7,
    668,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Bold Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000013',
    'lemongrass-sage-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Lemongrass & Sage Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 4/5 - Full Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/lemongrass-sage-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OF_Full-Lemongrass_Sage-Front-WEB.jpg?v=1762360667&width=800',
    4.7,
    124,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000014',
    'sensitive-skin-mountain-lavender-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Sensitive Skin Mountain Lavender Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 2/5 - Light Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/plastic-free-natural-deodorant-mountain-lavender-vegan',
    'direct',
    'https://humblebrands.com/cdn/shop/files/122222_Vegan_Mountain_Lavender_Front_Web.jpg?v=1782336140&width=800',
    4.7,
    122,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'Sensitive skin',
    'Light Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Baking soda-free', 'Sensitive skin formula', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000015',
    'palo-santo-frankincense-travel-size',
    (select id from public.brands where slug = 'humble-brands'),
    'Palo Santo & Frankincense Travel Size',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    3.99,
    'Travel Size Original. Scent intensity 5/5 - Bold Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/palo-santo-frankincense-travel-size-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/products/122722_Humble_OriginalDeodorant_PaloSantoFrankincenseTravel_Front_Web_93163f2e-2ad1-4a04-bccb-ee78f6015292.jpg?v=1762457415&width=800',
    4.7,
    672,
    '.5 oz | 14 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Bold Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Travel mini size', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000016',
    'lavender-holy-basil-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Lavender & Holy Basil Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 3/5 - Balanced Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/lavender-holy-basil-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-Lavender_HolyBasil-Front-WEB.jpg?v=1762360667&width=800',
    4.6,
    104,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000017',
    'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Baking Soda-Free Sensitive Skin Palo Santo & Frankincense Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Sensitive Skin Deodorant. Scent intensity 5/5 - Bold Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/palo-santo-frankincense-vegan-sensititive-skin-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-VSFull-PaloSanto_Frankincense-Front-WEB.jpg?v=1762360667&width=800',
    4.8,
    141,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'Sensitive skin',
    'Bold Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Baking soda-free', 'Sensitive skin formula', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000018',
    'patchouli-copal-soap',
    (select id from public.brands where slug = 'humble-brands'),
    'Patchouli & Copal Soap',
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    7.99,
    'Moisturizing bar soap - Deep earthy richness with smooth balsamic warmth and soft sweetness.',
    '#6A7F5C',
    'https://humblebrands.com/products/patchouli-copal-natural-bar-soap',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250520_Humble_Bar_Soap_Box_Naked_Patchouli_Copal_Web.jpg?v=1762457418&width=800',
    4.7,
    668,
    '2.5 oz | 70 g',
    'Wet bar. Work into a lather. Wash. Rinse. Done. Avoid contact with eyes.',
    'All skin types',
    'Deep earthy richness with smooth balsamic warmth and soft sweetness.',
    'Rich moisturizing lather',
    array['Moisturizing bar soap', 'Recyclable packaging, made with the planet in mind']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000019',
    'mountain-lavender-soap',
    (select id from public.brands where slug = 'humble-brands'),
    'Mountain Lavender Soap',
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    7.99,
    'Moisturizing bar soap - Clean herbal florals with gentle sweetness and green clarity',
    '#6A7F5C',
    'https://humblebrands.com/products/mountain-lavender-natural-bar-soap',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250520_Humble_Bar_Soap_Box_Naked_Mountain_Lavender_Web.jpg?v=1762457411&width=800',
    4.7,
    62,
    '2.5 oz | 70 g',
    'Wet bar. Work into a lather. Wash. Rinse. Done. Avoid contact with eyes.',
    'All skin types',
    'Clean herbal florals with gentle sweetness and green clarity',
    'Rich moisturizing lather',
    array['Moisturizing bar soap', 'Recyclable packaging, made with the planet in mind']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000020',
    'unscented-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Unscented Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Aluminum-free Deodorant. Scent intensity 1/5 - Unscented Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/simply-unscented-natural-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-OFFull-SimplyUnscented-Front-WEB.jpg?v=1762360667&width=800',
    4.7,
    104,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Unscented Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000021',
    'lemongrass-sage-soap',
    (select id from public.brands where slug = 'humble-brands'),
    'Lemongrass & Sage Soap',
    'skincare',
    (select id from public.categories where slug = 'skincare'),
    7.99,
    'Moisturizing bar soap from Humble Brands',
    '#6A7F5C',
    'https://humblebrands.com/products/lemongrass-sage-natural-bar-soap',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250520_Humble_Bar_Soap_Box_Naked_Lemongrass_and_Sage_Web.jpg?v=1775084023&width=800',
    4.7,
    62,
    '4 oz | 113 g',
    'Wet bar. Work into a lather. Wash. Rinse. Done. Avoid contact with eyes.',
    'All skin types',
    'Lemongrass & Sage',
    'Rich moisturizing lather',
    array['Moisturizing bar soap', 'Recyclable packaging, made with the planet in mind']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000022',
    'baking-soda-free-sensitive-skin-moroccan-rose-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Baking Soda-Free Sensitive Skin Moroccan Rose Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Sensitive Skin Deodorant. Scent intensity 3/5 - Balanced Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/moroccan-rose-vegan',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-VSFull-MoroccanRose-Front-WEB.jpg?v=1762360667&width=800',
    4.4,
    68,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'Sensitive skin',
    'Balanced Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Baking soda-free', 'Sensitive skin formula', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000023',
    'baking-soda-free-sensitive-skin-mountain-lavender-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Baking Soda-Free Sensitive Skin Mountain Lavender Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Sensitive Skin Deodorant. Scent intensity 2/5 - Light Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/mountain-lavender-vegan-sensitive-skin-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/250919-Humble-VSFull-MountainLavender-Front-WEB.jpg?v=1775083982&width=800',
    4.9,
    81,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'Sensitive skin',
    'Light Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Baking soda-free', 'Sensitive skin formula', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000024',
    'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Baking Soda-Free Sensitive Skin Bergamot & Ginger Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Sensitive Skin Deodorant. Scent intensity 2/5 - Light Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/bergamot-ginger-vegan-sensitive-skin-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/Bergamot_Ginger_Senstive_Deodorant.png?v=1786120058&width=800',
    4.7,
    80,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'Sensitive skin',
    'Light Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Baking soda-free', 'Sensitive skin formula', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000025',
    'baking-soda-free-sensitive-skin-unscented-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Baking Soda-Free Sensitive Skin Unscented Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    10.99,
    'Sensitive Skin Deodorant. Scent intensity 1/5 - Unscented Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/unscented-vegan-sensitive-skin-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/Energize_Kit_032b623d-8109-4d3d-a99a-c99e33eb4782.png?v=1786119632&width=800',
    4.6,
    90,
    '2.5 oz | 70 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'Sensitive skin',
    'Unscented Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Baking soda-free', 'Sensitive skin formula', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000026',
    'bergamot-ginger-travel-size',
    (select id from public.brands where slug = 'humble-brands'),
    'Bergamot & Ginger Travel Size',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    3.99,
    'Travel Size Original. Scent intensity 2/5 - Light Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/bergamot-ginger-travel-size-single-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/products/122722_Humble_OriginalDeodorant_BergamotandGingerTravel_Front_Web_61125dfa-1837-4db7-a851-c1f5573cd040.jpg?v=1762457397&width=800',
    5,
    20,
    '.5 oz | 14 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Light Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Travel mini size', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000027',
    'lemongrass-sage-travel-size',
    (select id from public.brands where slug = 'humble-brands'),
    'Lemongrass & Sage Travel Size',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    3.99,
    'Travel Size Original. Scent intensity 4/5 - Full Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/lemongrass-sage-travel-size-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/products/122722_Humble_OriginalDeodorant_LemongrassSageTravel_Front_Web_747d73e0-6c61-4a1d-8f45-fcad4d097194.jpg?v=1762457411&width=800',
    4.2,
    20,
    '.5 oz | 14 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Travel mini size', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000028',
    'black-spruce-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Black Spruce Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 4/5 - Full Masculine.',
    '#6A7F5C',
    'https://humblebrands.com/products/black-spruce-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/091624_Black_Spruce_Front_Web.jpg?v=1782335013&width=800',
    4.3,
    31,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Masculine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000029',
    'rosemary-mint-plastic-free-deodorant',
    (select id from public.brands where slug = 'humble-brands'),
    'Rosemary & Mint Plastic-Free Deodorant',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    12.99,
    'Plastic Free Deodorant. Scent intensity 3/5 - Balanced Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/rosemary-mint-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/files/080624_Rosemary_Mint_Front_Web.jpg?v=1782324302&width=800',
    4.6,
    27,
    '2.65 oz | 75 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Plastic-free paper packaging', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000030',
    'moroccan-rose-travel-size',
    (select id from public.brands where slug = 'humble-brands'),
    'Moroccan Rose Travel Size',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    3.99,
    'Travel Size Original. Scent intensity 3/5 - Balanced Feminine.',
    '#6A7F5C',
    'https://humblebrands.com/products/moroccan-rose-travel-size-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/products/122722_Humble_OriginalDeodorant_MoroccanRoseTravel_Front_Web_128e8903-86b2-4f7d-b60d-251c31d8ef9d.jpg?v=1762457452&width=800',
    4.6,
    25,
    '.5 oz | 14 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Feminine',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Travel mini size', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000031',
    'patchouli-copal-travel-size',
    (select id from public.brands where slug = 'humble-brands'),
    'Patchouli & Copal Travel Size',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    3.99,
    'Travel Size Original. Scent intensity 4/5 - Full Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/patchouli-copal-travel-size-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/products/122722_Humble_OriginalDeodorant_PatchouliCopalTravel_Front_Web_ea71ab79-496a-42bf-8902-38e0e7f0b15e.jpg?v=1762457450&width=800',
    4.8,
    27,
    '.5 oz | 14 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Full Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Travel mini size', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;

insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published
) values
  (
    'a0000000-0000-0000-0000-000000000032',
    'rosemary-mint-travel-size',
    (select id from public.brands where slug = 'humble-brands'),
    'Rosemary & Mint Travel Size',
    'deodorant',
    (select id from public.categories where slug = 'deodorant'),
    3.99,
    'Travel Size Original. Scent intensity 3/5 - Balanced Gender-neutral.',
    '#6A7F5C',
    'https://humblebrands.com/products/rosemary-mint-travel-size-deodorant',
    'direct',
    'https://humblebrands.com/cdn/shop/products/122722_Humble_OriginalDeodorant_RosemaryMintTravel_Front_Web_ba8f8cbc-2e75-4e5f-9a7a-62d33a6bfc44.jpg?v=1762457777&width=800',
    4.7,
    13,
    '.5 oz | 14 g',
    'Apply 2-3 swipes to underarms and rub in any excess. Do not apply to broken skin. Patch test before use. If irritation occurs, discontinue use.',
    'All skin types',
    'Balanced Gender-neutral',
    'Cream stick that glides on smooth',
    array['Aluminum-free', 'Original formula with baking soda', 'Travel mini size', '75% Post Consumer Recycled Plastic (PCR) and Plastic Free Paper packaging']::text[],
    true
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  affiliate_url = excluded.affiliate_url,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  smells_like = excluded.smells_like,
  finish = excluded.finish,
  features = excluded.features,
  is_published = excluded.is_published;


insert into public.ingredients (slug, name) values
  ('aluminum', 'Aluminum'),
  ('aqua', 'Aqua'),
  ('baking-soda', 'Baking Soda'),
  ('benzyl-benzoate', 'Benzyl Benzoate'),
  ('benzyl-benzoate-non-gmo', 'Benzyl Benzoate Non-GMO'),
  ('boswellia-serrata-frankincense-oil', 'Boswellia Serrata (Frankincense) Oil'),
  ('bursera-graveolens-palo-santo-wood-oil', 'Bursera Graveolens (Palo Santo) Wood Oil'),
  ('cananga-odorata-ylang-ylang-flower-oil', 'Cananga Odorata (Ylang Ylang) Flower Oil'),
  ('capryliccapric-triglyceride-mct', 'Caprylic/Capric Triglyceride (MCT)'),
  ('cedrus-atlantica-cedarwood-wood-oil', 'Cedrus Atlantica (Cedarwood) Wood Oil'),
  ('cera-alba-beeswax', 'Cera Alba (Beeswax)'),
  ('cinnamomum-camphora-ho-wood-branchleaf-oil', 'Cinnamomum Camphora (Ho Wood) Branch/Leaf Oil'),
  ('cistus-ladaniferus-labdanum-extract', 'Cistus Ladaniferus (Labdanum) Extract'),
  ('citral', 'Citral'),
  ('citronellol', 'Citronellol'),
  ('citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil', 'Citrus Aurantium Bergamia (Bergamot, Bergaptene Free) Peel Oil'),
  ('copaifera-species-copal-resin-oil', 'Copaifera Species (Copal) Resin Oil'),
  ('coumarin', 'Coumarin'),
  ('cymbopogon-flexuosus-lemongrass-oil', 'Cymbopogon Flexuosus (Lemongrass) Oil'),
  ('cymbopogon-winterianus-citronella-leaf-oil', 'Cymbopogon Winterianus (Citronella) Leaf Oil'),
  ('dipteryx-odorata-tonka-bean-seed-extract', 'Dipteryx Odorata (Tonka Bean) Seed Extract'),
  ('elettaria-cardamomum-cardamom-seed-oil', 'Elettaria Cardamomum (Cardamom) Seed Oil'),
  ('essential-oil-botanical-extract-for-fragrance-cistus-ladaniferus-cistus-oil', 'Essential Oil & Botanical Extract for Fragrance: Cistus Ladaniferus (Cistus) Oil'),
  ('eugenia-caryophillus-clove-flower-oil', 'Eugenia Caryophillus (Clove) Flower Oil'),
  ('eugenol', 'Eugenol'),
  ('euphorbia-cerifera-candelilla-wax', 'Euphorbia Cerifera (Candelilla) Wax'),
  ('geraniol', 'Geraniol'),
  ('harsh-surfactants', 'Harsh Surfactants'),
  ('jasminum-grandiflorum-jasmine-flower-extract', 'Jasminum Grandiflorum (Jasmine) Flower Extract'),
  ('lavandula-officinalis-lavender-flower-oil', 'Lavandula Officinalis (Lavender) Flower Oil'),
  ('limonene', 'Limonene'),
  ('linalool', 'Linalool'),
  ('magnesium-hydroxide', 'Magnesium Hydroxide'),
  ('mentha-piperita-peppermint-oil', 'Mentha Piperita (Peppermint) Oil'),
  ('mentha-spicata-spearmint-oil', 'Mentha Spicata (Spearmint) Oil'),
  ('naturally-occurring-in-essential-oils-and-botanical-extracts-limonene', 'Naturally Occurring in Essential Oils and Botanical Extracts: Limonene'),
  ('non-gmo-zea-mays-corn-starch', 'Non-GMO Zea Mays (Corn) Starch'),
  ('ocimum-sanctum-holy-basil-oil', 'Ocimum Sanctum (Holy Basil) Oil'),
  ('organic-cocos-nucifera-coconut-oil', 'Organic Cocos Nucifera (Coconut) Oil'),
  ('organic-fair-trade-certified-butyrospermum-parkii-shea-butter', 'Organic Fair Trade Certified Butyrospermum Parkii (Shea) Butter'),
  ('organic-helianthus-annuus-sunflower-seed-oil', 'Organic Helianthus Annuus (Sunflower) Seed Oil'),
  ('organic-olea-europaea-olive-oil', 'Organic Olea Europaea (Olive) Oil'),
  ('organic-rspo-certified-elaeis-guineensis-palm-oil', 'Organic RSPO Certified Elaeis Guineensis (Palm) Oil'),
  ('origanum-majorana-marjoram-flower-oil', 'Origanum Majorana (Marjoram) Flower Oil'),
  ('pelargonium-graveolens-geranium-oil', 'Pelargonium Graveolens (Geranium) Oil'),
  ('phthalates', 'Phthalates'),
  ('picea-mariana-black-spruce-oil', 'Picea Mariana (Black Spruce) Oil'),
  ('piper-nigrum-black-pepper-fruit-oil', 'Piper Nigrum (Black Pepper) Fruit Oil'),
  ('pogostemon-cablin-patchouli-leaf-oil', 'Pogostemon Cablin (Patchouli) Leaf Oil'),
  ('rosa-damascena-rose-extract', 'Rosa Damascena (Rose) Extract'),
  ('rosmarinus-officinalis-rosemary-leaf-extract', 'Rosmarinus Officinalis (Rosemary) Leaf Extract'),
  ('rosmarinus-officinalis-rosemary-leaf-oil', 'Rosmarinus Officinalis (Rosemary) Leaf Oil'),
  ('salvia-officinalis-sage-oil', 'Salvia Officinalis (Sage) Oil'),
  ('santalum-austrocaledonicum-sandalwood-wood-oil', 'Santalum Austrocaledonicum (Sandalwood) Wood Oil'),
  ('sodium-bicarbonate-baking-soda', 'Sodium Bicarbonate (Baking Soda)'),
  ('sodium-hydroxide', 'Sodium Hydroxide'),
  ('synthetic-fragrance', 'Synthetic Fragrance'),
  ('vetiveria-zizanoides-vetiver-root-oil', 'Vetiveria Zizanoides (Vetiver) Root Oil'),
  ('zea-mays-corn-starch', 'Zea Mays (Corn) Starch'),
  ('zingiber-officinale-ginger-root-oil', 'Zingiber Officinale (Ginger) Root Oil')
on conflict (slug) do update set name = excluded.name;

insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'bursera-graveolens-palo-santo-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'bursera-graveolens-palo-santo-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'pelargonium-graveolens-geranium-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'rosa-damascena-rose-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'cistus-ladaniferus-labdanum-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'picea-mariana-black-spruce-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'jasminum-grandiflorum-jasmine-flower-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'benzyl-benzoate'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'origanum-majorana-marjoram-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'mentha-piperita-peppermint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'mentha-spicata-spearmint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'cinnamomum-camphora-ho-wood-branchleaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'pelargonium-graveolens-geranium-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'rosa-damascena-rose-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'essential-oil-botanical-extract-for-fragrance-cistus-ladaniferus-cistus-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'cedrus-atlantica-cedarwood-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'elettaria-cardamomum-cardamom-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'vetiveria-zizanoides-vetiver-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'cananga-odorata-ylang-ylang-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'santalum-austrocaledonicum-sandalwood-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'piper-nigrum-black-pepper-fruit-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'eugenia-caryophillus-clove-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'naturally-occurring-in-essential-oils-and-botanical-extracts-limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'benzyl-benzoate-non-gmo'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'cymbopogon-flexuosus-lemongrass-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'salvia-officinalis-sage-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'cymbopogon-winterianus-citronella-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'bursera-graveolens-palo-santo-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'ocimum-sanctum-holy-basil-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-helianthus-annuus-sunflower-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-cocos-nucifera-coconut-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'aqua'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'sodium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-rspo-certified-elaeis-guineensis-palm-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-fair-trade-certified-butyrospermum-parkii-shea-butter'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-olea-europaea-olive-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'harsh-surfactants'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'synthetic-fragrance'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-helianthus-annuus-sunflower-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-cocos-nucifera-coconut-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'aqua'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'sodium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-rspo-certified-elaeis-guineensis-palm-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-fair-trade-certified-butyrospermum-parkii-shea-butter'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-olea-europaea-olive-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'harsh-surfactants'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'synthetic-fragrance'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-helianthus-annuus-sunflower-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-cocos-nucifera-coconut-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'aqua'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'sodium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-rspo-certified-elaeis-guineensis-palm-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-fair-trade-certified-butyrospermum-parkii-shea-butter'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-olea-europaea-olive-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'salvia-officinalis-sage-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'cymbopogon-flexuosus-lemongrass-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'harsh-surfactants'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'synthetic-fragrance'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'cymbopogon-flexuosus-lemongrass-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'salvia-officinalis-sage-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'cymbopogon-winterianus-citronella-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'cistus-ladaniferus-labdanum-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'picea-mariana-black-spruce-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'jasminum-grandiflorum-jasmine-flower-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'benzyl-benzoate'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'origanum-majorana-marjoram-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'mentha-piperita-peppermint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'mentha-spicata-spearmint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'cinnamomum-camphora-ho-wood-branchleaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'pelargonium-graveolens-geranium-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'rosa-damascena-rose-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'origanum-majorana-marjoram-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'mentha-piperita-peppermint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'mentha-spicata-spearmint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'cinnamomum-camphora-ho-wood-branchleaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'phthalates'
on conflict do nothing;

