/**
 * Fetch Shopify catalogs for wave32 brands (c985+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent / shade variants into their own listings
 * - Skips merch, events, gift cards, wholesale-only SKUs
 * - Extracts ingredients from product HTML
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave32.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 985;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|gift certificate|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|do not use|tiktok shop|credit card payment|price test|employee wellness|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|pump holder|marketing card|fanny pack|luggage tag|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|ball cap|beanie|rainbow cap|canvas cap|tote bag|statement tote|\btote\b|silk scarf|sticker|mug\b|apparel|poster|patch|keychain|stuffed toy|plush|crew socks|socks\b|head wrap|book\b|journal\b|ebook|e-book|cookbook|workshop|masterclass|reading|tarot|ticket|event|class with|immersion|social hour|astrology|gua sha class|oracle|akashic|initiation:|pocket altar|free class|free gift|enamel pin|deodorant scoop|cream applicator|deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|nalgene bottle|team bottle|terrain bottle|fuel bottle|for pets?|\bpet\b|dog soap|dog balm|dog shampoo|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|vip protection|priority handling|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|digital (file|download)|gravity feed|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|cheek tint|lipstick|lip gloss|lip liner|eyeliner|makeup|setting spray|room spray|floor cleaner|dishwasher|laundry detergent|all purpose cleaner|neem comb|scalp massager|pill travel tin|welcome card|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|pouches|travel bag|travel organiser|travel organizer|wax melt|reed diffuser|clay diffuser|diffuser blend|\bcandle\b|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|facial rounds|swag|academy|course download|storage jar|stainless steel|fertility test|pregnancy test|\bpouch\b|laundry powder|laundry scent|laundry detergent|puppy paw|dog paw|mat spray|yoga (room|mat)|linen spray|room \+ linen|fabric refresher|perfumes?|perfume bar|linen spray|founder edition|blender bottle|grip socks|fudge hoodie|dove hoodie|bundle & save|\bshirt\b|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|travel tin|counter display|counter top box|box of 12|buy 6|racerback|raceback|\btank\b|trucker|snapback|tumbler|flask|insulated glass|bamboo spoon|plastic tumbler|storage can|measuring spoon|shaving brush|safety blades|\brazor\b|lunch bag|jute soap|gift set|gift box|self tanner|kabuki|pencil case|cosmetic case|hand sanitizer|you are awesome|accessories only|starter kit bag|kit bag|bodysuit|onesie|metal travel cap|anti-slip bottle|bottle sleeve|\btesters?\b|silk bonnet|silk scrunchie|scrunchie|bulk empty|empty mouthwash|empty toothpaste|silicone sleeves?|soap holder|gua sha|setting powder|highlighter|bronzing|contour stick|lash \+ brow|brow oil|bug spray|insect repellent|jacket|windbreaker|windguard|wind vest|singlet|visor|sunglasses|carabiner|shopping bag|gaiter|tri suit|tri top|tri short|bib short|training top|marathon singlet|polo|jersey|almond butter|cacao powder|chia seeds|hemp hearts|lupin flour|peanut butter|mct oil|valentine|mask applicator|face brush|steel bowl|baseball cap|carbon offset|carbon neutral|walking with god|loofah|sage bundle|hair wrap|mindfulness book|mystery shampoo|volume [1-4]|full study|ambassador tee|ambassador set|konjac|facial sponge|foundation brush|protein shaker|\bshaker\b|\bbag\b|psl bag|bandana|dandelion bandana|dish soap|hand soap concentrate|route shipping|package cove|shipping protection|herbal tea|\btea bags?\b|loose leaf|laundry liquid|washing up liquid|dog & puppy|5 litre pump|pump dispenser|box of 18|20l\b|hand wash|kidney cleanse|liver detox|matcha tea|coconut milk powder|coconut coffee powder|wheatgrass juice|organic inulin|omelette|dark fish|light fish|powder funnel|cooking tallow|goat milk ghee|goat milk cream|stout coffee|\bbbq\b|\bsteak\b|\bburger\b|\bchicken\b|\bveggie\b|mushroom cap|leather lip balm|dish scrub|dishwashing set|soap saver bag|no bugs balm|hospitality bundle|retail bundle|clinic bundle|complimentary box|empty plastic jar|pouch only|colonized grain|agar plates|grow block|growler bottle|fire cider|donation|refuge|ice cube tray|sports bottle|glass bottle|application mitt|tanning mitt|self[- ]?tan|vacay vibes|christmas cracker|conversation cards|multi-tool|eau de parfum|cologne|nizoral|ketoconazole|tracking number|floor display|prepack combo|custom logo|b-pack|gift voucher|gift pack|vat free|facial roller|eye mask|application brush|tanning mist|face tan|bronzed babe|essential oil|bath bomb|bathing ritual|\bcombs?\b|\bshorts\b|\bspawn\b|dog treats?|sleep mask|red light|elderberry syrup|golden milk|bite relief|aromatherapy|room & body spray|soap saver|dopp|after shave|aftershave|postcard|booklet|counter card|hang tag|mystery gift|no gift|gear wash|ear rinse|defog|mask strap|pump head only|wall-mounted|army style cap|lifeguard|sunshirt|world reef day|satin sleep|air cleanser|culinary|makeup bundle|gingival|aroma diffuser|printed booklet|cardstock|neoprene|explorer kit|dive essentials|custom explorer|ingredients to avoid|body wash bottle|recycled washbag|shampoo bar tray|lip brush|\byoni\b|\blingam\b|love lube|tanning oil|complete guide|serum foundation|silicone sheet|hot pink case|mint green case|spatula|reusable pump|empty pump|foraging hunt|farm foraging|electric mixer|electric whisk|wild whisk|soap remnant|soap stand|shower soap stand|gardenia tallow & beeswax candle|tallow & beeswax candle|\bcandles?\b|wrinkle patches|lumineux|gua-?sha|soap case|scalp brush|eco escapades|soft drink|foraging|dried mushroom|tea blend|cotton flannel|wool flannel|vegetable glycerin|seasoning and rub|whole dried|cooking tallow|fresh beef tallow|order builder|wool batting|climate beneficial™ wool|camocim|cajamarca|regenerative organic coffee|\bcoffee beans?\b|abundance candle|beeswax candle|konjac sponge|digital gift card|subscription perk|play mat|spectrumview|monitor|hair brush|shampoo bar tin|bar tin|the humby club|methylene blue|ghk-?cu|copper peptide|celebrity skin|at-home remedies|vip bundle|\bpup\b|compression sock|crew sock|boot sock|sleep sock|pro gear|advantage gear|mason jar candle|wood conditioner|paw protect|farm tour|fresh (king|pink|golden|black|lion)|grower's choice|mixed mushroom box|\bseltzer\b|shower cap|silk pillowcase|microfiber|hair pick|hair towel|flaxseed cap|cotton face mask|bath bunny|bath toy|bubble wand|chewing gum|mouthwash cup|energy bar|energy gel|running energy|informed sport|\btesto\b|spot dots|face cloths?|hydrogel eye|bug balm|toothbrush case|brush case|toothkeeper|\bgwp\b|wholesale|sauna hat|vibey shades|dish soap|dishwashing|cellulose cloth|loofie|empty vegan capsules|empty capsules|dried whole|gourmet salt|finishing salt|food topper|tea blend|tea steeper|dried elderberries|tick stick|illuminator|edgelift|satin bonnet|hair bonnet|detangle define|24 pack|sample jar|wooden soap dish|gift basket|sriracha|smoked salt|pink salt|hickory|for dogs|dog blend|botanical tea|birthday bundle|slick-flex|slick-dense|slay and stay|slay & stay|thermal guard brush|reversible satin|edge lift|starter kit - dish|loofie scrubber|hand lotion with in|consultations?|guide to|water-based lubricant|\blubricant\b|fire cider|bone meal|wash tabs|bug off|bug repellent|herbal tea|vanilla (bean )?extract|migraine roller|soy candles?|wax wraps?|eyelash|drinkware|hand mixer|active bottle|elderberry syrup kits?|foaming tallow hand soap|6 pack|refillery|pearl powder|loofah|eco action|laundry detergent strips|wooden italian hair brush|nectar scent|natural perfume|free gifts)\b/i;

const SKIP_TITLE_EXTRA =
  /\b(consultations?|guide to|water-based lubricant|\blubricant\b|bone meal|wash tabs|bug off|vanilla (bean )?extract|migraine roller|wax wraps?|eyelash|drinkware|hand mixer|active bottle|elderberry syrup kits?|foaming tallow hand soap|refillery|pearl powder|eco action|laundry detergent strips|nectar scent|natural perfume|free gifts|egyptian loofah|ice cream maker|slushy machine|laying hens|whole turkey|compost garden|fresh,? 4 oz|linen & room mist|room mist|lash & brow|lash and brow|dad hat|heritage collection|tanning oil|self[- ]?tan|finishing oils? set|wellness oil set|everyday essentials oil|extra virgin coconut oil|gourmet & finishing|discovery kit|testers?|methylene blue|cbd infused|fairness cream|shipping protection|aluminum display|multi-pack|multi lip balm display|ups import|tube key|\*\s*\d+-pack|online market|ticked off|tallow tan|konjac|serving scoop|frother|shaker bottle|keepcap|keep cap|confetti comb|hair brush|jute travel|travel pouch|pink freud|mycology poster|mycology tee|trucker cap|i.?mushrooms|stainless steel water|me-time tea|tallow twins hats|gua sha|sample set|wholesale|gift card|digital gift card|flip top|sleep soak|bath soak)\b/i;

const SKIP_TYPE =
  /\b(gift card|merchandise|apparel|ticket|event|workshop|class|reading|ebook|download|swag|accessories|returns|post-purchase protection|shipping protection|cardstock|consultation|guide)\b/i;

const SKIP_TAGS =
  /\b(calendar|events|ticket|workshop|merch|apparel)\b/i;

const NICHE =
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sunbalm|sun[- ]?balm|sunguard|sun protection|sun lotion|sun cream|after[- ]?sun|sun protectant|sunup|sun milk|zinc oxide|\bzinc\b|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|tooth powder|floss|mouthwash|mouth rinse|mouth sores|healthy gums|healthy teeth|oral care|oral health|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|tablet|shampoo|conditioner|hairwash|hair wash|dry shampoo|hair clay|shikakai|champi|pomade|grooming balm|hair (oil|mask|serum|care|cream|butter)|beard|scalp|leave[- ]?in|protein|whey|casein|collagen|creatine|pea protein|chocho|meal shake|drink mix|wellness powder|immune support|daily (calm|energy|hydration)|vitamin|supplement|capsule|softgel|probiotic|synbiotic|colostrum|biotin|adaptogen|nootropic|lion'?s mane|reishi|chaga|cordyceps|turkey tail|mushroom coffee|(flow|zen|mojo|mush love) coffee|mushroom|tonic|powder|magnesium|gummies|gummy|prenatal|serums?|moisturizer|moisturiser|cleanser|face wash|facial|toner|retinol|niacinamide|bakuchiol|\bbooster\b|cream|lotion|oil|mask|balm|souffl|mist|essence|exfoliant|lip|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|organ|greens?|superfood|multi for|hydust|sweetpeace|bite|servings|morning ritual|afternoon ritual|ort|daily hustle|daily joy|mineral defense|\brefill\b|n[- ]?hap|nanoxim|recovery drink|hydration salts?|hydration drops?|hydration hero|salty einstein|salty goddess|salty turbo|lazy lightning|electric energy|plant protein|greens and reds|prebiotic deodorant|ceramide jelly|hydra drench|hydra-lite|weightless shampoo|weightless condition|forager'?s blend)\b|deodor|electrolyt|hydrat/i;

const FLAVOR_OPTION = /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade/i;

/** Convert shop-native prices that would otherwise look like USD luxury SKUs. */
const FX_TO_USD = {
  "tallow-twins": 0.73, // CAD
  hela: 0.73, // CAD
  mycotonics: 1.27, // GBP
  "c-and-o": 1.27, // GBP
};

function brandIdForIndex(i) {
  return `c${String(i + WAVE_START).padStart(3, "0")}`;
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
    .trim();
  const parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•*]\s*/, "").replace(/\.$/, ""))
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 160 &&
        !/^(and|or|with|contains|including|ingredients?|view all|full list|see all|free of|made without)$/i.test(
          s,
        ) &&
        !/^https?:/i.test(s) &&
        !/\.(jpg|png|webp|gif)(\?|$)/i.test(s),
    );
  if (parts.length <= 2 && cleaned.length > 80 && !/,/.test(cleaned)) return [];
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeInci(parts, raw) {
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin/i.test(raw)) {
    return true;
  }
  if (parts.length >= 2 && /water|aqua|glycerin|organic/i.test(raw) && /,/.test(raw)) return true;
  return parts.length >= 4;
}

function extractIngredients(html) {
  if (!html) return [];
  const dataAttrs = [
    /data-original-ingredients\s*=\s*"([^"]{10,8000})"/i,
    /data-ingredients(?:-list|-text)?\s*=\s*"([^"]{10,8000})"/i,
    /data-full-ingredients\s*=\s*"([^"]{10,8000})"/i,
  ];
  for (const re of dataAttrs) {
    const m = html.match(re);
    if (!m) continue;
    const raw = stripHtml(m[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }

  const viewAll = html.match(
    /(?:view\s+all\s+ingredients|full\s+ingredients?(?:\s+list)?|all\s+ingredients|inci\s*list|complete\s+ingredients?)[\s\S]{0,120}?<p[^>]*>([\s\S]{20,5000}?)<\/p>/i,
  );
  if (viewAll) {
    const raw = stripHtml(viewAll[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }

  const text = stripHtml(html);
  const markers = [
    /(?:full\s+)?(?:ingredients?|inci(?:\s+list)?|composition|what's in it|whats in it)\s*[:\-–]\s*([\s\S]{12,4000}?)(?=(?:\b(?:directions|how to use|how to apply|warnings?|caution|free from|what'?s not|storage|shelf life|for external|suggested use|usage|application|benefits|recycled|recyclable|disclaimer|other information|manufactured|nutrition)\b|$))/i,
  ];
  for (const re of markers) {
    const mm = text.match(re);
    if (!mm) continue;
    const raw = mm[1].trim();
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }

  const inci = text.match(
    /\b(?:Aqua|Water|Eau)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9][^,]{1,100}){5,60}/i,
  );
  if (inci) {
    const parts = parseList(inci[0]);
    if (parts.length >= 5) return parts;
  }
  return [];
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
    [/dairy[- ]free|no dairy/, "Dairy"],
    [/soy[- ]free/, "Soy"],
    [/artificial (color|colour|dye)s?[- ]free|no artificial (color|colour|dye)/, "Artificial dyes"],
  ];
  for (const [re, label] of rules) {
    if (re.test(hay) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 6);
}

function inferCategory(brandCategories, title, productType, tags) {
  const hay = `${title} ${productType} ${(tags || []).join(" ")}`.toLowerCase();
  const rules = [
    ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sunbalm|sun[- ]?balm|sunguard|sun protection|sun stick|sun lotion|sun cream|after[- ]?sun|sun protectant|mineral defense|zinc stick|tinted zinc|mineral zinc)\b/],
    ["deodorant", /deodor|antiperspir|underarm|\bdeo\b/],
    ["supplements", /\b(lion'?s mane|reishi|chaga|cordyceps|maitake|shiitake|turkey tail|oyster mushroom|snow fungus|mushroom complex|mushroom extract|mushroom (coffee|tincture|blend)|myco blend|synergy - \d+ mushrooms|adaptogen|nootropic)\b/],
    ["electrolytes", /\b(electrolyt|oral rehydration|hydration (powder|packet|mix|stick|multiplier|pak)|rapid hydration|hydro pak|power pak|drink mix|hydust|organic hydration|servings|morning ritual|afternoon ritual)\b/],
    ["oral", /\b(toothpaste|toothbrush|floss|mouthwash|oral care|oral health|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|teeth|tooth (powder|serum|paste)|enamelizer)\b/],
    ["hair", /\b(shampoo|conditioner|hair|scalp|curl|leave[- ]?in|edge control|twist|beard|dry shampoo|hair clay)\b/],
    ["protein", /\b(protein|whey|casein|pea protein|plant protein|chocho|meal shake|sweetpeace|creatine|recovery drink)\b/],
    ["skincare", /\b(serums?|moisturizer|moisturiser|cleanser|cream|toner|mask|facial|skin|body (lotion|butter|wash|cream|oil|bar)|lip|soap|balm|oil|mist|tallow)\b/],
    ["supplements", /\b(vitamin|supplement|capsule|softgel|probiotic|adaptogen|mushroom|tonic herb|collagen|prenatal|greens?|organ|superfood|magnesium|gumm|multi for|cortisol|bite)\b/],
  ];
  for (const [cat, re] of rules) {
    if (re.test(hay)) return cat;
  }
  return brandCategories[0] || "skincare";
}

function refineCategory(category, title, brand) {
  const t = title.toLowerCase();
  if (/\b(sunbalm|sun[- ]?balm|sunguard|tinted zinc|mineral zinc|zinc tallow|safe sunscreen|sun protectant|after[- ]?sun)\b/.test(t)) {
    return "sunscreen";
  }
  if (/\b(toothpaste|tooth powder|mouth rinse|pulling oil|hydroxyapatite|n[- ]?hap|volcanic tooth)\b/.test(t)) {
    return "oral";
  }
  if (/\b(sunup|sun milk|summer balm|tallow \+ non-nano zinc|non-nano zinc)\b/.test(t)) {
    return "sunscreen";
  }
  if (/\b(hydration drops?|electrolytes?)\b/.test(t)) return "electrolytes";
  if (/\b(organic plant protein|grass fed whey|marine collagen|micronized creatine)\b/.test(t)) {
    return /\bcollagen|creatine\b/.test(t) ? "supplements" : "protein";
  }
  if (/\b(deodorant|deo\b)\b/.test(t)) return "deodorant";
  if (/\b(shampoo|conditioner|hair (oil|mask|serum|cleanser)|scalp|curl (cleanser|cream|conditioner)|protein booster|oil blend)\b/.test(t) && !/\blip\b/.test(t)) {
    return "hair";
  }
  if (/\b(recovery drink|plant protein|hydration hero|blg)\b/.test(t)) return "protein";
  if (
    /\b(lip balm|bar soap|sphere soap|toner|salt scrub|diaper cream|face (oil|cream|balm|serum)|body (oil|balm|butter|wash|cream)|tallow balm|whipped tallow|moisturi[sz]er|cleanser)\b/.test(
      t,
    )
  ) {
    return "skincare";
  }
  if (/\bvitamin c serums?\b/.test(t)) return "skincare";
  if (brand?.categories?.length === 1 && brand.categories[0] === "supplements") {
    return "supplements";
  }
  return category;
}

function isOnNiche(raw, brand) {
  const title = raw.title || "";
  const type = raw.product_type || "";
  const tags = (raw.tags || []).join(" ");
  const hay = `${title} ${type} ${tags}`;
  if (SKIP_TITLE.test(title) || SKIP_TITLE_EXTRA.test(title) || SKIP_TYPE.test(type) || SKIP_TAGS.test(tags)) return false;
  if (NICHE.test(hay)) return true;
  // Single-category fallback only for drink-mix titles (e.g. "15 COLD SERVINGS")
  if (brand.categories.length === 1 && brand.categories[0] === "electrolytes") return true;
  // Functional drink-mix houses title SKUs "Focus" / "Calm" / "Love"
  if (
    brand.categories.includes("electrolytes") &&
    brand.categories.includes("supplements") &&
    /\b(focus|calm|energy|love|cacao|coconut|resilience|cluster|electric energy|salty)\b/i.test(hay)
  ) {
    return true;
  }
  // Hair/supplement gummy houses often title SKUs "Thrive" / "Glow" with type Hair|Skin
  if (
    (brand.categories.includes("hair") || brand.categories.includes("supplements")) &&
    /\b(hair|skin|anti-aging|wellness|gumm)\b/i.test(`${type} ${tags}`)
  ) {
    return true;
  }
  // Stack houses title SKUs "Foundation Complete" / "Gut Health Bundle"
  if (
    brand.categories.includes("supplements") &&
    /\b(foundation|immunity|gut|joint|colostrum|biotin|synbiotic|menopause|libido|metabolism|daily essentials|hair essentials|beauty bundle|creatine|whey|protein|collagen|vitamin)\b/i.test(
      hay,
    )
  ) {
    return true;
  }
  return false;
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
  return raw.images?.[0]?.src || raw.image?.src;
}

function flavorOptionIndex(raw) {
  const options = raw.options || [];
  return options.findIndex((o) => FLAVOR_OPTION.test(o.name || ""));
}

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

function mapOne(raw, brand, brandId, index, variant, flavorLabel) {
  const baseTitle = (raw.title || "").trim();
  const title = flavorLabel ? `${baseTitle} — ${flavorLabel}` : baseTitle;
  if (!title) return null;
  const imageSrc = imageForVariant(raw, variant);
  if (!imageSrc) return null;
  const rawPrice = Number(variant?.price || raw.variants?.[0]?.price || 0);
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return null;
  const fx = FX_TO_USD[brand.slug];
  const price = fx ? Math.round(rawPrice * fx * 100) / 100 : rawPrice;
  if (price <= 0) return null;

  const body = raw.body_html || "";
  const description =
    firstParagraph(body) ||
    `${title} from ${brand.name} — curated for the tiny marketplace.`;
  const handle = raw.handle || slugify(baseTitle);
  const flavorSlug = flavorLabel ? `-${slugify(flavorLabel)}` : "";
  const idCore = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10)}${String(index + 1).padStart(3, "0")}${flavorSlug.replace(/-/g, "").slice(0, 8)}`;
  const ingredients = extractIngredients(body);
  const freeFrom = inferFreeFrom(`${title} ${description} ${stripHtml(body)}`);
  const category = refineCategory(
    inferCategory(
      brand.categories || ["skincare"],
      `${title} ${raw.product_type || ""}`,
      raw.product_type || "",
      raw.tags || [],
    ),
    title,
    brand,
  );

  return {
    id: idCore.slice(0, 40),
    slug: `${brand.slug}-${handle}${flavorSlug}`.slice(0, 100),
    brandId,
    name: title.slice(0, 140),
    category,
    price: Math.round(price * 100) / 100,
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

function expandProducts(raw, brand, brandId, index) {
  if (!isOnNiche(raw, brand)) return [];
  const flavorIdx = flavorOptionIndex(raw);
  const variants = raw.variants || [];
  if (flavorIdx >= 0 && variants.length > 1) {
    const seen = new Set();
    const out = [];
    for (const v of variants) {
      const label = [v.option1, v.option2, v.option3][flavorIdx];
      if (!label || /^default title$/i.test(label)) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const mapped = mapOne(raw, brand, brandId, index, v, label);
      if (mapped) out.push(mapped);
    }
    if (out.length) return out;
  }
  const mapped = mapOne(raw, brand, brandId, index, variants[0], null);
  return mapped ? [mapped] : [];
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = existing.filter((p) => {
    const n = Number(String(p.brandId).replace(/^c/, ""));
    return !Number.isFinite(n) || n < WAVE_START || n > WAVE_END;
  });
  const all = [...kept];
  const perBrand = [];
  const failures = [];

  for (let i = 0; i < seedBrands.length; i++) {
    const brand = seedBrands[i];
    const brandId = brandIdForIndex(i);
    const base = brand.shopBase || brand.websiteUrl;
    process.stdout.write(`→ ${brand.slug.padEnd(22)} `);
    try {
      const rawProducts = await fetchShopifyProducts(base);
      const mapped = [];
      const seenSlug = new Set();
      const seenName = new Set();
      rawProducts.forEach((raw, idx) => {
        for (const p of expandProducts(raw, brand, brandId, idx)) {
          const nameKey = p.name.toLowerCase().replace(/\s+/g, " ");
          if (seenSlug.has(p.slug) || seenName.has(nameKey)) continue;
          seenSlug.add(p.slug);
          seenName.add(nameKey);
          mapped.push(p);
        }
      });
      const withIng = mapped.filter((p) => p.ingredients.length > 0).length;
      const variants = mapped.filter((p) => / — /.test(p.name)).length;
      console.log(`kept ${mapped.length}/${rawProducts.length} ingredients ${withIng} variants ${variants}`);
      perBrand.push({
        slug: brand.slug,
        brandId,
        raw: rawProducts.length,
        kept: mapped.length,
        withIngredients: withIng,
        flavorVariants: variants,
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
    path.join(root, "data/catalog-products-manifest-wave32.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave32Products: waveCount,
        wave32BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
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
    path.join(root, "data/wave32-selected.json"),
    JSON.stringify(
      seedBrands.map((b, i) => ({
        slug: b.slug,
        shopBase: b.shopBase,
        categories: b.categories,
        id: `c${String(i + WAVE_START).padStart(3, "0")}`,
      })),
      null,
      2,
    ),
  );
  console.log(
    `\nDone total=${all.length} wave32=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
