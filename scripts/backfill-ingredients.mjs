/**
 * Backfill missing product ingredients from Shopify product pages / JSON
 * and Open Beauty Facts when available.
 *
 * Usage: node scripts/backfill-ingredients.mjs [--limit=N] [--concurrency=20]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");
const progressPath = path.join(root, "data/ingredients-backfill-progress.json");
const manifestPath = path.join(root, "data/ingredients-backfill-manifest.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  }),
);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const CONCURRENCY = Number(args.concurrency || 16);
const SAVE_EVERY = 100;

const BEAUTY_NAME =
  /\b(serum|moisturizer|moisturiser|cleanser|cream|toner|mask|spf|sunscreen|deodorant|antiperspirant|shampoo|conditioner|toothpaste|mouthwash|vitamin|collagen|protein|electrolyte|lip balm|body lotion|body wash|face oil|retinol|hyaluronic|niacinamide|exfoliant|sunscreen|deo\b|underarm|oral|supplement|capsule|gummy|greens)\b/i;

function stripHtml(html) {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseList(chunk) {
  if (!chunk) return [];
  const cleaned = chunk
    .replace(/\s+/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .trim();
  let parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•\*]\s*/, "").replace(/\.$/, ""))
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
  // reject marketing-y non-INCI blobs
  if (parts.length <= 2 && cleaned.length > 80 && !/,/.test(cleaned)) return [];
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeInci(parts, raw) {
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide/i.test(raw)) {
    return true;
  }
  if (parts.length >= 2 && /water|aqua|glycerin/i.test(raw) && /,/.test(raw)) return true;
  return parts.length >= 4;
}

function extractIngredients(html) {
  if (!html) return { ingredients: [], source: "none" };

  // data attributes
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
    if (looksLikeInci(parts, raw)) return { ingredients: parts, source: "data-attr" };
  }

  // JSON-embedded ingredient fields
  const jsonRe =
    /"((?:full[_-])?ingredients?(?:[_-](?:list|text|html|inci))?)"\s*:\s*"((?:\\.|[^"\\]){10,8000})"/gi;
  let m;
  while ((m = jsonRe.exec(html))) {
    const key = m[1].toLowerCase();
    if (/image|photo|url|link|title|heading|label|tab|button|icon/.test(key)) continue;
    let val = m[2]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ", ")
      .replace(/\\u003c/gi, "<")
      .replace(/\\u003e/gi, ">")
      .replace(/\\u0026/gi, "&")
      .replace(/\\\//g, "/");
    val = stripHtml(val);
    if (val.length < 12) continue;
    if (/https?:|\/cdn\/|\.jpg|\.png|\.webp/i.test(val) && (val.match(/,/g) || []).length < 2) {
      continue;
    }
    const parts = parseList(val);
    if (looksLikeInci(parts, val)) return { ingredients: parts, source: `json:${key}` };
  }

  // "View all ingredients" / heading then paragraph with INCI
  const viewAll = html.match(
    /(?:view\s+all\s+ingredients|full\s+ingredients?(?:\s+list)?|all\s+ingredients|inci\s*list|complete\s+ingredients?)[\s\S]{0,120}?<p[^>]*>([\s\S]{20,5000}?)<\/p>/i,
  );
  if (viewAll) {
    const raw = stripHtml(viewAll[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return { ingredients: parts, source: "view-all-p" };
  }

  // Classic Ingredients: marker in text
  const text = stripHtml(html);
  const markers = [
    /(?:full\s+)?(?:ingredients?|inci(?:\s+list)?|composition)\s*[:\-–]\s*([\s\S]{12,4000}?)(?=(?:\b(?:directions|how to use|how to apply|warnings?|caution|free from|what'?s not|storage|shelf life|for external|suggested use|usage|application|benefits|recycled|recyclable|disclaimer|other information|manufactured)\b|$))/i,
  ];
  for (const re of markers) {
    const mm = text.match(re);
    if (!mm) continue;
    const raw = mm[1].trim();
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return { ingredients: parts, source: "text-marker" };
  }

  // Bare INCI blob starting with Water/Aqua and many commas
  const inci = text.match(
    /\b(?:Aqua|Water|Eau)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9][^,]{1,100}){5,60}/i,
  );
  if (inci) {
    const parts = parseList(inci[0]);
    if (parts.length >= 5) return { ingredients: parts, source: "inci-blob" };
  }

  return { ingredients: [], source: "none" };
}

function inferFreeFrom(text) {
  const hay = (text || "").toLowerCase();
  const out = [];
  const rules = [
    [/aluminum[- ]free|aluminium[- ]free|no aluminum/, "Aluminum"],
    [/paraben[- ]free|no parabens?/, "Parabens"],
    [/sulfate[- ]free|no sulfates?/, "Sulfates"],
    [/fragrance[- ]free|unscented|no (added )?fragrance/, "Fragrance"],
    [/cruelty[- ]free|not tested on animals/, "Animal testing"],
    [/silicone[- ]free/, "Silicones"],
    [/phthalate[- ]free/, "Phthalates"],
    [/fluoride[- ]free/, "Fluoride"],
    [/vegan/, "Animal products"],
    [/gluten[- ]free/, "Gluten"],
    [/baking soda[- ]free|bicarb[- ]free/, "Baking soda"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 6);
}

async function fetchText(url, timeout = 15000) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/json",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { text: await res.text(), finalUrl: res.url, contentType: res.headers.get("content-type") || "" };
}

async function fromShopify(product) {
  const url = (product.affiliateUrl || "").replace(/\/$/, "");
  if (!url || !/\/products\//i.test(url)) return null;

  // JSON body first (cheap)
  try {
    const { text } = await fetchText(url + ".json", 10000);
    if (text.trimStart().startsWith("{")) {
      const j = JSON.parse(text);
      const body = j.product?.body_html || "";
      const got = extractIngredients(body);
      if (got.ingredients.length) {
        return {
          ...got,
          source: `shopify-json:${got.source}`,
          freeFrom: inferFreeFrom(body),
        };
      }
    }
  } catch {
    /* continue */
  }

  // Full product page HTML
  try {
    const { text } = await fetchText(url, 18000);
    const got = extractIngredients(text);
    if (got.ingredients.length) {
      return {
        ...got,
        source: `shopify-html:${got.source}`,
        freeFrom: inferFreeFrom(text.slice(0, 50000)),
      };
    }
  } catch {
    /* continue */
  }
  return null;
}

async function fromOpenBeautyFacts(product) {
  const q = `${product.name}`.replace(/[^\w\s%-]/g, " ").trim().slice(0, 80);
  if (q.length < 4) return null;
  try {
    const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=5`;
    const { text } = await fetchText(url, 15000);
    const j = JSON.parse(text);
    for (const p of j.products || []) {
      const ingText = p.ingredients_text_en || p.ingredients_text || "";
      if (!ingText || ingText.length < 15) continue;
      const parts = parseList(ingText);
      if (looksLikeInci(parts, ingText)) {
        return {
          ingredients: parts,
          source: "openbeautyfacts",
          freeFrom: inferFreeFrom(ingText),
        };
      }
    }
  } catch {
    /* ignore */
  }
  // Open Food Facts for supplements/protein
  if (/\b(protein|vitamin|collagen|supplement|electrolyte|whey)\b/i.test(product.name)) {
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=5`;
      const { text } = await fetchText(url, 15000);
      const j = JSON.parse(text);
      for (const p of j.products || []) {
        const ingText = p.ingredients_text_en || p.ingredients_text || "";
        if (!ingText || ingText.length < 15) continue;
        const parts = parseList(ingText);
        if (parts.length >= 3) {
          return {
            ingredients: parts.slice(0, 80),
            source: "openfoodfacts",
            freeFrom: inferFreeFrom(ingText),
          };
        }
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function resolveIngredients(product) {
  const shopify = await fromShopify(product);
  if (shopify?.ingredients?.length) return shopify;
  if (BEAUTY_NAME.test(product.name) || ["skincare", "sunscreen", "deodorant", "oral", "hair", "protein", "supplements", "electrolytes"].includes(product.category)) {
    const obf = await fromOpenBeautyFacts(product);
    if (obf?.ingredients?.length) return obf;
  }
  return null;
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return results;
}

function loadProgress() {
  if (!fs.existsSync(progressPath)) return { doneIds: {}, stats: {} };
  try {
    return JSON.parse(fs.readFileSync(progressPath, "utf8"));
  } catch {
    return { doneIds: {}, stats: {} };
  }
}

async function main() {
  const products = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const progress = loadProgress();
  const doneIds = progress.doneIds || {};

  const needs = products
    .map((p, index) => ({ p, index }))
    .filter(({ p }) => {
      if (doneIds[p.id] === "skip" || doneIds[p.id] === "filled") return false;
      if (Array.isArray(p.ingredients) && p.ingredients.length > 0) return false;
      return Boolean(p.affiliateUrl);
    })
    // prioritize beauty-ish names
    .sort((a, b) => Number(BEAUTY_NAME.test(b.p.name)) - Number(BEAUTY_NAME.test(a.p.name)));

  const queue = needs.slice(0, LIMIT);
  console.log(
    `Backfilling ingredients for ${queue.length} products (of ${needs.length} eligible, ${products.length} total). concurrency=${CONCURRENCY}`,
  );

  const stats = {
    filled: 0,
    skipped: 0,
    bySource: {},
    startedAt: new Date().toISOString(),
  };

  let processed = 0;
  await mapPool(queue, CONCURRENCY, async ({ p, index }) => {
    try {
      const got = await resolveIngredients(p);
      if (got?.ingredients?.length) {
        products[index].ingredients = got.ingredients;
        if ((!p.freeFrom || p.freeFrom.length === 0) && got.freeFrom?.length) {
          products[index].freeFrom = got.freeFrom;
        }
        doneIds[p.id] = "filled";
        stats.filled++;
        stats.bySource[got.source] = (stats.bySource[got.source] || 0) + 1;
      } else {
        doneIds[p.id] = "skip";
        stats.skipped++;
      }
    } catch {
      doneIds[p.id] = "skip";
      stats.skipped++;
    }
    processed++;
    if (processed % 25 === 0 || processed === queue.length) {
      process.stdout.write(
        `\r${processed}/${queue.length} filled=${stats.filled} skipped=${stats.skipped}   `,
      );
    }
    if (processed % SAVE_EVERY === 0) {
      fs.writeFileSync(outJson, JSON.stringify(products, null, 2));
      fs.writeFileSync(
        progressPath,
        JSON.stringify({ updatedAt: new Date().toISOString(), doneIds, stats }, null, 2),
      );
    }
  });

  fs.writeFileSync(outJson, JSON.stringify(products, null, 2));
  fs.writeFileSync(
    progressPath,
    JSON.stringify({ updatedAt: new Date().toISOString(), doneIds, stats }, null, 2),
  );

  const withIng = products.filter((p) => Array.isArray(p.ingredients) && p.ingredients.length > 0);
  const manifest = {
    finishedAt: new Date().toISOString(),
    processed: queue.length,
    filled: stats.filled,
    skipped: stats.skipped,
    bySource: stats.bySource,
    totalProducts: products.length,
    withIngredients: withIng.length,
    coveragePct: Math.round((1000 * withIng.length) / products.length) / 10,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("\nDone", manifest);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
