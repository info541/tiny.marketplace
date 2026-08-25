/**
 * Write src/lib/catalog-brands-wave38.ts from the wave38 seed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands } from "./catalog-brands-seed-wave38.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/catalog-brands-wave38.ts");

function tsString(s) {
  return JSON.stringify(s);
}

const rows = brands.map((b, i) => {
  const id = `c${String(i + 1048).padStart(4, "0")}`;
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

/** Wave 38: small organic / toxic-free brands across marketplace categories (c1019+). */
export const catalogBrandsWave38: Brand[] = [
${rows.join(",\n")},
];
`;

fs.writeFileSync(out, file);
console.log("wrote", out, "brands", brands.length);
