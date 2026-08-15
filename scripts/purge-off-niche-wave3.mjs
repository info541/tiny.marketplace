/**
 * Remove wave3 brands whose catalogs are not in the marketplace niches:
 * sunscreen, deodorant, protein, electrolytes, supplements, skincare, hair, oral.
 *
 * Rewrites selected seed, brand TS module, and catalog products. Renumbers
 * surviving brands contiguously from c251.
 *
 * Usage: node scripts/purge-off-niche-wave3.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

const productsPath = path.join(root, "data/catalog-products-raw.json");
const selectedPath = path.join(root, "data/wave3-selected.json");
const seedPath = path.join(root, "scripts/catalog-brands-seed-wave3.mjs");
const brandsTsPath = path.join(root, "src/lib/catalog-brands-wave3.ts");
const reportPath = path.join(root, "data/wave3-niche-purge-report.json");

const NICHE_CAT = {
  sunscreen:
    /\b(spf\s*\d+|sunscreen|sunblock|sun cream|sun stick|uv (protection|defense|filter)|mineral (sun|spf)|broad[- ]spectrum|after[- ]?sun)\b/i,
  deodorant:
    /\b(deodor|antiperspir|underarm|armpit|whole[- ]body deodor|\bdeo\b|odor (control|protection))\b/i,
  oral:
    /\b(toothpaste|tooth[- ]?paste|toothpaste bits|toothbrush|tooth[- ]?brush|floss|mouthwash|mouth[- ]wash|mouth rinse|brushing rinse|oral care|teeth whitening|whitening (gel|pen|strips)|dental|nano[- ]?hydroxyapatite)\b/i,
  hair:
    /\b(shampoo|conditioner|dry shampoo|hair (oil|mask|serum|care|treatment|repair|growth|cream|gel|spray|tonic|paste|wax|foam|mousse)|scalp|leave[- ]?in|co[- ]?wash|curl (cream|gel)|hair colou?r|color depositing|hair dye|demi[- ]permanent|permanent colou?r|bleach (powder|kit)|bond (builder|repair)|olaplex|k18|edge control|wave cream|360 waves)\b/i,
  protein:
    /\b(protein (powder|shake|isolate|blend|bar|formula)|whey|casein|plant protein|pea protein|clear whey|collagen (peptides|protein|powder)|mass gainer)\b/i,
  electrolytes:
    /\b(electrolyte|hydration (powder|packet|mix|stick|tablet|tube|multiplier)|lmnt|saltstick|fastchews|vitassium|oral rehydration|roctane electrolyte)\b/i,
  supplements:
    /\b(supplement|vitamin|multivitamin|capsule|softgel|probiotic|prebiotic|adaptogen|mushroom (blend|complex|extract|gummies)|ashwagandha|magnesium|omega[- ]?3|fish oil|gummy vitamins?|dietary supplement|nootropic|greens (powder|super)|superfood powder|akkermansia|gut (health|support)|tincture|creatine|bcaa)\b/i,
  skincare:
    /\b(serum|moisturizer|moisturiser|cleanser|face wash|facial|toner|essence|ampoule|eye cream|eye brightener|retinol|retinoid|niacinamide|hyaluronic|peptide (cream|serum)|face cream|face oil|facial oil|body (lotion|butter|wash|oil|cream)|lip balm|lip butter|exfoliant|exfoliat|\baha\b|\bbha\b|sheet mask|clay mask|hydrogel|barrier cream|spot treatment|acne|skincare|skin care|self[- ]?tan|tanning (serum|lotion|mousse|drops|water)|hand cream|cuticle|complexion|tinted moisturizer|skin recovery|foam cleanser|brighten|bum bum cream)\b/i,
};

const HARD_OFF =
  /\b(cupcake|brownie|bakery|ice cream maker|placemat|lego\b|slime kit|hoodie|sweatshirt|corset|vape\b|nic salt|nicotine|thca|bmx\b|vinyl sticker|lunch bag|play tent|book rack|closet divider|storage bin|laundry|diaper|stroller|onesie|lanyard|shelving unit|fortnite|pen needle|bathrobe|horse (gut|supplement)|for horses|pet probiotic|whole bean coffee|macaron|kimchi|souvenir mug|farmhouse decor|caliburn|dablicator|wheelie bike)\b/i;

function classifyTitle(title) {
  const cats = [];
  for (const [cat, re] of Object.entries(NICHE_CAT)) {
    if (re.test(title)) cats.push(cat);
  }
  return cats;
}

function brandIdForIndex(i) {
  return `c${String(i + 251).padStart(3, "0")}`;
}

function escapeTsString(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function renderBrandTs(brands) {
  const lines = [
    `import type { Brand } from "./types";`,
    ``,
    `/** Wave 3: niche brands across marketplace categories (on-niche only). */`,
    `export const catalogBrandsWave3: Brand[] = [`,
  ];
  for (const b of brands) {
    lines.push(`  {`);
    lines.push(`    id: "${b.id}",`);
    lines.push(`    slug: "${escapeTsString(b.slug)}",`);
    lines.push(`    name: "${escapeTsString(b.name)}",`);
    lines.push(`    tagline: "${escapeTsString(b.tagline)}",`);
    lines.push(`    story: "${escapeTsString(b.story)}",`);
    lines.push(`    location: "${escapeTsString(b.location)}",`);
    lines.push(`    founded: ${b.founded},`);
    lines.push(
      `    categories: [${b.categories.map((c) => `"${c}"`).join(",")}],`,
    );
    lines.push(`    accent: "${b.accent}",`);
    lines.push(`    rating: ${b.rating},`);
    lines.push(`    reviewCount: ${b.reviewCount},`);
    lines.push(`    followerCount: ${b.followerCount},`);
    lines.push(`    websiteUrl: "${escapeTsString(b.websiteUrl)}",`);
    lines.push(`    logoUrl: "${escapeTsString(b.logoUrl)}",`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);
  return lines.join("\n");
}

function renderSeed(brands) {
  const payload = brands.map((b) => ({
    slug: b.slug,
    name: b.name,
    domain: b.domain,
    websiteUrl: b.websiteUrl,
    shopBase: b.shopBase || b.websiteUrl,
    categories: b.categories,
    accent: b.accent,
    tagline: b.tagline,
    story: b.story,
    location: b.location,
    founded: b.founded,
    rating: b.rating,
    reviewCount: b.reviewCount,
    followerCount: b.followerCount,
  }));
  return `/** Wave3 seed (on-niche brands only) */\nexport const brands = ${JSON.stringify(payload, null, 2)};\n`;
}

function main() {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const selected = JSON.parse(fs.readFileSync(selectedPath, "utf8"));

  const byBrand = new Map();
  for (const p of products) {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    if (!Number.isFinite(n) || n < 251 || n > 1250) continue;
    if (!byBrand.has(p.brandId)) byBrand.set(p.brandId, []);
    byBrand.get(p.brandId).push(p);
  }

  const keptMeta = [];
  const droppedMeta = [];

  for (let i = 0; i < selected.length; i++) {
    const sel = selected[i];
    const oldId = brandIdForIndex(i);
    const prods = byBrand.get(oldId) || [];

    let niche = 0;
    let hardOff = 0;
    const nicheProducts = [];
    const catCounts = {};

    for (const p of prods) {
      const cats = classifyTitle(p.name);
      const off = HARD_OFF.test(p.name);
      if (off && !cats.length) {
        hardOff++;
        continue;
      }
      if (cats.length) {
        niche++;
        nicheProducts.push({ product: p, cats });
        for (const c of cats) catCounts[c] = (catCounts[c] || 0) + 1;
      } else if (off) {
        hardOff++;
      }
    }

    const total = prods.length || 1;
    const ratio = niche / total;
    const primary = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([c]) => c);

    // Keep only brands that clearly sell marketplace-niche products.
    const keep =
      nicheProducts.length >= 4 &&
      ratio >= 0.2 &&
      hardOff / total < 0.35 &&
      primary.length > 0;

    const row = {
      oldId,
      slug: sel.slug,
      niche,
      hardOff,
      total: prods.length,
      ratio: Math.round(ratio * 1000) / 1000,
      primary,
      sample: nicheProducts.slice(0, 3).map((x) => x.product.name),
    };

    if (keep) {
      keptMeta.push({ ...row, sel, nicheProducts, catCounts });
    } else {
      droppedMeta.push(row);
    }
  }

  // Renumber survivors and rebuild product rows (niche SKUs only).
  const newBrands = [];
  const newSelected = [];
  const newProducts = [];
  const idMap = new Map();

  keptMeta.forEach((row, idx) => {
    const newId = brandIdForIndex(idx);
    idMap.set(row.oldId, newId);
    const cats = row.primary.slice(0, 2);
    const sel = {
      ...row.sel,
      categories: cats.length ? cats : row.sel.categories,
    };
    // Refresh story/tagline categories to match actual product signal.
    const catLabel = cats.join(" & ") || "wellness";
    sel.story = `${sel.name} is a small niche ${catLabel} brand — curated into the tiny marketplace for unique formulas without megastore noise.`;

    newSelected.push(sel);
    newBrands.push({
      id: newId,
      slug: sel.slug,
      name: sel.name,
      tagline: sel.tagline,
      story: sel.story,
      location: sel.location || "Independent / DTC",
      founded: sel.founded || 2018,
      categories: sel.categories,
      accent: sel.accent,
      rating: sel.rating,
      reviewCount: sel.reviewCount,
      followerCount: sel.followerCount,
      websiteUrl: sel.websiteUrl,
      logoUrl: `/brands/${sel.slug}.png`,
      domain: sel.domain,
      shopBase: sel.shopBase || sel.websiteUrl,
    });

    // Prefer existing logo extension if present.
    for (const ext of [".png", ".svg", ".webp", ".jpg"]) {
      if (fs.existsSync(path.join(root, "public/brands", `${sel.slug}${ext}`))) {
        newBrands[newBrands.length - 1].logoUrl = `/brands/${sel.slug}${ext}`;
        break;
      }
    }

    row.nicheProducts.forEach(({ product, cats }, pIdx) => {
      const handle = String(product.slug || product.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 10);
      newProducts.push({
        ...product,
        id: `${sel.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10)}${String(pIdx + 1).padStart(3, "0")}`,
        brandId: newId,
        category: cats[0] || product.category,
        slug: `${sel.slug}-${String(product.slug || "")
          .replace(new RegExp(`^${sel.slug}-`), "")
          .slice(0, 80)}`.slice(0, 100),
      });
      void handle;
    });
  });

  // Keep non-wave3 products untouched.
  const keptNonWave3 = products.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < 251 || n > 1250;
  });

  const finalProducts = [...keptNonWave3, ...newProducts];

  const report = {
    finishedAt: new Date().toISOString(),
    beforeBrands: selected.length,
    afterBrands: newBrands.length,
    droppedBrands: droppedMeta.length,
    beforeWave3Products: [...byBrand.values()].reduce((n, a) => n + a.length, 0),
    afterWave3Products: newProducts.length,
    finalCatalogProducts: finalProducts.length,
    keptCategoryMix: newBrands.reduce((acc, b) => {
      for (const c of b.categories) acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {}),
    droppedSample: droppedMeta.slice(0, 40),
    keptSample: keptMeta.slice(0, 40).map((r) => ({
      slug: r.slug,
      niche: r.niche,
      ratio: r.ratio,
      primary: r.primary,
    })),
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ dryRun, ...report, droppedSample: undefined, keptSample: undefined }, null, 2));
  console.log(`Dropped 3sprouts?`, droppedMeta.some((d) => d.slug === "3sprouts"));

  if (dryRun) {
    console.log("Dry run only — wrote report, no catalog rewrite.");
    return;
  }

  fs.writeFileSync(selectedPath, JSON.stringify(newSelected, null, 2) + "\n");
  fs.writeFileSync(seedPath, renderSeed(newBrands));
  fs.writeFileSync(brandsTsPath, renderBrandTs(newBrands));
  fs.writeFileSync(productsPath, JSON.stringify(finalProducts, null, 2) + "\n");
  console.log("Wrote selected, seed, brands TS, and products JSON.");
}

main();
