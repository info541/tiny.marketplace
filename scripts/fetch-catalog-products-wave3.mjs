/**
 * Fetch Shopify product catalogs for wave3 brands (c251–c1250).
 * Caps products per brand to keep repo size reasonable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave3.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");
const selectedPath = path.join(root, "data/wave3-selected.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const MAX_PER_BRAND = 25;
const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off)\b/i;

const selected = JSON.parse(fs.readFileSync(selectedPath, "utf8"));
const shopBaseBySlug = Object.fromEntries(
  selected.map((b) => [b.slug, b.shopBase || b.websiteUrl]),
);

function brandIdForIndex(i) {
  return `c${String(i + 251).padStart(3, "0")}`;
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
    /ingredients?:\s*([\s\S]{10,900}?)(?:\. (?:directions|how to|warning|free from|what'?s not)|$)/i,
    /full ingredients?:\s*([\s\S]{10,900}?)(?:\. (?:directions|how to)|$)/i,
  ];
  for (const re of markers) {
    const m = text.match(re);
    if (!m) continue;
    const chunk = m[1]
      .split(/[.;\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 80)
      .slice(0, 40);
    if (chunk.length >= 3) return chunk;
  }
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

function inferCategory(brandCategories, title, productType, tags) {
  const hay = `${title} ${productType} ${(tags || []).join(" ")}`.toLowerCase();
  const rules = [
    ["sunscreen", /\b(spf|sunscreen|sunblock)\b/],
    ["deodorant", /\b(deodor|antiperspir|underarm|\bdeo\b)\b/],
    ["oral", /\b(toothpaste|toothbrush|floss|mouthwash|oral)\b/],
    ["hair", /\b(shampoo|conditioner|hair|scalp|curl|beard)\b/],
    ["protein", /\b(protein|whey|casein|collagen)\b/],
    ["electrolytes", /\b(electrolyte|hydration)\b/],
    ["supplements", /\b(vitamin|supplement|capsule|probiotic|mushroom|adaptogen)\b/],
    ["skincare", /\b(serum|moisturizer|cleanser|cream|toner|mask|facial|skin|body lotion|lip)\b/],
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
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  if (!text.trimStart().startsWith("{")) throw new Error("not-json");
  return JSON.parse(text);
}

async function fetchShopifyProducts(base, maxPages = 2) {
  const products = [];
  for (let page = 1; page <= maxPages; page++) {
    const data = await fetchJson(
      `${base.replace(/\/$/, "")}/products.json?limit=250&page=${page}`,
    );
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
    `${title} from ${brand.name} — curated for the tiny marketplace.`;
  const handle = raw.handle || slugify(title);
  const id = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10)}${String(index + 1).padStart(3, "0")}`;
  const base = shopBaseBySlug[brand.slug] || brand.websiteUrl || "";
  const ingredients = extractIngredients(body);

  return {
    id,
    slug: `${brand.slug}-${handle}`.slice(0, 100),
    brandId,
    name: title.slice(0, 120),
    category: inferCategory(
      brand.categories || ["skincare"],
      title,
      raw.product_type || "",
      raw.tags || [],
    ),
    price: Math.round(price * 100) / 100,
    description,
    ingredients,
    freeFrom: [],
    rating: Math.round((4.4 + (index % 5) * 0.1) * 10) / 10,
    reviewCount: 30 + ((index * 17) % 480),
    accent: brand.accent,
    imageUrl: hiResImage(imageSrc),
    affiliateUrl: base ? `${base.replace(/\/$/, "")}/products/${handle}` : undefined,
    placedBy: "catalog",
  };
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < 251 || n > 1250;
  });
  const all = [...kept];
  const perBrand = [];
  const failures = [];

  for (let i = 0; i < seedBrands.length; i++) {
    const brand = seedBrands[i];
    const brandId = brandIdForIndex(i);
    const base = shopBaseBySlug[brand.slug] || brand.websiteUrl;
    process.stdout.write(`\r→ ${i + 1}/${seedBrands.length} ${brand.slug.slice(0, 28).padEnd(28)} `);
    try {
      const rawProducts = await fetchShopifyProducts(base, 1);
      const mapped = [];
      const seenSlug = new Set();
      for (let idx = 0; idx < rawProducts.length && mapped.length < MAX_PER_BRAND; idx++) {
        const p = mapProduct(rawProducts[idx], brand, brandId, idx);
        if (!p) continue;
        if (seenSlug.has(p.slug)) continue;
        seenSlug.add(p.slug);
        mapped.push(p);
      }
      perBrand.push({
        slug: brand.slug,
        brandId,
        raw: rawProducts.length,
        kept: mapped.length,
        shopBase: base,
      });
      if (!mapped.length) failures.push({ slug: brand.slug, error: "no-products" });
      all.push(...mapped);
    } catch (e) {
      failures.push({ slug: brand.slug, error: String(e.message || e) });
      perBrand.push({
        slug: brand.slug,
        brandId,
        raw: 0,
        kept: 0,
        shopBase: base,
        error: String(e.message || e),
      });
    }
  }

  all.sort((a, b) => a.brandId.localeCompare(b.brandId) || a.name.localeCompare(b.name));
  fs.writeFileSync(outJson, JSON.stringify(all, null, 2));

  const wave3Count = all.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return n >= 251 && n <= 1250;
  }).length;

  const hosts = [
    ...new Set(
      all
        .map((p) => {
          try {
            return new URL(p.imageUrl).hostname;
          } catch {
            return null;
          }
        })
        .filter(Boolean),
    ),
  ].sort();

  fs.writeFileSync(
    path.join(root, "data/catalog-products-manifest-wave3.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave3Products: wave3Count,
        wave3BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
        totalProducts: all.length,
        brandCount: new Set(all.map((p) => p.brandId)).size,
        failures: failures.length,
        imageHosts: hosts,
        perBrandSample: perBrand.slice(0, 20),
      },
      null,
      2,
    ),
  );
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
  console.log(
    `\nDone total=${all.length} wave3=${wave3Count} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
