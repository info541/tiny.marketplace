/**
 * Drop leftover merch from wave42 and backfill missing ingredients from product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1098;
const WAVE_END = 1107;
const CONCURRENCY = 12;

const MERCH =
  /\b(stuffed toy|plush|crew socks|socks\b|head wrap|tote bag|statement tote|\btote\b|silk scarf|t-?shirt|\btee\b|\bshirt\b|hoodie|sweatshirt|beanie|sticker pack|sticker\b|mug\b|apparel|poster|patch\b|keychain|storybook|\bbook\b|ebook|e-book|cookbook|journal\b|candle holder|\bcandle\b|wax melt|reed diffuser|clay diffuser|diffuser blends?|gift card|e[- ]?gift|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|nalgene bottle|team bottle|terrain bottle|fuel bottle|fanny pack|luggage tag|enamel pin|marketing card|deodorant scoop|cream applicator|deodorant applicator|refillable deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|for pets?|\bpet\b|dog shampoo|dog soap|dog balm|dog paw|puppy paw|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|product protection|vip protection|priority handling|labl guarantee|labl protect|returns & exchanges|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|rainbow cap|canvas cap|digital (file|download)|gravity feed|mystery gift|100%\s*off|spatula|spf brush|travel brush|sample tin|imperfect|prepaid return envelope|gua sha|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|facial scrubbie|facial rounds|storage tin|room & pillow spray|room spray|linen spray|fabric refresher|cologne spray|perfumes?|perfume bar|spf brush|printable|play pack|buy 1 get 1|makeup brush|kabuki brush|electric mixer|onesie|floor cleaner|dishwasher detergent|laundry detergent|laundry powder|laundry scent|chef soap|household essentials|neem comb|scalp massager|pill travel tin|welcome card|glass drink bottle|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|bronzing|cheek tints?|lip & cheek|lip and cheek|boxes - bulk|foaming herbal hand soap|foaming hand soap|lipstick|lip gloss|makeup|brow boss|cc cream|skin tint|headband|face cloth|bamboo buds|defining powder|cotton buds|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|\bpouch\b|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|travel organiser|travel organizer|swag|academy|bundle & save|mat spray|yoga (room|mat)|storage jar|stainless steel|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|counter display|counter top box|box of 12|buy 6|racerback|\btank\b|trucker|snapback|tumbler|flask|insulated glass|bamboo spoon|plastic tumbler|storage can|measuring spoon|shaving brush|safety blades|\brazor\b|lunch bag|jute soap|gift set|gift box|self tanner|kabuki|pencil case|cosmetic case|hand sanitizer|accessories only|kit bag|bodysuit|metal travel cap|anti-slip bottle|bottle sleeve|\btesters?\b|silk bonnet|silk scrunchie|scrunchie|bulk empty|empty mouthwash|empty toothpaste|silicone sleeves?|soap holder|gua sha|setting powder|highlighter|contour stick|lash \+ brow|brow oil|bug spray|insect repellent|bamboo soap holder|baseball cap|carbon offset|carbon neutral|walking with god|loofah|sage bundle|hair wrap|mindfulness book|mystery shampoo|ambassador tee|ambassador set|cosmetic bag|silk facial sponge|omelette|dark fish|light fish|powder funnel|cooking tallow|goat milk ghee|goat milk cream|stout coffee|\bbbq\b|\bsteak\b|\bburger\b|\bchicken\b|\bveggie\b|mushroom cap|leather lip balm|dish scrub|dishwashing set|soap saver bag|no bugs balm|hospitality bundle|retail bundle|clinic bundle|complimentary box|empty plastic jar|pouch only|colonized grain|agar plates|grow block|growler bottle|fire cider|toiletry bag|donation|refuge|ice cube tray|sports bottle|glass bottle|application mitt|tanning mitt|self[- ]?tan|eau de parfum|cologne|nizoral|ketoconazole|conversation cards|multi-tool|gift voucher|gift pack|vat free|facial roller|eye mask|application brush|tanning mist|face tan|bronzed babe|essential oil|bath bomb|bathing ritual|\bcombs?\b|\bshorts\b|\bspawn\b|dog treats?|sleep mask|red light|elderberry syrup|golden milk|bite relief|aromatherapy|room & body spray|soap saver|dopp|postcard|booklet|counter card|hang tag|mystery gift|no gift|gear wash|ear rinse|defog|mask strap|pump head only|wall-mounted|army style cap|lifeguard|sunshirt|world reef day|satin sleep|air cleanser|culinary|makeup bundle|gingival|aroma diffuser|printed booklet|cardstock|neoprene|explorer kit|dive essentials|custom explorer|ingredients to avoid|body wash bottle|recycled washbag|shampoo bar tray|lip brush|\byoni\b|\blingam\b|love lube|tanning oil|complete guide|serum foundation|silicone sheet|hot pink case|mint green case|reusable pump|empty pump|foraging hunt|farm foraging|electric mixer|electric whisk|wild whisk|soap remnant|soap stand|shower soap stand|\bcandles?\b|wrinkle patches|lumineux|cooking tallow|fresh beef tallow|order builder|wool batting|camocim|cajamarca|regenerative organic coffee|abundance candle|beeswax candle|konjac sponge|digital gift card|subscription perk|play mat|spectrumview|methylene blue|ghk-?cu|copper peptide|celebrity skin|at-home remedies|vip bundle|\bpup\b|compression sock|crew sock|boot sock|sleep sock|pro gear|advantage gear|mason jar candle|wood conditioner|paw protect|farm tour|fresh (king|pink|golden|black|lion)|grower's choice|mixed mushroom box|\bseltzer\b|shower cap|silk pillowcase|microfiber|hair pick|hair towel|flaxseed cap|cotton face mask|bath bunny|bath toy|bubble wand|chewing gum|mouthwash cup|energy bar|energy gel|running energy|informed sport|\btesto\b|spot dots|face cloths?|hydrogel eye|bug balm|toothbrush case|brush case|toothkeeper|\bgwp\b|wholesale|sauna hat|vibey shades|dish soap|dishwashing|cellulose cloth|loofie|empty vegan capsules|dried whole|gourmet salt|finishing salt|food topper|tea blend|tea steeper|dried elderberries|tick stick|illuminator|edgelift|satin bonnet|hair bonnet|detangle define|24 pack|sample jar|wooden soap dish|gift basket|sriracha|smoked salt|for dogs|dog blend|botanical tea|birthday bundle|slick-flex|slick-dense|slay and stay|edge lift|pre-workout|whitening strips|dry touch lotion|dry touch continuous|anti chafe|subscription box|shaker bottle|tallow guard shirt|hidden.product|whitening essentials|golf sun|sports bundle)\b/i;

function isWave26(p) {
  const n = Number(String(p.brandId).replace(/^c/, ""));
  return n >= WAVE_START && n <= WAVE_END;
}

function stripHtml(html) {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseList(chunk) {
  if (!chunk) return [];
  const cleaned = chunk.replace(/\s+/g, " ").replace(/\*\*/g, "").trim();
  const parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•*]\s*/, "").replace(/\.$/, ""))
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 160 &&
        !/^(and|or|with|contains|including|ingredients?|view all|full list|see all|free of|made without)$/i.test(s) &&
        !/^https?:/i.test(s),
    );
  if (parts.length <= 2 && cleaned.length > 80 && !/,/.test(cleaned)) return [];
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeInci(parts, raw) {
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|organic/i.test(raw)) {
    return true;
  }
  return parts.length >= 4 && /,/.test(raw);
}

function extractIngredients(html) {
  if (!html) return [];
  const metafield = html.match(
    /metafield-rich_text_field[\s\S]{0,80}?<p[^>]*>([\s\S]{12,2000}?)<\/p>/i,
  );
  if (metafield) {
    const raw = stripHtml(metafield[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const collapse = html.match(
    /(?:collapsible[^>]{0,200}|accordion[^>]{0,200})>[\s\S]{0,120}?ingredients?[\s\S]{0,400}?<p[^>]*>([\s\S]{20,4000}?)<\/p>/i,
  );
  if (collapse) {
    const raw = stripHtml(collapse[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const viewAll = html.match(
    /(?:view\s+all\s+ingredients|full\s+ingredients?(?:\s+list)?|all\s+ingredients|inci\s*list|complete\s+ingredients?|ingredients we love)[\s\S]{0,160}?<p[^>]*>([\s\S]{20,5000}?)<\/p>/i,
  );
  if (viewAll) {
    const raw = stripHtml(viewAll[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const text = stripHtml(html);
  const mm = text.match(
    /(?:full\s+)?(?:ingredients?|inci(?:\s+list)?|composition|what's in it|whats in it|supplement facts)\s*[:\-–]\s*([\s\S]{12,4000}?)(?=(?:\b(?:directions|how to use|how to apply|warnings?|caution|free from|what'?s not|storage|shelf life|for external|suggested use|usage|application|benefits|disclaimer|nutrition facts|other information|manufactured)\b|$))/i,
  );
  if (mm) {
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

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

async function ingredientsFor(product) {
  if (!product.affiliateUrl) return [];
  const jsonUrl = `${product.affiliateUrl.replace(/\/$/, "")}.js`;
  try {
    const raw = await fetchPage(jsonUrl);
    if (raw.trimStart().startsWith("{")) {
      const data = JSON.parse(raw);
      const fromJs = extractIngredients(
        `${data.body_html || ""} ${data.description || ""}`,
      );
      if (fromJs.length) return fromJs;
    }
  } catch {
    /* try html */
  }
  try {
    const html = await fetchPage(product.affiliateUrl);
    return extractIngredients(html);
  } catch {
    return [];
  }
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: n }, () => worker()));
  return out;
}

const EXTRA_DROP_WAVE42 =
  /\b(soap dish|shipping protection|sun ritual|nurturing ritual|signature ritual|graze tallow|wax melt|pamper tallow bundle|bundle of 3|pure pair|roller bottle|bug off|room spray|beeswax wrap|sniffer|nasal inhaler|migraine|sampler bag|buzz off|orthodontic wax|breath capsule|mouth pearl|color-correcting stick|teeth strips|portable mouthwash stick|pearl toothbrush|nasal stick|u-shaped|end tuft|daily oral care (set|kit)|duo set|twin care|hydro care combo|skincare routine|home spa set|healthy skin trio|the precursor|facial cupping|gift bag|travel pouch|beach clean-up|sample discovery|100% off)\b/i;

const EXTRA_DROP_WAVE41 =
  /\b(blender wand|electric blender|premium beef tallow|3-month refill|6-month refill|refill bags|refill set|postbiotic bundle|mouthwash duo|the foursome|ménage à trois|menage a trois|matcha wake-up call set|natch toothbrushes|day & night refill|uk -|^uk\b|gift card|travel set|try natch|grand affair|happy microbiome|whitening kit|kiss-ready|smile high|styling jar|\bshade\b|thrifty soap|soap sampler|build your own|mystery pack)\b/i;

const EXTRA_DROP_WAVE38 =
  /\b(hat & hair|hot girls use tallow|starter kit|reset trio|lip & blush|travel case|shampoo bag|shower-to-travel|better together|try me bundle|eau de|parfum|gift card|gua sha|bundle offer|buy two get one|glow & flow|silicone toothbrush holder|travel kit on the go|room spray|skincare ingredient|herbal skincare recipes|supplier directory|digital gift card)\b/i;

const EXTRA_DROP =
  /\b(consultations?|guide to|water-based lubricant|\blubricant\b|bone meal|wash tabs|bug off|vanilla extract|migraine roller|wax wraps?|eyelash|hand mixer|active bottle|elderberry syrup kits?|foaming tallow hand soap|refillery|pearl powder|eco action|laundry detergent strips|nectar scent|natural perfume|free gifts|egyptian loofah|soap of the month|soap subscription|exfoliating soap saver|finishing sea salt|dried turkey tail|elderberry oxymel|liver tonic|toilet bowl cleaner|foaming soap dispenser|glass soap dispenser|soap standle|cleanser dispenser|electric toothbrush|replacement toothbrush|bamboo heads for electric|starter bundle - .*?\+ (bottle|jar)|organic (banana|orange|strawberry|lemon|celery|kale|spinach|collard greens|broccoli(?: sprout)?|beet|raspberry|blackberry|cranberry|acerola|acai|maqui) powder|ice cream maker|slushy machine|laying hens|whole turkey|compost garden|room mist|lash & brow|dad hat|heritage collection|tanning oil|finishing oils? set|wellness oil set|extra virgin coconut oil|discovery kit|methylene blue|cbd infused|fairness cream|shipping protection|fresh,? 4 oz|local pick-up, fresh|jade facial stone|silicone applicator|brow styling wax|herbal lash serum|powder scoop|facial wand|serum lovers bauble|tongue (cleaner|scraper)|repel botanical|aluminum display|tube key|ticked off|tallow tan|konjac|serving scoop|frother|shaker bottle|keepcap|confetti comb|jute travel|mycology poster|trucker cap|me-time tea|tallow twins hats|gua sha|sleep soak|bath soak|fragrance oil|scented fragrance|cashback|oat milk|shaker cup|doggie|nasal inhaler|bug repel|bug repellant|dermastamp|derma stamp|makeup sticks?|cheek & lip|lip tint|skin tint|glow stick|fondue|latte lip duo|the hydration set|bamboo brush|travel case|protein mega bundle|collagen fruit tea|pre-workout|tally health|shred lord|sunrise (bucket|cap|tee)|suicide prevention|label setup|botanical bandana|consultation call|seconds lip balm|herb ally sticker|bamboo spatula|realtree camo|phone case|seasoning blend|food of the gods|make america healthy|soccer t-shirt|surf jersey|pre-feast|caffeinated|hibiscus halter|coconut tree crew|club adapt|stay awhile|baby tee|big shift|kids.? shorts|adapt glass bottle|agave plant loofah|hessian travel|vegan leather travel|free compostable toothbrush|soap keeper|soap scrap|into the woods|bug bite balm|beef tallow jar|protein bar|pick your option|the balm set|build a lip balm bundle|santa cruz paleo electrolyte tub \| all-natural|water bottle|starter pack|nose & toes|nose and toes|pet balm|128oz|thermostat|wreath decor|tin for lotion|mouth tape|dad hat|airbnb|hotels?, spas|dentist sample|bulk for hotels|build your own|pitt hopkins|soap scrap|sisal soap|infinity mascara|mascara (tablet|starter)|dual hit|get stronger in|holiday citrus herb brine|the best rub|krill|collagen mouth tape|travel tin - 10ct|massage oil|flavor collection|family collection|jar collection|3-month starter|subscription bundle)\b/i;

function reclassify(p) {
  const t = p.name.toLowerCase();
  if (/\b(mineral barrier|fun in the sun|sun balm|sun stick|sun shield|natural sun|sun prime|tallow.*zinc|zinc.*sun)\b/.test(t)) {
    p.category = "sunscreen";
  }
  if (/\b(tallow deodorant|natural deodorant)\b/.test(t)) p.category = "deodorant";
  if (/\b(shampoo|conditioner|masque bar|zen combo|beard balm|beard butter)\b/.test(t)) p.category = "hair";
  if (/\b(toothpaste|mouthwash|tooth powder|smile mist|oral spray|hydroxyapatite|tongue gel|floss)\b/.test(t)) {
    p.category = "oral";
  }
  if (/\b(himaya|spf\s*\d+)\b/.test(t) && /\b(mineral|zinc|sunscreen|stick)\b/.test(t)) p.category = "sunscreen";
  if (/\b(whey|vegan protein|protein powder)\b/.test(t)) p.category = "protein";
  if (/\belectrolyte drink mix\b/.test(t)) p.category = "electrolytes";
  if (/\bdebloat powder\b/.test(t)) p.category = "supplements";
  if (/\b(toothpaste|mouthwash|toothbrush|tongue|natch|shaman|wake-?up call|boombastic|screaming polar|tooth monster)\b/.test(t)) {
    p.category = "oral";
  }
  if (/\b(mamoru|ibuki|mezame|lion.?s mane|tincture|cordyceps|turkey tail|reishi)\b/.test(t) && !/\b(tallow|soap|balm|oil|cream)\b/.test(t)) {
    p.category = "supplements";
  }
  if (/\b(farmer pits|natural deodorant|first watch natural deodorant|steel quarry natural deodorant|beach patrol natural deodorant|sun soaked natural deodorant|barbershop natural deodorant)\b/.test(t)) {
    p.category = "deodorant";
  }
  if (/\b(shampoo|conditioner|beard (oil|balm)|hair oil|rosemary & juniper hair)\b/.test(t)) p.category = "hair";
  if (/\b(collagen facial cleanser|tallow soap|hand balm|body wash|lip balm|tallow balm)\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(sol |sun stick|sunscreen spray|tallow sunscreen)\b/.test(t)) p.category = "sunscreen";
  if (/\b(tallow deodorant|ash & earth deodorant|citrus vanilla deodorant)\b/.test(t)) p.category = "deodorant";
  if (/\b(tallowlux|shampoo bar)\b/.test(t)) p.category = "hair";
  if (/\b(shine -|smile toothpaste|fantastic floss|brush eco|bass toothbrush|tongue cleaner|healthy mouth blend|mcha)\b/.test(t)) {
    p.category = "oral";
  }
  if (/\b(grass-fed whey|protein iced coffee)\b/.test(t)) p.category = "protein";
  if (/\belectrolytes?\b/.test(t) && !/\bprotein\b/.test(t)) p.category = "electrolytes";
  if (/\b(botanical vinegar|hair rinse|reishi \+ shiitake hair)\b/.test(t)) p.category = "hair";
  if (/\b(herbal extracts|botanical extract|mushroom extract|lion.?s mane tincture|turkey tail tincture|reishi tincture)\b/.test(t) && !/\b(tallow|toner|serum|cream|balm|oil|moisturizer|soap|wash|bar)\b/.test(t)) {
    p.category = "supplements";
  }
  if (/\b(lion.?s mane (daily moisturizer|night cream|rescue balm)|snow mushroom serum|reishi phyto|reishi rose tallow|vitamin c botanical face wash)\b/.test(t)) {
    p.category = "skincare";
  }
  if (p.brandId && Number(String(p.brandId).replace(/^c/, "")) === 1085) {
    if (/\b(grass-fed whey|protein iced coffee)\b/.test(t)) p.category = "protein";
    else if (/\belectrolytes?\b/.test(t)) p.category = "electrolytes";
    else p.category = "supplements";
  }
  if (/\b(collagen peptides|foundation stack|maca|magnesium glycinate|collagen powder|vegan collagen)\b/.test(t)) p.category = "supplements";
  if (/\b(hand lotion bar|clump & define|light oil)\b/.test(t)) {
    p.category = /\blotion\b/.test(t) ? "skincare" : "hair";
  }
  if (/\b(goldenrod tincture|hearth berry tonic|self heal tincture|mullein oxymel)\b/.test(t)) {
    p.category = "supplements";
  }
  if (/\bvegan collagen boosting hair\b/.test(t)) p.category = "supplements";
  if (/\b(niacinamide powder|complexion polish|body dusting powder|travel kit|skincare booster|breast oil)\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(energy greens|alkalizing reset)\b/.test(t)) p.category = "supplements";
  if (/\b(vegan vanilla protein|protein shake|protein powder|organic plant protein|grass fed whey)\b/.test(t)) p.category = "protein";
  if (/\b(mineral zinc sunscreen|mineral sunstick|sun balm|daydream mineral sunscreen|sunup|sun milk|tallow \+ non-nano zinc|mineral sun butter|nourish & shield|tallow zinc)\b/.test(t)) {
    p.category = "sunscreen";
  }
  if (/\b(tooth powder|volcanic tooth|toothpaste|mouth rinse|hydroxyapatite|nhap|kerahap|silk floss)\b/.test(t)) p.category = "oral";
  if (/\b(hydration drops?|electrolyte powder|electrolytes?)\b/.test(t) && !/\bnootropic\b/.test(t)) p.category = "electrolytes";
  if (/^energy$/.test(t) || (/\b(nootropic energy|energy powder)\b/.test(t) && !/\belectrolyt\b/.test(t))) {
    p.category = "supplements";
  }
  if (/\b(marine collagen|collagen peptides)\b/.test(t)) p.category = "supplements";
  if (/\b(whey protein|plant protein|pea protein|whey isolate)\b/.test(t)) p.category = "protein";
  if (/\bbeard (oil|butter|soap|box)\b/.test(t)) p.category = "hair";
  if (/\b(tallow balm|whipped tallow|lip balm|lip elixir|love your lips|face balm|blue tansy|body butter|body scrub|cleansing oil|face mist|bath melt)\b/.test(t) && !/\bzinc\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(zahnputz|toothpaste tablet|the tablets|the floss|the toothbrush)\b/.test(t)) p.category = "oral";
  if (/\b(the deodorant|natural deodorant|tallow deodorant)\b/.test(t)) p.category = "deodorant";
  if (/\b(the face bundle|the tallow trio)\b/.test(t)) p.category = "skincare";
  if (/\b(whey protein|clear (whey )?protein|milk tea whey)\b/.test(t)) p.category = "protein";
  if (/\b(yuzu citrus|asian pear|white peach|lychee|elxr electrolytes|lyt hydration)\b/.test(t) && !/\bprotein\b/.test(t)) {
    p.category = "electrolytes";
  }
  if (/\b(shampoo bar|conditioner bar|dry shampoo|hair health gummies|glossing and smoothing hair oil)\b/.test(t)) {
    p.category = "hair";
  }
  if (
    /\b(lion'?s mane|turkey tail|chaga|reishi|tincture|bitters|immunity tonic)\b/.test(t) &&
    !/\b(toner|moisturizer|barrier defense|soap|mask|serum|cream|balm|oil|tallow|bar|wash)\b/.test(t)
  ) {
    p.category = "supplements";
  }
  if (/\b(chaga barrier|collagen lifting mask|extract skin toner|myco glow)\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(sun balm|mineral melt|mug guard|bod guard|sporto spray|melt stick|slip stick|golden guard|gold standard|the lifeguard|mineral spf)\b/.test(t)) {
    p.category = "sunscreen";
  }
  if (/\b(toothpaste tablet|mouthwash (tablet|concentrate)|remineralizing toothpaste|nano hydroxyapatite|bamboo floss)\b/.test(t)) {
    p.category = "oral";
  }
  if (/\b(watermelon seed protein|smash melon protein|whey protein|beef isolate protein)\b/.test(t)) p.category = "protein";
  if (/\b(electrolyte (tub|singles|caps|powder|mix)|hydration & recovery|sleep & hydration|adapt (variety|sleep|30pk|sample|starter))\b/.test(t) && !/\bprotein\b/.test(t)) {
    p.category = "electrolytes";
  }
  if (/\b(performance natural deodorant|deodorant (jar|tube|plastic-free)|charcoal citrus deodorant|pine cedarwood deodorant)\b/.test(t)) {
    p.category = "deodorant";
  }
  if (/\b(body fuel|the warmup|whipped (beef |bison )?tallow|goat.?s milk|everywhere balm|glide balm)\b/.test(t) && !/\bsun\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(shampoo bar|conditioner bar|murumuru shampoo|biotin shampoo|argan oil conditioner)\b/.test(t)) p.category = "hair";
  if (/\b(ashwagandha|creatine|nac \+ ala|zinc \+ copper|nootropic caps|vitamin d|sleep caps|magnesium \+ potassium|gut health probiotics|multi pro)\b/.test(t)) {
    p.category = "supplements";
  }
  if (/\b(lytes|electrolyte drink mix)\b/.test(t) && !/\bprotein\b/.test(t)) {
    p.category = "electrolytes";
  }
  if (/\b(tallow sunblock|sun shield|sun by manna|reef-safe|mineral sunscreen|lip balm with spf|tinted peppermint lip)\b/.test(t)) {
    p.category = "sunscreen";
  }
  if (/\b(pongy pits|cocoa and clay|natural deodorant)\b/.test(t)) p.category = "deodorant";
  if (/\b(hydrosol|hair spritz|solid shampoo|conditioner bar|active bar)\b/.test(t)) p.category = "hair";
  if (/\b(enzyme whitening|microbiome care|grin kids|travel freshening|happy mint|gum shield)\b/.test(t)) {
    p.category = "oral";
  }
  if (/\b(tallow (balm|whip|soap|cream)|calendula|face cream|body lotion|under eye|salt scrub|lotion bar)\b/.test(t) && !/\b(sun|spf|zinc)\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(sun cream|zinc lotion)\b/.test(t)) p.category = "sunscreen";
  if (/\bmuscle rub\b/.test(t)) p.category = "skincare";
  if (/\b(toothpaste tablet|mouthwash tablet|bamboo toothbrush|kids toothpaste)\b/.test(t)) p.category = "oral";
  if (/\b(velvet hour|moon dew|rose noir|amber glow|tallow butter|tallow soap|tallow lip)\b/.test(t)) {
    p.category = "skincare";
  }
  if (/\b(build grassfed whey|whey protein)\b/.test(t)) p.category = "protein";
  if (/\b(eco-friendly shampoo|beard oil|dry shampoo|hair mist|hair serum|man clay)\b/.test(t)) p.category = "hair";
  if (/\b(body wash bar|body scrub|fade & glow soap|natural exfoliator)\b/.test(t)) p.category = "skincare";
  if (/\bkiwi lemonade electrolyte tub — mango\b/.test(t)) return null;
  return p;
}

async function main() {
  const all = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const before = all.length;
  const cleaned = all
    .filter((p) => {
      if (!isWave26(p)) return true;
      const n = p.name.toLowerCase();
      if (/\b(the lifeguard|mineral melt|mug guard|bod guard|whey protein|protein bag|beef isolate|smash melon|tongue cleaner|fantastic floss|brush eco|bass toothbrush|sol sun|sol tallow|tallowlux)\b/.test(n)) {
        return !EXTRA_DROP.test(p.name) || /\b(tongue cleaner|fantastic floss|brush eco|bass toothbrush|sol |tallowlux)\b/.test(n);
      }
      return !(MERCH.test(p.name) || EXTRA_DROP.test(p.name) || EXTRA_DROP_WAVE38.test(p.name) || EXTRA_DROP_WAVE41.test(p.name) || EXTRA_DROP_WAVE42.test(p.name));
    })
    .map((p) => (isWave26(p) ? reclassify(p) : p))
    .filter(Boolean);
  const dropped = before - cleaned.length;

  const missing = cleaned.filter((p) => isWave26(p) && (!p.ingredients || p.ingredients.length === 0));
  let filled = 0;
  await pool(missing, CONCURRENCY, async (p, idx) => {
    const ings = await ingredientsFor(p);
    if (ings.length) {
      p.ingredients = ings;
      filled += 1;
    }
    if ((idx + 1) % 25 === 0) {
      console.log(`backfill ${idx + 1}/${missing.length} filled=${filled}`);
    }
  });

  fs.writeFileSync(outJson, JSON.stringify(cleaned, null, 2));
  const wave = cleaned.filter(isWave26);
  const withIng = wave.filter((p) => p.ingredients?.length > 0).length;
  const report = {
    generatedAt: new Date().toISOString(),
    merchDropped: dropped,
    missingTried: missing.length,
    newlyFilled: filled,
    wave42Products: wave.length,
    wave42WithIngredients: withIng,
  };
  fs.writeFileSync(
    path.join(root, "data/wave42-ingredients-backfill.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
