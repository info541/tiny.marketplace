-- the tiny marketplace · initial schema
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

create extension if not exists "pgcrypto";

create type public.product_category as enum (
  'sunscreen',
  'deodorant',
  'protein',
  'skincare',
  'hair',
  'oral'
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  story text not null default '',
  location text not null default '',
  founded int,
  accent text not null default '#1f8a7a',
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  follower_count int not null default 0,
  website_url text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand_id uuid not null references public.brands (id) on delete cascade,
  name text not null,
  category public.product_category not null,
  price numeric(10,2) not null,
  description text not null default '',
  accent text not null default '#1f8a7a',
  badge text,
  affiliate_url text not null,
  affiliate_network text not null default 'direct',
  image_url text,
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.product_ingredients (
  product_id uuid not null references public.products (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete cascade,
  kind text not null check (kind in ('contains', 'free_from')),
  primary key (product_id, ingredient_id, kind)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  brand_id uuid references public.brands (id) on delete cascade,
  author text not null,
  rating int not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  helpful int not null default 0,
  created_at timestamptz not null default now(),
  check (product_id is not null or brand_id is not null)
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  topic text not null,
  title text not null,
  body text not null,
  replies int not null default 0,
  likes int not null default 0,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  referrer text,
  created_at timestamptz not null default now()
);

create index products_brand_id_idx on public.products (brand_id);
create index products_category_idx on public.products (category);
create index product_ingredients_ingredient_id_idx on public.product_ingredients (ingredient_id);
create index reviews_product_id_idx on public.reviews (product_id);
create index reviews_brand_id_idx on public.reviews (brand_id);

alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.ingredients enable row level security;
alter table public.product_ingredients enable row level security;
alter table public.reviews enable row level security;
alter table public.community_posts enable row level security;
alter table public.affiliate_clicks enable row level security;

create policy "Public read brands" on public.brands for select using (true);
create policy "Public read published products" on public.products for select using (is_published = true);
create policy "Public read ingredients" on public.ingredients for select using (true);
create policy "Public read product ingredients" on public.product_ingredients for select using (true);
create policy "Public read reviews" on public.reviews for select using (true);
create policy "Public read community posts" on public.community_posts for select using (true);
create policy "Public insert affiliate clicks" on public.affiliate_clicks for insert with check (true);

-- Seed brands
insert into public.brands (id, slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values
  ('11111111-1111-1111-1111-111111111111', 'solara-lab', 'Solara Lab', 'SPF that feels like a second skin', 'Two surfers in San Diego got tired of sticky, chalky sunscreen. Solara Lab makes mineral formulas that disappear into skin and still hold up after a full day outside.', 'San Diego, CA', 2019, '#F4A261', 4.8, 312, 1840, 'https://example.com/solara'),
  ('22222222-2222-2222-2222-222222222222', 'pine-and-alum', 'Pine & Alum', 'Deodorant that actually lasts', 'Born in a Portland garage after one too many aluminum-free fails. Pine & Alum blends botanicals with smart mineral salts — no white cast, no mystery chemicals.', 'Portland, OR', 2021, '#2A9D8F', 4.6, 528, 3201, 'https://example.com/pine'),
  ('33333333-3333-3333-3333-333333333333', 'nourish-co', 'Nourish Co.', 'Clean protein, zero chalk', 'A small batch protein brand that sources pea and hemp from regenerative farms. Smooth shakes, transparent labels, flavors that taste like food — not candy.', 'Boulder, CO', 2020, '#E76F51', 4.7, 891, 5120, 'https://example.com/nourish'),
  ('44444444-4444-4444-4444-444444444444', 'dewdrop', 'Dewdrop', 'Skin that drinks water', 'Minimalist skincare from a Brooklyn chemist who believes fewer ingredients done right beat a 40-step routine. Hydration-first, fragrance-free options galore.', 'Brooklyn, NY', 2018, '#7EB8D4', 4.9, 1204, 8900, 'https://example.com/dewdrop'),
  ('55555555-5555-5555-5555-555555555555', 'root-ritual', 'Root Ritual', 'Hair care rooted in botanicals', 'Scalp-first hair care using cold-pressed oils and fermented botanicals. Made in small batches on a family farm outside Asheville.', 'Asheville, NC', 2022, '#9B7EBD', 4.5, 267, 1450, 'https://example.com/root'),
  ('66666666-6666-6666-6666-666666666666', 'mint-theory', 'Mint Theory', 'Toothpaste you can pronounce', 'Hydroxyapatite toothpaste without the plastic tube guilt. Refillable glass jars, gentle whitening, flavors that feel grown-up.', 'Austin, TX', 2023, '#45B69C', 4.4, 189, 980, 'https://example.com/mint');

-- Seed products (affiliate_url placeholders — swap for real affiliate links later)
insert into public.products (id, slug, brand_id, name, category, price, description, accent, badge, affiliate_url, affiliate_network, rating, review_count) values
  ('a1111111-1111-1111-1111-111111111111', 'daily-sheer-spf50', '11111111-1111-1111-1111-111111111111', 'Daily Sheer SPF 50', 'sunscreen', 32, 'A weightless mineral sunscreen with non-nano zinc oxide. No white cast, reef-conscious, and built for everyday wear under makeup or alone.', '#F4A261', 'Staff pick', 'https://example.com/solara/daily-sheer?ref=tiny', 'direct', 4.9, 214),
  ('a2222222-2222-2222-2222-222222222222', 'sport-stick-spf40', '11111111-1111-1111-1111-111111111111', 'Sport Stick SPF 40', 'sunscreen', 24, 'Pocket-sized mineral stick for reapplying on the go. Melts on contact — great for runners, kids, and anyone who hates liquid SPF mid-hike.', '#E9C46A', null, 'https://example.com/solara/sport-stick?ref=tiny', 'direct', 4.7, 98),
  ('a3333333-3333-3333-3333-333333333333', 'cedar-bergamot-deo', '22222222-2222-2222-2222-222222222222', 'Cedar + Bergamot Deo', 'deodorant', 18, 'Cream deodorant with magnesium and potassium alum. Fresh woody scent that stays put through workouts without clogging pores.', '#2A9D8F', 'Community fave', 'https://example.com/pine/cedar?ref=tiny', 'direct', 4.6, 341),
  ('a4444444-4444-4444-4444-444444444444', 'unscented-everyday', '22222222-2222-2222-2222-222222222222', 'Unscented Everyday', 'deodorant', 16, 'The same sweat-fighting formula, zero scent. Ideal for sensitive skin and anyone who wants their perfume to do the talking.', '#264653', null, 'https://example.com/pine/unscented?ref=tiny', 'direct', 4.5, 187),
  ('a5555555-5555-5555-5555-555555555555', 'vanilla-hemp-protein', '33333333-3333-3333-3333-333333333333', 'Vanilla Hemp Protein', 'protein', 42, '25g plant protein per scoop from hemp + pea. Naturally sweetened with monk fruit. Mixes smooth — no gritty aftertaste.', '#E76F51', 'Best seller', 'https://example.com/nourish/vanilla?ref=tiny', 'direct', 4.8, 456),
  ('a6666666-6666-6666-6666-666666666666', 'cacao-recovery', '33333333-3333-3333-3333-333333333333', 'Cacao Recovery Blend', 'protein', 46, 'Post-workout blend with protein, magnesium glycinate, and real cacao. Tastes like a mocha, recovers like a pro.', '#6D4C41', null, 'https://example.com/nourish/cacao?ref=tiny', 'direct', 4.7, 203),
  ('a7777777-7777-7777-7777-777777777777', 'cloud-serum', '44444444-4444-4444-4444-444444444444', 'Cloud Serum', 'skincare', 38, 'A featherweight hyaluronic + ceramides serum that plumps without stickiness. Five ingredients. That''s the whole story.', '#7EB8D4', 'Editor''s love', 'https://example.com/dewdrop/cloud?ref=tiny', 'direct', 4.9, 672),
  ('a8888888-8888-8888-8888-888888888888', 'barrier-balm', '44444444-4444-4444-4444-444444444444', 'Barrier Balm', 'skincare', 28, 'Nighttime balm for compromised barriers. Squalane, cholesterol, and fatty acids in a jar you will scrape clean.', '#A8DADC', null, 'https://example.com/dewdrop/barrier?ref=tiny', 'direct', 4.8, 389),
  ('a9999999-9999-9999-9999-999999999999', 'scalp-tonic', '55555555-5555-5555-5555-555555555555', 'Scalp Tonic', 'hair', 34, 'Leave-in tonic with rosemary, peppermint, and fermented rice water. Wakes up sleepy scalps without weighing hair down.', '#9B7EBD', null, 'https://example.com/root/tonic?ref=tiny', 'direct', 4.5, 142),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'hap-toothpaste', '66666666-6666-6666-6666-666666666666', 'nHA Toothpaste', 'oral', 22, 'Nano-hydroxyapatite toothpaste in a refillable jar. Remineralizes enamel gently — no harsh whitening burn.', '#45B69C', null, 'https://example.com/mint/nha?ref=tiny', 'direct', 4.4, 156);

-- Seed ingredients + links (contains)
with ing as (
  insert into public.ingredients (slug, name) values
    ('zinc-oxide', 'Zinc Oxide'),
    ('squalane', 'Squalane'),
    ('niacinamide', 'Niacinamide'),
    ('hyaluronic-acid', 'Hyaluronic Acid'),
    ('vitamin-e', 'Vitamin E'),
    ('coconut-alkanes', 'Coconut Alkanes'),
    ('beeswax', 'Beeswax'),
    ('jojoba-oil', 'Jojoba Oil'),
    ('shea-butter', 'Shea Butter'),
    ('tocopherol', 'Tocopherol'),
    ('magnesium-hydroxide', 'Magnesium Hydroxide'),
    ('potassium-alum', 'Potassium Alum'),
    ('arrowroot-powder', 'Arrowroot Powder'),
    ('coconut-oil', 'Coconut Oil'),
    ('bergamot-oil', 'Bergamot Oil'),
    ('cedarwood-oil', 'Cedarwood Oil'),
    ('hemp-protein', 'Hemp Protein'),
    ('pea-protein-isolate', 'Pea Protein Isolate'),
    ('monk-fruit-extract', 'Monk Fruit Extract'),
    ('vanilla-bean', 'Vanilla Bean'),
    ('sunflower-lecithin', 'Sunflower Lecithin'),
    ('sea-salt', 'Sea Salt'),
    ('cacao-powder', 'Cacao Powder'),
    ('magnesium-glycinate', 'Magnesium Glycinate'),
    ('cinnamon', 'Cinnamon'),
    ('ceramide-np', 'Ceramide NP'),
    ('glycerin', 'Glycerin'),
    ('panthenol', 'Panthenol'),
    ('aqua', 'Aqua'),
    ('cholesterol', 'Cholesterol'),
    ('ceramide-ap', 'Ceramide AP'),
    ('rosemary-extract', 'Rosemary Extract'),
    ('peppermint-oil', 'Peppermint Oil'),
    ('fermented-rice-water', 'Fermented Rice Water'),
    ('aloe-vera', 'Aloe Vera'),
    ('witch-hazel', 'Witch Hazel'),
    ('hydroxyapatite', 'Hydroxyapatite'),
    ('xylitol', 'Xylitol'),
    ('calcium-carbonate', 'Calcium Carbonate'),
    ('spearmint-oil', 'Spearmint Oil'),
    ('bentonite-clay', 'Bentonite Clay'),
    ('oxybenzone', 'Oxybenzone'),
    ('octinoxate', 'Octinoxate'),
    ('fragrance', 'Fragrance'),
    ('parabens', 'Parabens'),
    ('aluminum-chlorohydrate', 'Aluminum Chlorohydrate'),
    ('baking-soda', 'Baking Soda'),
    ('phthalates', 'Phthalates'),
    ('dairy', 'Dairy'),
    ('soy', 'Soy'),
    ('gluten', 'Gluten'),
    ('artificial-sweeteners', 'Artificial Sweeteners'),
    ('whey', 'Whey'),
    ('essential-oils', 'Essential Oils'),
    ('alcohol', 'Alcohol'),
    ('silicones', 'Silicones'),
    ('sulfates', 'Sulfates'),
    ('fluoride', 'Fluoride'),
    ('sls', 'SLS'),
    ('titanium-dioxide', 'Titanium Dioxide'),
    ('plastic-tube', 'Plastic Tube')
  on conflict (name) do update set slug = excluded.slug
  returning id, name
)
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, x.kind
from (values
  ('a1111111-1111-1111-1111-111111111111', 'Zinc Oxide', 'contains'),
  ('a1111111-1111-1111-1111-111111111111', 'Squalane', 'contains'),
  ('a1111111-1111-1111-1111-111111111111', 'Niacinamide', 'contains'),
  ('a1111111-1111-1111-1111-111111111111', 'Hyaluronic Acid', 'contains'),
  ('a1111111-1111-1111-1111-111111111111', 'Vitamin E', 'contains'),
  ('a1111111-1111-1111-1111-111111111111', 'Coconut Alkanes', 'contains'),
  ('a1111111-1111-1111-1111-111111111111', 'Oxybenzone', 'free_from'),
  ('a1111111-1111-1111-1111-111111111111', 'Octinoxate', 'free_from'),
  ('a1111111-1111-1111-1111-111111111111', 'Fragrance', 'free_from'),
  ('a1111111-1111-1111-1111-111111111111', 'Parabens', 'free_from'),
  ('a3333333-3333-3333-3333-333333333333', 'Magnesium Hydroxide', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Potassium Alum', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Arrowroot Powder', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Coconut Oil', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Bergamot Oil', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Cedarwood Oil', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Shea Butter', 'contains'),
  ('a3333333-3333-3333-3333-333333333333', 'Aluminum Chlorohydrate', 'free_from'),
  ('a3333333-3333-3333-3333-333333333333', 'Baking Soda', 'free_from'),
  ('a3333333-3333-3333-3333-333333333333', 'Phthalates', 'free_from'),
  ('a5555555-5555-5555-5555-555555555555', 'Hemp Protein', 'contains'),
  ('a5555555-5555-5555-5555-555555555555', 'Pea Protein Isolate', 'contains'),
  ('a5555555-5555-5555-5555-555555555555', 'Monk Fruit Extract', 'contains'),
  ('a5555555-5555-5555-5555-555555555555', 'Vanilla Bean', 'contains'),
  ('a5555555-5555-5555-5555-555555555555', 'Dairy', 'free_from'),
  ('a5555555-5555-5555-5555-555555555555', 'Soy', 'free_from'),
  ('a5555555-5555-5555-5555-555555555555', 'Gluten', 'free_from'),
  ('a5555555-5555-5555-5555-555555555555', 'Artificial Sweeteners', 'free_from'),
  ('a7777777-7777-7777-7777-777777777777', 'Hyaluronic Acid', 'contains'),
  ('a7777777-7777-7777-7777-777777777777', 'Ceramide NP', 'contains'),
  ('a7777777-7777-7777-7777-777777777777', 'Glycerin', 'contains'),
  ('a7777777-7777-7777-7777-777777777777', 'Panthenol', 'contains'),
  ('a7777777-7777-7777-7777-777777777777', 'Aqua', 'contains'),
  ('a7777777-7777-7777-7777-777777777777', 'Fragrance', 'free_from'),
  ('a7777777-7777-7777-7777-777777777777', 'Essential Oils', 'free_from'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hydroxyapatite', 'contains'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Xylitol', 'contains'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fluoride', 'free_from'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SLS', 'free_from')
) as x(product_id, ingredient_name, kind)
join public.products p on p.id = x.product_id::uuid
join ing i on i.name = x.ingredient_name;

insert into public.reviews (product_id, brand_id, author, rating, title, body, helpful, created_at) values
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Maya K.', 5, 'Finally, SPF that doesn''t pill', 'I wear this under foundation every day. Zero white cast on my medium-deep skin and it plays nice with my Dewdrop serum. Solara gets it.', 48, now() - interval '3 days'),
  ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Jordan T.', 5, 'Survived a Texas summer', 'I was skeptical of cream deodorants. This one made it through 90° days and a spin class. The cedar scent is subtle, not cologne-y.', 72, now() - interval '7 days'),
  ('a5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Sam R.', 4, 'Actually mixes without a blender', 'Shaken in a bottle with oat milk — smooth. Vanilla is real, not perfume. Wish the bag was a little bigger but quality over quantity.', 31, now() - interval '12 days'),
  ('a7777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Priya N.', 5, 'Five ingredients. Miraculous.', 'My reactive skin usually freaks out at new serums. Cloud Serum is the first thing that hydrated without a flare. Obsessed.', 95, now() - interval '2 days'),
  (null, '22222222-2222-2222-2222-222222222222', 'Chris L.', 4, 'Solid brand, great people', 'Reached out about a sensitive-skin swap and they sent samples of the unscented. Tiny brands that care like this are why I shop here.', 22, now() - interval '18 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'Alex M.', 5, 'Glass jar > plastic tube', 'Taste is clean spearmint. Teeth feel smoother after two weeks. Refill program is easy. Mint Theory is onto something.', 19, now() - interval '9 days');

insert into public.community_posts (author, topic, title, body, replies, likes, tags, created_at) values
  ('lena.shops.small', 'Finds', 'Anyone else replace their whole bathroom with tiny brands?', 'Started with Pine & Alum, now I''m fully Solara + Dewdrop + Mint Theory. Curious what your ''complete swap'' looks like.', 34, 128, array['routine','swap'], now() - interval '4 hours'),
  ('zinc.or.bust', 'Ingredients', 'Non-nano zinc: what % actually works for you?', 'Solara''s Daily Sheer is 20% and I don''t burn. Curious if anyone''s found a lower % that still holds for outdoor runs.', 21, 67, array['sunscreen','zinc oxide'], now() - interval '11 hours'),
  ('protein.nerd', 'Taste test', 'Nourish Co. cacao vs. the big brands', 'Blind tasted with roommates. Nourish won 3–1. The magnesium in the recovery blend is a quiet hero for my sleep.', 15, 89, array['protein','review'], now() - interval '26 hours'),
  ('sensitive.skin.club', 'Help', 'Fragrance-free deodorant that doesn''t itch?', 'Baking soda wrecks me. Trying Pine & Alum Unscented next — any other free-from lists I should filter for?', 42, 156, array['deodorant','sensitive'], now() - interval '8 hours'),
  ('apothecary.alex', 'Brands', 'Root Ritual scalp tonic — week 3 update', 'Less itch, more volume at the crown. Smells like a spa walk through a herb garden. Supporting Asheville feels good too.', 9, 44, array['hair','update'], now() - interval '40 hours');
