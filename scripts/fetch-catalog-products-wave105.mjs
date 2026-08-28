/**
 * Fetch Shopify catalogs for wave105 brands (c1499+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent variants into their own listings
 * - Skips merch, gift cards, bundles, kits
 * - Extracts ingredients from product HTML
 * - Converts cart.js currency (EUR × 1.08, GBP × 1.27, AUD × 0.65, CAD × 0.73, NZD × 0.60)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave105.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1499;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const FX = { EUR: 1.08, GBP: 1.27, AUD: 0.65, CAD: 0.73, NZD: 0.6, BHD: 2.65, INR: 0.012 };

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|gift certificate|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|tote bag|\btote\b|sticker|mug\b|apparel|book\b|ebook|e-guide|workshop|event|free gift|for pets?|\bpet\b|dog soap|dog shampoo|shipping protection|package protection|\bcandle\b|soap savers?|soap dish|sisal bag|sample pack|sample set|gift set|gift box|gift basket|bundle & save|starter kit|discovery kit|variety pack|3[- ]pack|6[- ]pack|family pack|couples pack)\b/i;

const WAVE105_EXTRA =
  /\b(gift card|e-gift|gift pack|gift set|gift basket|gift box|gift bag|ohana gift|shipping protection|package protection|routeins|build your (own )?bundle|bundles?\b|duo\b|duet\b|trio\b|threesome|variety pack|holiday gift|shaker bottle|shakers?\b|whisk\b|sampler pack|consultation|sponsorship|sisal|soap dish|soap saver|wholesale|discovery (box|set|kit)|t-shirt|\btee\b|do not use|caddie|measuring scoop|people[- ]pack|yearly set|perfume|complimentary|e-?book|masterclass|cotton rounds|paddle hair brush|blender ?bottle|wellness bottle|grow ?kit|plushy|hoodie|sweatshirt|crewneck|water bottle|starter pack|daily routine|kids pack|whitening pack|travel friendly|tube squeezer|denttabs|sonic|replacement heads?|insect repellent|bug balm|defog|mask strap|dry bag|bowl cover|donation|pump head|mystery gift|no gift|explorer kit|gear wash|ear rinse|army style|ball cap|konjac|welcome kit|workshop|class|csa|grain spawn|liquid culture|ready-to-fruit|pre-innoculated|pre-inoculated|mozzie|tumbler|sweat towel|packet organizer|phone holder|duffel|jogger|flannel|windbreaker|beanie|trucker|polo|crop top|protein (snack|bar|cookie|balls?|brioche)|extrait cologne|edp cologne|dupe theory|room spray|air freshener|insect repellent|buzz off|2 pak|2-pak|spour|mushroom coffee|mushroom matcha|mushroom drink mix|poster|mycoanalysis|gut-brain axis|elixir bundle|athlete.s bundle|fortify bundle|summer sale|sale-old|stuffed toy|electric (flosser|toothbrush)|tickle tooth|buzzy brush|toothkeeper|bath bunny|cotton face mask|remineralization routine|family bundle|grocery list|leaky gut|raw honey|collection hat|shower duo|shower trio|essential foundations|cultivation class|grow kit|fresh local mushroom|candle club|seasonal box|wood wick|whitening (kit|pen|gel|strips)|color corrector|travel pouch|key chain|bamboo pads|travel tin|illuminator|barista balm|everything box|free gift|6 tincture|drinking straw|cold ?cup|sustain water|embroidered cap|gym bottle|supper club|omakase|foundation stack|gua sha|eyeshadow|mascara|foundation|concealer|bronzer|highlighter|eyeliner|lip gloss|lipstick|luminizer|primer|shipping protection|sourdough|pop up|grab bag|shirt of the month|flexfit|multicam|throwback hoodie|supplement funnel|turkish cotton|beach towel|peshtemal|travel pack|sample pack|mini set|ritual (mini )?set|gemstone|crystal roller|shimmer shades|lip balm set|floral bouquet|oyster mushroom seasoning|mushroom salt|dried (shiitake|oyster|chestnut|lion)|not\) coffee|tincture set|performance trio|patented system|care pack|foundation pack|solver pack|power pack|restore & replenish|daily defense|breath balance|system plus|find your flavor|single stick|sampler pack|fsn hat|cookie bar|daily citrus shot|travel candle|running club|mind body|oversized heavyweight|hiker.s friend|trail relief|puppy paw|dog paw|paw protect|wood conditioner|dish soap|checkout\+|handheld frother|sample stick|bulk jar|toiletry bag|3-pack|hangover|revil|\bdhm\b|balance due|travel jar|razor handle|shave kit|dry brush)\b/i;

const NICHE =
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sunbalms?|sun[- ]?balms?|sun cream|sun protectant|after sun|zinc oxide|\bzinc\b|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|tooth powder|tooth suds|floss|mouthwash|mouth rinse|oil[- ]?pull\w*|pulling oil|tongue clean|oral (care|health)|hydroxyapatite|n[- ]?ha|remineral\w*|shampoo|conditioner|hair (oil|mask|serum|care|juice|bar|clay|cream|spray)|scalp|beard|protein|whey|casein|collagen|creatine|electrolytes?|hydration|vitamin|supplement|capsule|probiotic|lion'?s mane|reishi|chaga|cordyceps|turkey tail|shiitake|oyster mushroom|mushroom|tincture|serums?|moisturizer|cleanser|cream|lotion|oil|mask|balm|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|lip|hydrosol|magnesium|shaving|gum|pomade|complexion|dry shampoo|face wash)\b|deodorants?|\bhydrat(?:e|ion)\b|wpi\b/i;

const FLAVOR_OPTION =
  /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|tint|scented|types?|bar type|blend|choose your scent|choose scent|select one|inci|essential oil|choose product|single\/bundle|hair color|hue|formula|choose your flavou?r|approximate spf|variety|options|creamsicle|flavor\/size|purpose|dry shampoo shade/i;

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
  return /\b(how to (use|apply)|directions?|why (we|our|tallow|you.?ll)|add to cart|subscription|if you haven'?t tried|love & gratitude|shipping|refund|free from|ours doesn'?t|let it dissolve|swish for|easy to use daily|sip it|we prioritize clean|upgrade your daily|does not make any medical|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family|airy notes|elevate your|reconnect with|simple, natural ingredients|gentle ingredients that keep you fresh|ingredients are always|fuel your body|nourish and replenish|this product is not intended|naturally strengthen|why you.?ll love|clean\. powerful\. proven|no sugar\. no fillers|ingredients with a purpose|users report|customers report|customers rave|outperforming|nutritional information|food supplements should|add a pea-sized|don'?t forget to brush|there.?s one key ingredient|hydroxyapatite \(hap\) is the same mineral|all of the flavor in each of our products|star ingredients include|key ingredients sodium|uses: (focus|stress|antiviral|exercise)|we couldn'?t find a toothpaste|what.?s inside each stick|same clean-ingredient philosophy|zero sugar — sweetened|the power smoothie|protein upgrade|add to smoothies|shake vigorously|feed only as directed|instructions for use|consult your veterinarian|naturally sweet drink|morning smoothie|milk alternative|electrolytes you.?ll actually|stevia free real fruit|handmade with love|never outsource|70\+\s*trace minerals|sweetened with (pure )?monk fruit|no sugar alcohols|hydrolysed bovine collagen|to support healthy bones|help protect strands|boost resilience|to strengthen, smooth|you.?ll notice|shield your skin|then soaking in alcohol|ultrasonic extractor|we bottle our|highly adsorbent|draws out dirt|helps resolve acne|offers intense hydration|aluminum-free, all-natural solution|nourishing spf protection|that actually works|handcrafted with nourishing|long-lasting moisture|cooling peppermint sensation|creamy lather that|hydrate with our everyday|stand your ground|learn more about|every element of ground|premium, all-natural odor|water resistance|lab-tested|no white cast|melts makeup|skin-loving vitamins|long-lasting hydration|awaken the senses|peaceful shoreline|invigorating start|hand-poured in small batches|chemistry experiment|boosts moisture|enhances shine|feels as good as it smells|everyday hydration that feels|you can pronounce|you could eat|designed for shoppers who want|biomimetic mineral that supports|premium nano|strengthen enamel, reduce sensitivity|bright, uplifting|handcrafted with thoughtfully selected|this bar is loaded|peppermint oil cools|tired of the lack|asian-inspired|real fruit powder is sourced|goji berries are packed|convenient, wholesome protein|where your food comes from|we start by working with farmers|cold-processed microfiltration|performance first|simple ingredients\.|metal tube|made in canada|helps smooth fine lines|delivers vitamins and peptides|deeply hydrates and repairs|modern skincare overloads|your skin can heal itself|dual extract|fruiting body|replaces what you lose|your body doesn'?t sweat|experience sun protection|experience a fresh, clean mouth|luxury meets convenience|your skin deserves hydration|no aluminum\. no synthetic|the cleanest whey protein|your body deserves the very best|nutrition you can trust|carefully selected ingredients including|nano-hydroxyapatite is studied|our ingredient-first formulation|fuel your fitness journey|high-quality protein source)\b/i.test(
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
    ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|sun butter|sun[- ]?balm|sun cream|sun protectant|zinc stick|mineral zinc|mineral sun|mineral stick|after sun|sun lotion|sun balm|mineral barrier|fun in the sun|sun stick)\b/],
    ["deodorant", /deodorants?|antiperspir|underarm|\bdeo\b|pit stop/],
    ["supplements", /\b(lion'?s mane|reishi|chaga|cordyceps|shiitake|maitake|oyster mushroom|turkey tail|mushroom (complex|tincture|extract|powder|immunity|cacao|beet|turmeric|matcha)|adaptogen|creatine|vitamin d|omega-?3|magnesium|shilajit|maca|chlorella|d-?ribose|capsule|knotweed|dual extract|tincture|propolis|ashwagandha|turmeric|beet root|milk thistle|dandelion|calendula|poria|tremella|meshima|pine pollen|schizandra|astragalus|pearl beauty|resveratrol|fulvic|camu camu|liver capsules|longevity|sleep|calm|immune defense|joint defense|skin defense|energy \+ focus|pre-game|pre-workout|recover post|nootropic|probiotic|bcaa|zma|multivitamin|greens powder|fish oil|optomega)\b/],
    ["electrolytes", /\b(electrolytes?|\bhydrat(?:e|ion)\b|hydration (powder|packet|mix|stick)|drink mix|stick packs?|recovery plus)\b/],
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
  if (brand?.slug === "akamai") {
    if (/deodorant/i.test(t)) return "deodorant";
    if (/dry shampoo|hair|scalp/i.test(t)) return "hair";
    if (/skin fuel|black balm|3 in 1|living clay|bar\b/i.test(t)) return "skincare";
    if (/mineral drops|fulvic/i.test(t)) return "supplements";
    return "oral";
  }
  if (brand?.slug === "cure-hydration") return "electrolytes";
  if (brand?.slug === "mindful-crumb") return "protein";
  if (brand?.slug === "aelia-sun") return "sunscreen";
  if (brand?.slug === "wild-crafted-kitchen") {
    if (/deodorant/i.test(t)) return "deodorant";
    if (/sun balm|spf/i.test(t)) return "sunscreen";
    if (/shampoo|scalp|hair|beard/i.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "arbor-spring-farms") return "supplements";
  return category;
}

const AKAMAI_KEEP = new Set([
  "remineralizing-toothpaste-powder",
  "essential-oil-free-mineral-toothpowder",
  "kids-mineral-toothpowder",
  "oil-pulling-mouthwash",
  "infused-floss",
  "tongue-cleaner",
  "bamboo-toothbrushes",
  "mineral-deodorant",
  "dry-shampoo",
  "skin-fuel",
  "3-in-1-bar",
  "electrolyte-mineral-drops",
  "fulvic-mineral-complex",
  "food-grade-calcium-montmorillonite-bentonite-clay",
]);

const CURE_KEEP = new Set([
  "green-apple",
  "classic-grape",
  "raspberry",
  "peach-mango",
  "acai-berry",
  "mixed-berry",
  "pink-lemonade",
  "fruit-punch",
  "blood-orange",
  "tropical-punch",
  "peach",
  "strawberry-kiwi",
  "lemonade",
  "hydrating-electrolyte-mix-lime",
  "hydrating-electrolyte-mix-watermelon",
  "hydrating-electrolyte-mix-grapefruit",
  "hydrating-electrolyte-mix-berry-pomegranate",
  "hydrating-electrolyte-mix-ginger-turmeric",
]);

const WILD_KEEP = new Set([
  "aluminum-free-deodorant",
  "tallow-sun-balm",
  "tallow-beard-balm",
  "beard-oil",
  "cleansing-balm",
  "age-defying-tallow-face-balm",
  "frankincense-lightweight-tallow-body-lotion",
  "gardeners-hand-salve",
  "little-cheeks-rescue",
  "100-tallow-soap",
  "skin-rescue-tallow-balm",
  "pre-order-activated-charcoal-face-bar-soap",
  "manuka-honey-whipped-tallow-balm",
  "hair-scalp-oil",
  "tallow-body-butter",
  "orange-dream-whipped-tallow-balm",
  "orange-dream-sugar-scrub",
  "caffeinated-eye-balm",
  "patchouli-lavender-lightweight-tallow-body-lotion",
  "luxe-lavender-massage-oil",
  "lemon-myrtle-lavender-tallow-body-lotion",
  "infused-tallow-balm-rosemary-sage",
  "organic-frankincense-castor-oil",
  "vanilla-lavender-whipped-tallow-balm",
  "limited-edition-vanilla-bean-infused-lightweight-tallow-body-lotion",
  "tallow-sugar-scrub",
  "blue-tansy-tallow-fabe-balm",
  "vanilla-bean-infused-whipped-tallow-balm",
  "lightweight-tallow-body-lotion-unscented",
  "mama-s-belly-balm",
  "extra-strength-whipped-magnesium-tallow-lotion",
  "lip-balm",
  "untitled-jun5_14-26",
  "whipped-magnesium-lotion",
  "whipped-tallow-lotion",
  "tallow-balm",
  "lash-brow-serum",
]);

const ARBOR_KEEP = new Set([
  "lions-mane-mushroom-tincture",
  "lions-mane-mushroom-powder",
]);

function isOnNiche(raw, brand) {
  const title = raw.title || "";
  const type = raw.product_type || "";
  const handle = raw.handle || "";
  const hay = `${title} ${type} ${handle}`;
  if (Number((raw.variants || [])[0]?.price || 0) <= 0) return false;
  if (brand.slug === "akamai") return AKAMAI_KEEP.has(handle);
  if (brand.slug === "cure-hydration") return CURE_KEEP.has(handle);
  if (brand.slug === "mindful-crumb") return handle === "primal-core-grass-fed-low-lactose-whey-protein-concentrate-450g";
  if (brand.slug === "aelia-sun") return handle === "aelia-sunscreen";
  if (brand.slug === "wild-crafted-kitchen") return WILD_KEEP.has(handle);
  if (brand.slug === "arbor-spring-farms") return ARBOR_KEEP.has(handle);
  if (SKIP_TITLE.test(title) || WAVE105_EXTRA.test(title) || WAVE105_EXTRA.test(handle)) return false;
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
    .replace(/\s*\(for blondes\)/i, "")
    .replace(/\s*\(for dark hair\)/i, "")
    .trim();
}

function flavorOptionIndex(raw, brand) {
  const options = raw.options || [];
  const handle = raw.handle || "";
  if (brand?.slug === "cure-hydration") return -1;
  if (brand?.slug === "mindful-crumb") return -1;
  if (brand?.slug === "aelia-sun") return -1;
  if (brand?.slug === "arbor-spring-farms") return -1;
  if (brand?.slug === "akamai") {
    return options.findIndex((o) => /floss style/i.test(o.name || ""));
  }
  if (brand?.slug === "wild-crafted-kitchen") {
    return options.findIndex((o) => /scent/i.test(o.name || ""));
  }
  const scored = options.map((o, i) => {
    const name = o.name || "";
    if (!FLAVOR_OPTION.test(name)) return { i, score: -1 };
    let score = 1;
    if (/flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|tint|types?|blend|essential oil|choose product|hair color|formula|approximate spf|variety|options|creamsicle|purpose/i.test(name))
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
    if (/\b(single|single pack|1 pack|1 box|default title|50 g|50g|30 ml|30g|30 g|100 g|100g|1\.5oz|1\.5 oz|90 servings|full size|unsweetened|1 jar|1 bar|2 oz|4 oz|8 oz|1 pound|1 lb|10 ct|30 servings|1\.7 oz|5 sticks|300g|300 g)\b/i.test(hay))
      score += 8;
    if (/\b(two-pack|2-pack|three-pack|3-pack|four-pack|4-pack|2 boxes|4 boxes|6 boxes|0\.5oz|0\.5 oz|20 servings|3x90|250 g|250g|500 g|500g|1 kg|1kg|5g|sample size|refill only|2 jars|3 jars|5 jars|2 bars|3 bars|8 oz extra|16 oz|5lb|5 lb|family size|81 servings|15 servings|30 ct|3\.3 oz|refill cartridge|30g sample)\b/i.test(hay))
      score -= 8;
    if (brand?.slug === "akamai") {
      if (/\b(1 jar|1 bottle|2oz|1 oz|2 bamboo|2 refills)\b/i.test(hay)) score += 10;
      if (/\b(3 jars|6 jars|2 bottles|4 bottles|4oz set|home & travel|starter set|refill pack|3 refill|6 refill|container only|4 bamboo|10 refills)\b/i.test(hay))
        score -= 8;
    }
    if (brand?.slug === "wild-crafted-kitchen") {
      if (/\b(4oz|4 oz|0\.5 oz)\b/i.test(hay)) score += 6;
      if (/\b(8oz|8 oz|trial size|travel tube)\b/i.test(hay)) score -= 6;
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
  if (brand.slug === "akamai") {
    const h = raw.handle || "";
    if (h === "remineralizing-toothpaste-powder") baseTitle = "Akamai Mineral Toothpowder";
    else if (h === "essential-oil-free-mineral-toothpowder")
      baseTitle = "Akamai Essential Oil-Free Mineral Toothpowder";
    else if (h === "kids-mineral-toothpowder") baseTitle = "Akamai Kids Mineral Toothpowder";
    else if (h === "oil-pulling-mouthwash") baseTitle = "Akamai Oil Pulling Mouthwash";
    else if (h === "infused-floss") baseTitle = "Akamai Infused Floss";
    else if (h === "tongue-cleaner") baseTitle = "Akamai Tongue Cleaner";
    else if (h === "bamboo-toothbrushes") baseTitle = "Akamai Bamboo Bass Toothbrush";
    else if (h === "mineral-deodorant") baseTitle = "Akamai Mineral Deodorant";
    else if (h === "dry-shampoo") baseTitle = "Akamai Dry Shampoo";
    else if (h === "skin-fuel") baseTitle = "Akamai Skin Fuel";
    else if (h === "3-in-1-bar") baseTitle = "Akamai 3-in-1 Bar";
    else if (h === "electrolyte-mineral-drops") baseTitle = "Akamai Ancient Mineral Drops";
    else if (h === "fulvic-mineral-complex") baseTitle = "Akamai Fulvic Mineral Complex";
    else if (h === "food-grade-calcium-montmorillonite-bentonite-clay")
      baseTitle = "Akamai Living Clay";
    else if (!/^akamai\b/i.test(baseTitle)) baseTitle = `Akamai ${baseTitle}`;
  }
  if (brand.slug === "cure-hydration") {
    const h = raw.handle || "";
    const flavorMap = {
      "green-apple": "Green Apple",
      "classic-grape": "Classic Grape",
      raspberry: "Raspberry",
      "peach-mango": "Peach Mango",
      "acai-berry": "Acai Berry",
      "mixed-berry": "Mixed Berry",
      "pink-lemonade": "Pink Lemonade",
      "fruit-punch": "Fruit Punch",
      "blood-orange": "Blood Orange",
      "tropical-punch": "Tropical Punch",
      peach: "Peach Tea",
      "strawberry-kiwi": "Strawberry Kiwi",
      lemonade: "Lemonade",
      "hydrating-electrolyte-mix-lime": "Lime",
      "hydrating-electrolyte-mix-watermelon": "Watermelon",
      "hydrating-electrolyte-mix-grapefruit": "Grapefruit",
      "hydrating-electrolyte-mix-berry-pomegranate": "Berry Pomegranate",
      "hydrating-electrolyte-mix-ginger-turmeric": "Ginger Turmeric",
    };
    baseTitle = flavorMap[h] ? `Cure Hydration Electrolyte Mix — ${flavorMap[h]}` : `Cure Hydration ${baseTitle}`;
  }
  if (brand.slug === "mindful-crumb") baseTitle = "Mindful Crumb Primal Core Grass-Fed Whey";
  if (brand.slug === "aelia-sun") baseTitle = "AELIA Mineral SPF 50";
  if (brand.slug === "wild-crafted-kitchen") {
    if (!/^wild crafted/i.test(baseTitle)) baseTitle = `Wild Crafted Kitchen ${baseTitle}`;
  }
  if (brand.slug === "arbor-spring-farms") {
    const h = raw.handle || "";
    if (/tincture/.test(h)) baseTitle = "Arbor Spring Lion's Mane Fruiting-Body Tincture";
    else if (/powder/.test(h)) baseTitle = "Arbor Spring Lion's Mane Fruiting-Body Powder";
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
    /^(default title|single|1 pack|2 pack|3 pack|30 servings|60 servings|90 servings|2oz|4oz|3oz|1oz|6g|scented|buy one|buy two|buy three|1 jar|2 jars|1 tub|2 tubs|3 tubs|250g|500g|1 kg|1 lb\.?|2 lbs\.?|3 lbs\.?|12 pack|24 pack|36 pack|spf 30|spf 50|30 spf|50 spf|1 lbs|3 lbs|box|no box|no packaging|boxes|no boxes|plastic bottle|glass bottle|variety pack|quantity|full size|travel size|2lb|4lb|76g|full|small|1lb|2\.5lb|5lb|single tin|two-pack|5lb family size|10 ct stick pack|30 ct stick pack|300g|1kg|2kg|30g)$/i.test(
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
  if (brand.slug === "akamai" || brand.slug === "cure-hydration" || brand.slug === "aelia-sun") {
    ingredients = [];
  }
  if (brand.slug === "mindful-crumb") {
    ingredients = ["Whey protein concentrate"];
  }
  if (brand.slug === "wild-crafted-kitchen") {
    if (/deodorant/i.test(title) && /lavender/i.test(title)) {
      ingredients = [
        "Bovine tallow",
        "Cocos Nucifera (Coconut) Oil",
        "Cera Alba (Local Beeswax)",
        "Maranta Arundinacea (Arrowroot) Root Powder",
        "Sodium Bicarbonate",
        "Zinc Oxide (Non-Nano)",
        "Lavandula (Lavender) Angustifolia Oil",
        "Melaleuca Alternifolia (Tea Tree) Leaf Oil",
        "Tocopherol (Vitamin E)",
      ];
    } else if (/deodorant/i.test(title) && /unscented/i.test(title)) {
      ingredients = [
        "Bovine tallow",
        "Cocos Nucifera (Coconut) Oil",
        "Cera Alba (Local Beeswax)",
        "Maranta Arundinacea (Arrowroot) Root Powder",
        "Sodium Bicarbonate",
        "Zinc Oxide (Non-Nano)",
        "Tocopherol (Vitamin E)",
      ];
    } else {
      ingredients = [];
    }
  }
  if (brand.slug === "arbor-spring-farms") {
    if (/tincture/i.test(title)) {
      ingredients = ["Lion's Mane fruiting body", "Spring water", "Organic alcohol"];
    } else if (/powder/i.test(title)) {
      ingredients = ["Lion's Mane fruiting body"];
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
      if (brand?.slug === "akamai") {
        if (/black/i.test(label)) label = "Black";
        else if (/silk/i.test(label)) label = "Silk";
      }
      if (brand?.slug === "wild-crafted-kitchen") {
        label = label.replace(/\s*\+\s*/g, " + ").replace(/\bLIMITED EDITION:\s*/i, "").trim();
      }
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
    path.join(root, "data/catalog-products-manifest-wave105.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave105Products: waveCount,
        wave105BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
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
    path.join(root, "data/wave105-selected.json"),
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
    `\nDone total=${all.length} wave105=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
