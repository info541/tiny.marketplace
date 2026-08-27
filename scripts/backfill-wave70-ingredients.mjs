/**
 * Drop leftover merch from wave70 and backfill missing ingredients from product pages.
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

const WAVE_START = 1289;
const WAVE_END = 1294;

const EXTRA_DROP =
  /\b(gift card|e-gift|bundle|duo\b|trio\b|2 pack|3 pack|mix\s*&?\s*match|shipping protection|everything but|chewies|ortho wax|tinted\s*lip|lip serum|t-shirt|tote|bug spray|body spray|survival kit)\b/i;

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
  return /\b(how to (use|apply)|directions?|why (we|our|tallow)|add to cart|subscription|if you haven'?t tried|shipping|refund|free from|does not make any medical|this product is not intended|let it dissolve|swish for|easy to use daily|sip it|we prioritize clean|upgrade your daily|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family|simple, natural ingredients|ingredients are always)\b/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 24) return false;
  if (parts.length >= 5) return true;
  if (
    parts.length >= 3 &&
    /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|alcohol|honey|jojoba/i.test(
      raw,
    )
  ) {
    return true;
  }
  if (parts.length >= 2 && /tallow|oil|wax|butter|zinc|beeswax|xylitol|hydroxyapatite|alcohol/i.test(raw) && /,/.test(raw)) {
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
      /\b(product (benefits?|highlights?)|perfect for|elevate your|take your|from farm to formula|process\/ethos|scent family|how to|directions?|q:|note:|we recommend|best for:|reconnect with|love & gratitude|disclaimer|no added sugar|safety information|keep out of reach|for external use|zero sugar|designed to align|just clean hydration|this product is not intended|consult with your healthcare|not been evaluated)\b/i.test(
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
    test: (p) => p.brandId === "c1292" && /sun cream|mineral sun/i.test(p.name),
    ingredients: [
      "USDA Organic Grass-Fed Tallow",
      "USDA Organic Cold-Pressed Jojoba Oil",
      "Locally Sourced Beeswax",
      "Distilled Water",
      "Non-Nano Zinc Oxide",
      "Geogard ECT",
      "USDA Organic Sunflower Lecithin (Cold-Pressed)",
      "Vanilla Essential Oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1292" && /cloud moisturizer|original balm|body butter|pocket tallow/i.test(p.name),
    ingredients: [
      "USDA Organic 100% Grass-Fed & Finished Tallow",
      "USDA Certified Organic Cold-Pressed Jojoba Oil",
      "USDA Certified Organic Extra Virgin Olive Oil",
      "Pure Mango Butter",
      "Locally Sourced Raw Honey",
      "Locally Sourced Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1292" && /tallow guard/i.test(p.name),
    ingredients: [
      "Locally sourced bee propolis",
      "USDA Organic 100% grass-fed & finished tallow",
      "Local beeswax",
      "USDA Organic cold-pressed jojoba oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /deodorant/i.test(p.name),
    ingredients: [
      "Grass-fed and finished beef tallow",
      "Organic coconut oil",
      "MCT oil",
      "Magnesium hydroxide",
      "Baking soda",
      "Arrowroot powder",
      "Tapioca flour",
      "Coconut-activated charcoal",
      "Beeswax",
      "Raw unrefined shea butter",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /sungaze/i.test(p.name),
    ingredients: [
      "Grass-fed and finished tallow",
      "Non-nano zinc oxide",
      "Raw unrefined shea butter",
      "Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /toothpaste/i.test(p.name),
    ingredients: [
      "Calcium Carbonate",
      "Organic Bentonite Clay",
      "Baking Soda",
      "Organic Cold-Pressed Unrefined Coconut Oil",
      "Organic MCT Oil",
      "Organic Ground Cloves",
      "Organic Ceylon Cinnamon Powder",
      "Organic Coconut-Activated Charcoal",
      "Organic Monk Fruit Powder",
      "Organic Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /mouthwash/i.test(p.name),
    ingredients: [
      "Organic Aloe Vera Juice",
      "Organic MCT Oil (Coconut)",
      "Organic Monk Fruit Powder",
      "Organic Clove Oil",
      "Pure Bee Propolis (Alcohol-Free)",
      "Magnesium Hydroxide",
      "Sodium Bicarbonate",
      "Organic Steam-Distilled Peppermint Oil",
      "Organic Steam-Distilled Spearmint Oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /tooth powder/i.test(p.name),
    ingredients: [
      "Bentonite clay",
      "Activated charcoal",
      "Calcium carbonate",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /hair juice/i.test(p.name),
    ingredients: [
      "Organic Cold-Pressed Unrefined Argan Oil",
      "Organic Cold-Pressed Unrefined Jojoba Oil",
      "Organic Cold-Pressed Unrefined Rosehip Oil",
      "Organic MCT Oil",
      "Organic Cold-Pressed Unrefined Castor Oil",
      "Organic Steam-Distilled Cypress",
      "Organic Steam-Distilled Cedarwood",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /original tallow/i.test(p.name),
    ingredients: [
      "Grass-Fed, Finished Tallow",
      "Cold-Pressed Unrefined Olive Oil",
      "Raw Unfiltered Florida Honey",
      "Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /dead sea magnesium & aloe/i.test(p.name),
    ingredients: [
      "Magnesium Chloride USP (Dead Sea–derived) (80%)",
      "Organic Aloe Vera Juice (20%)",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /dead sea magnesium tallow/i.test(p.name),
    ingredients: [
      "Grass-Fed, Finished Tallow",
      "Magnesium Chloride USP (Derived from the Dead Sea)",
      "Manuka Honey (Glyphosate-Free)",
      "Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /face & body tallow soap/i.test(p.name),
    ingredients: [
      "Grass-Fed and Finished Beef Tallow",
      "Cold-Pressed Olive Oil",
      "Cold-Pressed Coconut Oil",
      "Cold-Pressed Castor Oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /tallow face & body cream/i.test(p.name),
    ingredients: [
      "Grass-Fed, Finished Tallow",
      "Raw Unrefined Mango Butter",
      "Cold-Pressed Unrefined Jojoba Oil",
      "Beeswax",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /pumpkin spice tallow/i.test(p.name),
    ingredients: [
      "Grass-Fed, Finished Tallow",
      "Raw Unrefined Shea Butter",
      "Raw Unrefined Kokum Butter",
      "Raw Unfiltered Florida Honey",
      "Cold-Pressed Unrefined Jojoba Oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /body powder/i.test(p.name),
    ingredients: [
      "Organic Kaolin Clay (Cosmetic Grade)",
      "Non-Nano Zinc Oxide (Uncoated, USP)",
    ],
  },
  {
    test: (p) => p.brandId === "c1293" && /restorative tallow/i.test(p.name),
    ingredients: [
      "Grass-fed, grass-finished tallow",
      "Cold-pressed jojoba oil",
    ],
  },
  {
    test: (p) => p.brandId === "c1291" && /^maca powder$/i.test(p.name),
    ingredients: ["Organic maca root (Lepidium meyenii)"],
  },
  {
    test: (p) => p.brandId === "c1291" && /chlorella/i.test(p.name),
    ingredients: ["Chlorella pyrenoidosa"],
  },
  {
    test: (p) => p.brandId === "c1294" && /alcohol-free/i.test(p.name),
    ingredients: [
      "Organic Lion's Mane Mushroom Extract",
      "Organic Vegetable Glycerin",
      "Purified Water",
      "Wild Flower Honey",
    ],
  },
  {
    test: (p) => p.brandId === "c1294" && /lion.?s mane/i.test(p.name) && !/alcohol-free/i.test(p.name),
    ingredients: [
      "Organic Lion's Mane Mushroom (Hericium erinaceus) Fruiting Body",
      "Organic Cane Alcohol",
      "Purified Water",
    ],
  },
  {
    test: (p) => p.brandId === "c1294" && /turkey tail/i.test(p.name),
    ingredients: [
      "Organic Turkey Tail Mushroom (Trametes versicolor) Fruiting Body",
      "Organic Cane Alcohol",
      "Purified Water",
    ],
  },
  {
    test: (p) => p.brandId === "c1294" && /cordyceps/i.test(p.name),
    ingredients: [
      "Organic Cordyceps militaris Fruiting Body",
      "Organic Cane Alcohol",
      "Purified Water",
    ],
  },
  {
    test: (p) => p.brandId === "c1294" && /reishi/i.test(p.name),
    ingredients: [
      "Organic Reishi Mushroom (Ganoderma lucidum) Fruiting Body",
      "Organic Cane Alcohol",
      "Purified Water",
    ],
  },
  {
    test: (p) => p.brandId === "c1294" && /shiitake/i.test(p.name),
    ingredients: [
      "Organic Shiitake Mushroom Fruiting Body",
      "Organic Cane Alcohol",
      "Purified Water",
    ],
  },
  {
    test: (p) => p.brandId === "c1294" && /maitake/i.test(p.name),
    ingredients: [
      "Organic Maitake Mushroom Fruiting Body",
      "Organic Cane Alcohol",
      "Purified Water",
    ],
  },
];

const products = JSON.parse(fs.readFileSync(outJson, "utf8"));
const kept = [];
let dropped = 0;
let filled = 0;
const perBrand = {};
const seenToothbrush = new Set();

for (const p of products) {
  if (!isWave(p)) {
    kept.push(p);
    continue;
  }
  if (EXTRA_DROP.test(p.name)) {
    dropped += 1;
    continue;
  }
  if (/manual toothbrush — pink/i.test(p.name)) {
    dropped += 1;
    continue;
  }
  if (/manual toothbrush — blue/i.test(p.name)) {
    p.name = "Manual Toothbrush";
    if (seenToothbrush.has(p.brandId)) {
      dropped += 1;
      continue;
    }
    seenToothbrush.add(p.brandId);
  }
  if (/mineral sun cream/i.test(p.name)) {
    p.name = "Mineral Sun Cream";
    p.badge = "Mineral";
  }
  p.name = p.name.replace(/^\*NEW\*\s*/i, "");

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
  path.join(root, "data/wave70-ingredients-backfill.json"),
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
