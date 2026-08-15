import fs from "node:fs";

const queue = JSON.parse(fs.readFileSync("data/wave3-probe-queue.json", "utf8"));
const priorHits = JSON.parse(fs.readFileSync("data/wave3-probe-hits.json", "utf8"));
const existing = new Set(
  JSON.parse(fs.readFileSync("data/existing-brand-domains.json")).map((d) =>
    d.toLowerCase().replace(/^www\./, ""),
  ),
);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CAT_RULES = [
  ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock)\b/i],
  ["deodorant", /\b(deodor\w*|antiperspir\w*|underarm|\bdeo\b)\b/i],
  ["oral", /\b(toothpaste|toothbrush|oral care|floss|mouthwash|teeth whit)\b/i],
  ["hair", /\b(shampoo|conditioner|hair\b|scalp|curl cream|hair oil|hair mask|leave-?in)\b/i],
  ["protein", /\b(protein powder|whey|casein|protein bar|collagen peptides)\b/i],
  ["electrolytes", /\b(electrolyte|hydration stick|rehydrat|sports drink)\b/i],
  [
    "supplements",
    /\b(vitamin|dietary supplement|capsule|softgel|mushroom powder|adaptogen|probiotic|greens powder)\b/i,
  ],
  [
    "skincare",
    /\b(serum|moisturizer|cleanser|face cream|toner|facial|retin|niacinamide|hyaluronic|skincare)\b/i,
  ],
];

const ALLOWED = new Set(CAT_RULES.map(([c]) => c));

function inferCategories(products) {
  const counts = Object.fromEntries([...ALLOWED].map((k) => [k, 0]));
  for (const p of products.slice(0, 60)) {
    const hay = `${p.title || ""} ${p.product_type || ""} ${(p.tags || []).join(" ")}`;
    for (const [cat, re] of CAT_RULES) if (re.test(hay)) counts[cat]++;
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c)
    .slice(0, 2);
}

async function probeOne(c) {
  const bases = [`https://${c.domain}`, `https://www.${c.domain}`];
  for (const base of [...new Set(bases)]) {
    try {
      const res = await fetch(`${base}/products.json?limit=50`, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trimStart().startsWith("{")) continue;
      const products = JSON.parse(text).products || [];
      if (products.length < 3) continue;
      const cats = inferCategories(products);
      if (!cats.length) continue; // not our marketplace categories
      const withImg = products.filter((p) => p.images?.[0]?.src || p.image?.src);
      if (withImg.length < 2) continue;
      return {
        name: c.name,
        domain: c.domain,
        shopBase: base,
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
  const out = new Array(items.length);
  let i = 0;
  let hits = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
        if (out[idx]) hits++;
        if ((idx + 1) % 100 === 0 || idx + 1 === items.length) {
          process.stdout.write(`\rprobed ${idx + 1}/${items.length} categoryHits=${hits}   `);
        }
      }
    }),
  );
  return out.filter(Boolean);
}

console.log("queue", queue.length);
const newHits = await mapPool(queue, 32, probeOne);
console.log("\nnew category hits", newHits.length);

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
console.log("total unique usable", all.length);
const by = {};
for (const h of all) for (const c of h.categories || [h.hint]) by[c] = (by[c] || 0) + 1;
console.log(by);
fs.writeFileSync("data/wave3-probe-hits.json", JSON.stringify(all, null, 2));
