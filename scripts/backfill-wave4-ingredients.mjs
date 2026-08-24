/**
 * Drop merch from wave4 and backfill missing ingredients from product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 460;
const WAVE_END = 480;
const CONCURRENCY = 12;

const MERCH =
  /\b(stuffed toy|plush|crew socks|socks\b|head wrap|tote bag|t-?shirt|tee\b|hoodie|sweatshirt|beanie|sticker pack|sticker\b|mug\b|apparel|poster|patch\b|keychain|book\b|journal\b|candle holder|gift card|e[- ]?gift)\b/i;

function isWave4(p) {
  const n = Number(String(p.brandId).replace(/^c/, ""));
  return n >= WAVE_START && n <= WAVE_END;
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
  const cleaned = chunk.replace(/\s+/g, " ").replace(/\*\*/g, "").trim();
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
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|organic/i.test(raw)) {
    return true;
  }
  return parts.length >= 4 && /,/.test(raw);
}

function extractIngredients(html) {
  if (!html) return [];
  const viewAll = html.match(
    /(?:view\s+all\s+ingredients|full\s+ingredients?(?:\s+list)?|all\s+ingredients|inci\s*list|complete\s+ingredients?|ingredients we love)[\s\S]{0,160}?<p[^>]*>([\s\S]{20,5000}?)<\/p>/i,
  );
  if (viewAll) {
    const raw = stripHtml(viewAll[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const text = stripHtml(html);
  const mm = text.match(
    /(?:full\s+)?(?:ingredients?|inci(?:\s+list)?|composition|what's in it|whats in it|supplement facts)\s*[:\-–]\s*([\s\S]{12,4000}?)(?=(?:\b(?:directions|how to use|how to apply|warnings?|caution|free from|what'?s not|storage|shelf life|for external|suggested use|usage|application|benefits|disclaimer|nutrition facts|other information|manufactured)\b|$))/i,
  );
  if (mm) {
    const raw = mm[1].trim();
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const inci = text.match(
    /\b(?:Aqua|Water|Eau|Organic)\b[^.]{0,40}(?:,\s*[A-Za-z0-9][^,]{1,100}){4,60}/i,
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
    [/fragrance[- ]free|unscented/, "Fragrance"],
    [/cruelty[- ]free|not tested on animals/, "Animal testing"],
    [/silicone[- ]free/, "Silicones"],
    [/phthalate[- ]free/, "Phthalates"],
    [/fluoride[- ]free/, "Fluoride"],
    [/vegan/, "Animal products"],
    [/gluten[- ]free/, "Gluten"],
    [/dairy[- ]free/, "Dairy"],
    [/artificial (color|colour|dye)s?[- ]free|no artificial (color|colour|dye)/, "Artificial dyes"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 6);
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

async function fillOne(product) {
  const url = (product.affiliateUrl || "").replace(/\/$/, "");
  if (!url) return null;
  try {
    const jsonText = await fetchText(`${url}.json`, 10000);
    if (jsonText.trimStart().startsWith("{")) {
      const j = JSON.parse(jsonText);
      const body = j.product?.body_html || "";
      const parts = extractIngredients(body);
      if (parts.length) return { ingredients: parts, freeFrom: inferFreeFrom(body) };
    }
  } catch {
    /* continue */
  }
  try {
    const html = await fetchText(url, 16000);
    const parts = extractIngredients(html);
    if (parts.length) return { ingredients: parts, freeFrom: inferFreeFrom(html.slice(0, 40000)) };
  } catch {
    /* ignore */
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
const before = products.length;
const cleaned = products.filter((p) => !isWave4(p) || !MERCH.test(p.name));
const dropped = before - cleaned.length;

const needs = cleaned
  .map((p, index) => ({ p, index }))
  .filter(({ p }) => isWave4(p) && (!p.ingredients || p.ingredients.length === 0) && p.affiliateUrl);

console.log(`wave4 merch dropped ${dropped}; backfilling ${needs.length} products`);

let filled = 0;
let failed = 0;
await mapPool(needs, CONCURRENCY, async ({ p, index }, i) => {
  const got = await fillOne(p);
  if (got?.ingredients?.length) {
    cleaned[index].ingredients = got.ingredients;
    if (!cleaned[index].freeFrom?.length) cleaned[index].freeFrom = got.freeFrom;
    filled++;
  } else {
    failed++;
  }
  if ((i + 1) % 40 === 0 || i + 1 === needs.length) {
    process.stdout.write(`\rbackfill ${i + 1}/${needs.length} filled=${filled} miss=${failed}   `);
  }
});

fs.writeFileSync(outJson, JSON.stringify(cleaned, null, 2));

const wave = cleaned.filter(isWave4);
const withIng = wave.filter((p) => p.ingredients?.length > 0).length;
const manifest = {
  generatedAt: new Date().toISOString(),
  merchDropped: dropped,
  wave4Products: wave.length,
  withIngredients: withIng,
  backfillFilled: filled,
  backfillMissed: failed,
};
fs.writeFileSync(path.join(root, "data/wave4-ingredients-backfill.json"), JSON.stringify(manifest, null, 2));
console.log(`\nDone wave4=${wave.length} withIngredients=${withIng} filled=${filled} missed=${failed}`);
