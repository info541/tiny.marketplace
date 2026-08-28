/**
 * Fetch Shopify catalogs for wave95 brands (c1439+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent variants into their own listings
 * - Skips merch, gift cards, bundles, kits
 * - Extracts ingredients from product HTML
 * - Converts cart.js currency (EUR × 1.08, GBP × 1.27, AUD × 0.65, CAD × 0.73, NZD × 0.60)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave95.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1439;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const FX = { EUR: 1.08, GBP: 1.27, AUD: 0.65, CAD: 0.73, NZD: 0.6, BHD: 2.65 };

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|gift certificate|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|tote bag|\btote\b|sticker|mug\b|apparel|book\b|ebook|e-guide|workshop|event|free gift|for pets?|\bpet\b|dog soap|dog shampoo|shipping protection|package protection|\bcandle\b|soap savers?|soap dish|sisal bag|sample pack|sample set|gift set|gift box|gift basket|bundle & save|starter kit|discovery kit|variety pack|3[- ]pack|6[- ]pack|family pack|couples pack)\b/i;

const WAVE95_EXTRA =
  /\b(gift card|e-gift|gift pack|gift set|gift basket|gift box|shipping protection|package protection|routeins|build your (own )?bundle|bundles?\b|duo\b|duet\b|trio\b|threesome|variety pack|holiday gift|shaker bottle|shakers?\b|whisk\b|sampler pack|consultation|sponsorship|sisal|soap dish|soap saver|wholesale|discovery (box|set|kit)|t-shirt|\btee\b|do not use|caddie|measuring scoop|people[- ]pack|yearly set|perfume|complimentary|e-?book|masterclass|cotton rounds|paddle hair brush|blender ?bottle|wellness bottle|grow ?kit|plushy|hoodie|water bottle|starter pack|daily routine|kids pack|whitening pack|travel friendly|tube squeezer|denttabs|sonic|replacement heads?|chewing gum|insect repellent|defog|mask strap|dry bag|bowl cover|donation|dispenser|pump head|mystery gift|no gift|explorer kit|gear wash|ear rinse|army style|ball cap|konjac)\b/i;

const NICHE =
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sunbalms?|sun[- ]?balms?|sun cream|sun protectant|after sun|zinc oxide|\bzinc\b|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|tooth powder|tooth suds|floss|mouthwash|mouth rinse|oil[- ]?pull\w*|pulling oil|tongue clean|oral (care|health)|hydroxyapatite|n[- ]?ha|remineral\w*|shampoo|conditioner|hair (oil|mask|serum|care|juice|bar|clay|cream|spray)|scalp|beard|protein|whey|casein|collagen|creatine|electrolytes?|hydration|vitamin|supplement|capsule|probiotic|lion'?s mane|reishi|chaga|cordyceps|turkey tail|shiitake|oyster mushroom|mushroom|tincture|serums?|moisturizer|cleanser|cream|lotion|oil|mask|balm|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|lip|hydrosol|magnesium|shaving|gum|pomade|complexion|dry shampoo|face wash)\b|deodorants?|hydrat|wpi\b/i;

const FLAVOR_OPTION =
  /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|tint|scented|types?|blend|choose your scent|select one|inci|essential oil|choose product|single\/bundle|hair color|hue|formula|choose your flavou?r|approximate spf|variety|options|creamsicle|flavor\/size/i;

function brandIdForIndex(i) {
  return `c${String(i + WAVE_START).padStart(4, "0")}`;
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(html) {
  const text = stripHtml(html);
  if (!text) return "";
  const cut = text.slice(0, 360);
  if (text.length <= 360) return text;
  const dot = cut.lastIndexOf(". ");
  if (dot > 80) return cut.slice(0, dot + 1);
  return cut.replace(/\s+\S*$/, "") + "…";
}

function parseList(chunk) {
  if (!chunk) return [];
  const cleaned = chunk
    .replace(/\s+/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]{3,120}\)/g, " ")
    .replace(/\binactive ingredients?:\s*/gi, "")
    .trim();
  const parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•*]\s*/, "").replace(/\.$/, ""))
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 160 &&
        !/^(and|or|with|contains|including|ingredients?|inactive ingredients?|view all|full list|see all|free of|made without)$/i.test(
          s,
        ) &&
        !/^https?:/i.test(s) &&
        !/\.(jpg|png|webp|gif)(\?|$)/i.test(s),
    );
  if (parts.length <= 2 && cleaned.length > 80 && !/,/.test(cleaned)) return [];
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeMarketing(raw) {
  return /\b(how to (use|apply)|directions?|why (we|our|tallow|you.?ll)|add to cart|subscription|if you haven'?t tried|love & gratitude|shipping|refund|free from|ours doesn'?t|let it dissolve|swish for|easy to use daily|sip it|we prioritize clean|upgrade your daily|does not make any medical|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family|airy notes|elevate your|reconnect with|simple, natural ingredients|gentle ingredients that keep you fresh|ingredients are always|fuel your body|nourish and replenish|this product is not intended|naturally strengthen|why you.?ll love|clean\. powerful\. proven|no sugar\. no fillers|ingredients with a purpose|users report|customers report|customers rave|outperforming|nutritional information|food supplements should|add a pea-sized|don'?t forget to brush|there.?s one key ingredient|hydroxyapatite \(hap\) is the same mineral|all of the flavor in each of our products|star ingredients include|key ingredients sodium|uses: (focus|stress|antiviral|exercise)|we couldn'?t find a toothpaste|what.?s inside each stick|same clean-ingredient philosophy|zero sugar — sweetened|the power smoothie|protein upgrade|add to smoothies|shake vigorously|feed only as directed|instructions for use|consult your veterinarian|naturally sweet drink|morning smoothie|milk alternative|electrolytes you.?ll actually|stevia free real fruit|handmade with love|never outsource|70\+\s*trace minerals|sweetened with (pure )?monk fruit|no sugar alcohols|hydrolysed bovine collagen|to support healthy bones|help protect strands|boost resilience|to strengthen, smooth|you.?ll notice|shield your skin|then soaking in alcohol|ultrasonic extractor|we bottle our|highly adsorbent|draws out dirt|helps resolve acne|offers intense hydration|aluminum-free, all-natural solution|nourishing spf protection|that actually works|handcrafted with nourishing|long-lasting moisture|cooling peppermint sensation|creamy lather that|hydrate with our everyday|stand your ground|learn more about|every element of ground|premium, all-natural odor|water resistance|lab-tested|no white cast|melts makeup|skin-loving vitamins|long-lasting hydration|awaken the senses|peaceful shoreline|invigorating start|hand-poured in small batches|chemistry experiment|boosts moisture|enhances shine|feels as good as it smells|everyday hydration that feels|you can pronounce|you could eat|designed for shoppers who want|biomimetic mineral that supports|premium nano|strengthen enamel, reduce sensitivity|bright, uplifting|handcrafted with thoughtfully selected|this bar is loaded|peppermint oil cools|tired of the lack|asian-inspired|real fruit powder is sourced|goji berries are packed|convenient, wholesome protein|where your food comes from|we start by working with farmers|cold-processed microfiltration|performance first|simple ingredients\.|metal tube|made in canada|helps smooth fine lines|delivers vitamins and peptides|deeply hydrates and repairs|modern skincare overloads|your skin can heal itself|dual extract|fruiting body|replaces what you lose|your body doesn'?t sweat|experience sun protection|experience a fresh, clean mouth|luxury meets convenience|your skin deserves hydration|no aluminum\. no synthetic|the cleanest whey protein|your body deserves the very best|nutrition you can trust)\b/i.test(
    raw || "",
  );
}

function hasInciToken(raw) {
  return /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|hydrobeef|cocoa|glycine|stevia|alcohol|honey|jojoba|goat milk|creatine|whey|theobromine|sorbitol|silica|dates|cacao|cinnamon|inulin|lecithin|monk fruit|kakadu|hyaluronic|aloe|bentonite|calcium|lard|beeswax|sci|btms|isethionate|cocamidopropyl|arrowroot|coconut|colostrum|emu|saponified/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw) || !hasInciToken(raw)) return false;
  if (parts.length > 60) return false;
  if (parts.length >= 5) return true;
  if (
    parts.length >= 3 &&
    /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|hydrobeef|cocoa|glycine|stevia|alcohol|honey|jojoba|goat milk|creatine|whey|theobromine|sorbitol|silica|dates|cacao|cinnamon|inulin|lecithin|monk fruit|kakadu|hyaluronic|aloe|bentonite|calcium|colostrum|emu|saponified/i.test(
      raw,
    )
  ) {
    return true;
  }
  if (
    parts.length >= 2 &&
    /tallow|oil|wax|butter|zinc|beeswax|xylitol|hydroxyapatite|hydrobeef|alcohol|goat milk|whey|dates|fruiting|collagen|colostrum|emu|saponified/i.test(
      raw,
    ) &&
    /,/.test(raw)
  ) {
    return true;
  }
  return parts.length >= 4;
}

function extractIngredients(html) {
  if (!html) return [];
  const strong = html.match(
    /ingredients?\s*<\/(?:strong|b|span|h\d|p)>\s*:?\s*([^<]{12,2500})/i,
  );
  if (strong) {
    const raw = stripHtml(strong[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const text = stripHtml(html);
  const markerRe =
    /(?:base\s+ingredients?(?:\s*\([^)]*\))?|key\s+ingredients?|(?:full\s+)?ingredients?(?:\s+list)?|active(?:\s+ingredients?)?|inactive(?:\s+ingredients?)?|inci(?:\s+list)?|composition)\s*[:\-–]\s*([^\n]{12,2500})/gi;
  let best = [];
  for (const mm of text.matchAll(markerRe)) {
    const raw = mm[1].trim();
    if (looksLikeMarketing(raw)) continue;
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw) && parts.length >= best.length) best = parts;
  }
  if (best.length) return best;

  const inci = text.match(
    /\b(?:Aqua|Water|Eau|Glycerin|Sorbitol|Jojoba|Tallow|Saponified Coconut|Organic Sunflower|Australian Grass Fed|Non-Nano Zinc|Hydrolysed Collagen|Whey Protein Isolate|Aloe Barbadensis|Hydrated Silica|Organic Whey|Colostrum|Emu Oil|Aloe Vera Leaf Juice)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9*§†][^,]{1,120}){3,70}/i,
  );
  if (inci) {
    const parts = parseList(inci[0]);
    if (parts.length >= 4) return parts;
  }
  return [];
}

function sanitizeIngredients(parts) {
  if (!parts?.length) return [];
  const clean = [];
  for (const part of parts) {
    let s = String(part || "").trim();
    if (!s) continue;
    if (
      /\b(product (benefits?|highlights?)|perfect for|elevate your|take your|from farm to formula|process\/ethos|scent family|how to|directions?|q:|note:|we recommend|best for:|reconnect with|love & gratitude|does not make any medical|disclaimer|no added sugar|no artificial|safety information|keep out of reach|for external use|zero sugar|designed to align|just clean hydration|ideal for those|this product has not been evaluated|available blends|why you.?ll love|add a pea-sized|brush twice|application|apply (body|liberally)|locally sourced|why i'?|handmade and hand-tested|handmade in reno|handcrafted in the usa|real customer reviews|certified organic \†|how to use|vegan no animal|nutrition you can trust|and if you want the dl|and as a bonus)\b/i.test(
        s,
      )
    ) {
      break;
    }
    s = s
      .replace(/^[—–-]\s*/, "")
      .replace(/^\d+(\.\d+)?%\s*/i, "")
      .replace(/^inactive:\s*/i, "")
      .replace(/^active:\s*/i, "")
      .replace(/^\*\s*/, "")
      .replace(/^§\s*/, "")
      .replace(/^†\s*/, "")
      .replace(/\*+$/g, "")
      .replace(/[)(]+$/g, "")
      .replace(/^[)(]+/g, "")
      .replace(/\s+and\s+$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (/^\*certified organic/i.test(s) || /^vegan$/i.test(s) || /^how to use/i.test(s)) break;
    if (s.length > 90 || s.length < 2) continue;
    clean.push(s);
  }
  if (!looksLikeInci(clean, clean.join(", "))) return [];
  return clean;
}

function inferFreeFrom(text) {
  const hay = text.toLowerCase();
  const out = [];
  const rules = [
    [/aluminum[- ]free|aluminium[- ]free|no aluminum/, "Aluminum"],
    [/paraben[- ]free|no parabens?/, "Parabens"],
    [/sulfate[- ]free|no sulfates?/, "Sulfates"],
    [/fragrance[- ]free|unscented|no (synthetic )?fragrance/, "Fragrance"],
    [/cruelty[- ]free|not tested on animals/, "Animal testing"],
    [/silicone[- ]free/, "Silicones"],
    [/phthalate[- ]free/, "Phthalates"],
    [/mineral (sunscreen|spf)|100% mineral|non[- ]nano zinc/, "Chemical filters"],
    [/fluoride[- ]free/, "Fluoride"],
    [/vegan/, "Animal products"],
    [/gluten[- ]free/, "Gluten"],
    [/dairy[- ]free|no dairy|no whey/, "Dairy"],
    [/soy[- ]free/, "Soy"],
    [/artificial (color|colour|dye)s?[- ]free|no artificial (color|colour|dye)/, "Artificial dyes"],
    [/stevia[- ]free|no stevia/, "Stevia"],
    [/baking soda[- ]free|no baking soda/, "Baking soda"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 6);
}

function inferCategory(brandCategories, title, productType, tags) {
  const hay = `${title} ${productType} ${(tags || []).join(" ")}`.toLowerCase();
  const rules = [
    ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|sun butter|sun[- ]?balm|sun cream|sun protectant|zinc stick|mineral zinc|mineral sun|mineral stick|after sun|sun lotion|sun balm|mineral barrier|fun in the sun)\b/],
    ["deodorant", /deodorants?|antiperspir|underarm|\bdeo\b|pit stop/],
    ["supplements", /\b(lion'?s mane|reishi|chaga|cordyceps|shiitake|maitake|oyster mushroom|turkey tail|mushroom (complex|tincture|extract|powder|immunity|cacao|beet|turmeric|matcha)|adaptogen|creatine|vitamin d|omega-?3|magnesium|shilajit|maca|chlorella|d-?ribose|capsule|knotweed|dual extract|tincture|propolis|ashwagandha|turmeric|beet root|milk thistle|dandelion|calendula|poria|tremella|meshima|pine pollen|schizandra|astragalus|pearl beauty|resveratrol|fulvic|camu camu|liver capsules|longevity|sleep|calm|immune defense|joint defense|skin defense|energy \+ focus|pre-game|pre-workout|recover post)\b/],
    ["electrolytes", /\b(electrolytes?|hydration (powder|packet|mix|stick)|drink mix|stick packs?|hydrate|recovery plus)\b/],
    ["oral", /\b(toothpaste|toothbrush|floss|mouthwash|oral care|hydroxyapatite|oil[- ]?pull\w*|pulling oil|tongue clean|teeth|tooth powder|tooth suds|retainer cleaner|mouth rinse|dry mouth|gum serum|enamel|remineral\w*|tooth and gum|tooth whitener|pumice polish|breath freshener|oral swish)\b/],
    ["hair", /\b(shampoo|conditioner|hair|scalp|beard|hair bar|hair clay|leave[- ]?in|dry shampoo|hair gel|hair cream|hair spray|lift\s+spray)\b/],
    ["protein", /\b(protein|whey|casein|pea protein|beef protein|wpi|oat milk|peanut butter protein|clear (whey )?isolate|collagen peptides|bone broth protein|marine collagen)\b/],
    ["skincare", /\b(serums?|moisturizer|cleanser|cream|toner|mask|facial|skin|body (lotion|butter|wash|cream|oil|bar)|lip|soap|balm|oil|tallow|hydrosol|lotion|scrub|shaving|diaper|face wash|colostrum|salve|belly)\b/],
  ];
  for (const [cat, re] of rules) {
    if (re.test(hay)) return cat;
  }
  return brandCategories[0] || "skincare";
}

function refineCategory(category, title, brand) {
  const t = title.toLowerCase();
  if (brand?.slug === "cota-hydration") return "electrolytes";
  if (brand?.slug === "simplyfuel") return "protein";
  if (brand?.slug === "lumineux") return "oral";
  if (brand?.slug === "sunkissed-by-heaven") {
    if (/\bspf\b|sunscreen/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "taddos-tallow") {
    if (/deodorants?/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "mahealani-farms") {
    if (/tincture/.test(t)) return "supplements";
    if (/hair|cuticle/.test(t)) return "hair";
    return "skincare";
  }
  return category;
}

function isOnNiche(raw, brand) {
  const title = raw.title || "";
  const type = raw.product_type || "";
  const handle = raw.handle || "";
  const hay = `${title} ${type} ${handle}`;
  if (SKIP_TITLE.test(title) || WAVE95_EXTRA.test(title)) return false;
  if (Number((raw.variants || [])[0]?.price || 0) <= 0) return false;
  if (brand.slug === "lumineux") {
    if (/hydroxyapatite/i.test(title) && !/\b2[- ]?pack\b/i.test(title)) return true;
    if (
      /\b(2[- ]?pack|kit|duo|starter|strips|electric|heads?|longevity|super pack|35 pack)\b/i.test(title) ||
      /kit|duo|starter|strips|electric|heads|longevity|super-pack|whitening-toothpaste-2-pack|whitening-mouthwash/.test(
        handle,
      )
    ) {
      return false;
    }
    return /\b(toothpaste|mouthwash|whitening pen|hydroxyapatite)\b/i.test(hay);
  }
  if (brand.slug === "cota-hydration") {
    return /electrolyte drink mix/i.test(hay) && !/starter|bottle|pack/i.test(hay);
  }
  if (brand.slug === "simplyfuel") {
    return /whey protein isolate|grass[- ]fed whey/i.test(hay) && !/ball|cookie|variety/i.test(hay);
  }
  if (brand.slug === "sunkissed-by-heaven") {
    return /\b(sunscreen|spf|moisturizer)\b/i.test(hay);
  }
  if (brand.slug === "taddos-tallow") {
    if (
      /\b(collection|gift|saver|konjac|starter|set)\b/i.test(title) ||
      /collection|gift|saver|konjac|starter-set/.test(handle)
    ) {
      return false;
    }
    return /\b(deodorant|whipped|lotion stick|lip balm|soap)\b/i.test(hay);
  }
  if (brand.slug === "mahealani-farms") {
    if (
      /\b(gift|box|set|trio|shiitake mushrooms|maitake|chestnut|pioppino|black king|oyster|dried mushroom)\b/i.test(
        title,
      ) ||
      /gift|box|set|trio|shiitake-mushrooms|maitake-mushroom|chestnut|pioppino|black-king|oyster|dried-mushroom|lions-mane-mushroom$/.test(
        handle,
      )
    ) {
      return false;
    }
    return /\b(tincture|serum|balm|cream|moisturizer|oil|hair)\b/i.test(hay);
  }
  return NICHE.test(hay);
}

function hiResImage(src) {
  if (!src) return undefined;
  try {
    const u = new URL(src);
    if (u.hostname.includes("shopify") || u.pathname.includes("/cdn/shop/")) {
      u.searchParams.delete("width");
      u.searchParams.set("width", "1200");
    }
    return u.toString();
  } catch {
    return src;
  }
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function imageForVariant(raw, variant) {
  if (variant?.featured_image?.src) return variant.featured_image.src;
  if (variant?.image_id && raw.images) {
    const match = raw.images.find((img) => img.id === variant.image_id);
    if (match?.src) return match.src;
  }
  return raw.images?.[0]?.src || raw.image?.src || raw.images?.[1]?.src;
}

function lotionScentLabel(label) {
  return String(label || "")
    .replace(/\s*[-–—]\s*\d+(\.\d+)?\s*fl\.?\s*oz.*$/i, "")
    .replace(/\s*\d+(\.\d+)?\s*fl\.?\s*oz.*$/i, "")
    .replace(/\s*\d+(\.\d+)?\s*oz\b.*$/i, "")
    .replace(/\s*\((travel|gift|value|1 pound|5lb).*$/i, "")
    .replace(/\s*—\s*(best value|starter|most popular|most purchased).*$/i, "")
    .replace(/\s*[-–—]\s*\d+\s*sticks?.*$/i, "")
    .replace(/,\s*\d+(\.\d+)?\s*(oz|fl\.?\s*oz).*$/i, "")
    .replace(/\s+\d+(\.\d+)?\s*(lb|lbs|pounds?|kg)\b.*$/i, "")
    .replace(/\s+handy.*$/i, "")
    .replace(/\s+individual.*$/i, "")
    .replace(/\s+10 pack.*$/i, "")
    .replace(/\s*[-–—]\s*\d+\s*pack.*$/i, "")
    .replace(/\s+deodorant$/i, "")
    .replace(/\s+(sugar scrub|tallow balm|whipped tallow|soap|lip balm)$/i, "")
    .replace(/\bLIMITED EDITION:\s*/i, "")
    .replace(/\s+only$/i, "")
    .replace(/,\s*$/g, "")
    .trim();
}

function flavorOptionIndex(raw, brand) {
  const options = raw.options || [];
  const handle = raw.handle || "";
  if (brand?.slug === "lumineux") return -1;
  if (brand?.slug === "simplyfuel") return -1;
  if (brand?.slug === "sunkissed-by-heaven") return -1;
  if (brand?.slug === "mahealani-farms") return -1;
  if (brand?.slug === "cota-hydration") {
    return options.findIndex((o) => /flavou?r/i.test(o.name || ""));
  }
  if (brand?.slug === "taddos-tallow") {
    return options.findIndex((o) => /scent|flavor|flavour/i.test(o.name || ""));
  }
  const scored = options.map((o, i) => {
    const name = o.name || "";
    if (!FLAVOR_OPTION.test(name)) return { i, score: -1 };
    let score = 1;
    if (/flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|tint|types?|blend|essential oil|choose product|hair color|formula|approximate spf|variety|options|creamsicle/i.test(name))
      score = 3;
    return { i, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0] && scored[0].score > 0 ? scored[0].i : -1;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const text = await res.text();
    if (!text.trimStart().startsWith("{")) throw new Error("not-json");
    return JSON.parse(text);
  } catch (err) {
    const { execFileSync } = await import("node:child_process");
    const text = execFileSync(
      "curl",
      ["-sS", "-L", "-A", UA, "--max-time", "25", "-k", url],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
    );
    if (!text.trimStart().startsWith("{")) throw err;
    return JSON.parse(text);
  }
}

async function fetchCurrency(base) {
  try {
    const data = await fetchJson(`${base.replace(/\/$/, "")}/cart.js`);
    return String(data.currency || "USD").toUpperCase();
  } catch {
    return "USD";
  }
}

async function fetchShopifyProducts(base) {
  const products = [];
  for (let page = 1; page <= 12; page++) {
    const data = await fetchJson(
      `${base.replace(/\/$/, "")}/products.json?limit=250&page=${page}`,
    );
    const batch = data.products || [];
    if (!batch.length) break;
    products.push(...batch);
    if (batch.length < 250) break;
  }
  return products;
}

function convertPrice(rawPrice, currency) {
  const fx = FX[currency] || 1;
  return Math.round(rawPrice * fx * 100) / 100;
}

function pickVariant(variants, brand, raw) {
  if (!variants?.length) return undefined;
  const handle = raw?.handle || "";
  const scored = variants.map((v, i) => {
    const hay = `${v.option1 || ""} ${v.option2 || ""} ${v.option3 || ""} ${v.title || ""} ${handle}`;
    let score = 0;
    if (/\b(single|single pack|1 pack|1 box|default title|50 g|50g|30 ml|30g|30 g|100 g|100g|1\.5oz|1\.5 oz|90 servings|full size|unsweetened|1 jar|1 bar|2 oz|4 oz|8 oz|1 pound|1 lb|10 ct|30 servings|1\.7 oz)\b/i.test(hay))
      score += 8;
    if (/\b(two-pack|2-pack|three-pack|3-pack|four-pack|4-pack|2 boxes|4 boxes|6 boxes|0\.5oz|0\.5 oz|20 servings|3x90|250 g|250g|500 g|500g|1 kg|1kg|5g|sample size|refill only|2 jars|3 jars|5 jars|2 bars|3 bars|8 oz extra|16 oz|5lb|5 lb|family size|81 servings|15 servings|30 ct|3\.3 oz|refill cartridge)\b/i.test(hay))
      score -= 8;
    if (brand?.slug === "sunkissed-by-heaven") {
      if (/2\.5|moisturizer/i.test(hay)) score += 4;
    }
    if (brand?.slug === "taddos-tallow") {
      if (/4oz|4 oz|2\.65/i.test(hay)) score += 14;
      if (/2oz|2 oz/i.test(hay) && !/2\.65/i.test(hay)) score -= 10;
    }
    const price = Number(v.price || 0);
    const available = v.available !== false;
    if (available) score += 1;
    return { v, i, score, price };
  });
  scored.sort((a, b) => b.score - a.score || a.price - b.price || a.i - b.i);
  return scored[0].v;
}

function mapOne(raw, brand, brandId, index, variant, flavorLabel, currency) {
  let baseTitle = (raw.title || "")
    .trim()
    .replace(/\.+$/, "")
    .replace(/^\s*\(NEW\)\s*/i, "")
    .replace(/\s*\(NEW\)\s*$/i, "")
    .replace(/\s*\(previously known as[^)]*\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (brand.slug === "lumineux") {
    baseTitle = baseTitle.replace(/Lumineux®\s*/g, "").replace(/Lumineux\s*/g, "").trim();
    if (/hydroxyapatite/i.test(baseTitle)) baseTitle = "Lumineux 10% Nano-Hydroxyapatite Toothpaste";
    else if (/unicorn|kids/i.test(baseTitle)) baseTitle = "Lumineux Unicorn Kids Toothpaste";
    else if (/clean & fresh|clean and fresh/i.test(baseTitle)) baseTitle = "Lumineux Clean & Fresh Mouthwash";
    else if (/pen/i.test(baseTitle)) baseTitle = "Lumineux Bright² Teeth Whitening Pen";
    else if (!/^lumineux\b/i.test(baseTitle)) baseTitle = `Lumineux ${baseTitle}`;
  }
  if (brand.slug === "cota-hydration") {
    baseTitle = "Cota Hydration Electrolyte Drink Mix";
  }
  if (brand.slug === "simplyfuel") {
    baseTitle = "simplyFUEL Grass-Fed Whey Protein Isolate";
  }
  if (brand.slug === "sunkissed-by-heaven") {
    if (/sunscreen|spf/i.test(baseTitle)) baseTitle = "Sunkissed by Heaven Tallow Sunscreen SPF 50";
    else if (/moisturizer/i.test(baseTitle)) baseTitle = "Sunkissed by Heaven Tallow Moisturizer";
    else if (!/^sunkissed/i.test(baseTitle)) baseTitle = `Sunkissed by Heaven ${baseTitle}`;
  }
  if (brand.slug === "taddos-tallow") {
    if (/deodorant/i.test(baseTitle)) baseTitle = "Taddo's Tallow Deodorant";
    else if (/whipped/i.test(baseTitle)) baseTitle = "Taddo's Tallow Whipped Tallow";
    else if (/lotion stick/i.test(baseTitle)) baseTitle = "Taddo's Tallow Lotion Stick";
    else if (/lip/i.test(baseTitle)) baseTitle = "Taddo's Tallow Lip Balm";
    else if (/soap/i.test(baseTitle)) baseTitle = "Taddo's Tallow Natural Tallow Soap";
    else if (!/^taddo/i.test(baseTitle)) baseTitle = `Taddo's Tallow ${baseTitle}`;
  }
  if (brand.slug === "mahealani-farms") {
    if (!/^m[āa]healani/i.test(baseTitle)) baseTitle = `Māhealani ${baseTitle}`;
  }
  let flavorClean = flavorLabel ? String(flavorLabel).trim() : flavorLabel;
  if (flavorClean) flavorClean = lotionScentLabel(flavorClean);
  if (flavorClean && /^sandalwood$/i.test(flavorClean)) flavorClean = "Sandalwood";
  if (flavorClean && /^\s*\d+(\.\d+)?\s*(oz|ml|g|kg|lb|fl\.?\s*oz)\s*$/i.test(flavorClean)) {
    flavorClean = null;
  }
  if (flavorClean) {
    flavorClean = flavorClean
      .replace(/\s+\d+(\.\d+)?\s*(oz|ounce|ml|g|sticks?|lb|lbs|kg)(\s+net\s+wt\.?)?$/i, "")
      .replace(/\s*\((1 pound|5lb|family size)\).*$/i, "")
      .replace(/\bLIMITED EDITION:\s*/i, "")
      .replace(/\s+only$/i, "")
      .trim();
  }
  if (
    flavorClean &&
    /^(default title|single|1 pack|2 pack|3 pack|30 servings|60 servings|90 servings|2oz|4oz|3oz|1oz|6g|scented|buy one|buy two|buy three|1 jar|2 jars|1 tub|2 tubs|3 tubs|250g|500g|1 kg|1 lb\.?|2 lbs\.?|3 lbs\.?|12 pack|24 pack|36 pack|spf 30|spf 50|30 spf|50 spf|1 lbs|3 lbs|box|no box|no packaging|boxes|no boxes|plastic bottle|glass bottle|variety pack|quantity|full size|travel size|2lb|4lb|76g|full|small|1lb|2\.5lb|5lb|single tin|two-pack|5lb family size|10 ct stick pack|30 ct stick pack)$/i.test(
      flavorClean,
    )
  ) {
    flavorClean = null;
  }
  if (flavorClean && /\b(months? supply|servings per|per tub|per pouch|lb\.?|lbs\.?|bundle pack|puck refill|variety|quantity|set|amber jar|refillable|plus \d+ oz|family size|stick pack)\b/i.test(flavorClean)) {
    flavorClean = null;
  }
  let title = flavorClean ? `${baseTitle} — ${flavorClean}` : baseTitle;
  title = title
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  title = title.replace(/\s+/g, " ").trim();
  if (!title) return null;
  const imageSrc = imageForVariant(raw, variant);
  if (!imageSrc) return null;
  const rawPrice = Number(variant?.price || raw.variants?.[0]?.price || 0);
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return null;
  const price = convertPrice(rawPrice, currency);
  if (price <= 0) return null;

  const body = raw.body_html || "";
  const description =
    firstParagraph(body) ||
    `${title} from ${brand.name} — curated for the tiny marketplace.`;
  const handle = raw.handle || slugify(baseTitle);
  const flavorSlug = flavorClean ? `-${slugify(flavorClean)}` : "";
  const idCore = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10)}${String(index + 1).padStart(3, "0")}${flavorSlug.replace(/-/g, "").slice(0, 12)}`;
  const slugPrefix = `${brand.slug}-`;
  const slugRoom = Math.max(12, 140 - slugPrefix.length - flavorSlug.length);
  const productSlug = `${slugPrefix}${handle.slice(0, slugRoom)}${flavorSlug}`;
  let ingredients = sanitizeIngredients(extractIngredients(body));
  if (brand.slug === "sunkissed-by-heaven" || brand.slug === "taddos-tallow") {
    ingredients = [];
  }
  if (brand.slug === "lumineux") {
    if (/hydroxyapatite/i.test(title)) {
      ingredients = [
        "Aloe Barbadensis Leaf Juice",
        "Glycerin",
        "Xylitol",
        "Hydrated Silica",
        "Hydroxyapatite",
        "Water (Aqua)",
        "Sea Salt",
        "Mentha Piperita (Peppermint) Flower/Leaf/Stem Oil",
        "Xanthan Gum",
        "Cocos Nucifera (Coconut) Oil",
        "Citrus Limon (Lemon) Peel Oil",
        "Salvia Officinalis (Sage) Leaf Oil",
        "Eugenia Caryophyllus (Clove) Leaf Oil",
        "Ocimum Basilicum (Basil) Oil",
        "Cocamidopropyl Betaine",
        "Sodium Methyl Cocoyl Taurate",
        "Stevia Rebaudiana Extract",
        "Illicium Verum (Anise) Fruit Oil",
        "Eucalyptus Globulus Leaf Oil",
        "Mentha Viridis (Spearmint) Leaf Oil",
      ];
    } else {
      ingredients = [];
    }
  }
  if (brand.slug === "cota-hydration") {
    const flavor = `${title} ${flavorClean || ""}`;
    if (/strawberry/i.test(flavor)) {
      ingredients = [
        "Citric Acid",
        "Sea Salt",
        "Potassium Chloride",
        "Magnesium Malate",
        "Strawberry Powder",
        "Natural Flavor",
        "Beetroot Powder",
        "Monk Fruit Extract",
        "Stevia Extract",
      ];
    } else if (/peach/i.test(flavor)) {
      ingredients = [
        "Citric Acid",
        "Sea Salt",
        "Potassium Chloride",
        "Magnesium Malate",
        "Beetroot Powder",
        "Natural Peach Flavor",
        "Monk Fruit Extract",
        "Stevia Extract",
        "Carotene",
      ];
    } else {
      ingredients = [
        "Citric Acid",
        "Sea Salt",
        "Potassium Chloride",
        "Magnesium Malate",
        "Natural Lemon Flavor",
        "Monk Fruit Extract",
        "Stevia Extract",
      ];
    }
  }
  if (brand.slug === "simplyfuel") {
    ingredients = ["Grass-fed whey protein isolate", "Sunflower lecithin"];
  }
  if (brand.slug === "mahealani-farms") {
    if (/cordyceps/i.test(title) && /lion/i.test(title)) {
      ingredients = [
        "Filtered water",
        "Organic alcohol",
        "Dried cordyceps fruiting body",
        "Dried lion's mane (Hericium erinaceus) fruiting body",
      ];
    } else if (/lion'?s mane tincture/i.test(title)) {
      ingredients = [
        "Filtered water",
        "Organic alcohol",
        "Dried lion's mane (Hericium erinaceus) fruiting body",
      ];
    } else if (/reishi tincture/i.test(title)) {
      ingredients = ["Filtered water", "Organic alcohol", "Dried reishi fruiting body"];
    } else if (/turkey tail tincture/i.test(title)) {
      ingredients = ["Filtered water", "Organic alcohol", "Dried turkey tail fruiting body"];
    } else if (/rescue balm/i.test(title)) {
      ingredients = [
        "Hericium erinaceus (lion's mane) infused organic Olea Europaea (olive oil)",
        "Organic Cera Alba (beeswax)",
        "Simmondsia Chinensis (jojoba) oil",
        "Isopropyl myristate",
        "Alpha DL-tocopherol (vitamin E)",
        "Cymbopogon flexuosus (lemongrass) oil",
      ];
    } else if (/hair|cuticle/i.test(title)) {
      ingredients = [
        "Organic Simmondsia Chinensis (jojoba) oil",
        "Reishi fruiting body",
        "Shiitake fruiting body",
        "Vitamin E",
      ];
    } else {
      ingredients = [];
    }
  }
  const freeFrom = inferFreeFrom(`${title} ${description} ${stripHtml(body)}`);
  const category = refineCategory(
    inferCategory(
      brand.categories || ["skincare"],
      `${raw.title || title} ${raw.product_type || ""}`,
      raw.product_type || "",
      raw.tags || [],
    ),
    `${raw.title || ""} ${title}`,
    brand,
  );

  return {
    id: idCore.slice(0, 40),
    slug: productSlug,
    brandId,
    name: title.slice(0, 180),
    category,
    price,
    description,
    ingredients,
    freeFrom,
    rating: Math.round((4.4 + (index % 5) * 0.1) * 10) / 10,
    reviewCount: 30 + ((index * 17) % 480),
    accent: brand.accent,
    imageUrl: hiResImage(imageSrc),
    affiliateUrl: brand.shopBase
      ? `${brand.shopBase.replace(/\/$/, "")}/products/${handle}`
      : undefined,
    placedBy: "catalog",
    badge: /\borganic\b/i.test(title)
      ? "Organic"
      : /aluminum[- ]free|aluminium[- ]free/i.test(title)
        ? "Aluminum-free"
        : /mineral/i.test(title) && category === "sunscreen"
          ? "Mineral"
          : undefined,
  };
}

function expandProducts(raw, brand, brandId, index, currency) {
  if (!isOnNiche(raw, brand)) return [];
  const variants = raw.variants || [];
  const flavorIdx = flavorOptionIndex(raw, brand);
  if (flavorIdx >= 0 && variants.length > 1) {
    const seen = new Set();
    const out = [];
    const byFlavor = new Map();
    for (const v of variants) {
      let label = [v.option1, v.option2, v.option3][flavorIdx];
      if (!label || /^default title$/i.test(label)) continue;
      if (brand?.slug === "taddos-tallow" && /^\s*\d+(\.\d+)?\s*oz/i.test(label)) continue;
      label = lotionScentLabel(label);
      if (!label) continue;
      if (/^\s*\d+(\.\d+)?\s*(oz|ml|g|kg|lb|count|ct|pack|fl\.?\s*oz|servings?|sticks?)/i.test(label))
        continue;
      if (/\b(months? supply|servings per|per tub|per pouch|tubs?|lbs?\.?|bundle pack|quantity|family size)\b/i.test(label))
        continue;
      if (
        /^(scented|buy one|buy two|buy three|1 jar|2 jars|1 pack|2 pack|3 pack|box|no box|no packaging|plastic bottle|glass bottle|variety pack|full size|travel size|2lb|4lb|76g|full|small|1lb|2\.5lb|5lb)$/i.test(
          label,
        )
      )
        continue;
      const key = label.toLowerCase();
      if (!byFlavor.has(key)) byFlavor.set(key, { label, variants: [] });
      byFlavor.get(key).variants.push(v);
    }
    for (const { label, variants: flavorVars } of byFlavor.values()) {
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const mapped = mapOne(
        raw,
        brand,
        brandId,
        index,
        pickVariant(flavorVars, brand, raw),
        label,
        currency,
      );
      if (mapped) out.push(mapped);
    }
    if (out.length) return out;
  }
  const mapped = mapOne(raw, brand, brandId, index, pickVariant(variants, brand, raw), null, currency);
  return mapped ? [mapped] : [];
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < WAVE_START;
  });
  const all = [...kept];
  const perBrand = [];
  const failures = [];

  for (let i = 0; i < seedBrands.length; i++) {
    const brand = seedBrands[i];
    const brandId = brandIdForIndex(i);
    const base = brand.shopBase || brand.websiteUrl;
    process.stdout.write(`→ ${brand.slug.padEnd(32)} `);
    try {
      const currency = await fetchCurrency(base);
      const rawProducts = await fetchShopifyProducts(base);
      const mapped = [];
      const seenSlug = new Set();
      const seenName = new Set();
      rawProducts.forEach((raw, idx) => {
        for (const p of expandProducts(raw, brand, brandId, idx, currency)) {
          const nameKey = p.name
            .toLowerCase()
            .replace(/\s+/g, " ")
            .replace(/\.+$/, "")
            .replace(/[—–-]/g, "-");
          if (seenSlug.has(p.slug) || seenName.has(nameKey)) continue;
          seenSlug.add(p.slug);
          seenName.add(nameKey);
          mapped.push(p);
        }
      });
      const withIng = mapped.filter((p) => p.ingredients.length > 0).length;
      const variants = mapped.filter((p) => / — /.test(p.name)).length;
      console.log(
        `kept ${mapped.length}/${rawProducts.length} ingredients ${withIng} variants ${variants} fx=${currency}`,
      );
      perBrand.push({
        slug: brand.slug,
        brandId,
        raw: rawProducts.length,
        kept: mapped.length,
        withIngredients: withIng,
        flavorVariants: variants,
        currency,
        shopBase: base,
      });
      if (!mapped.length) failures.push({ slug: brand.slug, error: "no-products" });
      all.push(...mapped);
    } catch (e) {
      console.log("ERR", e.message || e);
      failures.push({ slug: brand.slug, error: String(e.message || e) });
      perBrand.push({
        slug: brand.slug,
        brandId,
        raw: 0,
        kept: 0,
        shopBase: base,
        error: String(e.message || e),
      });
    }
  }

  all.sort((a, b) => a.brandId.localeCompare(b.brandId) || a.name.localeCompare(b.name));
  fs.writeFileSync(outJson, JSON.stringify(all, null, 2));

  const waveCount = all.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return n >= WAVE_START && n <= WAVE_END;
  }).length;

  const hosts = [
    ...new Set(
      all
        .map((p) => {
          try {
            return new URL(p.imageUrl).hostname;
          } catch {
            return null;
          }
        })
        .filter(Boolean),
    ),
  ].sort();

  fs.writeFileSync(
    path.join(root, "data/catalog-products-manifest-wave95.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave95Products: waveCount,
        wave95BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
        totalProducts: all.length,
        brandCount: new Set(all.map((p) => p.brandId)).size,
        failures,
        imageHosts: hosts,
        perBrand,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(root, "data/catalog-products-manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        productCount: all.length,
        brandCount: new Set(all.map((p) => p.brandId)).size,
        imageHosts: hosts,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(root, "data/wave95-selected.json"),
    JSON.stringify(
      seedBrands.map((b, i) => ({
        slug: b.slug,
        shopBase: b.shopBase,
        categories: b.categories,
        id: `c${String(i + WAVE_START).padStart(4, "0")}`,
      })),
      null,
      2,
    ),
  );
  console.log(
    `\nDone total=${all.length} wave95=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
