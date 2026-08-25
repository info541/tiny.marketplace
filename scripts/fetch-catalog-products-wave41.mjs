/**
 * Fetch Shopify catalogs for wave41 brands (c1086+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent / shade variants into their own listings
 * - Skips merch, events, gift cards, wholesale-only SKUs
 * - Extracts ingredients from product HTML
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave41.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1086;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|gift certificate|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|do not use|tiktok shop|credit card payment|price test|employee wellness|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|pump holder|marketing card|fanny pack|luggage tag|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|ball cap|beanie|rainbow cap|canvas cap|tote bag|statement tote|\btote\b|silk scarf|sticker|mug\b|apparel|poster|patch|keychain|stuffed toy|plush|crew socks|socks\b|head wrap|book\b|journal\b|ebook|e-book|cookbook|workshop|masterclass|reading|tarot|ticket|event|class with|immersion|social hour|astrology|gua sha class|oracle|akashic|initiation:|pocket altar|free class|free gift|enamel pin|deodorant scoop|cream applicator|deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|nalgene bottle|team bottle|terrain bottle|fuel bottle|for pets?|\bpet\b|dog soap|dog balm|dog shampoo|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|vip protection|priority handling|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|digital (file|download)|gravity feed|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|cheek tint|lipstick|lip gloss|lip liner|eyeliner|makeup|setting spray|room spray|floor cleaner|dishwasher|laundry detergent|all purpose cleaner|neem comb|scalp massager|pill travel tin|welcome card|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|pouches|travel bag|travel organiser|travel organizer|wax melt|reed diffuser|clay diffuser|diffuser blend|\bcandle\b|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|facial rounds|swag|academy|course download|storage jar|stainless steel|fertility test|pregnancy test|\bpouch\b|laundry powder|laundry scent|laundry detergent|puppy paw|dog paw|mat spray|yoga (room|mat)|linen spray|room \+ linen|fabric refresher|perfumes?|perfume bar|linen spray|founder edition|blender bottle|grip socks|fudge hoodie|dove hoodie|bundle & save|\bshirt\b|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|travel tin|counter display|counter top box|box of 12|buy 6|racerback|raceback|\btank\b|trucker|snapback|tumbler|flask|insulated glass|bamboo spoon|plastic tumbler|storage can|measuring spoon|shaving brush|safety blades|\brazor\b|lunch bag|jute soap|gift set|gift box|self tanner|kabuki|pencil case|cosmetic case|hand sanitizer|you are awesome|accessories only|starter kit bag|kit bag|bodysuit|onesie|metal travel cap|anti-slip bottle|bottle sleeve|\btesters?\b|silk bonnet|silk scrunchie|scrunchie|bulk empty|empty mouthwash|empty toothpaste|silicone sleeves?|soap holder|gua sha|setting powder|highlighter|bronzing|contour stick|lash \+ brow|brow oil|bug spray|insect repellent|jacket|windbreaker|windguard|wind vest|singlet|visor|sunglasses|carabiner|shopping bag|gaiter|tri suit|tri top|tri short|bib short|training top|marathon singlet|polo|jersey|almond butter|cacao powder|chia seeds|hemp hearts|lupin flour|peanut butter|mct oil|valentine|mask applicator|face brush|steel bowl|baseball cap|carbon offset|carbon neutral|walking with god|loofah|sage bundle|hair wrap|mindfulness book|mystery shampoo|volume [1-4]|full study|ambassador tee|ambassador set|konjac|facial sponge|foundation brush|protein shaker|\bshaker\b|\bbag\b|psl bag|bandana|dandelion bandana|dish soap|hand soap concentrate|route shipping|package cove|shipping protection|herbal tea|\btea bags?\b|loose leaf|laundry liquid|washing up liquid|dog & puppy|5 litre pump|pump dispenser|box of 18|20l\b|hand wash|kidney cleanse|liver detox|matcha tea|coconut milk powder|coconut coffee powder|wheatgrass juice|organic inulin|omelette|dark fish|light fish|powder funnel|cooking tallow|goat milk ghee|goat milk cream|stout coffee|\bbbq\b|\bsteak\b|\bburger\b|\bchicken\b|\bveggie\b|mushroom cap|leather lip balm|dish scrub|dishwashing set|soap saver bag|no bugs balm|hospitality bundle|retail bundle|clinic bundle|complimentary box|empty plastic jar|pouch only|colonized grain|agar plates|grow block|growler bottle|fire cider|donation|refuge|ice cube tray|sports bottle|glass bottle|application mitt|tanning mitt|self[- ]?tan|vacay vibes|christmas cracker|conversation cards|multi-tool|eau de parfum|cologne|nizoral|ketoconazole|tracking number|floor display|prepack combo|custom logo|b-pack|gift voucher|gift pack|vat free|facial roller|eye mask|application brush|tanning mist|face tan|bronzed babe|essential oil|bath bomb|bathing ritual|\bcombs?\b|\bshorts\b|\bspawn\b|dog treats?|sleep mask|red light|elderberry syrup|golden milk|bite relief|aromatherapy|room & body spray|soap saver|dopp|after shave|aftershave|postcard|booklet|counter card|hang tag|mystery gift|no gift|gear wash|ear rinse|defog|mask strap|pump head only|wall-mounted|army style cap|lifeguard|sunshirt|world reef day|satin sleep|air cleanser|culinary|makeup bundle|gingival|aroma diffuser|printed booklet|cardstock|neoprene|explorer kit|dive essentials|custom explorer|ingredients to avoid|body wash bottle|recycled washbag|shampoo bar tray|lip brush|\byoni\b|\blingam\b|love lube|tanning oil|complete guide|serum foundation|silicone sheet|hot pink case|mint green case|spatula|reusable pump|empty pump|foraging hunt|farm foraging|electric mixer|electric whisk|wild whisk|soap remnant|soap stand|shower soap stand|gardenia tallow & beeswax candle|tallow & beeswax candle|\bcandles?\b|wrinkle patches|lumineux|gua-?sha|soap case|scalp brush|eco escapades|soft drink|foraging|dried mushroom|tea blend|cotton flannel|wool flannel|vegetable glycerin|seasoning and rub|whole dried|cooking tallow|fresh beef tallow|order builder|wool batting|climate beneficial™ wool|camocim|cajamarca|regenerative organic coffee|\bcoffee beans?\b|abundance candle|beeswax candle|konjac sponge|digital gift card|subscription perk|play mat|spectrumview|monitor|hair brush|shampoo bar tin|bar tin|the humby club|methylene blue|ghk-?cu|copper peptide|celebrity skin|at-home remedies|vip bundle|\bpup\b|compression sock|crew sock|boot sock|sleep sock|pro gear|advantage gear|mason jar candle|wood conditioner|paw protect|farm tour|fresh (king|pink|golden|black|lion)|grower's choice|mixed mushroom box|\bseltzer\b|shower cap|silk pillowcase|microfiber|hair pick|hair towel|flaxseed cap|cotton face mask|bath bunny|bath toy|bubble wand|chewing gum|mouthwash cup|energy bar|energy gel|running energy|informed sport|\btesto\b|spot dots|face cloths?|hydrogel eye|bug balm|toothbrush case|brush case|toothkeeper|\bgwp\b|wholesale|sauna hat|vibey shades|dish soap|dishwashing|cellulose cloth|loofie|empty vegan capsules|empty capsules|dried whole|gourmet salt|finishing salt|food topper|tea blend|tea steeper|dried elderberries|tick stick|illuminator|edgelift|satin bonnet|hair bonnet|detangle define|24 pack|sample jar|wooden soap dish|gift basket|sriracha|smoked salt|pink salt|hickory|for dogs|dog blend|botanical tea|birthday bundle|slick-flex|slick-dense|slay and stay|slay & stay|thermal guard brush|reversible satin|edge lift|starter kit - dish|loofie scrubber|hand lotion with in|consultations?|guide to|water-based lubricant|\blubricant\b|fire cider|bone meal|wash tabs|bug off|bug repellent|herbal tea|vanilla (bean )?extract|migraine roller|soy candles?|wax wraps?|eyelash|drinkware|hand mixer|active bottle|elderberry syrup kits?|foaming tallow hand soap|6 pack|refillery|pearl powder|loofah|eco action|laundry detergent strips|wooden italian hair brush|nectar scent|natural perfume|free gifts)\b/i;

const SKIP_TITLE_EXTRA =
  /\b(consultations?|guide to|oral health guide|water-based lubricant|\blubricant\b|bone meal|wash tabs|bug off|vanilla (bean )?extract|migraine roller|wax wraps?|eyelash|drinkware|hand mixer|active bottle|elderberry syrup kits?|foaming tallow hand soap|refillery|pearl powder|eco action|laundry detergent strips|nectar scent|natural perfume|free gifts|egyptian loofah|ice cream maker|slushy machine|laying hens|whole turkey|compost garden|fresh,? 4 oz|linen & room mist|room mist|lash & brow|lash and brow|dad hat|heritage collection|tanning oil|self[- ]?tan|finishing oils? set|wellness oil set|everyday essentials oil|extra virgin coconut oil|gourmet & finishing|discovery kit|testers?|methylene blue|cbd infused|fairness cream|shipping protection|aluminum display|multi-pack|multi lip balm display|ups import|tube key|\*\s*\d+-pack|online market|ticked off|tallow tan|konjac|serving scoop|frother|shaker bottle|keepcap|keep cap|confetti comb|hair brush|jute travel|travel pouch|pink freud|mycology poster|mycology tee|trucker cap|i.?mushrooms|stainless steel water|me-time tea|tallow twins hats|gua sha|sample set|wholesale|gift card|digital gift card|flip top|sleep soak|bath soak|fragrance oil|scented fragrance|cashback|\$10 back|\$15 cash|oat milk|shaker cup|doggie|nasal inhaler|bug repel|bug repellant|dermastamp|derma stamp|scalp oil applicator|applicator bottle|makeup sticks?|cheek & lip|cheek and lip|lip tint|skin tint|glow stick|fondue|mix & match deodorant \+ fragrance|^shipping$|campus set|jet set|puffed pouch|lightweight sweatshirt|the puff -|the puff –|the hat\b|savedby|boba pearls?|boba frother|pixelated dreams|ramuné|retrowire|shower caddy|hair growth guide|1kg bag|probiertüte|trial sachet|custom herbal|custom formula|wholesale order|green currents zine|bombilla|shipping label|awakening hair brush|perfume oil|tools set|magnetic jar|oil pump|vanilla flame|sculpting copper|got beef cap|logo cap|skincare spoon|instant brown sugar|holiday gift kit|free shaker|denttabs book|herbal broth|herbal cold care|gut feeling -|tide pool herbal|cool wave herbal|village green herbal|tally health|shred lord|sunrise (bucket|cap|tee|long sleeve)|gelly mug guard|suicide prevention|label setup|botanical bandana|consultation call|seconds lip balm|herb ally sticker|put flowers on your face|bamboo spatula|realtree camo|phone case|iphone tough|seasoning blend|food of the gods|make america healthy|soccer t-shirt|surf jersey|pre-workout|pre-feast|caffeinated island|caffeinated pineapple|hibiscus halter|coconut tree crew|club adapt|stay awhile|baby tee|the wave long sleeve|big shift|this body contains|kids.? shorts|adapt glass bottle|agave plant loofah|hessian travel|vegan leather travel|free compostable toothbrush|soap keeper|teak rectangular|bamboo waterfall|soap scrap|e-gift card|into the woods|bug bite balm|beef tallow jar|vanilla protein bar|chocolate protein bar|peanut butter protein bar|water bottle|starter pack|nose & toes|nose and toes|pet balm|128oz|thermostat|wreath decor|tin for lotion|mouth tape|dad hat|airbnb|hotels?, spas|dentist sample|bulk for hotels|build your own|pitt hopkins|soap scrap|sisal soap|infinity mascara|mascara (tablet|starter)|dual hit|get stronger in|holiday citrus herb brine|the best rub|seasoning & spices|krill|massage oil|flavor collection|family collection|jar collection|3-month starter|subscription bundle|dry touch lotion|dry touch continuous|dry touch sunscreen|anti chafe|whitening strips|pre-workout|massage candle|tallow guard shirt|hidden.product|discount_hidden|soap club|bulk bath salt|hand sanitizer|shower mist|room spray|customizable|winter biweekly|ready-to-fruit|liquid culture syringe|farm pickup|instruction cards)\b/i;

const SKIP_TYPE =
  /\b(gift card|merchandise|apparel|ticket|event|workshop|class|reading|ebook|download|swag|accessories|accessory|returns|post-purchase protection|shipping protection|cardstock|consultation|guide|pets?|room spray|massage candle|soap club|bug repellent|essential oil blend)\b/i;

const SKIP_TAGS =
  /\b(calendar|events|ticket|workshop|merch|apparel)\b/i;

const NICHE =
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sunbalms?|sun[- ]?balms?|sunguard|sun protection|sun lotion|sun cream|after[- ]?sun|sun protectant|sunup|sun milk|zinc oxide|\bzinc\b|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|tooth powder|zahnputz|floss|mouthwash|mouth rinse|mouth sores|healthy gums|healthy teeth|oral care|oral health|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|tablets?|shampoo|conditioner|hairwash|hair wash|dry shampoo|hair clay|shikakai|champi|pomade|grooming balm|hair (oil|mask|serum|care|cream|butter|gummies)|beard|scalp|leave[- ]?in|protein|whey|casein|collagen|creatine|pea protein|chocho|meal shake|drink mix|wellness powder|immune support|daily (calm|energy|hydration)|vitamin|supplement|capsule|softgel|probiotic|synbiotic|colostrum|biotin|adaptogen|nootropic|lion'?s mane|reishi|chaga|cordyceps|turkey tail|mushroom coffee|(flow|zen|mojo|mush love) coffee|mushroom|tonic|powder|magnesium|gummies|gummy|prenatal|serums?|moisturizer|moisturiser|cleanser|face wash|facial|toner|retinol|niacinamide|bakuchiol|\bbooster\b|cream|lotion|oil|mask|balm|souffl|mist|essence|exfoliant|lips?|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|organ|greens?|superfood|multi for|hydust|sweetpeace|bite|servings|morning ritual|afternoon ritual|ort|daily hustle|daily joy|mineral defense|\brefill\b|n[- ]?hap|nanoxim|recovery drink|hydration salts?|hydration drops?|hydration hero|salty einstein|salty goddess|salty turbo|lazy lightning|electric energy|plant protein|clear protein|greens and reds|prebiotic deodorant|ceramide jelly|hydra drench|hydra-lite|weightless shampoo|weightless condition|forager'?s blend|shampoo bars?|conditioner bars?)\b|deodor|electrolyt|hydrat/i;

const FLAVOR_OPTION = /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|scented|finish|constitutive|herb|fluord|fluoride|the taste|dry shampoo colour|style|tint|formula|whip|blend|infusi[oó]n|\bmaku\b|botanical bars|choose your scent/i;

/** Convert shop-native prices that would otherwise look like USD luxury SKUs. */
const FX_TO_USD = {
  himaya: 1.08,
  "natch-labs": 1.08,
  "hearth-and-hide": 0.6,
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
    ["oral", /\b(toothpaste|toothbrush|floss|mouthwash|oral care|oral health|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|teeth|tooth (powder|serum|paste)|enamelizer|zahnputz)\b/],
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
  if (brand?.slug === "himaya") return "sunscreen";
  if (brand?.slug === "natch-labs") return "oral";
  if (brand?.slug === "yamabushi-farms" || brand?.slug === "tilted-cap" || brand?.slug === "hodgins-harvest") {
    return "supplements";
  }
  if (brand?.slug === "miococo") {
    if (/\b(whey|vegan protein|protein powder)\b/.test(t)) return "protein";
    if (/\belectrolyte\b/.test(t)) return "electrolytes";
    return "supplements";
  }
  if (brand?.slug === "fat-chance-farm" && /\bdeodorant\b/.test(t)) return "deodorant";
  if (brand?.slug === "bearsville") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|beard|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "my-neighbors-tallow" && /\bhair oil\b/.test(t)) return "hair";
  if (brand?.slug === "house-of-tallow" && /\b(sol |sun stick|sunscreen spray)\b/.test(t)) return "sunscreen";
  if (brand?.slug === "house-of-tallow" && /\bdeodorant\b/.test(t)) return "deodorant";
  if (brand?.slug === "house-of-tallow" && /\bshampoo\b/.test(t)) return "hair";
  if (brand?.slug === "orawellness") return "oral";
  if (brand?.slug === "oak-grove-farms") return "supplements";
  if (brand?.slug === "clearly") {
    if (/\b(grass-fed whey|protein iced coffee)\b/.test(t)) return "protein";
    if (/\belectrolytes?\b/.test(t)) return "electrolytes";
    return "supplements";
  }
  if (brand?.slug === "hawaii-tallow") {
    if (/\bhair rinse\b/.test(t)) return "hair";
    if (/\b(tallow|toner|serum|soap|bar|lip|wash|scrub|oil|elixir|purifiant)\b/.test(t)) return "skincare";
    if (/\b(extract|tincture)\b/.test(t)) return "supplements";
  }
  if (brand?.slug === "mahealani-farms") {
    if (/\bhair\b/.test(t)) return "hair";
    if (/\b(serum|cream|balm|moisturizer)\b/.test(t)) return "skincare";
    if (/\btincture\b/.test(t)) return "supplements";
  }
  if (brand?.slug === "tallow-made" && /\bdeodorant\b/.test(t)) return "deodorant";
  if (brand?.slug === "be-blessed" && !/\b(spf|mineral shield|mineral sunscreen|silky sunscreen|daily protection)\b/.test(t)) {
    return "skincare";
  }
  if (brand?.slug === "texas-tallow" && !/\b(spf|sunscreen|zinc)\b/.test(t) && !/\bbeard\b/.test(t)) {
    return category === "hair" ? "hair" : "skincare";
  }
  if (/\b(skin toner|extract skin toner|chaga barrier|collagen lifting mask|muscle salve|myco glow|shiitake soap)\b/.test(t)) {
    return "skincare";
  }
  if (/\b(sunbalms?|sun[- ]?balms?|sunguard|tinted zinc|mineral zinc|zinc tallow|safe sunscreen|sun protectant|after[- ]?sun|tallow sunblock|sun shield|sun by manna|reef-safe|mineral sunscreen|spf\s*\d+|lip balm with spf|tinted peppermint lip)\b/.test(t)) {
    return "sunscreen";
  }
  if (/\b(toothpaste|tooth powder|mouth rinse|pulling oil|hydroxyapatite|n[- ]?hap|volcanic tooth|zahnputz|the tablets|the floss|the toothbrush)\b/.test(t)) {
    return "oral";
  }
  if (/\b(sunup|sun milk|summer balm|tallow \+ non-nano zinc|non-nano zinc|mineral sun butter|tallow zinc balm|nourish & shield|nourish and shield)\b/.test(t)) {
    return "sunscreen";
  }
  if (/\b(hydration drops?|electrolytes?|electrolyte powder|yuzu citrus|asian pear|white peach|lychee|watermelon electrolyte|jamaica electrolyte|acai electrolyte|pog electrolyte|electrolyte (tub|singles|caps|mix|stick)|hydration & recovery|sleep & hydration|raspberry electrolyte|lemon and lime electrolyte|adapt variety|adapt sleep|adapt 30pk|adapt sample|lytes|lemonade|cota|strawberry lemonade|peach clementine|bcaas? \+ electrolytes)\b/.test(t) && !/\bprotein\b/.test(t)) {
    return "electrolytes";
  }
  if (/\b(sun balm|mineral melt|mug guard|bod guard|sporto spray|melt stick|slip stick|golden guard|gold standard|the lifeguard|the gang|daily double|mineral spf|miracle jelly|miracle mask|sun cream|zinc lotion|tallow mineral sunscreen|tallow guard|spf\s*\d+|after[- ]?sun)\b/.test(t) && !/\b(dry touch|anti chafe|pre-workout)\b/.test(t)) {
    return "sunscreen";
  }
  if (/\b(toothpaste tablet|mouthwash (tablet|concentrate)|remineralizing toothpaste|nano hydroxyapatite)\b/.test(t)) {
    return "oral";
  }
  if (/\b(watermelon seed protein|smash melon protein|whey protein|beef isolate protein)\b/.test(t)) {
    return "protein";
  }
  if (/\b(body fuel|the warmup|goat.?s milk|golden glow|woodland dream|magic mushroom (moisture|facial|face)|matriarch|herbal enzyme|everywhere balm|glide balm|garden salve|calendula rose)\b/.test(t) && !/\bsun\b/.test(t)) {
    return "skincare";
  }
  if (/\b(nootropic energy|energy powder|creatine|collagen|daily greens|colostrum|inositol|chasteberry|biotin|l-glutamine|iron capsules|women'?s multivitamin)\b/.test(t) && !/\belectrolyt\b/.test(t) && !/\bpre-workout\b/.test(t)) {
    return "supplements";
  }
  if (/\b(marine collagen|collagen peptides|lion'?s mane|reishi|chaga|turkey tail|tincture|bitters|immunity tonic)\b/.test(t)) {
    return "supplements";
  }
  if (/\b(whey protein|plant protein|pea protein|whey isolate|clear (whey )?protein|milk tea whey|mushroom latte whey|grass-fed whey|clear whey)\b/.test(t)) {
    return "protein";
  }
  if (/\bbeard (oil|balm|soap|box|set)\b/.test(t)) return "hair";
  if (/\b(organic plant protein|grass fed whey|marine collagen|micronized creatine)\b/.test(t)) {
    return /\bcollagen|creatine\b/.test(t) ? "supplements" : "protein";
  }
  if (/\b(deodorant|deo\b|pongy pits|cocoa and clay)\b/.test(t)) return "deodorant";
  if (/\b(shampoo|conditioner|hair (oil|mask|serum|cleanser|gummies|spritz)|scalp|curl (cleanser|cream|conditioner)|protein booster|oil blend|dry shampoo|hydrosol|active bar)\b/.test(t) && !/\blip\b/.test(t)) {
    return "hair";
  }
  if (/\b(recovery drink|plant protein|hydration hero|blg)\b/.test(t)) return "protein";
  if (
    /\b(lip balm|lip elixir|love your lips|bar soap|sphere soap|toner|salt scrub|diaper cream|face (oil|cream|balm|serum)|body (oil|balm|butter|wash|cream)|tallow balm|tallow whip|whipped tallow|original balm|cloud moisturizer|pocket tallow|tallow body butter|moisturi[sz]er|cleanser|cleansing oil|face mist|bath melt)\b/.test(
      t,
    )
  ) {
    return "skincare";
  }
  if (/\b(acv rinse|apple cider vinegar rinse|hair tea|detangler blend)\b/.test(t)) return "hair";
  if (/\bvitamin c serums?\b/.test(t)) return "skincare";
  if (brand?.slug === "be-blessed" && !/\b(spf|mineral shield|mineral sunscreen|silky sunscreen|daily protection)\b/.test(t)) {
    if (category === "sunscreen" || category === "supplements") return "skincare";
  }
  if (brand?.slug === "texas-tallow" && !/\b(spf|sunscreen|zinc)\b/.test(t)) {
    if (category === "sunscreen") return "skincare";
  }
  if (/\b(chaga barrier|collagen lifting mask|muscle salve|myco glow|shiitake soap)\b/.test(t)) {
    return "skincare";
  }
  if (/\b(dental probiotic|oral probiotic|prebiotic (soft )?floss|hydroxyapatite|n[- ]?ha toothpaste|prebiotic toothpaste)\b/.test(t)) {
    return "oral";
  }
  if (/\b(pit stop|natural deodorant|desodorante)\b/.test(t)) return "deodorant";
  if (/\b(shampoo bar|conditioner bar|tangles beware|nice flow|good hair day|curl boss|shampoo en barra|acondicionador en barra)\b/.test(t)) {
    return "hair";
  }
  if (/\b(magnese me|magnesium spray)\b/.test(t)) return "supplements";
  if (/\b(soft serve|hey sugar|soap opera|wash goals|everywhere soap|body (lotion|scrub)|family body butter|barra bálsamo)\b/.test(t)) {
    return "skincare";
  }
  if (/\b(rough stock whip|beard)\b/.test(t)) return "hair";
  if (/\b(lion'?s mane|reishi|cordyceps|turkey tail|shiitake|chaga|maitake|blue oyster|trifecta blend|mega blend|dual extract|mushroom tincture)\b/.test(t)) {
    return "supplements";
  }
  if (/\b(skin toner|extract skin toner)\b/.test(t)) return "skincare";
  if (/\b(mineral zinc|sun balm|tinted mineral|tinted sports stick|solar repair|sheer mineral shield|tinted mineral sunscreen|after[- ]?sun)\b/.test(t)) {
    return "sunscreen";
  }
  if (/\b(hypertonic|isotonic|marine minerals|ion electrolytes)\b/.test(t)) return "electrolytes";
  if (/\b(grass fed whey|artisan cocoa whey|vanilla bean|signature native)\b/.test(t)) return "protein";
  if (brand?.categories?.length === 1 && brand.categories[0] === "electrolytes") return "electrolytes";
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
  const skipped =
    SKIP_TITLE.test(title) || SKIP_TITLE_EXTRA.test(title) || SKIP_TYPE.test(type) || SKIP_TAGS.test(tags);
  if (skipped) {
    const keepDespiteEssentialOil =
      /\b(tallow|deodorant|toothpaste|whey|protein|sun butter|zinc balm|body butter)\b/i.test(title) &&
      /\bessential oils?\b/i.test(title) &&
      !/\b(roller|perfume|fragrance oil|single)\b/i.test(title);
    const keepSample =
      /\b(sample|sampler)\b/i.test(title) &&
      (brand.categories.includes("electrolytes") || brand.categories.includes("protein")) &&
      !/\b(shaker|pre-workout)\b/i.test(title);
    const keepTallowAftershave =
      /\b(tallow|beard)\b/i.test(title) && /\b(aftershave|after shave)\b/i.test(title);
    const keepProteinBag = /\b(whey protein|protein bag|beef isolate|smash melon protein)\b/i.test(title);
    const keepSunmudTin = brand.slug === "sunmud" && /\b(travel tin|mineral sunscreen|sports stick|solar repair)\b/i.test(title);
    if (!keepDespiteEssentialOil && !keepSample && !keepTallowAftershave && !keepProteinBag && !keepSunmudTin) return false;
  }
  if (brand.slug === "nefertem" && /\b(bundle|skincare set|gift card|cold shipping|4 soap|3 lip balm set)\b/i.test(title)) return false;
  if (brand.slug === "hawaii-tallow" && /\b(candle|honi|discovery collection|night renewal ritual|tallow trio)\b/i.test(title)) return false;
  if (brand.slug === "mahealani-farms" && /\b(gift box|complete tincture set|dried mushroom)\b/i.test(title)) return false;
  if (
    brand.slug === "mahealani-farms" &&
    /\b(shiitake mushrooms|maitake mushroom|chestnut mushroom|pioppino|black king|white oyster|pink oyster|yellow oyster|lion'?s mane mushroom)\b/i.test(title) &&
    !/\b(tincture|serum|cream|balm|oil|moisturizer)\b/i.test(title)
  ) {
    return false;
  }
  if (brand.slug === "dakhota-prairie" && /\b(luxe discovery set|luxe renewal set)\b/i.test(title)) return false;
  if (brand.slug === "orawellness" && /\b(red.?light|ebook|educational materials|ph test|pocket applicator|starter kit|healthy mouth system|healthy teeth & gums)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "clearly" && /\b(stainless steel|bottle|bag|shaker|olive oil|matcha)\b/i.test(title) && !/\b(whey|electrolyte|protein|collagen|creatine)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "miococo" && /\b(blender|wand|frother)\b/i.test(title)) return false;
  if (brand.slug === "natch-labs" && /^uk\b/i.test(title)) return false;
  if (brand.slug === "natch-labs" && /\b(gift card|nennwerte|travel set|try natch|grand affair|happy microbiome|premium ritual|smile high gift|kiss-ready|natural detox whitening|day & night set|the foursome -|damaged box)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "natch-labs" && /ménage à trois$|menage a trois$/i.test(title.trim())) return false;
  if (brand.slug === "yamabushi-farms" && /\b(bandana|t-shirt|tee|tea)\b/i.test(title)) return false;
  if (brand.slug === "tilted-cap" && /\bbundle\b/i.test(title)) return false;
  if (brand.slug === "hodgins-harvest" && !/\btincture\b/i.test(title)) return false;
  if (brand.slug === "hodgins-harvest" && /\bbundle\b/i.test(title)) return false;
  if (brand.slug === "greene-grass-tallow" && /\bpremium beef tallow\b/i.test(title)) return false;
  if (brand.slug === "hide-tallow" && /\b(styling jar|shade)\b/i.test(title)) return false;
  if (brand.slug === "fat-chance-farm" && /\b(soap bag|soap dish|stain stick|dish soap|gift card|soap labels|mystery pack|build your own|gift set|soap sampler)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "bearsville" && /\b(candle|cologne|fragrance\b|gift card|gift note|e-gift|routine|bundle|stack|pair|mix|set\b|hand soap|hand wash|soap lift|bearsville picks|latest drop|our latest)\b/i.test(title) && !/\b(natural deodorant|daily moisturizer|shampoo|conditioner|beard|bar soap)\b/i.test(title)) {
    return false;
  }
  if (
    brand.slug === "bearsville" &&
    /\b(routine|bundle|stack|pair|mix|set|the bearsville|the deodorant mix|the moisturizer mix|the hair care|the beard care|the fragrance|the morning|the daily|the everyday|the core|the hand|four of a kind|timberline|smoky pines|layered legends|clean slate|mint condition|true grit|brightside|heavy hitters|big bear|woodsy shampoo bar duo|fresh shampoo bar duo)\b/i.test(
      title,
    )
  ) {
    return false;
  }
  if (brand.slug === "my-neighbors-tallow" && /\b(soap dish|hand wash|scarf|journal|calendar|candle|leather bag|hat|bundle|box|trio|set|essentials|starter pack|duo)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "sunmud" && /\b(plastic free bundle|surfer'?s bundle|elephant valley|safari park|mixed samples)\b/i.test(title)) return false;
  if (brand.slug === "aus-natural-protein" && /\b(starter bundle|2kg)\b/i.test(title)) return false;
  if (brand.slug === "seaonic" && /\bduo\b/i.test(title)) return false;
  if (brand.slug === "noble-mushrooms" && /\btrio\b/i.test(title)) return false;
  if (brand.slug === "mycoterra" && /\bdried lion/i.test(title) && !/\btincture|toner\b/i.test(title)) return false;
  if (brand.slug === "be-blessed" && /\b(kit|wholesale|candle|essential oil|instruction cards|shipping protection|ice roller|be merry|be well|be still|backbar)\b/i.test(title)) return false;
  if (brand.slug === "be-blessed" && /\b(adult acne|teen acne|pre-teen|brightening bundle|perfect skincare|retinol starter|acne restart|dark circle duo)\b/i.test(title)) return false;
  if (brand.slug === "aus-natural-protein" && /\b(bundle & save|7kg|5kg|3kg|shaker|scoop|drink bottle|stainless steel)\b/i.test(title)) return false;
  if (brand.slug === "superteeth" && /\b(oral health guide|3-step oral|oral care (regimen|system)|kids ent|whitening oral care)\b/i.test(title)) return false;
  if (brand.slug === "freo-living" && /\bbody bundle\b/i.test(title)) return false;
  if (brand.slug === "noble-mushrooms" && /\b(workshop|class|gift card|csa|dried mushrooms|grow your own|grow kit|spawn|liquid culture|ready-to-fruit|biweekly)\b/i.test(title)) return false;
  if (brand.slug === "sunshine-fungi" && /\b(fresh |dried (chestnut|reishi antler|wild morel|pioppino|lion'?s mane chunks|lobster)|jerky|spawn|sterilized grain|liquid culture|chef'?s mix)\b/i.test(title)) return false;
  if (brand.slug === "mycoterra" && /\b(grow kit|workshop|book|paperback|hardcover|csa|farm share|fresh organic|compost|spawn|gift card|plug spawn|mycelium running|mushrooms of|mushrooms demystified)\b/i.test(title)) return false;
  if (brand.slug === "mycoterra" && /\b(dried (lions? mane|reishi|oyster|shiitake|mushroom)|kit bundle|extract bundle)\b/i.test(title) && !/\btincture|toner\b/i.test(title)) return false;
  if (brand.slug === "shroomery-nm" && /\b(tea|infuser)\b/i.test(title)) return false;
  if (NICHE.test(hay) || /\bscrub\b/i.test(hay)) return true;
  if (brand.slug === "house-of-tallow" && /\b(sol |sun stick|sunscreen|tallow|deodorant|shampoo|lip balm|lotion|soap|cream|butter)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "nefertem" && /\b(soap|moisturizer|balm|salve|lip|tallow|cream)\b/i.test(title) && !/\b(bundle|set|shipping|gift)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "hawaii-tallow" && /\b(tallow|extract|toner|serum|soap|rinse|lip|wash|scrub|oil)\b/i.test(title) && !/\b(candle|honi|ritual|discovery collection)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "oak-grove-farms" && /\btincture\b/i.test(title)) return true;
  if (brand.slug === "mahealani-farms" && /\b(tincture|serum|cream|balm|moisturizer|hair)\b/i.test(title) && !/\b(gift box|complete tincture set|fresh )\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "dakhota-prairie" && /\b(tallow|purifiant|exfoliant|salve)\b/i.test(title) && !/\bset\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tallow-made" && /\b(tallow|deodorant|soap|lotion|cream|butter)\b/i.test(title)) return true;
  if (brand.slug === "orawellness" && /\b(toothpaste|tooth powder|floss|toothbrush|tongue|hydroxyapatite|mcha|healthy mouth blend|shine)\b/i.test(title) && !/\b(ebook|kit|system|educational|ph test|applicator|red.?light)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "clearly" && /\b(whey|electrolyte|collagen|creatine|protein|lion.?s mane|reishi|chaga|cordyceps|colostrum|ashwagandha|magnesium|omega|maca|rhodiola|berberine|curcuma|quercetin|zinc|glutamine|theanine|mushroom mix|maitake|not coffee|d3|k2)\b/i.test(title) && !/\b(bottle|bag|shaker|olive|matcha)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "himaya" && /\b(spf|mineral|zinc|sunscreen)\b/i.test(title)) return true;
  if (brand.slug === "miococo" && /\b(protein|whey|electrolyte|debloat)\b/i.test(title) && !/\b(blender|wand)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "natch-labs" && /\b(toothpaste|mouthwash|toothbrush|tongue|tabs?|shaman|wake-?up|boombastic|screaming polar|so black|tooth monster|bitter sweet)\b/i.test(title) && !/\b(uk -|^uk\b|gift card|travel set|try natch|grand affair|whitening kit)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "yamabushi-farms" && /\b(mamoru|ibuki|mezame|lion.?s mane|capsule|powder)\b/i.test(title) && !/\b(bandana|shirt|tea)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tilted-cap" && /\btincture\b/i.test(title) && !/\bbundle\b/i.test(title)) return true;
  if (brand.slug === "hodgins-harvest" && /\btincture\b/i.test(title) && !/\bbundle\b/i.test(title)) return true;
  if (brand.slug === "hearth-and-hide" && /\b(balm|tallow|lip)\b/i.test(title)) return true;
  if (brand.slug === "greene-grass-tallow" && /\b(tallow|lip|butter)\b/i.test(title) && !/\bpremium beef tallow\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "hide-tallow" && /\b(jar|stick|tin|bar|tallow)\b/i.test(title) && !/\b(styling jar|shade)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "fat-chance-farm" && /\b(deodorant|soap|lip balm|salve|balm)\b/i.test(title) && !/\b(dish soap|stain stick|gift|mystery|build your own|sampler|labels|bag|dish)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "bearsville" && /\b(deodorant|moisturizer|shampoo|conditioner|beard|soap)\b/i.test(title) && !/\b(candle|cologne|gift|routine|bundle|stack|pair|mix|set|hand soap)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "my-neighbors-tallow" && /\b(tallow|balm|soap|serum|cleanser|body wash|hair oil|lip)\b/i.test(title) && !/\b(bundle|box|set|trio|candle|hand wash|scarf|journal|hat)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "seaker-sun" && /\b(zinc|sun balm)\b/i.test(title)) return true;
  if (brand.slug === "sunmud" && /\b(mineral sunscreen|sports stick|solar repair|lip balm|muscle salve)\b/i.test(title)) return true;
  if (brand.slug === "be-blessed" && /\b(mineral|spf|cleanser|essence|serum|toner|moisturizer|quench|restore|revitalize|peptide|collagen|chaga)\b/i.test(title) && !/\b(kit|wholesale|candle)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "seaonic" && /\b(marine|hypertonic|isotonic)\b/i.test(title)) return true;
  if (brand.slug === "ion-electrolytes" && /\belectrolyt\b/i.test(title)) return true;
  if (brand.slug === "aus-natural-protein" && /\bwhey\b/i.test(title) && !/\b(bundle|shaker|scoop)\b/i.test(title)) return true;
  if (brand.slug === "perfect-deodorant" && /\bdeodorant\b/i.test(title)) return true;
  if (brand.slug === "boeuf-tallow" && /\b(whip|tallow)\b/i.test(title)) return true;
  if (brand.slug === "superteeth" && /\b(toothpaste|floss|probiotic|hydroxyapatite)\b/i.test(title) && !/\bguide\b/i.test(title)) return true;
  if (brand.slug === "freo-living" && /\b(shampoo|conditioner|deodorant|lotion|soap|scrub|magnesium)\b/i.test(title) && !/\bbody bundle\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "texas-tallow" && /\b(tallow|salve|whip|soap|lip balm|serum)\b/i.test(title)) return true;
  if (brand.slug === "pasture-skincare" && /\btallow\b/i.test(title)) return true;
  if (brand.slug === "tallow-and-me" && /\b(tallow|shampoo|acondicionador|desodorante|body butter|bálsamo)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "noble-mushrooms" && /\btincture\b/i.test(title) && !/\btrio\b/i.test(title)) return true;
  if (brand.slug === "sunshine-fungi" && /\b(dual extract|lion'?s mane powder|dried reishi powder)\b/i.test(title)) return true;
  if (brand.slug === "mycoterra" && /\b(tincture|skin toner)\b/i.test(title)) return true;
  if (brand.slug === "shroomery-nm" && /\btincture\b/i.test(title)) return true;
  if (brand.slug === "tallow-balm-co" && /\b(tallow|sun cream|mineral|lip serum|cloud moisturizer|original balm|pocket tallow)\b/i.test(title) && !/\bshirt\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tallow-and-wild" && /\b(tallow|sunscreen|spf|balm)\b/i.test(title)) return true;
  if (brand.slug === "chagrin-valley" && /\b(soap|shampoo|deodorant|lip balm|salve|lotion|body (oil|powder|balm|scrub)|dry shampoo|facial|beard|hair (oil|balm|tea)|acv rinse|shave|whip)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "haus-of-sage" && /\b(tallow|deodorant|sun balm|sun lip|lip balm|face oil|cleanser|eye restore)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "lather-and-leaf" && /\bsoap\b/i.test(title)) return true;
  if (brand.slug === "saint-oral" && /\b(toothpaste|floss|toothbrush|tongue scraper|hydroxyapatite)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "seen-oral" && /\b(toothpaste|floss|toothbrush|hydroxyapatite)\b/i.test(title)) return true;
  if (
    brand.slug === "surface-sunscreen" &&
    /\b(mineral|after[- ]?sun|aloe vera|spf\s*\d+ lip)\b/i.test(title) &&
    !/\b(anti chafe|golf|sports bundle|grab & go|kids go-to)\b/i.test(title) &&
    !(/\bdry touch\b/i.test(title) && !/\bmineral\b/i.test(title))
  ) {
    return true;
  }
  if (brand.slug === "wellah" && /\b(electrolyte|whey|collagen|creatine|greens|colostrum|inositol|biotin|glutamine|iron|multivitamin|chasteberry|urinary)\b/i.test(title) && !/\bpre-workout\b/i.test(title)) {
    return true;
  }
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
  if (brand.slug === "haus-of-sage" && price >= 100) return null;

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
      if (/\b(variety pack|staple flavors?|limited flavors?|mix of|mix vanilla|duo\b|toothbrush|brush eco|bass -|rows of bristles|donate it|3 pack|7 pack|single bottle|bulk bag)\b/i.test(label)) continue;
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
    path.join(root, "data/catalog-products-manifest-wave41.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave41Products: waveCount,
        wave41BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
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
    path.join(root, "data/wave41-selected.json"),
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
    `\nDone total=${all.length} wave41=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
