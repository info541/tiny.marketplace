import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands } from "./catalog-brands-seed-wave98.mjs";

const WAVE_START = 1457;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/catalog-brands-wave98.ts");

function esc(s) {
  return JSON.stringify(s);
}

const rows = brands.map((b, i) => {
  const id = `c${String(i + WAVE_START).padStart(4, "0")}`;
  const cats = b.categories.map((c) => esc(c)).join(", ");
  return `  {
    id: ${esc(id)},
    slug: ${esc(b.slug)},
    name: ${esc(b.name)},
    tagline: ${esc(b.tagline)},
    story:
      ${esc(b.story)},
    location: ${esc(b.location)},
    founded: ${b.founded},
    categories: [${cats}],
    accent: ${esc(b.accent)},
    rating: ${b.rating},
    reviewCount: ${b.reviewCount},
    followerCount: ${b.followerCount},
    websiteUrl: ${esc(b.websiteUrl)},
    logoUrl: "/brands/${b.slug}.svg",
  }`;
});

const src = `import type { Brand } from "./types";

/** Wave 98: small organic / toxic-free brands across marketplace categories (c1457+). */
export const catalogBrandsWave98: Brand[] = [
${rows.join(",\n")}
];
`;

fs.writeFileSync(out, src);
console.log("wrote", out, "brands", brands.length);
