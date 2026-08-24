/**
 * Backfill ingredients for wave4 products only (brand ids c460–c480).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function isWave4(p) {
  const n = Number(String(p.brandId).replace(/^c/, ""));
  return Number.isFinite(n) && n >= 460 && n <= 480;
}

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
    .replace(/\s+/g, " ")
    .trim();
}

function parseList(chunk) {
  if (!chunk) return [];
  const cleaned = chunk.replace(/\s+/g, " ").replace(/\*\*/g, "").replace(/\[[^\]]*\]/g, "").trim();
  const parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•*]\s*/, "").replace(/\.$/, ""))
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 160 &&
        !/^(and|or|with|contains|including|ingredients?|view all|full list|see all|free of|made without)$/i.test(s) &&
        !/^https?:/i.test(s),
    );
  if (parts.length <= 2 && cleaned.length > 80 && !/,/.test(cleaned)) return [];
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeInci(parts, raw) {
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|powder/i.test(raw)) {
    return true;
  }
  return parts.length >= 4;
}

function extractIngredients(html) {
  if (!html) return [];
  const dataAttrs = [
    /data-original-ingredients\s*=\s*"([^"]{10,8000})"/i,
    /data-ingredients(?:-list|-text)?\s*=\s*"([^"]{10,8000})"/i,
  ];
  for (const re of dataAttrs) {
    const m = html.match(re);
    if (!m) continue;
    const raw = stripHtml(m[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
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
      .replace(/\\u0026/gi, "&");
    val = stripHtml(val);
    const parts = parseList(val);
    if (looksLikeInci(parts, val)) return parts;
  }
  const text = stripHtml(html);
  const mm = text.match(
    /(?:full\s+)?(?:ingredients?|inci(?:\s+list)?|composition|supplement facts)\s*[:\-–]\s*([\s\S]{12,4000}?)(?=(?:\b(?:directions|how to use|how to apply|warnings?|caution|free from|suggested use|usage|benefits|disclaimer)\b|$))/i,
  );
  if (mm) {
    const parts = parseList(mm[1].trim());
    if (looksLikeInci(parts, mm[1])) return parts;
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
    [/dairy[- ]free|no dairy/, "Dairy"],
    [/soy[- ]free/, "Soy"],
    [/no (artificial )?(dyes?|colors?)/, "Artificial dyes"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 8);
}

async function fetchText(url, timeout = 15000) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

async function resolve(product) {
  const url = (product.affiliateUrl || "").replace(/\/$/, "");
  if (!url) return null;
  try {
    const text = await fetchText(url + ".json", 10000);
    if (text.trimStart().startsWith("{")) {
      const j = JSON.parse(text);
      const body = j.product?.body_html || "";
      const ingredients = extractIngredients(body);
      if (ingredients.length) return { ingredients, freeFrom: inferFreeFrom(body) };
    }
  } catch {
    /* continue */
  }
  try {
    const html = await fetchText(url, 18000);
    const ingredients = extractIngredients(html);
    if (ingredients.length) return { ingredients, freeFrom: inferFreeFrom(html.slice(0, 50000)) };
  } catch {
    /* continue */
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

const products = JSON.parse(fs.readFileSync(outJson, "utf8"));
const targets = products
  .map((p, index) => ({ p, index }))
  .filter(({ p }) => isWave4(p));

console.log(`Wave4 products: ${targets.length}`);

let filled = 0;
let skipped = 0;
await mapPool(targets, 10, async ({ p, index }) => {
  const got = await resolve(p);
  if (got?.ingredients?.length) {
    products[index].ingredients = got.ingredients;
    if (!p.freeFrom?.length && got.freeFrom?.length) products[index].freeFrom = got.freeFrom;
    if (p.category === "skincare" && /deodor|family pack/i.test(p.name)) {
      products[index].category = "deodorant";
    }
    filled++;
  } else {
    skipped++;
  }
  if ((filled + skipped) % 20 === 0) {
    process.stdout.write(`\rfilled=${filled} skipped=${skipped}   `);
  }
});

fs.writeFileSync(outJson, JSON.stringify(products, null, 2));
const wave = products.filter(isWave4);
const withIng = wave.filter((p) => p.ingredients?.length);
console.log(`\nDone filled=${filled} skipped=${skipped} coverage=${withIng.length}/${wave.length}`);
