/**
 * Generate logos for wave74 brands (uplead → generated SVG mark).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands } from "./catalog-brands-seed-wave74.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/brands");
const catalogPath = path.join(__dirname, "../src/lib/catalog-brands-wave74.ts");
fs.mkdirSync(outDir, { recursive: true });

function svgMark(name, accent) {
  const initials =
    name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="28" fill="${accent}"/>
  <text x="128" y="148" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="600" fill="#ffffff">${initials}</text>
</svg>`;
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "TinyMarketplaceLogoBot/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) throw new Error(`too small ${buf.length}`);
  return buf;
}

function isPng(buf) {
  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
}

async function downloadOne(brand) {
  const slug = brand.slug;
  const domain = brand.domain;
  const pngPath = path.join(outDir, `${slug}.png`);
  const svgPath = path.join(outDir, `${slug}.svg`);

  if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 400) {
    return { slug, source: "cached-png", file: `/brands/${slug}.png` };
  }
  if (fs.existsSync(svgPath) && fs.statSync(svgPath).size > 100) {
    return { slug, source: "cached-svg", file: `/brands/${slug}.svg` };
  }

  try {
    const buf = await fetchBuffer(`https://logo.uplead.com/${domain}`);
    if (isPng(buf)) {
      fs.writeFileSync(pngPath, buf);
      return { slug, source: "uplead", file: `/brands/${slug}.png` };
    }
  } catch {
    /* continue */
  }

  fs.writeFileSync(svgPath, svgMark(brand.name, brand.accent || "#2C5F4E"));
  return { slug, source: "generated-svg", file: `/brands/${slug}.svg` };
}

const results = [];
for (const brand of brands) {
  try {
    const r = await downloadOne(brand);
    results.push(r);
    console.log(r.source.padEnd(14), r.slug);
  } catch (e) {
    console.error("FAIL", brand.slug, e.message);
  }
}

let catalog = fs.readFileSync(catalogPath, "utf8");
for (const r of results) {
  catalog = catalog.replace(
    new RegExp(
      `(slug: ${JSON.stringify(r.slug)}[\\s\\S]*?logoUrl: )"/brands/${r.slug}\\.(?:png|svg)"`,
    ),
    `$1"${r.file}"`,
  );
}
fs.writeFileSync(catalogPath, catalog);

const summary = results.reduce((acc, r) => {
  acc[r.source] = (acc[r.source] || 0) + 1;
  return acc;
}, {});
console.log("done logos", results.length, summary);
fs.writeFileSync(
  path.join(__dirname, "../data/brand-logo-manifest-wave74.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), summary, count: results.length }, null, 2),
);
