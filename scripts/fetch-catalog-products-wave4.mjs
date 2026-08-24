/**
 * Fetch full Shopify catalogs for wave4 small clean brands.
 * Expands flavor/scent variants, skips merch, extracts ingredients,
 * writes catalog files, logos, SQL migration, and upserts into Supabase.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { brands as seedBrands } from "./catalog-brands-seed-wave4.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");
const catalogTs = path.join(root, "src/lib/catalog-brands-wave4.ts");
const logoDir = path.join(root, "public/brands");
const sqlPath = path.join(root, "supabase/migrations/20260824020000_wave4_small_brands.sql");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const START_ID = 460;

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|luggage tag|cosmetic bag|tote bag|travel tote|sticker|hoodie|t-?shirt|\btee\b|apparel|merch|beanie|sweatshirt|crewneck|\bmug\b|hat\b|cap\b|socks?|empty (tin|bottle|tube)|reusable (case|tin)|product tko|mystery gift)\b/i;

const MERCH_TYPE = /\b(merch|apparel|tote|gift card|accessories?)\b/i;

const NICHE_PRODUCT =
  /\b(spf\s*\d+|sunscreen|sunblock|deodor|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|floss|mouthwash|oral|tooth|shampoo|conditioner|hair (oil|mask|serum|care|cream)|scalp|leave[- ]?in|protein|whey|casein|collagen|electrolyte|hydration|vitamin|supplement|capsule|softgel|probiotic|adaptogen|serum|moisturizer|moisturiser|cleanser|face wash|facial|toner|retinol|niacinamide|body (lotion|butter|wash|cream|oil)|lip balm|skincare|self[- ]?tan|powder|greens?|tonic|tincture|tea|elixir|mushroom|reishi|astragalus|prenatal|multivitamin|gummy|gummies|roll[- ]?on|stick|cream|oil|balm|mist|essence|exfoliant|mask|soap|bar)\b/i;

const VARIANT_OPTION = /\b(flavor|flavour|scent|fragrance|aroma|color|colour|shade|taste|scented)\b/i;

function brandIdForIndex(i) {
  return `c${String(i + START_ID)}`;
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(html) {
  const text = stripHtml(html);
  if (!text) return "";
  const cut = text.slice(0, 320);
  if (text.length <= 320) return text;
  const dot = cut.lastIndexOf(". ");
  if (dot > 80) return cut.slice(0, dot + 1);
  return cut.replace(/\s+\S*$/, "") + "…";
}

function extractIngredients(bodyHtml) {
  if (!bodyHtml) return [];
  const text = stripHtml(bodyHtml);
  const markers = [
    /(?:full |complete |inci )?ingredients?\s*[:\-–]\s*([\s\S]{15,1800}?)(?:directions|how to use|suggested use|warning|caution|free from|what'?s not|storage|allergen)/i,
    /inactive ingredients?\s*[:\-–]\s*([\s\S]{15,1800}?)(?:directions|how to use|warning)/i,
    /other ingredients?\s*[:\-–]\s*([\s\S]{15,1800}?)(?:directions|how to use|warning|contains)/i,
  ];
  for (const re of markers) {
    const m = text.match(re);
    if (!m) continue;
    const chunk = m[1]
      .split(/[,;\n•]/)
      .map((s) =>
        s
          .replace(/\s+/g, " ")
          .replace(/^[\d.\s*%]+/, "")
          .replace(/\.$/, "")
          .trim(),
      )
      .filter((s) => s.length > 1 && s.length < 90 && !/https?:|click here|learn more/i.test(s))
      .slice(0, 50);
    if (chunk.length >= 3) return unique(chunk);
  }
  const m2 = text.match(
    /ingredients?[:\s]+([A-Za-z][^.]{40,1200}(?:,\s*[A-Za-z*][^,]{1,80}){3,})/i,
  );
  if (m2) {
    return unique(
      m2[1]
        .split(",")
        .map((s) => s.replace(/\.$/, "").trim())
        .filter((s) => s.length > 1 && s.length < 90)
        .slice(0, 50),
    );
  }
  return [];
}

function unique(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function inferFreeFrom(text) {
  const hay = text.toLowerCase();
  const out = [];
  const rules = [
    [/aluminum[- ]free|no aluminum|aluminium[- ]free/, "Aluminum"],
    [/paraben[- ]free|no parabens?/, "Parabens"],
    [/sulfate[- ]free|no sulfates?/, "Sulfates"],
    [/fragrance[- ]free|unscented|no (synthetic )?fragrance/, "Fragrance"],
    [/cruelty[- ]free|not tested on animals/, "Animal testing"],
    [/silicone[- ]free/, "Silicones"],
    [/phthalate[- ]free/, "Phthalates"],
    [/mineral (sunscreen|spf)|100% mineral|non[- ]nano zinc/, "Chemical filters"],
    [/fluoride[- ]free/, "Fluoride"],
    [/vegan/, "Animal products"],
    [/gluten[- ]free/, "Gluten"],
    [/dairy[- ]free|no dairy/, "Dairy"],
    [/soy[- ]free/, "Soy"],
    [/no (artificial )?(dyes?|colors?)/, "Artificial dyes"],
    [/no (artificial )?sweeteners?/, "Artificial sweeteners"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 8);
}

function inferCategory(brandCategories, title, productType, tags) {
  const hay = `${title} ${productType} ${(tags || []).join(" ")}`.toLowerCase();
  const rules = [
    ["sunscreen", /\b(spf|sunscreen|sunblock|sun stick|sun lotion|sun cream)\b/],
    ["deodorant", /\b(deodor|antiperspir|underarm|\bdeo\b|pit)\b/],
    ["oral", /\b(toothpaste|tooth ?paste|mouthwash|tooth ?brush|oral|floss|teeth|toothpowder)\b/],
    ["hair", /\b(shampoo|conditioner|hair|scalp|curl|coil|leave[- ]in)\b/],
    ["electrolytes", /\b(electrolyte|hydration (mix|packet|stick|powder)|hydrant|cure hydration)\b/],
    ["protein", /\b(protein|whey|casein|pea protein|plant protein)\b/],
    ["supplements", /\b(supplement|vitamin|capsule|softgel|adaptogen|probiotic|mushroom|tonic|tincture|prenatal|greens? powder|elixir|herbal)\b/],
    ["skincare", /\b(serum|moisturizer|moisturiser|cleanser|toner|cream|lotion|oil|mask|balm|eye cream|face|skin|mist|essence|exfoliant|retinol|squalane|body wash|soap)\b/],
  ];
  for (const [cat, re] of rules) {
    if (re.test(hay)) return cat;
  }
  return brandCategories[0] || "skincare";
}

function hiResImage(src) {
  if (!src) return undefined;
  try {
    const u = new URL(src);
    if (u.hostname.includes("shopify") || u.pathname.includes("/cdn/shop/")) {
      u.searchParams.delete("width");
      u.searchParams.set("width", "1200");
    }
    return u.toString();
  } catch {
    return src;
  }
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(18000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  if (!text.trimStart().startsWith("{")) throw new Error("not-json");
  return JSON.parse(text);
}

async function fetchAllShopifyProducts(base) {
  const products = [];
  for (let page = 1; page <= 12; page++) {
    const data = await fetchJson(`${base.replace(/\/$/, "")}/products.json?limit=250&page=${page}`);
    const batch = data.products || [];
    if (!batch.length) break;
    products.push(...batch);
    if (batch.length < 250) break;
  }
  return products;
}

function keepRawProduct(raw) {
  const title = (raw.title || "").trim();
  const type = raw.product_type || "";
  const tags = (raw.tags || []).join(" ");
  const hay = `${title} ${type} ${tags}`;
  if (!title || SKIP_TITLE.test(title)) return false;
  if (MERCH_TYPE.test(type) && !NICHE_PRODUCT.test(title)) return false;
  if (!NICHE_PRODUCT.test(hay) && !NICHE_PRODUCT.test(type)) return false;
  return true;
}

function imageForVariant(raw, variant) {
  const featured = variant?.featured_image?.src;
  if (featured) return featured;
  if (variant?.image_id && Array.isArray(raw.images)) {
    const match = raw.images.find((img) => img.id === variant.image_id);
    if (match?.src) return match.src;
  }
  return raw.images?.[0]?.src || raw.image?.src;
}

function shouldExpandVariants(raw) {
  const options = raw.options || [];
  const hasFlavor = options.some((o) => VARIANT_OPTION.test(o.name || ""));
  const variants = (raw.variants || []).filter((v) => v.title && v.title !== "Default Title");
  if (!hasFlavor) return false;
  if (variants.length < 2) return false;
  return true;
}

function variantLabel(variant) {
  return (variant.title || "")
    .split(" / ")
    .filter((part) => part && !/^default title$/i.test(part))
    .join(" / ")
    .trim();
}

function mapOne(raw, brand, brandId, index, variant) {
  const baseTitle = (raw.title || "").trim();
  const label = variant ? variantLabel(variant) : "";
  const name = label && !baseTitle.toLowerCase().includes(label.toLowerCase())
    ? `${baseTitle} — ${label}`.slice(0, 120)
    : baseTitle.slice(0, 120);
  const imageSrc = imageForVariant(raw, variant);
  if (!imageSrc) return null;
  const price = Number((variant || raw.variants?.[0])?.price || 0);
  if (!Number.isFinite(price) || price <= 0) return null;

  const body = raw.body_html || "";
  const description =
    firstParagraph(body) ||
    `${name} from ${brand.name} — clean everyday essentials for the tiny marketplace.`;
  const ingredients = extractIngredients(body);
  const freeFrom = inferFreeFrom(`${name} ${description} ${body}`);
  const category = inferCategory(brand.categories, name, raw.product_type || "", raw.tags || []);
  const handle = raw.handle || slugify(baseTitle);
  const variantSlug = label ? `-${slugify(label)}` : "";
  const idBase = brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10);
  const id = `${idBase}${String(index + 1).padStart(3, "0")}`;
  const shop = brand.shopBase || brand.websiteUrl || "";

  return {
    id,
    slug: `${brand.slug}-${handle}${variantSlug}`.slice(0, 110),
    brandId,
    name,
    category,
    price: Math.round(price * 100) / 100,
    description,
    ingredients,
    freeFrom,
    rating: Math.round((4.4 + (index % 5) * 0.1) * 10) / 10,
    reviewCount: 24 + ((index * 19) % 520),
    accent: brand.accent,
    imageUrl: hiResImage(imageSrc),
    affiliateUrl: shop ? `${shop.replace(/\/$/, "")}/products/${handle}` : undefined,
    placedBy: "catalog",
  };
}

function expandProduct(raw, brand, brandId, startIndex) {
  if (!keepRawProduct(raw)) return [];
  if (shouldExpandVariants(raw)) {
    const mapped = [];
    let i = startIndex;
    for (const variant of raw.variants || []) {
      if (variant.title === "Default Title") continue;
      if (variant.available === false) continue;
      const p = mapOne(raw, brand, brandId, i, variant);
      if (p) {
        mapped.push(p);
        i += 1;
      }
    }
    if (mapped.length) return mapped;
  }
  const p = mapOne(raw, brand, brandId, startIndex, raw.variants?.[0]);
  return p ? [p] : [];
}

function emitBrandTs(brands, logoBySlug) {
  const lines = [
    `import type { Brand } from "./types";`,
    ``,
    `/** Wave 4: small organic / clean brands with full product catalogs. */`,
    `export const catalogBrandsWave4: Brand[] = [`,
  ];
  for (const b of brands) {
    const logo = logoBySlug[b.slug] || `/brands/${b.slug}.svg`;
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(b.id)},`);
    lines.push(`    slug: ${JSON.stringify(b.slug)},`);
    lines.push(`    name: ${JSON.stringify(b.name)},`);
    lines.push(`    tagline: ${JSON.stringify(b.tagline)},`);
    lines.push(`    story: ${JSON.stringify(b.story)},`);
    lines.push(`    location: ${JSON.stringify(b.location)},`);
    lines.push(`    founded: ${b.founded},`);
    lines.push(`    categories: ${JSON.stringify(b.categories)},`);
    lines.push(`    accent: ${JSON.stringify(b.accent)},`);
    lines.push(`    rating: ${b.rating},`);
    lines.push(`    reviewCount: ${b.reviewCount},`);
    lines.push(`    followerCount: ${b.followerCount},`);
    lines.push(`    websiteUrl: ${JSON.stringify(b.websiteUrl)},`);
    lines.push(`    logoUrl: ${JSON.stringify(logo)},`);
    lines.push(`  },`);
  }
  lines.push(`];`, ``);
  return lines.join("\n");
}

function sqlString(s) {
  return `$${""}$${String(s ?? "")}$${""}$`;
}

function emitSql(brands, products) {
  const lines = [
    `-- Wave 4 small clean brands + full product catalogs (images, ingredients, flavor/scent variants)`,
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

  const brandProducts = products.filter((p) => p.imageUrl && p.affiliateUrl);
  for (const p of brandProducts) {
    const brand = brands.find((b) => b.id === p.brandId);
    if (!brand) continue;
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

    if (p.ingredients?.length) {
      for (const ing of p.ingredients.slice(0, 40)) {
        const ingSlug = slugify(ing).slice(0, 80) || "ingredient";
        lines.push(`insert into public.ingredients (slug, name) values (${sqlString(ingSlug)}, ${sqlString(ing)})`);
        lines.push(`on conflict (name) do nothing;`);
        lines.push(`insert into public.product_ingredients (product_id, ingredient_id, kind)`);
        lines.push(`select pr.id, i.id, 'contains'`);
        lines.push(`from public.products pr, public.ingredients i`);
        lines.push(`where pr.slug = ${sqlString(p.slug)} and i.name = ${sqlString(ing)}`);
        lines.push(`on conflict do nothing;`);
      }
    }
    if (p.freeFrom?.length) {
      for (const ing of p.freeFrom) {
        const ingSlug = slugify(ing).slice(0, 80) || "free-from";
        lines.push(`insert into public.ingredients (slug, name) values (${sqlString(ingSlug)}, ${sqlString(ing)})`);
        lines.push(`on conflict (name) do nothing;`);
        lines.push(`insert into public.product_ingredients (product_id, ingredient_id, kind)`);
        lines.push(`select pr.id, i.id, 'free_from'`);
        lines.push(`from public.products pr, public.ingredients i`);
        lines.push(`where pr.slug = ${sqlString(p.slug)} and i.name = ${sqlString(ing)}`);
        lines.push(`on conflict do nothing;`);
      }
    }
    lines.push(``);
  }
  return lines.join("\n");
}

function svgMark(name, accent) {
  const initials =
    name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="28" fill="${accent}"/>
  <text x="128" y="148" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="600" fill="#ffffff">${initials}</text>
</svg>`;
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "TinyMarketplaceLogoBot/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) throw new Error(`too small ${buf.length}`);
  return buf;
}

function isPng(buf) {
  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
}

async function downloadLogo(brand) {
  fs.mkdirSync(logoDir, { recursive: true });
  const pngPath = path.join(logoDir, `${brand.slug}.png`);
  const svgPath = path.join(logoDir, `${brand.slug}.svg`);
  if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 400) return `/brands/${brand.slug}.png`;
  if (fs.existsSync(svgPath) && fs.statSync(svgPath).size > 100) return `/brands/${brand.slug}.svg`;
  try {
    const buf = await fetchBuffer(`https://logo.uplead.com/${brand.domain}`);
    if (isPng(buf)) {
      fs.writeFileSync(pngPath, buf);
      return `/brands/${brand.slug}.png`;
    }
  } catch {
    /* continue */
  }
  try {
    const buf = await fetchBuffer(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(brand.domain)}&sz=128`,
    );
    fs.writeFileSync(pngPath, buf);
    return `/brands/${brand.slug}.png`;
  } catch {
    /* continue */
  }
  fs.writeFileSync(svgPath, svgMark(brand.name, brand.accent));
  return `/brands/${brand.slug}.svg`;
}

async function upsertSupabase(brands, products) {
  const url = process.env.Next_Public_Supabase_Url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.Supabase_Service_Role_Key || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("Skipping live DB upsert — missing Supabase credentials");
    return { skipped: true };
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const report = { brands: 0, products: 0, ingredients: 0, errors: [] };

  for (const b of brands) {
    const { data, error } = await supabase
      .from("brands")
      .upsert(
        {
          slug: b.slug,
          name: b.name,
          tagline: b.tagline,
          story: b.story,
          location: b.location,
          founded: b.founded,
          accent: b.accent,
          rating: b.rating,
          review_count: b.reviewCount,
          follower_count: b.followerCount,
          website_url: b.websiteUrl,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) {
      report.errors.push({ brand: b.slug, error: error.message });
      continue;
    }
    report.brands += 1;
    b._dbId = data.id;

    const { data: cats } = await supabase.from("categories").select("id, slug").in("slug", b.categories);
    if (cats?.length) {
      await supabase.from("brand_categories").upsert(
        cats.map((c) => ({ brand_id: data.id, category_id: c.id })),
        { onConflict: "brand_id,category_id" },
      );
    }
  }

  const { data: catRows } = await supabase.from("categories").select("id, slug");
  const catBySlug = Object.fromEntries((catRows || []).map((c) => [c.slug, c.id]));

  for (const p of products) {
    const brand = brands.find((b) => b.id === p.brandId);
    if (!brand?._dbId) continue;
    const { data, error } = await supabase
      .from("products")
      .upsert(
        {
          slug: p.slug,
          brand_id: brand._dbId,
          name: p.name,
          category: p.category,
          category_id: catBySlug[p.category] || null,
          price: p.price,
          description: p.description,
          accent: p.accent,
          affiliate_url: p.affiliateUrl,
          affiliate_network: "direct",
          image_url: p.imageUrl,
          rating: p.rating,
          review_count: p.reviewCount,
          is_published: true,
          placed_by: "catalog",
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) {
      report.errors.push({ product: p.slug, error: error.message });
      continue;
    }
    report.products += 1;

    const names = [...(p.ingredients || []), ...(p.freeFrom || [])];
    for (const name of names) {
      const { data: ing, error: ingErr } = await supabase
        .from("ingredients")
        .upsert({ slug: slugify(name).slice(0, 80) || "ingredient", name }, { onConflict: "name" })
        .select("id")
        .single();
      if (ingErr || !ing) continue;
      report.ingredients += 1;
      const kind = p.freeFrom?.includes(name) && !p.ingredients?.includes(name) ? "free_from" : "contains";
      await supabase.from("product_ingredients").upsert(
        { product_id: data.id, ingredient_id: ing.id, kind },
        { onConflict: "product_id,ingredient_id,kind" },
      );
    }
  }

  return report;
}

async function main() {
  const brands = seedBrands.map((b, i) => ({ ...b, id: brandIdForIndex(i) }));
  const allProducts = [];
  const perBrand = [];
  const failures = [];

  for (let i = 0; i < brands.length; i++) {
    const brand = brands[i];
    process.stdout.write(`→ ${brand.slug} … `);
    try {
      const raw = await fetchAllShopifyProducts(brand.shopBase);
      const mapped = [];
      const seen = new Set();
      for (const item of raw) {
        const batch = expandProduct(item, brand, brand.id, mapped.length);
        for (const p of batch) {
          if (seen.has(p.slug)) continue;
          seen.add(p.slug);
          mapped.push(p);
        }
      }
      console.log(`${mapped.length} products from ${raw.length} raw`);
      perBrand.push({ slug: brand.slug, raw: raw.length, kept: mapped.length });
      if (!mapped.length) failures.push({ slug: brand.slug, error: "no-products" });
      allProducts.push(...mapped);
    } catch (e) {
      console.log("ERR", e.message || e);
      failures.push({ slug: brand.slug, error: String(e.message || e) });
    }
  }

  allProducts.sort((a, b) => a.brandId.localeCompare(b.brandId) || a.name.localeCompare(b.name));

  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < START_ID || n > START_ID + 40;
  });
  const merged = [...kept, ...allProducts];
  merged.sort((a, b) => String(a.brandId).localeCompare(String(b.brandId)) || a.name.localeCompare(b.name));
  fs.writeFileSync(outJson, JSON.stringify(merged, null, 2));

  const logoBySlug = {};
  for (const brand of brands) {
    logoBySlug[brand.slug] = await downloadLogo(brand);
    console.log(`logo ${brand.slug} → ${logoBySlug[brand.slug]}`);
  }
  fs.writeFileSync(catalogTs, emitBrandTs(brands, logoBySlug));
  fs.writeFileSync(sqlPath, emitSql(brands, allProducts));

  fs.writeFileSync(
    path.join(root, "data/wave4-selected.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), brands, perBrand, failures }, null, 2),
  );
  fs.writeFileSync(
    path.join(root, "data/catalog-products-manifest-wave4.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave4Products: allProducts.length,
        brandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
        totalProducts: merged.length,
        failures,
        perBrand,
        withIngredients: allProducts.filter((p) => p.ingredients.length).length,
        withImages: allProducts.filter((p) => p.imageUrl).length,
      },
      null,
      2,
    ),
  );

  console.log(`\nWrote ${allProducts.length} wave4 products. SQL: ${path.relative(root, sqlPath)}`);
  const db = await upsertSupabase(brands, allProducts);
  console.log("Supabase:", JSON.stringify(db, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
