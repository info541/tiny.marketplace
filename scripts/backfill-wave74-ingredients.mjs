/**
 * Backfill missing wave74 ingredients from live product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1313;
const WAVE_END = 1318;

function isWave(p) {
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
        !/^(and|or|with|contains|including|ingredients?|directions?|how to|warning|free from|what'?s not)$/i.test(
          s,
        ) &&
        !/^https?:/i.test(s),
    );
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeMarketing(raw) {
  return /\b(how to (use|apply)|directions?|why (we|our|tallow|you.?ll)|add to cart|subscription|shipping|refund|free from|does not make any medical|this product is not intended|easy to use daily|sip it|we prioritize clean|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family|simple, natural ingredients|why you.?ll love|clean\. powerful\. proven|no sugar\. no fillers|read more|was this helpful|how many sticks|users report|customers report|safe for (facial|sensitive)|outperforming|ingredients with a purpose|use before or after|first thing in the morning|apply a thin layer|reapply up to|nutritional information|food supplements should|add a pea-sized|don'?t forget to brush)\b/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 32) return false;
  if (parts.length >= 5) return true;
  if (
    parts.length >= 3 &&
    /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|alcohol|honey|jojoba|goat milk|creatine|whey|theobromine|sorbitol|silica/i.test(
      raw,
    )
  ) {
    return true;
  }
  if (
    parts.length >= 2 &&
    /tallow|oil|wax|butter|zinc|beeswax|xylitol|hydroxyapatite|alcohol|goat milk|whey/i.test(raw) &&
    /,/.test(raw)
  ) {
    return true;
  }
  return parts.length >= 4;
}

function sanitizeIngredients(parts) {
  if (!parts?.length) return [];
  const clean = [];
  for (const part of parts) {
    const s = String(part || "").trim();
    if (!s) continue;
    if (
      /\b(product (benefits?|highlights?)|perfect for|elevate your|from farm to formula|how to|directions?|q:|note:|best for:|disclaimer|safety information|keep out of reach|for external use|this product has not been evaluated|available blends|why you.?ll love|add a pea-sized|brush twice)\b/i.test(
        s,
      )
    ) {
      break;
    }
    if (s.length > 90) continue;
    clean.push(s);
  }
  if (!looksLikeInci(clean, clean.join(", "))) return [];
  return clean;
}

function extractIngredients(html) {
  if (!html) return [];
  const text = stripHtml(html);
  const markers = [
    /inactive ingredients?:\s*([^\n]{12,2000})/i,
    /ingredients?\s*list:\s*([^\n]{12,2000})/i,
    /(?:full\s+)?ingredients?\s*[:\-–]\s*([^\n]{12,2000})/i,
    /ingredients?\s+(?=glycerin|water|aqua|cocos|sodium|goat milk|sorbitol|jojoba)([^\n]{12,2000})/i,
    /key ingredients?:\s*([^\n]{12,2000})/i,
  ];
  let best = [];
  for (const re of markers) {
    const m = text.match(re);
    if (!m) continue;
    let raw = m[1];
    raw = raw.split(
      /(?:nutritional information|directions?|how to (?:use|apply)|reviews?|add to cart|best for|made in usa|customers also|you may also|food supplements should|this product is not intended|add a pea-sized)/i,
    )[0];
    if (looksLikeMarketing(raw)) continue;
    const parts = parseList(raw).slice(0, 28);
    if (looksLikeInci(parts, raw) && parts.length >= best.length) best = parts;
  }
  const inci = text.match(
    /\b(?:Aqua|Water|Eau|Glycerin|Sorbitol|Cocos Nucifera|Jojoba)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9*][^,]{1,100}){4,60}/i,
  );
  if (inci) {
    const parts = parseList(inci[0].replace(/\*/g, ""));
    if (parts.length >= 5 && parts.length >= best.length) best = parts;
  }
  return sanitizeIngredients(best);
}

function fetchPage(url) {
  try {
    return execFileSync("curl", ["-sS", "-L", "-A", UA, "--max-time", "20", url], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch {
    return "";
  }
}

const PUBLISHED = [
  {
    test: (p) => p.brandId === "c1316" && /helios/i.test(p.name),
    ingredients: [
      "Jojoba oil (Simmondsia chinensis)",
      "Shea butter (Butyrospermum Parkii)",
      "Beeswax (Cera alba)",
      "Cocoa butter (Theobroma cacao)",
      "Non-nano zinc oxide",
      "Cocoa powder",
      "Chamomile essential oil (Anthemis nobilis)",
      "Vitamin E (alpha-tocopherol)",
    ],
  },
  {
    test: (p) => p.brandId === "c1315",
    ingredients: ["Grass-Fed Whey Protein Isolate", "Sunflower Lecithin"],
  },
  {
    test: (p) => p.brandId === "c1318" && /tincture/i.test(p.name),
    ingredients: ["Fruiting-body extract", "Cane alcohol", "Water"],
  },
];

const products = JSON.parse(fs.readFileSync(outJson, "utf8"));
let filled = 0;
let scraped = 0;
let cleared = 0;
const report = [];
const pageCache = new Map();

for (const p of products) {
  if (!isWave(p)) continue;
  if (p.ingredients?.length && looksLikeMarketing(p.ingredients.join(", "))) {
    p.ingredients = [];
    cleared += 1;
  }
  if (p.ingredients?.length) continue;
  const published = PUBLISHED.find((row) => row.test(p));
  if (published) {
    p.ingredients = published.ingredients;
    filled += 1;
    report.push({ slug: p.slug, source: "published", n: p.ingredients.length });
    continue;
  }
  if (!p.affiliateUrl) continue;
  let html = pageCache.get(p.affiliateUrl);
  if (html === undefined) {
    html = fetchPage(p.affiliateUrl);
    pageCache.set(p.affiliateUrl, html);
  }
  const parts = extractIngredients(html);
  if (parts.length) {
    p.ingredients = parts;
    scraped += 1;
    report.push({ slug: p.slug, source: "page", n: parts.length });
  }
}

function cleanStored(parts) {
  if (!parts?.length) return [];
  const out = [];
  for (const part of parts) {
    const s = String(part || "").trim();
    if (!s) continue;
    if (
      /\b(about zechstein|read more|it glides|leaves the under-eye|how to use|denotes an organic|apply a|add a pea|brush twice|directions?:|loofah\s*$)\b/i.test(
        s,
      )
    ) {
      break;
    }
    if (s.length > 90) continue;
    out.push(s);
  }
  if (!looksLikeInci(out, out.join(", "))) return [];
  return out;
}

for (const p of products) {
  if (!isWave(p)) continue;
  p.ingredients = cleanStored(p.ingredients || []);
}

fs.writeFileSync(outJson, JSON.stringify(products, null, 2));
fs.writeFileSync(
  path.join(root, "data/wave74-ingredients-backfill.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), filled, scraped, cleared, report }, null, 2),
);
console.log("backfill filled", filled, "scraped", scraped, "cleared", cleared);
