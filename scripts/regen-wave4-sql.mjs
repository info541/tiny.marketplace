import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave4.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const products = JSON.parse(fs.readFileSync(path.join(root, "data/catalog-products-raw.json"), "utf8"));
const brands = seedBrands.map((b, i) => ({ ...b, id: `c${460 + i}` }));
const wave = products.filter((p) => {
  const n = Number(String(p.brandId).replace(/^c/, ""));
  return n >= 460 && n <= 480;
});

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sqlString(s) {
  return `$${""}$${String(s ?? "").replace(/\$\$/g, "")}$${""}$`;
}

const lines = [
  `-- Wave 4 small clean brands + full product catalogs (images, ingredients, flavor/scent variants)`,
  `-- Run on the tiny marketplace Supabase project, not unrelated databases.`,
  `-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new`,
  ``,
  `alter type public.product_category add value if not exists 'electrolytes';`,
  `alter type public.product_category add value if not exists 'supplements';`,
  ``,
  `insert into public.categories (id, slug, name) values`,
  `  ('c1000000-0000-0000-0000-000000000007', 'electrolytes', 'Electrolytes'),`,
  `  ('c1000000-0000-0000-0000-000000000008', 'supplements', 'Supplements')`,
  `on conflict (slug) do nothing;`,
  ``,
];

for (const b of brands) {
  lines.push(`insert into public.brands (slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values (`);
  lines.push(`  ${sqlString(b.slug)}, ${sqlString(b.name)}, ${sqlString(b.tagline)},`);
  lines.push(`  ${sqlString(b.story)}, ${sqlString(b.location)}, ${b.founded}, ${sqlString(b.accent)},`);
  lines.push(`  ${b.rating}, ${b.reviewCount}, ${b.followerCount}, ${sqlString(b.websiteUrl)}`);
  lines.push(`)`);
  lines.push(`on conflict (slug) do update set`);
  lines.push(`  name = excluded.name, tagline = excluded.tagline, story = excluded.story,`);
  lines.push(`  location = excluded.location, founded = excluded.founded, accent = excluded.accent,`);
  lines.push(`  rating = excluded.rating, review_count = excluded.review_count, website_url = excluded.website_url;`);
  lines.push(``);
  const cats = b.categories.map((c) => `'${c}'`).join(", ");
  lines.push(`insert into public.brand_categories (brand_id, category_id)`);
  lines.push(`select br.id, c.id from public.brands br`);
  lines.push(`join public.categories c on c.slug in (${cats})`);
  lines.push(`where br.slug = ${sqlString(b.slug)}`);
  lines.push(`on conflict do nothing;`);
  lines.push(``);
}

for (const p of wave) {
  const brand = brands.find((b) => b.id === p.brandId);
  if (!brand || !p.imageUrl || !p.affiliateUrl) continue;
  lines.push(`insert into public.products (`);
  lines.push(`  slug, brand_id, name, category, category_id, price, description, accent,`);
  lines.push(`  affiliate_url, affiliate_network, image_url, rating, review_count, is_published, placed_by`);
  lines.push(`) values (`);
  lines.push(`  ${sqlString(p.slug)},`);
  lines.push(`  (select id from public.brands where slug = ${sqlString(brand.slug)}),`);
  lines.push(`  ${sqlString(p.name)},`);
  lines.push(`  ${sqlString(p.category)}::public.product_category,`);
  lines.push(`  (select id from public.categories where slug = ${sqlString(p.category)}),`);
  lines.push(`  ${p.price},`);
  lines.push(`  ${sqlString(p.description)},`);
  lines.push(`  ${sqlString(p.accent)},`);
  lines.push(`  ${sqlString(p.affiliateUrl)},`);
  lines.push(`  'direct',`);
  lines.push(`  ${sqlString(p.imageUrl)},`);
  lines.push(`  ${p.rating},`);
  lines.push(`  ${p.reviewCount},`);
  lines.push(`  true,`);
  lines.push(`  'catalog'`);
  lines.push(`)`);
  lines.push(`on conflict (slug) do update set`);
  lines.push(`  name = excluded.name, price = excluded.price, description = excluded.description,`);
  lines.push(`  image_url = excluded.image_url, affiliate_url = excluded.affiliate_url,`);
  lines.push(`  category = excluded.category, is_published = true;`);
  lines.push(``);
  for (const ing of (p.ingredients || []).slice(0, 40)) {
    const ingSlug = slugify(ing) || "ingredient";
    lines.push(`insert into public.ingredients (slug, name) values (${sqlString(ingSlug)}, ${sqlString(ing)}) on conflict (name) do nothing;`);
    lines.push(`insert into public.product_ingredients (product_id, ingredient_id, kind)`);
    lines.push(`select pr.id, i.id, 'contains' from public.products pr, public.ingredients i`);
    lines.push(`where pr.slug = ${sqlString(p.slug)} and i.name = ${sqlString(ing)} on conflict do nothing;`);
  }
  for (const ing of p.freeFrom || []) {
    const ingSlug = slugify(ing) || "free-from";
    lines.push(`insert into public.ingredients (slug, name) values (${sqlString(ingSlug)}, ${sqlString(ing)}) on conflict (name) do nothing;`);
    lines.push(`insert into public.product_ingredients (product_id, ingredient_id, kind)`);
    lines.push(`select pr.id, i.id, 'free_from' from public.products pr, public.ingredients i`);
    lines.push(`where pr.slug = ${sqlString(p.slug)} and i.name = ${sqlString(ing)} on conflict do nothing;`);
  }
  lines.push(``);
}

const sqlPath = path.join(root, "supabase/migrations/20260824020000_wave4_small_brands.sql");
fs.writeFileSync(sqlPath, lines.join("\n"));
console.log("Wrote", sqlPath, "products", wave.length, "with ingredients", wave.filter((p) => p.ingredients?.length).length);
