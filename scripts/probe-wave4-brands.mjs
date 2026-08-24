/**
 * Probe curated wave4 indie / clean-ingredient brands for Shopify products.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CANDIDATES = [
  { slug: "soleil-toujours", name: "Soleil Toujours", bases: ["https://soleiltoujours.com"], categories: ["sunscreen", "skincare"], tagline: "Luxury mineral SPF with clean botanicals", story: "Clean, reef-conscious sun care with a skincare finish — mineral and hybrid SPF that feels like a serum, not a chalky paste.", location: "United States", founded: 2013, accent: "#E8A54B" },
  { slug: "suntegrity", name: "Suntegrity", bases: ["https://suntegrityskincare.com"], categories: ["sunscreen", "skincare"], tagline: "Clean mineral sunscreen that wears like makeup", story: "Family-made mineral SPF tinted to disappear on real skin — no oxybenzone, no nano-zinc circus, just everyday sun care.", location: "United States", founded: 2009, accent: "#C45C26" },
  { slug: "kinfield", name: "Kinfield", bases: ["https://kinfield.com"], categories: ["sunscreen", "skincare"], tagline: "Outdoor-ready mineral SPF and bug care", story: "Portland-born outdoor skin care — mineral sunscreen, after-sun, and plant-powered bug balm for people who actually go outside.", location: "Portland, OR", founded: 2018, accent: "#2C5F4E" },
  { slug: "goddess-garden", name: "Goddess Garden", bases: ["https://www.goddessgarden.com", "https://goddessgarden.com"], categories: ["sunscreen"], tagline: "Plant-powered mineral SPF for families", story: "Colorado mineral sunscreen with botanicals and no chemical filters — continuous spray and lotions built for kids, faces, and long days.", location: "Colorado", founded: 2004, accent: "#6B8E23" },
  { slug: "unsun", name: "Unsun", bases: ["https://unsuncosmetics.com", "https://www.unsuncosmetics.com"], categories: ["sunscreen", "skincare"], tagline: "Mineral SPF made to vanish on deeper skin", story: "Inclusive mineral sunscreen and hair SPF that skips the white cast — clean filters for melanin-rich skin that still wants to glow.", location: "United States", founded: 2017, accent: "#8B5A2B" },
  { slug: "solara-suncare", name: "Solara Suncare", bases: ["https://solarasuncare.com"], categories: ["sunscreen", "skincare"], tagline: "Clean mineral sun care with a ritual feel", story: "Small-batch mineral SPF and after-sun built around botanicals, no oxybenzone, and formulas that respect reefs and skin barriers.", location: "United States", founded: 2018, accent: "#1B4F72" },
  { slug: "island-butter", name: "Island Butter", bases: ["https://www.islandbutter.co", "https://islandbutter.co"], categories: ["sunscreen"], tagline: "Reef-safe mineral butter for untamed days", story: "Tampa-made all-natural mineral sun butter — reef-safe, sweatproof, and built to nourish skin instead of coating it in synthetics.", location: "Tampa, FL", founded: 2022, accent: "#2A9D8F" },
  { slug: "swellies", name: "Swellies", bases: ["https://www.swellies.com", "https://swellies.com"], categories: ["sunscreen"], tagline: "Five-ingredient mineral SPF, no white cast", story: "Colorado-made mineral sunscreen with a five-ingredient formula — non-nano zinc, no silicones, no fragrance, no chemical filters.", location: "Colorado", founded: 2023, accent: "#1A4A6B" },
  { slug: "black-girl-sunscreen", name: "Black Girl Sunscreen", bases: ["https://www.blackgirlsunscreen.com", "https://blackgirlsunscreen.com"], categories: ["sunscreen"], tagline: "SPF made for melanin-rich skin", story: "No white cast, just protection — sunscreen formulated to disappear on deeper skin tones without the chemical-filter pile-on.", location: "Los Angeles, CA", founded: 2016, accent: "#F2C94C" },
  { slug: "nuud", name: "Nuud", bases: ["https://nuud.shop", "https://nuudcare.com", "https://www.nuudcare.com"], categories: ["deodorant"], tagline: "Microbiome-friendly cream deodorant that lasts days", story: "Dutch natural deodorant cream in a tiny tube — prebiotic, aluminum-free, and designed to work with your skin instead of blasting it.", location: "Netherlands", founded: 2015, accent: "#E07A5F" },
  { slug: "crystal-deodorant", name: "Crystal", bases: ["https://thecrystal.com", "https://www.thecrystal.com", "https://crystaldeodorant.com"], categories: ["deodorant"], tagline: "Mineral salt deodorant without the junk", story: "Potassium-alum mineral deodorant — no aluminum chlorohydrate, no parabens, no scent circus. Just a stone that actually works.", location: "United States", founded: 1984, accent: "#4A90A4" },
  { slug: "wild-deodorant", name: "Wild", bases: ["https://wearewild.com", "https://www.wearewild.com", "https://uk.wearewild.com"], categories: ["deodorant"], tagline: "Refillable natural deodorant in a reusable case", story: "UK refill deodorant with compostable refills and essential-oil scents — aluminum-free formulas that skip the plastic stick graveyard.", location: "United Kingdom", founded: 2020, accent: "#2D6A4F" },
  { slug: "type-a", name: "Type:A", bases: ["https://typeadeodorant.com", "https://www.typeadeodorant.com"], categories: ["deodorant"], tagline: "Sensitive-skin natural deodorant, no baking soda", story: "Baking-soda-free natural deodorant for people who already tried the itchy sticks — magnesium and plant oils, scents that stay quiet.", location: "United States", founded: 2017, accent: "#6B4F3A" },
  { slug: "by-humankind", name: "By Humankind", bases: ["https://byhumankind.com", "https://www.byhumankind.com"], categories: ["deodorant", "oral"], tagline: "Refillable personal care without the plastic", story: "Refill-first deodorant, mouthwash tablets, and daily care — fewer single-use plastics, cleaner formulas, same bathroom ritual.", location: "New York, NY", founded: 2018, accent: "#3D5A4C" },
  { slug: "fygg", name: "Fygg", bases: ["https://fygg.com", "https://www.fygg.com"], categories: ["oral"], tagline: "Hydroxyapatite toothpaste for the whole family", story: "Nano-hydroxyapatite oral care without the plastic-tube guilt trip — clean toothpaste that remineralizes instead of just foaming.", location: "United States", founded: 2021, accent: "#7EB8A2" },
  { slug: "dr-tungs", name: "Dr. Tung's", bases: ["https://drtungs.com", "https://www.drtungs.com"], categories: ["oral"], tagline: "Oil pulling and clean oral care, the long way", story: "Holistic oral care from oil-pulling concentrates to tongue cleaners — simple, effective tools without the supermarket chemistry set.", location: "United States", founded: 1994, accent: "#8B6914" },
  { slug: "unpaste", name: "Unpaste", bases: ["https://unpaste.com", "https://www.unpaste.com"], categories: ["oral"], tagline: "Plastic-free toothpaste tablets", story: "Chewable toothpaste tablets that skip the tube — clean oral care with hydroxyapatite or fluoride options and compostable packaging.", location: "United States", founded: 2020, accent: "#45B69C" },
  { slug: "sprout-living", name: "Sprout Living", bases: ["https://sproutliving.com", "https://www.sproutliving.com"], categories: ["protein", "supplements"], tagline: "Organic plant protein with real-food ingredients", story: "Chicago-born organic protein and superfood powders — short labels, recognizable plants, no gums-and-junk smoothie dust.", location: "Chicago, IL", founded: 2010, accent: "#3D8B6E" },
  { slug: "nuzest", name: "Nuzest", bases: ["https://nuzest-usa.com", "https://www.nuzest-usa.com", "https://nuzest.com"], categories: ["protein", "supplements"], tagline: "European golden pea protein, clean and quiet", story: "Pea protein isolates with short ingredient lists — no dairy, no soy, no stevia drama. Just plant protein that mixes like it means it.", location: "New Zealand", founded: 2012, accent: "#2E7D32" },
  { slug: "kos", name: "KOS", bases: ["https://kos.com", "https://www.kos.com"], categories: ["protein", "supplements"], tagline: "Organic plant protein that actually tastes like food", story: "Organic plant protein and superfood blends with flavor that doesn't taste like chalk — clean labels for daily shakes.", location: "United States", founded: 2017, accent: "#C4783A" },
  { slug: "cure", name: "CURE", bases: ["https://curehydration.com", "https://www.curehydration.com"], categories: ["electrolytes"], tagline: "Plant-based electrolytes with coconut water", story: "Hydration from coconut water and pink salt — no artificial dyes, no mystery sweeteners, just electrolytes that taste like fruit.", location: "United States", founded: 2018, accent: "#E07A5F" },
  { slug: "hydrant", name: "Hydrant", bases: ["https://drinkhydrant.com", "https://www.drinkhydrant.com"], categories: ["electrolytes"], tagline: "Rapid hydration packets without the junk", story: "Electrolyte drink mixes with real sugar in the right dose — no artificial colors, built for travel days and actual thirst.", location: "United States", founded: 2016, accent: "#1B4F72" },
  { slug: "iqmix", name: "IQMIX", bases: ["https://drinkiqmix.com", "https://www.drinkiqmix.com", "https://iqlabs.com"], categories: ["electrolytes", "supplements"], tagline: "Ketone-friendly electrolytes for clear-headed hydration", story: "Sugar-free electrolyte sticks with lion's mane and magnesium — hydration for brains that don't want a candy-aisle sports drink.", location: "United States", founded: 2019, accent: "#4A5568" },
  { slug: "earth-harbor", name: "Earth Harbor", bases: ["https://earthharbor.com", "https://www.earthharbor.com"], categories: ["skincare", "sunscreen"], tagline: "Sea-powered clean skincare from a family lab", story: "Woman-owned, independently made botanicals and mineral SPF — sea algae, clean actives, and no outsourcing the formula.", location: "United States", founded: 2017, accent: "#2A9D8F" },
  { slug: "evolve-beauty", name: "Evolve Beauty", bases: ["https://evolvebeauty.co.uk", "https://www.evolvebeauty.co.uk"], categories: ["skincare"], tagline: "Certified organic British skincare", story: "Hertfordshire-made organic skincare with COSMOS credentials — short, honest formulas and refill pouches that skip the greenwash.", location: "United Kingdom", founded: 2018, accent: "#5B7A3A" },
  { slug: "mad-hippie", name: "Mad Hippie", bases: ["https://madhippie.com", "https://www.madhippie.com"], categories: ["skincare"], tagline: "High-performance naturals without the toxins", story: "Vitamin C, retinol alternatives, and everyday serums with transparent INCI lists — clean actives, no paraben-phthalate fog.", location: "United States", founded: 2009, accent: "#7B4B94" },
  { slug: "honua", name: "Honua Hawaiian Skincare", bases: ["https://honuaskincare.com", "https://www.honuaskincare.com"], categories: ["skincare"], tagline: "Hawaiian botanicals, small-batch skin rituals", story: "Oahu-made skincare rooted in native plants — kukui, noni, and clean oils for skin that wants island botanicals, not filler.", location: "Oahu, HI", founded: 2014, accent: "#2F6F5E" },
  { slug: "melanin-haircare", name: "Melanin Haircare", bases: ["https://melaninhaircare.com", "https://www.melaninhaircare.com"], categories: ["hair"], tagline: "Clean hair care built for textured hair", story: "Multi-use oils, twists, and wash-day formulas for afro-textured hair — no mineral oil, no petrolatum, just ingredients that earn their spot.", location: "United States", founded: 2018, accent: "#6B3E26" },
  { slug: "anima-mundi", name: "Anima Mundi", bases: ["https://animamundiherbals.com", "https://www.animamundiherbals.com"], categories: ["supplements"], tagline: "Organic herbal apothecary for daily ritual", story: "Brooklyn herbalists making organic powders, tonics, and adaptogens — regenerative botanicals with labels you can actually read.", location: "Brooklyn, NY", founded: 2016, accent: "#6B3E26" },
  { slug: "sun-potion", name: "Sun Potion", bases: ["https://sunpotion.com", "https://www.sunpotion.com"], categories: ["supplements"], tagline: "Tonic herbs and adaptogens, the slow way", story: "Ceremonial-grade mushrooms, tonic herbs, and blends for people who treat supplements like a ritual — not a neon gummy aisle.", location: "California", founded: 2013, accent: "#C4A484" },
  { slug: "needed", name: "Needed", bases: ["https://thisisneeded.com", "https://www.thisisneeded.com"], categories: ["supplements"], tagline: "Clinical-grade nutrition for pregnancy and beyond", story: "Women's health supplements with doses that match the research — prenatal, collagen, and daily support without the candy-store formula.", location: "United States", founded: 2017, accent: "#8B6F5C" },
];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  if (!text.trimStart().startsWith("{")) throw new Error("not-json");
  return JSON.parse(text);
}

const NICHE =
  /\b(spf|sunscreen|sunblock|deodor|antiperspir|toothpaste|toothbrush|floss|mouthwash|oral|hydroxyapatite|shampoo|conditioner|hair|scalp|protein|whey|pea protein|electrolyte|hydration|vitamin|supplement|capsule|adaptogen|mushroom|serum|moisturizer|cleanser|toner|cream|oil|mask|balm|lip)\b/i;
const MERCH =
  /\b(gift card|merch|t-?shirt|tee\b|hoodie|sweatshirt|hat\b|cap\b|beanie|tote|sticker|mug\b|apparel|poster|patch|keychain)\b/i;

const results = [];
for (const c of CANDIDATES) {
  let hit = null;
  const errors = [];
  for (const base of c.bases) {
    try {
      const data = await fetchJson(`${base.replace(/\/$/, "")}/products.json?limit=50`);
      const products = data.products || [];
      const niche = products.filter((p) => {
        const hay = `${p.title} ${p.product_type} ${(p.tags || []).join(" ")}`;
        return NICHE.test(hay) && !MERCH.test(hay);
      });
      const sample = niche.slice(0, 8).map((p) => ({
        title: p.title,
        type: p.product_type,
        variants: (p.variants || []).length,
        options: (p.options || []).map((o) => o.name),
        hasIngredients: /ingredient/i.test(p.body_html || ""),
      }));
      hit = {
        ...c,
        shopBase: base,
        raw: products.length,
        niche: niche.length,
        sample,
      };
      break;
    } catch (e) {
      errors.push(`${base}: ${e.message || e}`);
    }
  }
  results.push(
    hit || {
      ...c,
      shopBase: null,
      raw: 0,
      niche: 0,
      error: errors.join(" | "),
    },
  );
  const status = hit ? `OK ${hit.niche}/${hit.raw} ${hit.shopBase}` : `FAIL ${errors[0]}`;
  console.log(`${c.slug.padEnd(24)} ${status}`);
}

const hits = results.filter((r) => r.shopBase && r.niche > 0);
fs.writeFileSync(
  path.join(root, "data/wave4-probe.json"),
  JSON.stringify({ probedAt: new Date().toISOString(), hits: hits.length, results }, null, 2),
);
console.log(`\nHits: ${hits.length}/${results.length}`);
