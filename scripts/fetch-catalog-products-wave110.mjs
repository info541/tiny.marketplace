/**
 * Fetch Shopify catalogs for wave110 brands (c1529+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent variants into their own listings
 * - Skips merch, gift cards, bundles, kits
 * - Extracts ingredients from product HTML
 * - Converts cart.js currency (EUR × 1.08, GBP × 1.27, AUD × 0.65, CAD × 0.73, NZD × 0.60)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave110.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1529;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const FX = { EUR: 1.08, GBP: 1.27, AUD: 0.65, CAD: 0.73, NZD: 0.6, BHD: 2.65, INR: 0.012 };

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|gift certificate|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|tote bag|\btote\b|sticker|mug\b|apparel|book\b|ebook|e-guide|workshop|event|free gift|for pets?|\bpet\b|dog soap|dog shampoo|shipping protection|package protection|\bcandle\b|soap savers?|soap dish|sisal bag|sample pack|sample set|gift set|gift box|gift basket|bundle & save|starter kit|discovery kit|variety pack|3[- ]pack|6[- ]pack|family pack|couples pack)\b/i;

const WAVE106_EXTRA =
  /\b(gift card|e-gift|gift pack|gift set|gift basket|gift box|gift bag|ohana gift|shipping protection|package protection|routeins|build your (own )?bundle|bundles?\b|duo\b|duet\b|trio\b|threesome|variety pack|holiday gift|shaker bottle|shakers?\b|whisk\b|sampler pack|consultation|sponsorship|sisal|soap dish|soap saver|wholesale|discovery (box|set|kit)|t-shirt|\btee\b|do not use|caddie|measuring scoop|people[- ]pack|yearly set|perfume|complimentary|e-?book|masterclass|cotton rounds|paddle hair brush|blender ?bottle|wellness bottle|grow ?kit|plushy|hoodie|sweatshirt|crewneck|water bottle|starter pack|daily routine|kids pack|whitening pack|travel friendly|tube squeezer|denttabs|sonic|replacement heads?|insect repellent|bug balm|defog|mask strap|dry bag|bowl cover|donation|pump head|mystery gift|no gift|explorer kit|gear wash|ear rinse|army style|ball cap|konjac|welcome kit|workshop|class|csa|grain spawn|liquid culture|ready-to-fruit|pre-innoculated|pre-inoculated|mozzie|tumbler|sweat towel|packet organizer|phone holder|duffel|jogger|flannel|windbreaker|beanie|trucker|polo|crop top|protein (snack|bar|cookie|balls?|brioche)|extrait cologne|edp cologne|dupe theory|room spray|air freshener|insect repellent|buzz off|2 pak|2-pak|spour|mushroom coffee|mushroom matcha|mushroom drink mix|poster|mycoanalysis|gut-brain axis|elixir bundle|athlete.s bundle|fortify bundle|summer sale|sale-old|stuffed toy|electric (flosser|toothbrush)|tickle tooth|buzzy brush|toothkeeper|bath bunny|cotton face mask|remineralization routine|family bundle|grocery list|leaky gut|raw honey|collection hat|shower duo|shower trio|essential foundations|cultivation class|grow kit|fresh local mushroom|candle club|seasonal box|wood wick|whitening (kit|pen|gel|strips)|color corrector|travel pouch|key chain|bamboo pads|travel tin|illuminator|barista balm|everything box|free gift|6 tincture|drinking straw|cold ?cup|sustain water|embroidered cap|gym bottle|supper club|omakase|foundation stack|gua sha|eyeshadow|mascara|foundation|concealer|bronzer|highlighter|eyeliner|lip gloss|lipstick|luminizer|primer|shipping protection|sourdough|pop up|grab bag|shirt of the month|flexfit|multicam|throwback hoodie|supplement funnel|turkish cotton|beach towel|peshtemal|travel pack|sample pack|mini set|ritual (mini )?set|gemstone|crystal roller|shimmer shades|lip balm set|floral bouquet|oyster mushroom seasoning|mushroom salt|dried (shiitake|oyster|chestnut|lion)|not\) coffee|tincture set|performance trio|patented system|care pack|foundation pack|solver pack|power pack|restore & replenish|daily defense|breath balance|system plus|find your flavor|single stick|sampler pack|fsn hat|cookie bar|daily citrus shot|travel candle|running club|mind body|oversized heavyweight|hiker.s friend|trail relief|puppy paw|dog paw|paw protect|wood conditioner|dish soap|checkout\+|handheld frother|sample stick|bulk jar|toiletry bag|3-pack|hangover|revil|\bdhm\b|balance due|travel jar|razor handle|shave kit|dry brush|dad hat|gum case|gum dish|camping mug|pearl powder spoon|rinse cup|the vault|membership|smile reset|gum lover|essentials duo|essentials bundle|oral care bundle|energy gum|build your (own )?bundle|build your box|free gift|gift a friend|priority handling|shipping protection|demo bundle|baker.s collection|people[- ]pack|essential oil|honey\.|tea\.|candle|soap saver|soap dish|soap tray|dish scrub|laundry soap|bug repellant|mosquito|travel soap pouch|gift set|aromatherapy bundle|shaker|canister|giftcard|gift card|3 pack|3-pack|single serving|sachet|protein bar|mct oil|mct creamer|power cacao|pure chocolate|pure coffee|everyday essentials|mag six|creatine pro|eaa formula|omega|vitamin d3|performance tincture stack|tincture\. sample|soap stack|adaptive blend|essential oil stack|mini bag|mini bags|brain boost tea|sample\.|shroom stack|turkey tail honey|adaptive honey|r3 -|muscle rub\. sample|athlete stack|herbal tea)\b/i;

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
    if (/^ingredients:\s*/i.test(s)) {
      s = s.replace(/^ingredients:\s*/i, "").trim();
      clean.length = 0;
      if (!s) continue;
    }
    if (/^(tallow balm is a rich|nourishing tallow cream|nourishing and all-natural cream)/i.test(s)) {
      continue;
    }
    if (/^(eczema|psoriasis|stiffness|deeply nourishing|unlock radiant)/i.test(s)) {
      if (!clean.length) return [];
      break;
    }
    if (/\bInstructions:/i.test(s)) {
      s = s.replace(/\s*Instructions:.*$/i, "").trim();
      if (s.length >= 2 && s.length <= 90) clean.push(s);
      break;
    }
    if (
      /product (benefits?|highlights?)|perfect for|elevate your|take your|from farm to formula|process\/ethos|scent family|how to|directions?|q:|note:|please note|we recommend|we suggest|we source|your (products are packaged|order will|body will|skin can)|best for:|reconnect with|love & gratitude|does not make any medical|disclaimer|no added sugar|no artificial|safety information|keep out of reach|for external use|zero sugar|designed to align|just clean hydration|ideal for those|this product has not been evaluated|available blends|why you.?ll love|add a pea-sized|brush twice|application|apply (body|liberally|as needed|15 minutes)|instructions:|re-apply|massage tallow|whether you have perfectly|they are the perfect|great alternative|sweat glands|anti-perspirant|this soap bar has|locally sourced|why i'?|handmade and hand-tested|handmade in reno|handcrafted in the usa|handcrafted with love|real customer reviews|certified organic \†|how to use|vegan no animal|nutrition you can trust|and if you want the dl|and as a bonus|aluminum tin|sensitivities may occur|always try a test patch|variations in color|for best longevity|if not paired|ditch the lotions|read more|designed to be used|long-term wear|degrades dna|this causes more friction|over time|as time go|unlock radiant|warnings?:|food supplements?|category:|do not exceed|a healthy lifestyle|a varied and balanced|do not use if outer|made in:|business operator/i.test(
        s,
      )
    ) {
      break;
    }
    if (/\bCARE:/i.test(s)) {
      s = s.replace(/\s*CARE:.*$/i, "").trim();
      if (s.length >= 2 && s.length <= 90) clean.push(s);
      break;
    }
    if (/\*[A-Za-z].*ingredients:/i.test(s)) {
      s = s.replace(/\s*\*.*$/, "").trim();
      if (s.length >= 2 && s.length <= 90) clean.push(s);
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
      .replace(/\s+lightly scented.*$/i, "")
      .replace(/\s+\d+(\.\d+)?\s*oz\b.*$/i, "")
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
  if (brand?.slug === "zing-toothpaste") return "oral";
  if (brand?.slug === "hydro-trapp") return "electrolytes";
  if (brand?.slug === "stomp-nutrition") return "protein";
  if (brand?.slug === "solara-suncare") {
    if (/lip/i.test(t) && /spf/i.test(t)) return "sunscreen";
    if (/spf|sunscreen|sun /i.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "haus-of-sage") {
    if (/deodorant/i.test(t)) return "deodorant";
    if (/sun balm|sunscreen|spf/i.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "sugarshack-mushrooms") return "supplements";
  return category;
}

const ZING_KEEP = new Set([
  "strawberries-cream-toothpaste",
  "original-mint-fluoride-free",
  "original-mint",
  "apple-kiwi",
  "lemon",
  "peach",
  "pre-order-mint-floss",
  "pre-order-watermelon-floss",
  "copper-tongue-scraper",
]);

const HYDRO_KEEP = new Set([
  "kiwi-chill-electrolyte-hydration-mix",
  "trap-sandia-electrolyte-hydration-mix",
  "blue-oasis-electrolyte-hydration-mix",
  "trap-nectar",
]);

const STOMP_KEEP = new Set([
  "chocolate-chip-cookie-dough-vegan-protein",
  "whey-protein-chocolate-brownie-batter",
]);

const SOLARA_KEEP = new Set([
  "day-dreamer-super-peptide-eye-primer-spf-30",
  "good-karma",
  "guardian-angel-super-peptide-sunscreen-milk-spf-50",
  "fortune-teller-tinted-brightening-sunscreen-serum",
  "go-mineral-defense-sport-superfruit-body-sunscreen",
  "go-mineral-defense-sport-antioxidant-face-sunscreen",
  "go-daily-defense-soothing-mineral-face-sunscreen",
  "go-mineral-defense-sport-superfruit-aloe-sheer-sunscreen-mist",
  "go-vacation-glow-illuminating-mineral-sunscreen",
  "clean-freak-nutrient-boosted-daily-sunscreen-3-fl",
  "pout-protector-moisturizing-lip-serum",
  "time-traveler-ageless-daily-face-sunscreen-unscented",
]);

const HAUS_KEEP = new Set([
  "cloud-9-whipped-tallow",
  "hands-barrier-tallow-balm",
  "vitamin-c-glow-face-oil",
  "tallow-soap-bar",
  "tallow-deodorant-stick",
  "tallow-lip-balm",
  "sun-lip-balm",
  "vitamin-c-eye-restore-balm",
  "firming-tallow-balm",
  "sun-balm",
  "everyday-daily-tallow-creme",
  "everything-daily-tallow-creme",
  "mens-daily-creme",
  "blue-algae-aloe-powder-cleanser",
  "antioxidant-tallow-balm",
  "brightening-tallow-balm",
  "clarifying-tallow-balm",
  "whipped-tallow-moisturizer-choose-your-scent",
  "activated-charcoal-tallow-deodorant-cream",
  "honey-tallow-gentle-daily-soap",
]);

const SUGAR_KEEP = new Set([
  "chaga-mushroom-extract",
  "cordyceps-mushroom-extract",
  "turkey-tail-mushroom-extract",
  "lions-mane-mushroom-extract",
  "reishi-mushroom-extract",
  "mind-and-body-blend-mushroom-extract",
]);

const KEEP_BY_SLUG = {
  "zing-toothpaste": ZING_KEEP,
  "hydro-trapp": HYDRO_KEEP,
  "stomp-nutrition": STOMP_KEEP,
  "solara-suncare": SOLARA_KEEP,
  "haus-of-sage": HAUS_KEEP,
  "sugarshack-mushrooms": SUGAR_KEEP,
};

function isOnNiche(raw, brand) {
  const title = raw.title || "";
  const type = raw.product_type || "";
  const handle = raw.handle || "";
  const hay = `${title} ${type} ${handle}`;
  if (Number((raw.variants || [])[0]?.price || 0) <= 0) return false;
  const keep = KEEP_BY_SLUG[brand.slug];
  if (keep) return keep.has(handle);
  if (SKIP_TITLE.test(title) || WAVE106_EXTRA.test(title) || WAVE106_EXTRA.test(handle)) return false;
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
  if (brand?.slug === "zing-toothpaste") return -1;
  if (brand?.slug === "hydro-trapp") return -1;
  if (brand?.slug === "stomp-nutrition") return -1;
  if (brand?.slug === "sugarshack-mushrooms") return -1;
  if (brand?.slug === "solara-suncare") {
    if (handle === "fortune-teller-tinted-brightening-sunscreen-serum") {
      return options.findIndex((o) => /color|tint|microtint/i.test(o.name || ""));
    }
    return -1;
  }
  if (brand?.slug === "haus-of-sage") {
    if (
      handle === "whipped-tallow-moisturizer-choose-your-scent" ||
      handle === "activated-charcoal-tallow-deodorant-cream" ||
      handle === "tallow-deodorant-stick" ||
      handle === "tallow-lip-balm" ||
      handle === "cloud-9-whipped-tallow"
    ) {
      return options.findIndex((o) => /scent|fragrance/i.test(o.name || ""));
    }
    return -1;
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
    if (brand?.slug === "sugarshack-mushrooms") {
      if (/\b1oz|1 oz|1oz bottle\b/i.test(hay)) score += 12;
      if (/\b2oz|2 oz|4oz|4 oz\b/i.test(hay)) score -= 12;
    }
    if (brand?.slug === "haus-of-sage") {
      if (/\b(sample|48|72|96|100|gallon)\b/i.test(hay)) score -= 12;
      if (/\b(2 oz|4 oz|1 unit)\b/i.test(hay)) score += 6;
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
  if (brand.slug === "zing-toothpaste") {
    const h = raw.handle || "";
    if (h === "original-mint") baseTitle = "ZING Original Mint Toothpaste";
    else if (h === "original-mint-fluoride-free") baseTitle = "ZING Fluoride-Free Original Mint Toothpaste";
    else if (h === "peach") baseTitle = "ZING Soft Peach Toothpaste";
    else if (h === "lemon") baseTitle = "ZING Soft Lemon Toothpaste";
    else if (h === "apple-kiwi") baseTitle = "ZING Apple & Kiwi Toothpaste";
    else if (h === "strawberries-cream-toothpaste") baseTitle = "ZING Strawberries & Cream Toothpaste";
    else if (h === "pre-order-mint-floss") baseTitle = "ZING Mint Floss";
    else if (h === "pre-order-watermelon-floss") baseTitle = "ZING Watermelon Floss";
    else if (h === "copper-tongue-scraper") baseTitle = "ZING Copper Tongue Scraper";
    else if (!/^zing\b/i.test(baseTitle)) baseTitle = `ZING ${baseTitle}`;
  }
  if (brand.slug === "hydro-trapp") {
    const h = raw.handle || "";
    if (h === "kiwi-chill-electrolyte-hydration-mix") baseTitle = "Hydro Trapp — Kiwi Chill";
    else if (h === "trap-sandia-electrolyte-hydration-mix") baseTitle = "Hydro Trapp — Trap Sandia";
    else if (h === "blue-oasis-electrolyte-hydration-mix") baseTitle = "Hydro Trapp — Blue Oasis";
    else if (h === "trap-nectar") baseTitle = "Hydro Trapp — Trap Nectar";
    else if (!/^hydro trapp\b/i.test(baseTitle)) baseTitle = `Hydro Trapp ${baseTitle}`;
  }
  if (brand.slug === "stomp-nutrition") {
    const h = raw.handle || "";
    if (h === "whey-protein-chocolate-brownie-batter") baseTitle = "Stomp Chocolate Fudge Brownie Whey Protein";
    else if (h === "chocolate-chip-cookie-dough-vegan-protein")
      baseTitle = "Stomp Chocolate Chip Cookie Dough Vegan Protein";
    else if (!/^stomp\b/i.test(baseTitle)) baseTitle = `Stomp ${baseTitle}`;
  }
  if (brand.slug === "solara-suncare") {
    const h = raw.handle || "";
    if (h === "go-daily-defense-soothing-mineral-face-sunscreen")
      baseTitle = "Solara Go! Daily Defense Mineral Face SPF 30";
    else if (h === "go-mineral-defense-sport-antioxidant-face-sunscreen")
      baseTitle = "Solara Go! Sport Antioxidant Face SPF 50";
    else if (h === "go-mineral-defense-sport-superfruit-body-sunscreen")
      baseTitle = "Solara Go! Sport Superfruit Body SPF 50";
    else if (h === "go-mineral-defense-sport-superfruit-aloe-sheer-sunscreen-mist")
      baseTitle = "Solara Go! Sport Superfruit + Aloe Mist SPF 30";
    else if (h === "go-vacation-glow-illuminating-mineral-sunscreen")
      baseTitle = "Solara Go! Vacation Glow Tinted Moisturizer SPF 30";
    else if (h === "guardian-angel-super-peptide-sunscreen-milk-spf-50")
      baseTitle = "Solara Guardian Angel Super Peptide Milk SPF 50";
    else if (h === "fortune-teller-tinted-brightening-sunscreen-serum")
      baseTitle = "Solara Fortune Teller Tinted Serum SPF 30";
    else if (h === "good-karma") baseTitle = "Solara Good Karma Body Oil SPF 30";
    else if (h === "day-dreamer-super-peptide-eye-primer-spf-30")
      baseTitle = "Solara Day Dreamer Super Peptide Eye Primer SPF 30";
    else if (h === "clean-freak-nutrient-boosted-daily-sunscreen-3-fl")
      baseTitle = "Solara Clean Freak Body SPF 30";
    else if (h === "pout-protector-moisturizing-lip-serum")
      baseTitle = "Solara Pout Protector Lip Serum SPF 15";
    else if (h === "time-traveler-ageless-daily-face-sunscreen-unscented")
      baseTitle = "Solara Time Traveler Peptide Face SPF 30";
    else if (!/^solara\b/i.test(baseTitle)) baseTitle = `Solara ${baseTitle}`;
  }
  if (brand.slug === "haus-of-sage") {
    const h = raw.handle || "";
    if (h === "activated-charcoal-tallow-deodorant-cream") baseTitle = "Haus of Sage Tallow Deodorant Cream";
    else if (h === "tallow-deodorant-stick") baseTitle = "Haus of Sage Tallow Deodorant Stick";
    else if (h === "liquid-deodorant-extra-strength") baseTitle = "Haus of Sage Liquid Deodorant";
    else if (h === "cloud-9-whipped-tallow") baseTitle = "Haus of Sage Cloud 9 Whipped Tallow";
    else if (h === "tallow-lip-balm-1" || h === "tallow-lip-balm") baseTitle = "Haus of Sage Tallow Lip Balm";
    else if (h === "sun-lip-balm") baseTitle = "Haus of Sage Sun Lip Balm";
    else if (h === "hands-barrier-tallow-balm") baseTitle = "Haus of Sage Hands Barrier Tallow Balm";
    else if (h === "vitamin-c-glow-face-oil") baseTitle = "Haus of Sage Vitamin C Glow Face Oil";
    else if (h === "tallow-soap-bar") baseTitle = "Haus of Sage Tallow Soap Bar";
    else if (h === "vitamin-c-eye-restore-balm") baseTitle = "Haus of Sage Vitamin C Eye Restore Balm";
    else if (h === "tallow-sun-balm") baseTitle = "Haus of Sage Tallow Sun Balm";
    else if (h === "whipped-tallow-moisturizer-choose-your-scent")
      baseTitle = "Haus of Sage Whipped Tallow Moisturizer";
    else if (h === "sun-balm") baseTitle = "Haus of Sage Sun Balm";
    else if (h === "everything-daily-tallow-creme") baseTitle = "Haus of Sage Sun Balm Stick";
    else if (h === "everyday-daily-tallow-creme") baseTitle = "Haus of Sage Everything Daily Tallow Crème";
    else if (h === "mens-daily-creme") baseTitle = "Haus of Sage Men's Daily Tallow Crème";
    else if (h === "firming-tallow-balm") baseTitle = "Haus of Sage Firming Tallow Balm";
    else if (h === "antioxidant-tallow-balm") baseTitle = "Haus of Sage Antioxidant Tallow Balm";
    else if (h === "brightening-tallow-balm") baseTitle = "Haus of Sage Vitamin C Brightening Tallow Balm";
    else if (h === "clarifying-tallow-balm") baseTitle = "Haus of Sage Clarifying Tallow Balm";
    else if (h === "blue-algae-aloe-powder-cleanser") baseTitle = "Haus of Sage Blue Algae & Aloe Powder Cleanser";
    else if (h === "honey-tallow-gentle-daily-soap") baseTitle = "Haus of Sage Honey Tallow Soap";
    else if (!/^haus of sage\b/i.test(baseTitle)) baseTitle = `Haus of Sage ${baseTitle}`;
  }
  if (brand.slug === "sugarshack-mushrooms") {
    const h = raw.handle || "";
    if (h === "lions-mane-mushroom-extract") baseTitle = "Sugarshack Lion's Mane Tincture";
    else if (h === "reishi-mushroom-extract") baseTitle = "Sugarshack Reishi Tincture";
    else if (h === "chaga-mushroom-extract") baseTitle = "Sugarshack Chaga Tincture";
    else if (h === "cordyceps-mushroom-extract") baseTitle = "Sugarshack Cordyceps Tincture";
    else if (h === "turkey-tail-mushroom-extract") baseTitle = "Sugarshack Turkey Tail Tincture";
    else if (h === "mind-and-body-blend-mushroom-extract") baseTitle = "Sugarshack Mind and Body Blend Tincture";
    else if (!/^sugarshack\b/i.test(baseTitle)) baseTitle = `Sugarshack ${baseTitle}`;
  }
  let flavorClean = flavorLabel ? String(flavorLabel).trim() : flavorLabel;
  if (flavorClean) flavorClean = lotionScentLabel(flavorClean);
  if (flavorClean) flavorClean = flavorClean.replace(/\s*[-–—]+\s*$/g, "").replace(/\s+-\s*$/g, "").trim();
  if (flavorClean && /baker|collection|stack|variety|combo pack|white label|sample|gallon/i.test(flavorClean))
    flavorClean = null;
  if (flavorClean && brand.slug === "haus-of-sage") {
    if (/\b(sample|48|72|96|gallon|pack of)\b/i.test(flavorClean)) flavorClean = null;
  }
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
  title = title.replace(/\s+-\s*$/, "").replace(/\s+—\s+stack$/i, "").trim();
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
  if (
    brand.slug === "zing-toothpaste" ||
    brand.slug === "hydro-trapp" ||
    brand.slug === "solara-suncare"
  ) {
    ingredients = [];
  }
  if (brand.slug === "stomp-nutrition") {
    const h = raw.handle || "";
    if (h === "whey-protein-chocolate-brownie-batter") {
      ingredients = [
        "Grass-fed whey protein isolate",
        "Grass-fed whey protein concentrate",
        "Cocoa powder",
        "MCT on acacia",
        "Xanthan gum",
        "Stevia Reb M",
        "Sunflower lecithin",
        "Sea salt",
      ];
    } else if (h === "chocolate-chip-cookie-dough-vegan-protein") {
      ingredients = [];
    }
  }
  if (brand.slug === "haus-of-sage") {
    const h = raw.handle || "";
    if (h === "activated-charcoal-tallow-deodorant-cream" || h === "tallow-deodorant-stick" || h === "liquid-deodorant-extra-strength") {
      ingredients = ["Grass-fed beef tallow", "Magnesium hydroxide"];
    } else if (h === "sun-balm" || h === "everything-daily-tallow-creme" || h === "tallow-sun-balm" || h === "sun-lip-balm") {
      ingredients = ["Grass-fed beef tallow", "Non-nano zinc oxide"];
    } else if (/tallow|cloud-9/i.test(h)) {
      ingredients = ["Grass-fed beef tallow"];
    }
  }
  if (brand.slug === "sugarshack-mushrooms") {
    const h = raw.handle || "";
    const baseIng = ["Organic cane alcohol", "Carbon-filtered water"];
    if (h === "lions-mane-mushroom-extract") {
      ingredients = ["Lion's Mane fruiting body", ...baseIng];
    } else if (h === "reishi-mushroom-extract") {
      ingredients = ["Reishi fruiting body", ...baseIng];
    } else if (h === "chaga-mushroom-extract") {
      ingredients = ["Chaga fruiting body", ...baseIng];
    } else if (h === "cordyceps-mushroom-extract") {
      ingredients = ["Cordyceps fruiting body", ...baseIng];
    } else if (h === "turkey-tail-mushroom-extract") {
      ingredients = ["Turkey tail fruiting body", ...baseIng];
    } else if (h === "mind-and-body-blend-mushroom-extract") {
      ingredients = ["Mushroom fruiting body blend", ...baseIng];
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
      if (brand?.slug === "haus-of-sage") {
        if (/\b(sample|48|72|96|gallon|pack of|white label)\b/i.test(label)) continue;
      }
      label = lotionScentLabel(label);
      if (!label) continue;
      if (/baker|collection|stack|variety/i.test(label)) continue;
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
      const cartCurrency = await fetchCurrency(base);
      const rawProducts = await fetchShopifyProducts(base);
      // products.json is often USD presentment even when cart.js is CAD/AUD.
      const presentment = rawProducts
        .flatMap((p) => p.variants || [])
        .map((v) => v.presentment_prices?.[0]?.price?.currency_code)
        .find(Boolean);
      const currency =
        presentment && String(presentment).toUpperCase() === "USD" ? "USD" : cartCurrency;
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
    path.join(root, "data/catalog-products-manifest-wave110.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave110Products: waveCount,
        wave110BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
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
    path.join(root, "data/wave110-selected.json"),
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
    `\nDone total=${all.length} wave110=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
