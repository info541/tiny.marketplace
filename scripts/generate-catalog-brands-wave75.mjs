/**
 * Write src/lib/catalog-brands-wave75.ts from the wave75 seed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands } from "./catalog-brands-seed-wave75.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/catalog-brands-wave75.ts");
const WAVE_START = 1319;

function tsString(s) {
  return JSON.stringify(s);
}

const rows = brands.map((b, i) => {
  const id = `c${String(i + WAVE_START)}`;
  return `  {
    id: ${tsString(id)},
    slug: ${tsString(b.slug)},
    name: ${tsString(b.name)},
    tagline: ${tsString(b.tagline)},
    story: ${tsString(b.story)},
    location: ${tsString(b.location)},
    founded: ${b.founded},
    categories: ${JSON.stringify(b.categories)},
    accent: ${tsString(b.accent)},
    rating: ${b.rating},
    reviewCount: ${b.reviewCount},
    followerCount: ${b.followerCount},
    websiteUrl: ${tsString(b.websiteUrl)},
    logoUrl: ${tsString(`/brands/${b.slug}.svg`)},
  }`;
});

const file = `import type { Brand } from "./types";

/** Wave 75: small organic / toxic-free brands across marketplace categories (c1319+). */
export const catalogBrandsWave75: Brand[] = [
${rows.join(",\n")},
];
`;

fs.writeFileSync(out, file);
console.log("wrote", out, "brands", brands.length);
