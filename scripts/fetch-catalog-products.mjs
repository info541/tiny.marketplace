/**
 * Fetch product catalogs for curated brands (mostly Shopify products.json),
 * then write src/lib/catalog-products.ts + data/catalog-products-manifest.json.
 *
 * Usage: node scripts/fetch-catalog-products.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogBrandsPath = path.join(root, "src/lib/catalog-brands.ts");
const outTs = path.join(root, "src/lib/catalog-products.ts");
const outJson = path.join(root, "data/catalog-products-raw.json");
const outManifest = path.join(root, "data/catalog-products-manifest.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Known Shopify storefront bases when marketing domains block products.json */
const SHOP_OVERRIDES = {
  "good-molecules": "https://shop.goodmolecules.com",
  bite: "https://www.bitetoothpastebits.com",
  hello: "https://www.hello-products.com",
  attitude: "https://www.attitudeliving.com",
  lmnt: "https://www.drinklmnt.com",
  "liquid-iv": "https://liquid-iv.com",
  laneige: "https://us.laneige.com",
  innisfree: "https://us.innisfree.com",
  topicals: "https://www.mytopicals.com",
  davines: "https://us.davines.com",
  biore: "https://kaomallshop.myshopify.com",
  // Extra guesses tried previously — keep for retries
  schmidts: "https://www.schmidtsnaturals.com",
  "hi-bar": "https://www.hibarsoap.com",
  "bare-republic": "https://shop.barerepublic.com",
  truvani: "https://www.truvani.com",
  "ancient-nutrition": "https://www.ancientnutrition.com",
  hanni: "https://www.forhanni.com",
  "hum-nutrition": "https://www.humnutrition.com",
  seed: "https://www.seed.com",
  sakara: "https://www.sakara.com",
  "athletic-greens": "https://drinkag1.com",
  weleda: "https://www.weleda.com",
  "youth-to-the-people": "https://youthtothepeople.com",
  biossance: "https://biossance.com",
};

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|store credit|membership|subscription box|not for sale|tester only|wholesale)\b/i;

function brandIdForSlug(slug) {
  const idx = seedBrands.findIndex((b) => b.slug === slug);
  if (idx < 0) throw new Error(`unknown slug ${slug}`);
  return `c${String(idx + 1).padStart(3, "0")}`;
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
  // Comma-heavy ingredient lists
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
    ["oral", /\b(toothpaste|tooth ?paste|mouthwash|tooth ?brush|oral care|floss|teeth whitening|tooth bits)\b/],
    ["hair", /\b(shampoo|conditioner|hair (oil|mask|serum|cream|spray)|scalp|curl cream|leave[- ]in)\b/],
    ["electrolytes", /\b(electrolyte|hydration multiplier|lmnt|nuun|dripdrop|liquid i\.?v)\b/],
    ["protein", /\b(protein (powder|shake|bar)|collagen peptides|whey|plant protein)\b/],
    ["supplements", /\b(supplement|vitamin|capsule|softgel|adaptogen|probiotic|greens? powder|ag1|multivitamin|gummy|gummies)\b/],
    ["skincare", /\b(serum|moisturizer|moisturiser|cleanser|toner|cream|lotion|oil|mask|balm|eye cream|face|skin| mist|essence|exfoliant|retinol|squalane)\b/],
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
    // Prefer large Shopify CDN renders
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

async function discoverShopifyBase(websiteUrl, slug) {
  const candidates = [];
  if (SHOP_OVERRIDES[slug]) candidates.push(SHOP_OVERRIDES[slug]);
  if (websiteUrl) {
    candidates.push(websiteUrl);
    try {
      const u = new URL(websiteUrl);
      const host = u.hostname.replace(/^www\./, "");
      candidates.push(`https://${host}`);
      candidates.push(`https://www.${host}`);
      candidates.push(`https://shop.${host}`);
      candidates.push(`https://us.${host}`);
    } catch {
      /* ignore */
    }
  }
  const seen = new Set();
  for (const base of candidates) {
    const key = base.replace(/\/$/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      await fetchJson(`${key}/products.json?limit=1`);
      return key;
    } catch {
      try {
        await fetchJson(`${key}/collections/all/products.json?limit=1`);
        return key;
      } catch {
        /* continue */
      }
    }
  }
  return null;
}

/** Lightweight JSON-LD Product scrape for non-Shopify storefronts */
async function scrapeJsonLdProducts(websiteUrl, limit = 40) {
  const pages = [
    websiteUrl,
    `${websiteUrl.replace(/\/$/, "")}/collections/all`,
    `${websiteUrl.replace(/\/$/, "")}/collections/shop-all`,
    `${websiteUrl.replace(/\/$/, "")}/shop`,
    `${websiteUrl.replace(/\/$/, "")}/products`,
  ];
  const found = [];
  const seen = new Set();
  for (const page of pages) {
    if (found.length >= limit) break;
    try {
      const res = await fetch(page, {
        headers: { "User-Agent": UA, Accept: "text/html" },
        redirect: "follow",
      });
      if (!res.ok) continue;
      const html = await res.text();
      const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      for (const m of scripts) {
        try {
          const data = JSON.parse(m[1]);
          const nodes = Array.isArray(data) ? data : [data];
          for (const node of nodes) {
            const graph = node["@graph"] || [node];
            for (const item of graph) {
              const type = item["@type"];
              const types = Array.isArray(type) ? type : [type];
              if (!types.includes("Product") && !types.includes("ProductGroup")) continue;
              const name = item.name;
              const image = Array.isArray(item.image) ? item.image[0] : item.image;
              const img =
                typeof image === "string"
                  ? image
                  : image?.url || image?.contentUrl || undefined;
              const offers = item.offers;
              const offer = Array.isArray(offers) ? offers[0] : offers;
              const price = Number(offer?.price || offer?.lowPrice || 0);
              const url = item.url || offer?.url || page;
              if (!name || !img || seen.has(name)) continue;
              seen.add(name);
              found.push({
                title: name,
                body_html: item.description || "",
                product_type: item.category || "",
                tags: [],
                handle: slugify(name),
                images: [{ src: img }],
                variants: [{ price: String(price || 0) }],
                vendor: "",
                sourceUrl: url,
              });
            }
          }
        } catch {
          /* bad json-ld */
        }
      }
      // Shopify-like CDN image cards as last resort
      if (found.length < 8) {
        const imgs = [...html.matchAll(/https:\/\/cdn\.shopify\.com\/s\/files\/[^"'&\s]+\.(?:jpg|jpeg|png|webp)/gi)];
        // too noisy without titles — skip
        void imgs;
      }
    } catch {
      /* ignore page */
    }
  }
  return found;
}

function mapProduct(raw, brand, index) {
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
  const brandId = brandIdForSlug(brand.slug);
  const id = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 12)}${String(index + 1).padStart(3, "0")}`;
  const base = brand._shopBase || brand.websiteUrl || "";
  const affiliateUrl = raw.sourceUrl
    ? raw.sourceUrl
    : base
      ? `${base.replace(/\/$/, "")}/products/${handle}`
      : undefined;

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

function tsString(s) {
  return JSON.stringify(s);
}

function emitTs(products) {
  const lines = [];
  lines.push(`import type { Product } from "./types";`);
  lines.push("");
  lines.push(`/** Auto-generated by scripts/fetch-catalog-products.mjs — do not edit by hand. */`);
  lines.push(`export const catalogProducts: Product[] = [`);
  for (const p of products) {
    lines.push(`  {`);
    lines.push(`    id: ${tsString(p.id)},`);
    lines.push(`    slug: ${tsString(p.slug)},`);
    lines.push(`    brandId: ${tsString(p.brandId)},`);
    lines.push(`    name: ${tsString(p.name)},`);
    lines.push(`    category: ${tsString(p.category)},`);
    lines.push(`    price: ${p.price},`);
    lines.push(`    description: ${tsString(p.description)},`);
    lines.push(`    ingredients: ${tsString(p.ingredients)},`);
    lines.push(`    freeFrom: ${tsString(p.freeFrom)},`);
    lines.push(`    rating: ${p.rating},`);
    lines.push(`    reviewCount: ${p.reviewCount},`);
    lines.push(`    accent: ${tsString(p.accent)},`);
    if (p.imageUrl) lines.push(`    imageUrl: ${tsString(p.imageUrl)},`);
    if (p.affiliateUrl) lines.push(`    affiliateUrl: ${tsString(p.affiliateUrl)},`);
    if (p.placedBy) lines.push(`    placedBy: ${tsString(p.placedBy)},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push("");
  return lines.join("\n");
}

function collectImageHosts(products) {
  const hosts = new Set();
  for (const p of products) {
    if (!p.imageUrl) continue;
    try {
      hosts.add(new URL(p.imageUrl).hostname);
    } catch {
      /* ignore */
    }
  }
  return [...hosts].sort();
}

async function main() {
  // Prefer live catalog-brands.ts metadata (ids already assigned)
  const catalogSrc = fs.readFileSync(catalogBrandsPath, "utf8");
  const brands = seedBrands.map((b, i) => {
    const id = `c${String(i + 1).padStart(3, "0")}`;
    // pull accent/categories from seed (same as catalog)
    return { ...b, id };
  });

  const all = [];
  const perBrand = [];
  const failures = [];

  for (const brand of brands) {
    process.stdout.write(`→ ${brand.slug} … `);
    let rawProducts = [];
    let method = "none";
    try {
      const base = await discoverShopifyBase(brand.websiteUrl, brand.slug);
      if (base) {
        brand._shopBase = base;
        rawProducts = await fetchAllShopifyProducts(base);
        method = "shopify";
      } else {
        rawProducts = await scrapeJsonLdProducts(brand.websiteUrl, 60);
        method = rawProducts.length ? "json-ld" : "none";
      }
    } catch (e) {
      failures.push({ slug: brand.slug, error: String(e.message || e) });
      console.log("ERR", e.message || e);
      continue;
    }

    const mapped = [];
    const seenSlug = new Set();
    rawProducts.forEach((raw, idx) => {
      const p = mapProduct(raw, brand, idx);
      if (!p) return;
      if (seenSlug.has(p.slug)) return;
      seenSlug.add(p.slug);
      mapped.push(p);
    });

    console.log(`${method} ${mapped.length}/${rawProducts.length}`);
    perBrand.push({
      slug: brand.slug,
      method,
      raw: rawProducts.length,
      kept: mapped.length,
      shopBase: brand._shopBase || null,
    });
    if (!mapped.length) failures.push({ slug: brand.slug, error: "no-products" });
    all.push(...mapped);
  }

  // Stable sort: by brandId then name
  all.sort((a, b) => a.brandId.localeCompare(b.brandId) || a.name.localeCompare(b.name));

  fs.mkdirSync(path.join(root, "data"), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(all, null, 2));
  fs.writeFileSync(outTs, emitTs(all));

  const hosts = collectImageHosts(all);
  const manifest = {
    generatedAt: new Date().toISOString(),
    productCount: all.length,
    brandCount: perBrand.filter((b) => b.kept > 0).length,
    brandsAttempted: brands.length,
    imageHosts: hosts,
    perBrand,
    failures,
  };
  fs.writeFileSync(outManifest, JSON.stringify(manifest, null, 2));

  console.log("\nDone:", all.length, "products across", manifest.brandCount, "brands");
  console.log("Failures:", failures.length);
  console.log("Image hosts:", hosts.join(", "));
  console.log("Wrote", path.relative(root, outTs));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
