/**
 * Drop leftover merch from wave72 and backfill missing ingredients from product pages.
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

const WAVE_START = 1301;
const WAVE_END = 1306;

const EXTRA_DROP =
  /\b(gift card|e-gift|bundle|duo\b|duet\b|trio\b|2 pack|3 pack|4 pack|ritual\b|ebook|directory|room spray|sunglasses|branded hat|sample pack|variety|assorted|gua sha|diy body|ingredient & supplier|bundle and save)\b/i;

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
  return /\b(how to (use|apply)|directions?|why (we|our|tallow|you.?ll)|add to cart|subscription|if you haven'?t tried|shipping|refund|free from|does not make any medical|this product is not intended|let it dissolve|swish for|easy to use daily|sip it|we prioritize clean|upgrade your daily|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family|simple, natural ingredients|ingredients are always|naturally strengthen|why you.?ll love)\b/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 24) return false;
  if (parts.length >= 5) return true;
  if (
    parts.length >= 3 &&
    /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|alcohol|honey|jojoba|goat milk|creatine|whey/i.test(
      raw,
    )
  ) {
    return true;
  }
  if (parts.length >= 2 && /tallow|oil|wax|butter|zinc|beeswax|xylitol|hydroxyapatite|alcohol|goat milk|whey/i.test(raw) && /,/.test(raw)) {
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
      /\b(product (benefits?|highlights?)|perfect for|elevate your|take your|from farm to formula|process\/ethos|scent family|how to|directions?|q:|note:|we recommend|best for:|reconnect with|love & gratitude|disclaimer|no added sugar|safety information|keep out of reach|for external use|zero sugar|designed to align|just clean hydration|this product is not intended|consult with your healthcare|not been evaluated|available blends|why you.?ll love)\b/i.test(
        s,
      )
    ) {
      break;
    }
    if (s.length > 90) continue;
    if (/^beef tallow$/i.test(s) && clean.some((c) => /^beef tallow$/i.test(c))) break;
    if (
      /\b(cleanse|nurture|highlights|benefits|routine|skincare|creamy lather|daily shower|refreshing cleanse|silky glide|treat|cure|prevent any disease)\b/i.test(
        s,
      ) &&
      !/oil|butter|tallow|clay|wax|extract|oxide|acid|salt|magnesium|glycerin|hydroxyapatite|xylitol|beeswax|shea|goat milk|whey/i.test(
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

function extractIngredients(html) {
  if (!html) return [];
  const text = stripHtml(html);
  const markers = [
    /inactive ingredients?:\s*([^\n]{12,1500})/i,
    /ingredients?\s*list:\s*([^\n]{12,1500})/i,
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
  const inci = text.match(
    /\b(?:Aqua|Water|Eau)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9*][^,]{1,100}){5,60}/i,
  );
  if (inci) {
    const parts = parseList(inci[0].replace(/\*/g, ""));
    if (parts.length >= 5 && parts.length >= best.length) best = parts;
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
    test: (p) => p.brandId === "c1304" && /sun haven/i.test(p.name),
    ingredients: [
      "Non-nano zinc oxide (20%)",
      "Grass-fed grass-finished tallow",
      "Organic shea butter",
      "Organic beeswax",
      "Organic raspberry seed oil",
      "Organic coconut oil",
      "Organic calendula",
      "Vitamin E",
    ],
  },
  {
    test: (p) => p.brandId === "c1305",
    ingredients: [
      "100% grass-fed beef suet tallow",
      "Organic jojoba oil",
      "Organic sweet almond oil",
      "Frankincense essential oil",
      "Raw wild honey",
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
  if (EXTRA_DROP.test(p.name)) {
    dropped += 1;
    continue;
  }
  if (p.brandId === "c1303" && /\s+&\s+/.test(p.name)) {
    dropped += 1;
    continue;
  }
  p.name = p.name.replace(/^\*NEW\*\s*/i, "").replace(/\.+$/, "");

  const brandKey = p.brandId;
  perBrand[brandKey] = perBrand[brandKey] || { filled: 0, empty: 0 };
  if (p.ingredients?.length) {
    p.ingredients = sanitizeIngredients(p.ingredients);
  }
  const published = PUBLISHED.find((row) => row.test(p));
  if (published) {
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
  path.join(root, "data/wave72-ingredients-backfill.json"),
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
