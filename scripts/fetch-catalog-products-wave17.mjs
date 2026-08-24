/**
 * Fetch Shopify catalogs for wave17 brands (c721+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent / shade variants into their own listings
 * - Skips merch, events, gift cards, wholesale-only SKUs
 * - Extracts ingredients from product HTML
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave17.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 721;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|do not use|tiktok shop|credit card payment|price test|employee wellness|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|pump holder|marketing card|fanny pack|luggage tag|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|ball cap|beanie|rainbow cap|canvas cap|tote bag|statement tote|\btote\b|silk scarf|sticker|mug\b|apparel|poster|patch|keychain|stuffed toy|plush|crew socks|socks\b|head wrap|book\b|journal\b|ebook|e-book|cookbook|workshop|masterclass|reading|tarot|ticket|event|class with|immersion|social hour|astrology|gua sha class|oracle|akashic|initiation:|pocket altar|free class|free gift|enamel pin|deodorant scoop|cream applicator|deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|nalgene bottle|team bottle|terrain bottle|fuel bottle|for pets?|\bpet\b|dog soap|dog balm|dog shampoo|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|vip protection|priority handling|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|digital (file|download)|gravity feed|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|cheek tint|lipstick|lip gloss|lip liner|eyeliner|makeup|setting spray|room spray|floor cleaner|dishwasher|laundry detergent|all purpose cleaner|neem comb|scalp massager|pill travel tin|welcome card|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|pouches|travel bag|travel organiser|travel organizer|wax melt|reed diffuser|clay diffuser|diffuser blend|\bcandle\b|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|facial rounds|swag|academy|course download|storage jar|stainless steel|fertility test|pregnancy test|\bpouch\b|laundry powder|laundry scent|laundry detergent|puppy paw|dog paw|mat spray|yoga (room|mat)|linen spray|room \+ linen|fabric refresher|perfume|bundle & save|\bshirt\b|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|travel tin|counter display|accessories only|starter kit bag|kit bag|bodysuit|onesie|metal travel cap|anti-slip bottle|bottle sleeve)\b/i;

const SKIP_TYPE =
  /\b(gift card|merchandise|apparel|ticket|event|workshop|class|reading|ebook|download|swag|accessories|returns|post-purchase protection|shipping protection)\b/i;

const SKIP_TAGS =
  /\b(calendar|events|ticket|workshop|merch|apparel)\b/i;

const NICHE =
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sun protection|sun lotion|sun cream|after[- ]?sun|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|floss|mouthwash|oral|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|tablet|shampoo|conditioner|hairwash|hair wash|dry shampoo|hair clay|shikakai|champi|hair (oil|mask|serum|care|cream|butter)|beard|scalp|leave[- ]?in|protein|whey|casein|collagen|creatine|pea protein|chocho|meal shake|drink mix|wellness powder|immune support|daily (calm|energy|hydration)|vitamin|supplement|capsule|softgel|probiotic|adaptogen|mushroom|tonic|powder|magnesium|gummies|gummy|prenatal|serum|moisturizer|moisturiser|cleanser|face wash|facial|toner|retinol|niacinamide|cream|lotion|oil|mask|balm|souffl|mist|essence|exfoliant|lip|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|organ|greens?|superfood|multi for|hydust|sweetpeace|bite)\b|deodor|electrolyt|hydrat/i;

const FLAVOR_OPTION = /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade/i;

function brandIdForIndex(i) {
  return `c${String(i + WAVE_START).padStart(3, "0")}`;
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(html) {
  const text = stripHtml(html);
  if (!text) return "";
  const cut = text.slice(0, 360);
  if (text.length <= 360) return text;
  const dot = cut.lastIndexOf(". ");
  if (dot > 80) return cut.slice(0, dot + 1);
  return cut.replace(/\s+\S*$/, "") + "…";
}

function parseList(chunk) {
  if (!chunk) return [];
  const cleaned = chunk
    .replace(/\s+/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .trim();
  const parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•*]\s*/, "").replace(/\.$/, ""))
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 160 &&
        !/^(and|or|with|contains|including|ingredients?|view all|full list|see all|free of|made without)$/i.test(
          s,
        ) &&
        !/^https?:/i.test(s) &&
        !/\.(jpg|png|webp|gif)(\?|$)/i.test(s),
    );
  if (parts.length <= 2 && cleaned.length > 80 && !/,/.test(cleaned)) return [];
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeInci(parts, raw) {
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin/i.test(raw)) {
    return true;
  }
  if (parts.length >= 2 && /water|aqua|glycerin|organic/i.test(raw) && /,/.test(raw)) return true;
  return parts.length >= 4;
}

function extractIngredients(html) {
  if (!html) return [];
  const dataAttrs = [
    /data-original-ingredients\s*=\s*"([^"]{10,8000})"/i,
    /data-ingredients(?:-list|-text)?\s*=\s*"([^"]{10,8000})"/i,
    /data-full-ingredients\s*=\s*"([^"]{10,8000})"/i,
  ];
  for (const re of dataAttrs) {
    const m = html.match(re);
    if (!m) continue;
    const raw = stripHtml(m[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }

  const viewAll = html.match(
    /(?:view\s+all\s+ingredients|full\s+ingredients?(?:\s+list)?|all\s+ingredients|inci\s*list|complete\s+ingredients?)[\s\S]{0,120}?<p[^>]*>([\s\S]{20,5000}?)<\/p>/i,
  );
  if (viewAll) {
    const raw = stripHtml(viewAll[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }

  const text = stripHtml(html);
  const markers = [
    /(?:full\s+)?(?:ingredients?|inci(?:\s+list)?|composition|what's in it|whats in it)\s*[:\-–]\s*([\s\S]{12,4000}?)(?=(?:\b(?:directions|how to use|how to apply|warnings?|caution|free from|what'?s not|storage|shelf life|for external|suggested use|usage|application|benefits|recycled|recyclable|disclaimer|other information|manufactured|nutrition)\b|$))/i,
  ];
  for (const re of markers) {
    const mm = text.match(re);
    if (!mm) continue;
    const raw = mm[1].trim();
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }

  const inci = text.match(
    /\b(?:Aqua|Water|Eau)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9][^,]{1,100}){5,60}/i,
  );
  if (inci) {
    const parts = parseList(inci[0]);
    if (parts.length >= 5) return parts;
  }
  return [];
}

function inferFreeFrom(text) {
  const hay = text.toLowerCase();
  const out = [];
  const rules = [
    [/aluminum[- ]free|aluminium[- ]free|no aluminum/, "Aluminum"],
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
    [/artificial (color|colour|dye)s?[- ]free|no artificial (color|colour|dye)/, "Artificial dyes"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 6);
}

function inferCategory(brandCategories, title, productType, tags) {
  const hay = `${title} ${productType} ${(tags || []).join(" ")}`.toLowerCase();
  const rules = [
    ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sun protection|sun stick|sun lotion|sun cream|after[- ]?sun)\b/],
    ["deodorant", /deodor|antiperspir|underarm|\bdeo\b/],
    ["oral", /\b(toothpaste|toothbrush|floss|mouthwash|oral|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|teeth|tablet)\b/],
    ["hair", /\b(shampoo|conditioner|hair|scalp|curl|leave[- ]?in|edge control|twist|beard|dry shampoo|hair clay)\b/],
    ["protein", /\b(protein|whey|casein|pea protein|plant protein|chocho|meal shake|sweetpeace|creatine)\b/],
    ["electrolytes", /\b(electrolyt|hydration (powder|packet|mix|stick|multiplier|pak)|rapid hydration|hydro pak|power pak|drink mix|wellness powder|immune support|hydust|organic hydration)\b/],
    ["skincare", /\b(serum|moisturizer|moisturiser|cleanser|cream|toner|mask|facial|skin|body (lotion|butter|wash|cream|oil|bar)|lip|soap|balm|oil|mist|tallow)\b/],
    ["supplements", /\b(vitamin|supplement|capsule|softgel|probiotic|adaptogen|mushroom|tonic herb|collagen|prenatal|greens?|organ|superfood|magnesium|gumm|multi for|cortisol|bite)\b/],
  ];
  for (const [cat, re] of rules) {
    if (re.test(hay)) return cat;
  }
  return brandCategories[0] || "skincare";
}

function isOnNiche(raw, brand) {
  const title = raw.title || "";
  const type = raw.product_type || "";
  const tags = (raw.tags || []).join(" ");
  const hay = `${title} ${type} ${tags}`;
  if (SKIP_TITLE.test(title) || SKIP_TYPE.test(type) || SKIP_TAGS.test(tags)) return false;
  if (NICHE.test(hay)) return true;
  if (brand.categories.length === 1) return true;
  return false;
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

function imageForVariant(raw, variant) {
  if (variant?.featured_image?.src) return variant.featured_image.src;
  if (variant?.image_id && raw.images) {
    const match = raw.images.find((img) => img.id === variant.image_id);
    if (match?.src) return match.src;
  }
  return raw.images?.[0]?.src || raw.image?.src;
}

function flavorOptionIndex(raw) {
  const options = raw.options || [];
  return options.findIndex((o) => FLAVOR_OPTION.test(o.name || ""));
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  if (!text.trimStart().startsWith("{")) throw new Error("not-json");
  return JSON.parse(text);
}

async function fetchShopifyProducts(base) {
  const products = [];
  for (let page = 1; page <= 12; page++) {
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

function mapOne(raw, brand, brandId, index, variant, flavorLabel) {
  const baseTitle = (raw.title || "").trim();
  const title = flavorLabel ? `${baseTitle} — ${flavorLabel}` : baseTitle;
  if (!title) return null;
  const imageSrc = imageForVariant(raw, variant);
  if (!imageSrc) return null;
  const price = Number(variant?.price || raw.variants?.[0]?.price || 0);
  if (!Number.isFinite(price) || price <= 0) return null;

  const body = raw.body_html || "";
  const description =
    firstParagraph(body) ||
    `${title} from ${brand.name} — curated for the tiny marketplace.`;
  const handle = raw.handle || slugify(baseTitle);
  const flavorSlug = flavorLabel ? `-${slugify(flavorLabel)}` : "";
  const idCore = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10)}${String(index + 1).padStart(3, "0")}${flavorSlug.replace(/-/g, "").slice(0, 8)}`;
  const ingredients = extractIngredients(body);
  const freeFrom = inferFreeFrom(`${title} ${description} ${stripHtml(body)}`);
  const category = inferCategory(
    brand.categories || ["skincare"],
    `${title} ${raw.product_type || ""}`,
    raw.product_type || "",
    raw.tags || [],
  );

  return {
    id: idCore.slice(0, 40),
    slug: `${brand.slug}-${handle}${flavorSlug}`.slice(0, 100),
    brandId,
    name: title.slice(0, 140),
    category,
    price: Math.round(price * 100) / 100,
    description,
    ingredients,
    freeFrom,
    rating: Math.round((4.4 + (index % 5) * 0.1) * 10) / 10,
    reviewCount: 30 + ((index * 17) % 480),
    accent: brand.accent,
    imageUrl: hiResImage(imageSrc),
    affiliateUrl: brand.shopBase
      ? `${brand.shopBase.replace(/\/$/, "")}/products/${handle}`
      : undefined,
    placedBy: "catalog",
    badge: /\borganic\b/i.test(title)
      ? "Organic"
      : /aluminum[- ]free|aluminium[- ]free/i.test(title)
        ? "Aluminum-free"
        : /mineral/i.test(title) && category === "sunscreen"
          ? "Mineral"
          : undefined,
  };
}

function expandProducts(raw, brand, brandId, index) {
  if (!isOnNiche(raw, brand)) return [];
  const flavorIdx = flavorOptionIndex(raw);
  const variants = raw.variants || [];
  if (flavorIdx >= 0 && variants.length > 1) {
    const seen = new Set();
    const out = [];
    for (const v of variants) {
      const label = [v.option1, v.option2, v.option3][flavorIdx];
      if (!label || /^default title$/i.test(label)) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const mapped = mapOne(raw, brand, brandId, index, v, label);
      if (mapped) out.push(mapped);
    }
    if (out.length) return out;
  }
  const mapped = mapOne(raw, brand, brandId, index, variants[0], null);
  return mapped ? [mapped] : [];
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < WAVE_START || n > WAVE_END;
  });
  const all = [...kept];
  const perBrand = [];
  const failures = [];

  for (let i = 0; i < seedBrands.length; i++) {
    const brand = seedBrands[i];
    const brandId = brandIdForIndex(i);
    const base = brand.shopBase || brand.websiteUrl;
    process.stdout.write(`→ ${brand.slug.padEnd(22)} `);
    try {
      const rawProducts = await fetchShopifyProducts(base);
      const mapped = [];
      const seenSlug = new Set();
      const seenName = new Set();
      rawProducts.forEach((raw, idx) => {
        for (const p of expandProducts(raw, brand, brandId, idx)) {
          const nameKey = p.name.toLowerCase().replace(/\s+/g, " ");
          if (seenSlug.has(p.slug) || seenName.has(nameKey)) continue;
          seenSlug.add(p.slug);
          seenName.add(nameKey);
          mapped.push(p);
        }
      });
      const withIng = mapped.filter((p) => p.ingredients.length > 0).length;
      const variants = mapped.filter((p) => / — /.test(p.name)).length;
      console.log(`kept ${mapped.length}/${rawProducts.length} ingredients ${withIng} variants ${variants}`);
      perBrand.push({
        slug: brand.slug,
        brandId,
        raw: rawProducts.length,
        kept: mapped.length,
        withIngredients: withIng,
        flavorVariants: variants,
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

  const waveCount = all.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return n >= WAVE_START && n <= WAVE_END;
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
    path.join(root, "data/catalog-products-manifest-wave17.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave17Products: waveCount,
        wave17BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
        totalProducts: all.length,
        brandCount: new Set(all.map((p) => p.brandId)).size,
        failures,
        imageHosts: hosts,
        perBrand,
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
  fs.writeFileSync(
    path.join(root, "data/wave17-selected.json"),
    JSON.stringify(
      seedBrands.map((b, i) => ({
        slug: b.slug,
        shopBase: b.shopBase,
        categories: b.categories,
        id: `c${String(i + WAVE_START).padStart(3, "0")}`,
      })),
      null,
      2,
    ),
  );
  console.log(
    `\nDone total=${all.length} wave17=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
