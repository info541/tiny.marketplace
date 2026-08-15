/**
 * Fetch Shopify product catalogs for batch-2 brands (ids c101+).
 * Merges into data/catalog-products-raw.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-batch2.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");
const outManifest = path.join(root, "data/catalog-products-manifest-batch2.json");
const selectedPath = path.join(root, "data/batch2-selected.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|store credit|membership|subscription box|not for sale|tester only|wholesale)\b/i;

const selected = JSON.parse(fs.readFileSync(selectedPath, "utf8"));
const shopBaseBySlug = Object.fromEntries(
  selected.map((b) => [b.slug, b.shopBase || b.websiteUrl]),
);

function brandIdForIndex(i) {
  return `c${String(i + 101).padStart(3, "0")}`;
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
  const m2 = text.match(
    /ingredients?[:\s]+([A-Za-z][^.]{40,700}(?:,\s*[A-Za-z][^,]{2,60}){4,})/i,
  );
  if (m2) {
    return m2[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 40);
  }
  return [];
}

function inferFreeFrom(text, productType) {
  const hay = `${text} ${productType}`.toLowerCase();
  const out = [];
  const rules = [
    [/aluminum[- ]free|no aluminum/, "Aluminum"],
    [/paraben[- ]free|no parabens?/, "Parabens"],
    [/sulfate[- ]free|no sulfates?/, "Sulfates"],
    [/fragrance[- ]free|unscented|no fragrance/, "Fragrance"],
    [/cruelty[- ]free|not tested on animals/, "Animal testing"],
    [/silicone[- ]free/, "Silicones"],
    [/phthalate[- ]free/, "Phthalates"],
    [/mineral (sunscreen|spf)|100% mineral|non[- ]nano zinc/, "Chemical filters"],
    [/fluoride[- ]free/, "Fluoride"],
    [/vegan/, "Animal products"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 6);
}

function inferCategory(brandCategories, title, productType, tags) {
  const hay = `${title} ${productType} ${(tags || []).join(" ")}`.toLowerCase();
  const rules = [
    ["sunscreen", /\b(sunscreen|spf\s*\d|spf\d|sun stick|sun lotion|sun cream|sunblock)\b/],
    ["deodorant", /\b(deodorant|antiperspirant|underarm)\b/],
    ["oral", /\b(toothpaste|tooth ?paste|mouthwash|tooth ?brush|oral care|floss|teeth whitening)\b/],
    ["hair", /\b(shampoo|conditioner|hair (oil|mask|serum|cream|spray)|scalp|curl cream|leave[- ]in|pomade)\b/],
    ["electrolytes", /\b(electrolyte|hydration multiplier)\b/],
    ["protein", /\b(protein (powder|shake|bar)|collagen peptides|whey|plant protein)\b/],
    ["supplements", /\b(supplement|vitamin|capsule|softgel|adaptogen|probiotic|greens? powder|multivitamin|gummy|gummies)\b/],
    ["skincare", /\b(serum|moisturizer|moisturiser|cleanser|toner|cream|lotion|oil|mask|balm|eye cream|face|skin|mist|essence|exfoliant|retinol|candle|fragrance|perfume|cologne)\b/],
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
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!ct.includes("json") && !text.trimStart().startsWith("{")) {
    throw new Error("not-json");
  }
  return JSON.parse(text);
}

async function fetchAllShopifyProducts(base) {
  const products = [];
  for (let page = 1; page <= 20; page++) {
    const url = `${base.replace(/\/$/, "")}/products.json?limit=250&page=${page}`;
    const data = await fetchJson(url);
    const batch = data.products || [];
    if (!batch.length) break;
    products.push(...batch);
    if (batch.length < 250) break;
  }
  return products;
}

function mapProduct(raw, brand, brandId, index) {
  const title = (raw.title || "").trim();
  if (!title || SKIP_TITLE.test(title)) return null;
  const imageSrc = raw.images?.[0]?.src || raw.image?.src;
  if (!imageSrc) return null;
  const price = Number(raw.variants?.[0]?.price || 0);
  if (!Number.isFinite(price) || price <= 0) return null;

  const body = raw.body_html || "";
  const description =
    firstParagraph(body) ||
    `${title} from ${brand.name} — clean everyday essentials for the tiny marketplace.`;
  const ingredients = extractIngredients(body);
  const freeFrom = inferFreeFrom(`${title} ${description} ${body}`, raw.product_type || "");
  const category = inferCategory(
    brand.categories,
    title,
    raw.product_type || "",
    raw.tags || [],
  );
  const handle = raw.handle || slugify(title);
  const id = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 12)}${String(index + 1).padStart(3, "0")}`;
  const base = shopBaseBySlug[brand.slug] || brand.websiteUrl || "";
  const affiliateUrl = base ? `${base.replace(/\/$/, "")}/products/${handle}` : undefined;

  return {
    id,
    slug: `${brand.slug}-${handle}`.slice(0, 100),
    brandId,
    name: title.slice(0, 120),
    category,
    price: Math.round(price * 100) / 100,
    description,
    ingredients,
    freeFrom,
    rating: Math.round((4.4 + (index % 5) * 0.1) * 10) / 10,
    reviewCount: 20 + ((index * 17) % 480),
    accent: brand.accent,
    imageUrl: hiResImage(imageSrc),
    affiliateUrl,
    placedBy: "catalog",
  };
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  // Drop any previous batch2 products (c101–c200)
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < 101 || n > 200;
  });
  const all = [...kept];
  const perBrand = [];
  const failures = [];

  for (let i = 0; i < seedBrands.length; i++) {
    const brand = seedBrands[i];
    const brandId = brandIdForIndex(i);
    const base = shopBaseBySlug[brand.slug] || brand.websiteUrl;
    process.stdout.write(`→ ${brand.slug} … `);
    try {
      const rawProducts = await fetchAllShopifyProducts(base);
      const mapped = [];
      const seenSlug = new Set();
      rawProducts.forEach((raw, idx) => {
        const p = mapProduct(raw, brand, brandId, idx);
        if (!p) return;
        if (seenSlug.has(p.slug)) return;
        seenSlug.add(p.slug);
        mapped.push(p);
      });
      console.log(`shopify ${mapped.length}/${rawProducts.length}`);
      perBrand.push({ slug: brand.slug, brandId, raw: rawProducts.length, kept: mapped.length, shopBase: base });
      if (!mapped.length) failures.push({ slug: brand.slug, error: "no-products" });
      all.push(...mapped);
    } catch (e) {
      console.log("ERR", e.message || e);
      failures.push({ slug: brand.slug, error: String(e.message || e) });
      perBrand.push({ slug: brand.slug, brandId, raw: 0, kept: 0, shopBase: base, error: String(e.message || e) });
    }
  }

  all.sort((a, b) => a.brandId.localeCompare(b.brandId) || a.name.localeCompare(b.name));
  fs.writeFileSync(outJson, JSON.stringify(all, null, 2));

  const hosts = [...new Set(all.map((p) => {
    try { return new URL(p.imageUrl).hostname; } catch { return null; }
  }).filter(Boolean))].sort();

  const batch2Count = all.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return n >= 101 && n <= 200;
  }).length;
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalProducts: all.length,
    batch2Products: batch2Count,
    batch2BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
    imageHosts: hosts,
    perBrand,
    failures,
  };
  fs.writeFileSync(outManifest, JSON.stringify(manifest, null, 2));
  // also refresh main manifest lightly
  fs.writeFileSync(
    path.join(root, "data/catalog-products-manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        productCount: all.length,
        brandCount: new Set(all.map((p) => p.brandId)).size,
        imageHosts: hosts,
      },
      null,
      2,
    ),
  );
  console.log("\nDone total", all.length, "batch2", batch2Count, "brands", manifest.batch2BrandsWithProducts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
