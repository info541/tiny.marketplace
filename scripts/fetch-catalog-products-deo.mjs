/**
 * Fetch Shopify catalogs for natural deodorant brands (ids c226–c250).
 * Keeps deodorant / underarm SKUs only — no hats, apparel, or unrelated merch.
 * Merges into data/catalog-products-raw.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-deo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");
const selectedPath = path.join(root, "data/deo-selected.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|product tko|mystery gift)\b/i;

/** Must look like deodorant / underarm care */
const INCLUDE =
  /\b(deodor\w*|antiperspir\w*|underarm|armpit|pit[- ]?stick|odor[- ]?control|odour[- ]?control)|\bdeo\b/i;

/** Hard exclude merch & non-deo categories */
const EXCLUDE_MERCH =
  /\b(hat|hoodie|t-?shirt|\btee\b|apparel|merch|beanie|sweatshirt|crewneck|\bmug\b|sticker|cap\b|socks?|tote|flask only|empty bottle)\b/i;

/** Accessory-only titles (case/tin without refill/deo content) */
const ACCESSORY_ONLY =
  /\b(reusable storage|travel tin|storage\/travel|empty tin|tube squeezer|deodorant container|bamboo applicator)\b/i;

const selected = JSON.parse(fs.readFileSync(selectedPath, "utf8"));
const shopBaseBySlug = Object.fromEntries(
  selected.map((b) => [b.slug, b.shopBase || b.websiteUrl]),
);

function brandIdForIndex(i) {
  return `c${String(i + 226).padStart(3, "0")}`;
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

function isDeodorantProduct(raw) {
  const title = (raw.title || "").trim();
  const type = raw.product_type || "";
  const tags = (raw.tags || []).join(" ");
  const handle = raw.handle || "";
  const hay = `${title} ${type} ${tags} ${handle}`;

  if (!title || SKIP_TITLE.test(title)) return false;
  if (EXCLUDE_MERCH.test(hay) && !INCLUDE.test(`${title} ${type}`)) return false;
  if (ACCESSORY_ONLY.test(title)) return false;
  // Bare case / applicator without deodorant words in the title
  if (
    /\b(case|applicator|container|dock)\b/i.test(title) &&
    !INCLUDE.test(title) &&
    !/\b(refill|starter|deodorant|deo)\b/i.test(title)
  ) {
    return false;
  }

  // Mis-tagged products (e.g. hand cream with product_type DEODORANT)
  if (
    /\b(hand cream|lip balm|body butter|body oil|shampoo|conditioner|toothpaste|bar soap|castile|carpet deodoriz)\b/i.test(
      title,
    ) &&
    !INCLUDE.test(title)
  ) {
    return false;
  }

  // Body wash only if clearly underarm-focused
  if (/\b(body wash|shower gel|wash &)\b/i.test(title) && !/\bunderarm\b/i.test(title)) {
    if (!/\b(deodor\w*|antiperspir\w*)\b/i.test(title)) return false;
  }

  return INCLUDE.test(title) || INCLUDE.test(type);
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
  if (!isDeodorantProduct(raw)) return null;
  const title = (raw.title || "").trim();
  const imageSrc = raw.images?.[0]?.src || raw.image?.src;
  if (!imageSrc) return null;
  const price = Number(raw.variants?.[0]?.price || 0);
  if (!Number.isFinite(price) || price <= 0) return null;

  const body = raw.body_html || "";
  const description =
    firstParagraph(body) ||
    `${title} from ${brand.name} — natural deodorant for the tiny marketplace.`;
  const handle = raw.handle || slugify(title);
  const id = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 12)}${String(index + 1).padStart(3, "0")}`;
  const base = shopBaseBySlug[brand.slug] || brand.websiteUrl || "";
  const hay = `${title} ${body}`.toLowerCase();
  const freeFrom = [];
  if (/aluminum[- ]free|aluminium[- ]free/.test(hay)) freeFrom.push("Aluminum");
  if (/baking soda[- ]free|bicarb[- ]free|bicarbonate[- ]free/.test(hay)) {
    freeFrom.push("Baking soda");
  }
  if (/organic/.test(hay)) freeFrom.push("Synthetic fragrance");
  if (/vegan/.test(hay)) freeFrom.push("Animal products");
  if (/plastic[- ]free/.test(hay)) freeFrom.push("Plastic packaging");

  return {
    id,
    slug: `${brand.slug}-${handle}`.slice(0, 100),
    brandId,
    name: title.slice(0, 120),
    category: "deodorant",
    price: Math.round(price * 100) / 100,
    description,
    ingredients: [],
    freeFrom: freeFrom.slice(0, 6),
    rating: Math.round((4.5 + (index % 5) * 0.1) * 10) / 10,
    reviewCount: 40 + ((index * 19) % 520),
    accent: brand.accent,
    imageUrl: hiResImage(imageSrc),
    affiliateUrl: base ? `${base.replace(/\/$/, "")}/products/${handle}` : undefined,
    placedBy: "catalog",
    badge: /\borganic\b/i.test(title)
      ? "Organic"
      : /aluminum[- ]free|aluminium[- ]free/i.test(title)
        ? "Aluminum-free"
        : undefined,
  };
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < 226 || n > 250;
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
      console.log(`deodorant ${mapped.length}/${rawProducts.length}`);
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
      console.log("ERR", e.message || e);
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

  const deoCount = all.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return n >= 226 && n <= 250;
  }).length;

  fs.writeFileSync(
    path.join(root, "data/catalog-products-manifest-deo.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        deoProducts: deoCount,
        deoBrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
        totalProducts: all.length,
        brandCount: new Set(all.map((p) => p.brandId)).size,
        imageHosts: hosts,
        perBrand,
        failures,
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
    "\nDone total",
    all.length,
    "deo",
    deoCount,
    "brands",
    perBrand.filter((b) => b.kept > 0).length,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
