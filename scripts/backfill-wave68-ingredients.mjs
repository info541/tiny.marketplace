/**
 * Drop leftover merch from wave68 and backfill missing ingredients from product pages.
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

const WAVE_START = 1278;
const WAVE_END = 1282;

const EXTRA_DROP =
  /\b(gift card|e-gift|bundle|duo\b|trio\b|hat\b|raw honey\b|shilajit|grocery list|leaky gut|dog toothpaste|zeeyo|soap stamp|mug\b|dish soap|cologne|bug spray|ebook|imperfect|subscription|pet soap|bath soak|stack\b|ritual stack)\b/i;

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
        !/^(and|or|with|contains|including|ingredients?|directions?|how to|warning|free from|what'?s not)$/i.test(s) &&
        !/^https?:/i.test(s),
    );
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeMarketing(raw) {
  return /\b(how to (use|apply)|directions?|why (we|our|tallow)|add to cart|subscription|if you haven'?t tried|shipping|refund|free from|does not make any medical|let it dissolve|swish for|easy to use daily|sip it|we prioritize clean|upgrade your daily|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family)\b/i.test(
    raw || "",
  );
}

function sanitizeIngredients(parts) {
  if (!parts?.length) return [];
  const clean = [];
  for (const part of parts) {
    const s = String(part || "").trim();
    if (!s) continue;
    if (
      /\b(product (benefits?|highlights?)|perfect for|elevate your|take your|from farm to formula|process\/ethos|scent family|how to|directions?|q:|note:|we recommend|best for:|reconnect with|love & gratitude)\b/i.test(
        s,
      )
    ) {
      break;
    }
    if (s.length > 90) continue;
    if (
      /\b(cleanse|nurture|highlights|benefits|routine|skincare|creamy lather|daily shower|refreshing cleanse|silky glide|airy notes)\b/i.test(
        s,
      ) &&
      !/oil|butter|tallow|clay|wax|extract|oxide|acid|salt|magnesium|glycerin|hydroxyapatite|xylitol|beeswax|shea/i.test(
        s,
      )
    ) {
      continue;
    }
    clean.push(s);
  }
  if (!looksLikeInci(clean, clean.join(", "))) return [];
  return clean;
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 24) return false;
  if (parts.length >= 5) return true;
  if (
    parts.length >= 3 &&
    /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea/i.test(
      raw,
    )
  ) {
    return true;
  }
  if (parts.length >= 2 && /tallow|oil|wax|butter|zinc|beeswax|xylitol|hydroxyapatite/i.test(raw) && /,/.test(raw)) {
    return true;
  }
  return parts.length >= 4;
}

function extractIngredients(html) {
  if (!html) return [];
  const text = stripHtml(html);
  const markers = [
    /inactive ingredients?:\s*([^\n]{12,1500})/i,
    /(?:full\s+)?ingredients?\s*[:\-–]\s*([^\n]{12,1500})/i,
    /key ingredients?:\s*([^\n]{12,1500})/i,
  ];
  let best = [];
  for (const re of markers) {
    const m = text.match(re);
    if (!m) continue;
    const raw = m[1];
    if (looksLikeMarketing(raw)) continue;
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw) && parts.length >= best.length) best = parts;
  }
  return best;
}

function fetchPage(url) {
  try {
    return execFileSync(
      "curl",
      ["-sS", "-L", "-A", UA, "--max-time", "20", url],
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    );
  } catch {
    return "";
  }
}

const PUBLISHED = [
  {
    test: (p) => p.brandId === "c1279" && /sealyte|citrus electrolyte/i.test(p.name),
    ingredients: [
      "Sodium Chloride",
      "Potassium",
      "Magnesium",
      "Solar Sea trace minerals",
      "Stevia extract",
    ],
  },
  {
    test: (p) => p.brandId === "c1278" && /floss/i.test(p.name),
    ingredients: [
      "Activated charcoal",
      "Bamboo fiber",
      "Candelilla wax",
      "Coconut oil",
      "Peppermint essential oil",
      "Spearmint essential oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1281" && /sun butter/i.test(p.name),
    ingredients: [
      "Non-nano zinc oxide",
      "Grass-fed tallow",
      "Aloe butter",
      "Carrot seed oil",
      "Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1281" && /^cedarwood & rosemary$/i.test(p.name.trim()),
    ingredients: [
      "Arrowroot Powder",
      "Kaolin Clay",
      "Bentonite Clay",
      "Magnesium Hydroxide",
      "Grass-Fed Tallow",
      "Organic Unrefined Shea Butter",
      "Jojoba Oil",
      "Cedarwood Essential Oil",
      "Rosemary Essential Oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1281" && /^powerhouse deodorant$/i.test(p.name.trim()),
    ingredients: [
      "Arrowroot Powder",
      "Kaolin Clay",
      "Bentonite Clay",
      "Magnesium Hydroxide",
      "Grass-Fed Tallow",
      "Organic Unrefined Shea Butter",
      "Jojoba Oil",
      "Lavender Essential Oil",
      "Peppermint Essential Oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1281" && /^unscented$/i.test(p.name.trim()),
    ingredients: [
      "Arrowroot Powder",
      "Kaolin Clay",
      "Bentonite Clay",
      "Magnesium Hydroxide",
      "Grass-Fed Tallow",
      "Organic Unrefined Shea Butter",
      "Jojoba Oil",
    ],
  },
];

const products = JSON.parse(fs.readFileSync(outJson, "utf8"));
const kept = [];
let dropped = 0;
let filled = 0;
const perBrand = {};

for (const p of products) {
  if (!isWave(p)) {
    kept.push(p);
    continue;
  }
  if (EXTRA_DROP.test(p.name) && !/\bsun butter\b/i.test(p.name)) {
    dropped += 1;
    continue;
  }
  const brandKey = p.brandId;
  perBrand[brandKey] = perBrand[brandKey] || { filled: 0, empty: 0 };
  if (p.ingredients?.length) {
    p.ingredients = sanitizeIngredients(p.ingredients);
  }
  const published = PUBLISHED.find((row) => row.test(p));
  if (published && !p.ingredients?.length) {
    p.ingredients = published.ingredients;
    filled += 1;
    perBrand[brandKey].filled += 1;
    kept.push(p);
    continue;
  }
  if (!p.ingredients?.length && p.affiliateUrl) {
    const html = fetchPage(p.affiliateUrl);
    const parts = sanitizeIngredients(extractIngredients(html));
    if (parts.length) {
      p.ingredients = parts;
      filled += 1;
      perBrand[brandKey].filled += 1;
    } else {
      perBrand[brandKey].empty += 1;
    }
  } else if (p.ingredients?.length) {
    perBrand[brandKey].filled += 1;
  } else {
    perBrand[brandKey].empty += 1;
  }
  kept.push(p);
}

fs.writeFileSync(outJson, JSON.stringify(kept, null, 2));
fs.writeFileSync(
  path.join(root, "data/wave68-ingredients-backfill.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      dropped,
      filled,
      waveProducts: kept.filter(isWave).length,
      withIngredients: kept.filter((p) => isWave(p) && p.ingredients?.length).length,
      perBrand,
    },
    null,
    2,
  ),
);
console.log(
  "backfill dropped",
  dropped,
  "filled",
  filled,
  "wave",
  kept.filter(isWave).length,
  "withIng",
  kept.filter((p) => isWave(p) && p.ingredients?.length).length,
);
