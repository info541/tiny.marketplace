/**
 * Probe candidate small clean brands that are not already in the catalog.
 * Checks Shopify products.json and prints keep/skip reasons.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const catalogFiles = [
  "src/lib/catalog-brands.ts",
  "src/lib/catalog-brands-batch2.ts",
  "src/lib/catalog-brands-whey.ts",
  "src/lib/catalog-brands-deo.ts",
  "src/lib/catalog-brands-wave3.ts",
  "src/lib/data.ts",
];

const existingSlugs = new Set();
const existingDomains = new Set();
for (const rel of catalogFiles) {
  const src = fs.readFileSync(path.join(root, rel), "utf8");
  for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) existingSlugs.add(m[1].toLowerCase());
  for (const m of src.matchAll(/websiteUrl:\s*"https?:\/\/(?:www\.)?([^"/]+)/g)) {
    existingDomains.add(m[1].toLowerCase());
  }
}

const CANDIDATES = [
  // Sunscreen
  { name: "Suntegrity", slug: "suntegrity", domain: "suntegrityskincare.com", categories: ["sunscreen", "skincare"], hint: "Certified organic mineral SPF" },
  { name: "Goddess Garden", slug: "goddess-garden", domain: "goddessgarden.com", categories: ["sunscreen"], hint: "Organic mineral sunscreen" },
  { name: "Kinfield", slug: "kinfield", domain: "kinfield.com", categories: ["sunscreen", "skincare"], hint: "Outdoor mineral SPF + bug care" },
  { name: "Solara Suncare", slug: "solara-suncare", domain: "solarasuncare.com", categories: ["sunscreen"], hint: "Clean mineral SPF" },
  { name: "Unsun", slug: "unsun", domain: "unsunbeauty.com", categories: ["sunscreen"], hint: "Mineral SPF for melanin-rich skin" },
  { name: "Sunslayer", slug: "sunslayer", domain: "sunslayer.com", categories: ["sunscreen"], hint: "Reef-safe mineral SPF" },
  { name: "Pretty Athletic", slug: "pretty-athletic", domain: "prettyathletic.com", categories: ["sunscreen", "skincare"], hint: "Sport mineral SPF" },
  { name: "Suntribe", slug: "suntribe", domain: "suntribe.com", categories: ["sunscreen"], hint: "Natural mineral sunscreen" },
  { name: "Raw Love", slug: "raw-love", domain: "rawlovesunscreen.com", categories: ["sunscreen"], hint: "Handmade mineral sunscreen" },
  { name: "Soleil Toujours", slug: "soleil-toujours", domain: "soleiltoujours.com", categories: ["sunscreen"], hint: "Clean organic SPF" },
  // Deodorant
  { name: "Wild", slug: "wild", domain: "wearewild.com", categories: ["deodorant"], hint: "Refillable natural deodorant" },
  { name: "By Humankind", slug: "by-humankind", domain: "byhumankind.com", categories: ["deodorant", "oral"], hint: "Refillable clean personal care" },
  { name: "Type:A", slug: "type-a", domain: "typeadeodorant.com", categories: ["deodorant"], hint: "Sensitive-skin natural deodorant" },
  { name: "Nuud", slug: "nuud", domain: "nuudcare.com", categories: ["deodorant"], hint: "Natural cream deodorant" },
  { name: "Crystal", slug: "crystal-deodorant", domain: "thecrystal.com", categories: ["deodorant"], hint: "Mineral salt deodorant" },
  { name: "Myro", slug: "myro", domain: "mymyro.com", categories: ["deodorant"], hint: "Refillable natural deodorant" },
  { name: "No Pong", slug: "no-pong", domain: "nopong.com", categories: ["deodorant"], hint: "Natural cream deodorant" },
  { name: "KAKADU", slug: "kakadu", domain: "kakaduorganics.com", categories: ["deodorant"], hint: "Organic deodorant" },
  // Oral
  { name: "Fygg", slug: "fygg", domain: "fygg.com", categories: ["oral"], hint: "Hydroxyapatite toothpaste" },
  { name: "Dr. Brite", slug: "dr-brite", domain: "drbrite.com", categories: ["oral"], hint: "Clean natural oral care" },
  { name: "RADIUS", slug: "radius", domain: "radiustoothbrush.com", categories: ["oral"], hint: "Sustainable oral care" },
  { name: "Desert Essence", slug: "desert-essence", domain: "desertessence.com", categories: ["oral", "skincare"], hint: "Tea tree oral + body care" },
  { name: "Dr. Tung's", slug: "dr-tungs", domain: "drtungs.com", categories: ["oral"], hint: "Natural oral care" },
  { name: "Jason", slug: "jason", domain: "jason-personalcare.com", categories: ["oral", "skincare"], hint: "Natural personal care" },
  // Protein
  { name: "Sprout Living", slug: "sprout-living", domain: "sproutliving.com", categories: ["protein", "supplements"], hint: "Organic plant protein" },
  { name: "Nuzest", slug: "nuzest", domain: "nuzest-usa.com", categories: ["protein"], hint: "Clean pea protein" },
  { name: "ALOHA", slug: "aloha", domain: "aloha.com", categories: ["protein"], hint: "Organic plant protein" },
  { name: "Paleovalley", slug: "paleovalley", domain: "paleovalley.com", categories: ["protein", "supplements"], hint: "Grass-fed protein + organ blends" },
  { name: "Sunwarrior", slug: "sunwarrior", domain: "sunwarrior.com", categories: ["protein"], hint: "Plant protein" },
  { name: "OWYN", slug: "owyn", domain: "liveowyn.com", categories: ["protein"], hint: "Allergen-friendly plant protein" },
  { name: "Koia", slug: "koia", domain: "drinkkoia.com", categories: ["protein"], hint: "Plant protein drinks" },
  { name: "Ka'Chava", slug: "kachava", domain: "kachava.com", categories: ["protein", "supplements"], hint: "All-in-one superfood protein" },
  // Electrolytes
  { name: "CURE", slug: "cure-hydration", domain: "curehydration.com", categories: ["electrolytes"], hint: "Coconut water electrolytes" },
  { name: "Hydrant", slug: "hydrant", domain: "drinkhydrant.com", categories: ["electrolytes"], hint: "Clean electrolyte mix" },
  { name: "SOS Hydration", slug: "sos-hydration", domain: "soshydration.com", categories: ["electrolytes"], hint: "WHO-style hydration" },
  { name: "IQMIX", slug: "iqmix", domain: "iqmix.com", categories: ["electrolytes"], hint: "Ketolyte hydration" },
  { name: "Saltt", slug: "saltt", domain: "saltt.com", categories: ["electrolytes"], hint: "Electrolyte drink mix" },
  // Supplements
  { name: "Anima Mundi", slug: "anima-mundi", domain: "animamundiherbals.com", categories: ["supplements"], hint: "Organic herbal apothecary" },
  { name: "Needed", slug: "needed", domain: "thisisneeded.com", categories: ["supplements"], hint: "Women's nutrition supplements" },
  { name: "FullWell", slug: "fullwell", domain: "fullwellfertility.com", categories: ["supplements"], hint: "Practitioner prenatal" },
  { name: "Host Defense", slug: "host-defense", domain: "hostdefense.com", categories: ["supplements"], hint: "Organic mushroom supplements" },
  { name: "Sun Potion", slug: "sun-potion", domain: "sunpotion.com", categories: ["supplements"], hint: "Tonic herbs + adaptogens" },
  { name: "Organifi", slug: "organifi", domain: "organifi.com", categories: ["supplements"], hint: "Organic superfood powders" },
  { name: "Real Mushrooms", slug: "real-mushrooms", domain: "realmushrooms.com", categories: ["supplements"], hint: "Extracted mushroom supplements" },
  { name: "Gaia Herbs", slug: "gaia-herbs", domain: "gaiaherbs.com", categories: ["supplements"], hint: "Organic herbal supplements" },
  // Hair
  { name: "Melanin Haircare", slug: "melanin-haircare", domain: "melaninhaircare.com", categories: ["hair"], hint: "Clean textured-hair care" },
  { name: "Oway", slug: "oway", domain: "oway.us", categories: ["hair"], hint: "Biodynamic organic hair care" },
  { name: "Evolve Beauty", slug: "evolve-beauty", domain: "evolvebeauty.co.uk", categories: ["skincare", "hair"], hint: "Certified organic British beauty" },
  // Skincare
  { name: "Earth Harbor", slug: "earth-harbor", domain: "earthharbor.com", categories: ["skincare"], hint: "Clean ocean-inspired skincare" },
  { name: "Dr. Hauschka", slug: "dr-hauschka", domain: "drhauschka.com", categories: ["skincare"], hint: "Biodynamic natural skincare" },
  { name: "Mad Hippie", slug: "mad-hippie", domain: "madhippie.com", categories: ["skincare"], hint: "Clean active skincare" },
  { name: "Herbivore extra check", slug: "odinsoil", domain: "odinsoil.com", categories: ["skincare"], hint: "placeholder skip" },
];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  if (!text.trimStart().startsWith("{")) throw new Error("not-json");
  return JSON.parse(text);
}

async function probeBase(base) {
  const url = `${base.replace(/\/$/, "")}/products.json?limit=8`;
  const data = await fetchJson(url);
  const products = data.products || [];
  return {
    base,
    count: products.length,
    sample: products.slice(0, 4).map((p) => ({
      title: p.title,
      variants: (p.variants || []).length,
      images: (p.images || []).length,
      type: p.product_type,
    })),
  };
}

function candidateBases(domain) {
  const host = domain.replace(/^www\./, "");
  return [
    `https://${host}`,
    `https://www.${host}`,
    `https://shop.${host}`,
    `https://us.${host}`,
  ];
}

const results = [];
for (const brand of CANDIDATES) {
  if (existingSlugs.has(brand.slug) || existingDomains.has(brand.domain)) {
    results.push({ ...brand, status: "already-listed" });
    continue;
  }
  let found = null;
  let lastErr = "";
  for (const base of candidateBases(brand.domain)) {
    try {
      found = await probeBase(base);
      break;
    } catch (e) {
      lastErr = String(e.message || e);
    }
  }
  results.push({
    ...brand,
    status: found ? "ok" : "fail",
    shopBase: found?.base || null,
    sampleCount: found?.count || 0,
    sample: found?.sample || [],
    error: found ? null : lastErr,
  });
  process.stdout.write(
    `${found ? "OK " : "NO "} ${brand.slug.padEnd(22)} ${found ? found.base : lastErr}\n`,
  );
}

fs.mkdirSync(path.join(root, "data"), { recursive: true });
fs.writeFileSync(
  path.join(root, "data/wave4-probe.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      existingSlugCount: existingSlugs.size,
      results,
    },
    null,
    2,
  ),
);

const ok = results.filter((r) => r.status === "ok");
console.log(`\nOK ${ok.length} / ${results.length}`);
console.log(
  "Already listed:",
  results.filter((r) => r.status === "already-listed").map((r) => r.slug).join(", "),
);
