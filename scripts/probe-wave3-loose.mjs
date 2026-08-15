/**
 * Second-pass probe with looser category matching to fill toward 1000 brands.
 * Reuses queue domains not already in hits.
 */
import fs from "node:fs";

const existing = new Set(
  JSON.parse(fs.readFileSync("data/existing-brand-domains.json")).map((d) =>
    d.toLowerCase().replace(/^www\./, ""),
  ),
);
const priorHits = JSON.parse(fs.readFileSync("data/wave3-probe-hits.json", "utf8"));
const hitHosts = new Set();
for (const h of priorHits) {
  try {
    hitHosts.add(new URL(h.shopBase).hostname.replace(/^www\./, ""));
  } catch {
    hitHosts.add(h.domain);
  }
  hitHosts.add(h.domain.replace(/^www\./, ""));
}

const queue = JSON.parse(fs.readFileSync("data/wave3-probe-queue.json", "utf8")).filter((c) => {
  const d = c.domain.replace(/^www\./, "");
  return !existing.has(d) && !hitHosts.has(d);
});

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CAT_RULES = [
  ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|uv protection|sun lotion)\b/i],
  ["deodorant", /\b(deodor\w*|antiperspir\w*|underarm|\bdeo\b|pit paste)\b/i],
  ["oral", /\b(toothpaste|toothbrush|oral care|dental floss|mouthwash|teeth whit|tooth powder)\b/i],
  [
    "hair",
    /\b(shampoo|conditioner|hair\b|scalp|curl|leave-?in|hair oil|hair mask|beard oil|beard balm|pomade|hair dye|bleach powder)\b/i,
  ],
  ["protein", /\b(protein powder|whey protein|casein|protein bar|collagen peptides|plant protein)\b/i],
  ["electrolytes", /\b(electrolyte|hydration mix|rehydrat|sports drink|oral rehydration)\b/i],
  [
    "supplements",
    /\b(vitamin|supplement|capsule|softgel|gummy vitamin|mushroom|adaptogen|probiotic|greens powder|nootropic|wellness powder)\b/i,
  ],
  [
    "skincare",
    /\b(serum|moisturizer|cleanser|cream|toner|mask|facial|retin|niacinamide|hyaluronic|skincare|body lotion|body butter|body oil|lip balm|lip gloss|foundation|concealer|mascara|eyeliner|blush|highlighter|perfume|fragrance|eau de|body wash|shower gel|soap bar|face oil|eye cream|primer|setting spray|makeup|cosmetic)\b/i,
  ],
];

function inferCategories(products) {
  const counts = Object.fromEntries(CAT_RULES.map(([c]) => [c, 0]));
  for (const p of products.slice(0, 80)) {
    const hay = `${p.title || ""} ${p.product_type || ""} ${(p.tags || []).join(" ")}`;
    for (const [cat, re] of CAT_RULES) if (re.test(hay)) counts[cat]++;
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c)
    .slice(0, 2);
}

async function probeOne(c) {
  for (const base of [`https://${c.domain}`, `https://www.${c.domain}`]) {
    try {
      const res = await fetch(`${base}/products.json?limit=50`, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        redirect: "follow",
        signal: AbortSignal.timeout(7000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trimStart().startsWith("{")) continue;
      const products = JSON.parse(text).products || [];
      if (products.length < 2) continue;
      const cats = inferCategories(products);
      if (!cats.length) continue;
      const withImg = products.filter((p) => p.images?.[0]?.src || p.image?.src);
      if (withImg.length < 1) continue;
      return {
        name: c.name,
        domain: c.domain,
        shopBase: base.replace(/\/$/, ""),
        hint: c.hint,
        categories: cats,
        productCount: products.length,
        sample: products.slice(0, 2).map((p) => p.title),
      };
    } catch {
      /* next */
    }
  }
  return null;
}

async function mapPool(items, concurrency, fn) {
  const out = [];
  let i = 0;
  let hits = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (i < items.length) {
        const idx = i++;
        const r = await fn(items[idx]);
        if (r) {
          out.push(r);
          hits++;
        }
        if ((idx + 1) % 150 === 0 || idx + 1 === items.length) {
          process.stdout.write(`\rloose-probed ${idx + 1}/${items.length} hits=${hits}   `);
        }
      }
    }),
  );
  return out;
}

console.log("remaining queue", queue.length);
const newHits = await mapPool(queue, 40, probeOne);
console.log("\nloose new hits", newHits.length);

const byHost = new Map();
for (const h of [...priorHits, ...newHits]) {
  let host;
  try {
    host = new URL(h.shopBase).hostname.replace(/^www\./, "");
  } catch {
    host = h.domain;
  }
  if (existing.has(host) || existing.has(h.domain)) continue;
  if (!byHost.has(host)) byHost.set(host, h);
}
const all = [...byHost.values()];
console.log("total unique", all.length);
fs.writeFileSync("data/wave3-probe-hits.json", JSON.stringify(all, null, 2));
const by = {};
for (const h of all) for (const c of h.categories || []) by[c] = (by[c] || 0) + 1;
console.log(by);
