/**
 * Probe wave3 candidates for Shopify products.json availability.
 * Writes data/wave3-probe-hits.json with working stores + inferred categories.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const candidates = JSON.parse(
  fs.readFileSync(path.join(root, "data/wave3-candidates.json"), "utf8"),
);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CAT_RULES = [
  ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sun\s?care|uv\b|sunblock)\b/i],
  ["deodorant", /\b(deodor\w*|antiperspir\w*|underarm|\bdeo\b)\b/i],
  ["oral", /\b(toothpaste|toothbrush|oral|floss|mouthwash|whitening strips|teeth)\b/i],
  ["hair", /\b(shampoo|conditioner|hair\b|scalp|curl|leave-?in|hair oil|hair mask)\b/i],
  [
    "protein",
    /\b(protein|whey|casein|collagen powder|protein powder|protein bar)\b/i,
  ],
  [
    "electrolytes",
    /\b(electrolyte|hydration|rehydrat|sports drink|lmnt|nuun)\b/i,
  ],
  [
    "supplements",
    /\b(vitamin|supplement|capsule|softgel|gummy|mushroom|adaptogen|probiotic|greens?\b|superfood)\b/i,
  ],
  [
    "skincare",
    /\b(serum|moisturizer|cleanser|cream|toner|mask|skincare|facial|retin|niacinamide|hyaluronic)\b/i,
  ],
];

function inferCategories(products, hint) {
  const counts = Object.fromEntries(
    [
      "sunscreen",
      "deodorant",
      "oral",
      "hair",
      "protein",
      "electrolytes",
      "supplements",
      "skincare",
    ].map((k) => [k, 0]),
  );
  for (const p of products.slice(0, 80)) {
    const hay = `${p.title || ""} ${p.product_type || ""} ${(p.tags || []).join(" ")}`;
    for (const [cat, re] of CAT_RULES) {
      if (re.test(hay)) counts[cat]++;
    }
  }
  const ranked = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return [hint || "skincare"];
  const cats = ranked.slice(0, 2).map(([c]) => c);
  if (hint && !cats.includes(hint) && (counts[hint] || 0) >= 1) {
    cats.push(hint);
  }
  return [...new Set(cats)].slice(0, 2);
}

function slugify(name, domain) {
  const base = (name || domain.split(".")[0])
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || domain.split(".")[0];
}

async function probeOne(c) {
  const bases = [
    `https://${c.domain}`,
    `https://www.${c.domain.replace(/^(www\.)/, "")}`,
  ];
  // unique bases
  const tried = new Set();
  for (const base of bases) {
    const key = base.replace(/\/$/, "");
    if (tried.has(key)) continue;
    tried.add(key);
    try {
      const res = await fetch(`${key}/products.json?limit=50`, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trimStart().startsWith("{")) continue;
      const data = JSON.parse(text);
      const products = data.products || [];
      if (products.length < 2) continue;
      const withImages = products.filter((p) => p.images?.[0]?.src || p.image?.src);
      if (withImages.length < 2) continue;
      return {
        name: c.name,
        domain: c.domain,
        shopBase: key,
        hint: c.hint,
        productCount: products.length,
        categories: inferCategories(products, c.hint),
        sample: products.slice(0, 3).map((p) => p.title),
      };
    } catch {
      // try next
    }
  }
  return null;
}

async function mapPool(items, concurrency, fn) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
      if ((idx + 1) % 50 === 0 || idx + 1 === items.length) {
        process.stdout.write(`\rprobed ${idx + 1}/${items.length} hits=${results.filter(Boolean).length}   `);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

const hits = (await mapPool(candidates, 24, probeOne)).filter(Boolean);
console.log(`\nHits: ${hits.length}`);

// Dedupe by shop host
const byHost = new Map();
for (const h of hits) {
  let host;
  try {
    host = new URL(h.shopBase).hostname.replace(/^www\./, "");
  } catch {
    host = h.domain;
  }
  if (!byHost.has(host)) byHost.set(host, h);
}
const unique = [...byHost.values()];
console.log("Unique hosts:", unique.length);

fs.writeFileSync(
  path.join(root, "data/wave3-probe-hits.json"),
  JSON.stringify(unique, null, 2),
);
