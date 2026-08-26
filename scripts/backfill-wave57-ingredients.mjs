/**
 * Drop leftover merch from wave57 and backfill missing ingredients from product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1212;
const WAVE_END = 1217;
// 6 brands: c1212–c1217
const CONCURRENCY = 12;

const MERCH =
  /\b(soap dish|bugs away|gift box|laundry detergent|dishwasher|glass cleaner|surface cleaner|dish soap|wax melts|essential oil|copper peptide|skin tint|mascara|eyeliner|lip plumping|starter kit|routine set|holiday kickoff|newsletter|refillable bottle|pure-fume|tallow candle|epsom salts|bath soak|room and pillow|pillow mist|stuffed toy|plush|crew socks|socks\b|head wrap|tote bag|statement tote|\btote\b|silk scarf|t-?shirt|\btee\b|\bshirt\b|hoodie|sweatshirt|beanie|sticker pack|sticker\b|mug\b|apparel|poster|patch\b|keychain|storybook|\bbook\b|ebook|e-book|cookbook|journal\b|candle holder|\bcandle\b|wax melt|reed diffuser|clay diffuser|diffuser blends?|gift card|e[- ]?gift|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|nalgene bottle|team bottle|terrain bottle|fuel bottle|fanny pack|luggage tag|enamel pin|marketing card|deodorant scoop|cream applicator|deodorant applicator|refillable deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|for pets?|\bpet\b|dog shampoo|dog soap|dog balm|dog paw|puppy paw|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|product protection|vip protection|priority handling|labl guarantee|labl protect|returns & exchanges|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|rainbow cap|canvas cap|digital (file|download)|gravity feed|mystery gift|100%\s*off|spatula|spf brush|travel brush|sample tin|imperfect|prepaid return envelope|gua sha|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|facial scrubbie|facial rounds|storage tin|room & pillow spray|room spray|linen spray|fabric refresher|cologne spray|perfumes?|perfume bar|spf brush|printable|play pack|buy 1 get 1|makeup brush|kabuki brush|electric mixer|onesie|floor cleaner|dishwasher detergent|laundry detergent|laundry powder|laundry scent|chef soap|household essentials|neem comb|scalp massager|pill travel tin|welcome card|glass drink bottle|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|bronzing|cheek tints?|lip & cheek|lip and cheek|boxes - bulk|foaming herbal hand soap|foaming hand soap|lipstick|lip gloss|makeup|brow boss|cc cream|skin tint|headband|face cloth|bamboo buds|defining powder|cotton buds|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|\bpouch\b|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|travel organiser|travel organizer|swag|academy|bundle & save|mat spray|yoga (room|mat)|storage jar|stainless steel|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|counter display|counter top box|box of 12|buy 6|racerback|\btank\b|trucker|snapback|tumbler|flask|insulated glass|bamboo spoon|plastic tumbler|storage can|measuring spoon|shaving brush|safety blades|\brazor\b|lunch bag|jute soap|gift set|gift box|self tanner|kabuki|pencil case|cosmetic case|hand sanitizer|accessories only|kit bag|bodysuit|metal travel cap|anti-slip bottle|bottle sleeve|\btesters?\b|silk bonnet|silk scrunchie|scrunchie|bulk empty|empty mouthwash|empty toothpaste|silicone sleeves?|soap holder|gua sha|setting powder|highlighter|contour stick|lash \+ brow|brow oil|bug spray|insect repellent|bamboo soap holder|baseball cap|carbon offset|carbon neutral|walking with god|loofah|sage bundle|hair wrap|mindfulness book|mystery shampoo|ambassador tee|ambassador set|cosmetic bag|silk facial sponge|omelette|dark fish|light fish|powder funnel|cooking tallow|goat milk ghee|goat milk cream|stout coffee|\bbbq\b|\bsteak\b|\bburger\b|\bchicken\b|\bveggie\b|mushroom cap|leather lip balm|dish scrub|dishwashing set|soap saver bag|no bugs balm|hospitality bundle|retail bundle|clinic bundle|complimentary box|empty plastic jar|pouch only|colonized grain|agar plates|grow block|growler bottle|fire cider|toiletry bag|donation|refuge|ice cube tray|sports bottle|glass bottle|application mitt|tanning mitt|self[- ]?tan|eau de parfum|cologne|nizoral|ketoconazole|conversation cards|multi-tool|gift voucher|gift pack|vat free|facial roller|eye mask|application brush|tanning mist|face tan|bronzed babe|essential oil|bath bomb|bathing ritual|\bcombs?\b|\bshorts\b|\bspawn\b|dog treats?|sleep mask|red light|elderberry syrup|golden milk|bite relief|aromatherapy|room & body spray|soap saver|dopp|postcard|booklet|counter card|hang tag|mystery gift|no gift|gear wash|ear rinse|defog|mask strap|pump head only|wall-mounted|army style cap|lifeguard|sunshirt|world reef day|satin sleep|air cleanser|culinary|makeup bundle|gingival|aroma diffuser|printed booklet|cardstock|neoprene|explorer kit|dive essentials|custom explorer|ingredients to avoid|body wash bottle|recycled washbag|shampoo bar tray|lip brush|\byoni\b|\blingam\b|love lube|tanning oil|complete guide|serum foundation|silicone sheet|hot pink case|mint green case|reusable pump|empty pump|foraging hunt|farm foraging|electric mixer|electric whisk|wild whisk|soap remnant|soap stand|shower soap stand|\bcandles?\b|wrinkle patches|lumineux|cooking tallow|fresh beef tallow|order builder|wool batting|camocim|cajamarca|regenerative organic coffee|abundance candle|beeswax candle|konjac sponge|digital gift card|subscription perk|play mat|spectrumview|methylene blue|ghk-?cu|copper peptide|celebrity skin|at-home remedies|vip bundle|\bpup\b|compression sock|crew sock|boot sock|sleep sock|pro gear|advantage gear|mason jar candle|wood conditioner|paw protect|farm tour|fresh (king|pink|golden|black|lion)|grower's choice|mixed mushroom box|\bseltzer\b|shower cap|silk pillowcase|microfiber|hair pick|hair towel|flaxseed cap|cotton face mask|bath bunny|bath toy|bubble wand|chewing gum|mouthwash cup|energy bar|energy gel|running energy|informed sport|\btesto\b|spot dots|face cloths?|hydrogel eye|bug balm|toothbrush case|brush case|toothkeeper|\bgwp\b|wholesale|sauna hat|vibey shades|dish soap|dishwashing|cellulose cloth|loofie|empty vegan capsules|dried whole|gourmet salt|finishing salt|food topper|tea blend|tea steeper|dried elderberries|tick stick|illuminator|edgelift|satin bonnet|hair bonnet|detangle define|24 pack|sample jar|wooden soap dish|gift basket|sriracha|smoked salt|for dogs|dog blend|botanical tea|birthday bundle|slick-flex|slick-dense|slay and stay|edge lift|pre-workout|whitening strips|dry touch lotion|dry touch continuous|anti chafe|subscription box|shaker bottle|tallow guard shirt|hidden.product|whitening essentials|golf sun|sports bundle|damaged packaging|waitlist|protein ball|cookie dough|brownie batter|complete tallow system|under eye lift|tightening eye|foaming liquid soap|soap dispenser|deluxe bundle|lip balm bundle|laundry detergent|tallow dish soap|essentials bundle|ceramic little tallow|little tallow co crewneck|jade stone|talk tallow|farm fresh sticker|keep calm tallow)\b/i;

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

function looksLikeMarketing(raw) {
  return /\b(why tallow|the no list|quantity variant|add to cart|subscription|deferred|nourish and protect without|if you wouldn|if you can.?t pronounce|versatile tallow|sourcing our|lightly scented with|not recommended for pregnant|see our page on essential oils|contains essential oils some essential|handcrafted the way your grandmother|tallow has been used for centuries|the process of turning beef tallow|mirrors our skin'?s natural)\b/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 24) return false;
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|organic|tallow|wax|butter|zinc/i.test(raw)) {
    return true;
  }
  return parts.length >= 4 && /,/.test(raw);
}

function extractIngredients(html) {
  if (!html) return [];
  const strong = html.match(
    /ingredients?\s*<\/(?:strong|b|span|h\d|p)>\s*:?\s*([^<]{12,1500})/i,
  );
  if (strong) {
    const raw = stripHtml(strong[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
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
  const markerRe =
    /(?:base\s+ingredients?(?:\s*\([^)]*\))?|key\s+ingredients?|(?:full\s+)?ingredients?|inci(?:\s+list)?|composition|supplement facts)\s*[:\-–]\s*([^\n]{12,1500})/gi;
  let best = [];
  for (const mm of text.matchAll(markerRe)) {
    const raw = mm[1].trim();
    if (looksLikeMarketing(raw)) continue;
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw) && parts.length >= best.length) best = parts;
  }
  if (best.length) return best;
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

const EXTRA_DROP_WAVE57 =
  /\b(the explorer|195 tabs|3 month supply|5 bamboo|tallow cream foundation|sculpt & bronze|cream blush|bug block|relief cbd|cbd tallow|whole ranch|reset bundle|bear essentials|farm to skin essentials|summer starter|complete summer|calm bear|skin recovery|lip duo|lip care bundle|tallow chips|tallow candle|laundry detergent|tallow-popped|tallow pet|am\/pm bundle|perfect pair|all american pet|fruit & veggie|cooking tallow|hot honey|raw honey|mamabear|self care bundle|5 pack|2 pack|x2 qty|bum balm|papabear essential|bear hands soap|golden aura|amour fou|lip gloss|wooden spoon|artisan mask|hydee starter|creatine bundle|mixed pack|mixed bundle|everyday bundle|protein oats|ultra bundle|drink bottle|oats container|blackcurrant 8|casual alchemical|free lip|free tallow|free soap|free 4oz|all encompass|grand family|starter kit|gift bundle|laundry soap|bag size encompass)\b/i;

const EXTRA_DROP_WAVE56 =
  /\b(restore duo|choose any two|48 pouch complete|elite athlete protocol|recharge 24 pack|daily powder bundle|daily mushroom tincture bundle|microgreens powder|beet microgreens|beet root powder|citrus spice fall bundle|build your own bundle|youthful bundle|tallow lip stain|tallow cheek tint|lash and brow|bath shots?|lavender bath soak|detox bath soak|winter simmer|solid dish soap|gift certificate|gift wrap|roller ball|elderberry kit|hand sanitizer|bug spray|immunity \+ strength|rest \+ relax|age away|splash spray|mystery (box|soap|bag)|wholesale|bath soak)\b/i;

const EXTRA_DROP_WAVE51 =
  /\b(beeswax candle|all purpose seasoning|problem skin pack|detox tea|elderberry syrup|fire cider|am \+ pm ritual|ritual set|skincare duo|bamboo deodorant|scented room|lather collection|soap bits|sisal soap|talavera soap dish|premium bottle|intro bottle|intro pack|discovery pack|sample pack|variety pack|garage originals|gentleman soap bundle|starter pack gift|3 bar handmade|snapback hat|raise the bar|aloha clean|wooden soap dish|wooden soap saver|beach trio|renewal duo|collagen boost xl|glow duo|hair repair duo|men'?s duo|anti-aging ritual|starter kit|mixed berry\s+ws|orange lemon\s+ws|variety pouch|microfiber towel|pos counter|display box)\b/i;

const EXTRA_DROP_WAVE47 =
  /\b(available september|sampler size|daily ritual|lauryn'?s bundle|pack of [23]|ritual set|5 lb bulk|jumbo |starter pack|gift box|gift pack|shampoo and conditioner|mineral sunscreen set|glowing serum set|bug bite|tinted lip|tote bag|soy wax candle|senses mist)\b/i;

const EXTRA_DROP_WAVE46 =
  /\b(retailer full display|retail daily display|retail starter display|metal socks|long-sleeve shirt|metal up keychain|og flat bill|out at night beanie|flash metal trucker|metal head headband|metal up\. double down|the b\*tch flight|sample -|hydration starter kit|drgn endurance hat|drgn headband|summer hydration bundle|electrolete performance|try it all discovery|bestsellers set|try 2 bundle|discovery trio|laro washbag|the travel edit|the signature edit|quarterly toothpaste|concentrated shampoo bars$|concentrated conditioner bars$|6-month better hair|concentrated hair care starter|shipping insurance|gift wrapping|custom designed soapwalla|into the garden mist|deodorant cream quartet|luxurious body oil quartet|toning mist trio|everyday wash quartet|soaking salts quartet|facial glow set|hydration trio|facial basics|body basics|flash forward|tasting menu|daily routine|tailor-made|the spray)\b/i;

const EXTRA_DROP_WAVE43 =
  /\b(body butter set|salve set|jolly little|jewelweed soap \+|full facial set|summer glow bundle|tallow trio|sample box|pure beef tallow|trio bundle|methylene blue|before & after sun|lip balm gift set|must have dailys|triple fighting|face duo|full moisture set|enamel commitment|complete set|full ritual|enamel collection|signature six|family (tube|pump) bundle|voyager|holistic collection)\b/i;

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
  const n = Number(String(p.brandId).replace(/^c/, ""));
  if (n === 1212) p.category = "oral";
  if (n === 1213) {
    p.category = /\b(sun shade|sun cream|mineral 50|zinc)\b/.test(t) ? "sunscreen" : "skincare";
  }
  if (n === 1214) {
    if (/\b(sunblock|sunscreen|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(tooth powder|mouthwash|oral)\b/.test(t)) p.category = "oral";
    else if (/\b(beard|shampoo)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1215) {
    p.category = /\b(deodorant|deo detox|underarm)\b/.test(t) ? "deodorant" : "skincare";
  }
  if (n === 1216) {
    p.category = /\bcreatine\b/.test(t) && !/electrolyt/.test(t) ? "supplements" : "electrolytes";
  }
  if (n === 1217) {
    if (/\b(lion'?s mane|reishi|cordyceps|turkey tail|extract)\b/.test(t)) p.category = "supplements";
    else if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else p.category = "skincare";
  }
  if (n === 1207) p.category = "oral";
  if (n === 1208) p.category = "electrolytes";
  if (n === 1209) p.category = "supplements";
  if (n === 1210) {
    if (/\b(sun cream|sun stick|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(dry shampoo|frizz|hair)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1211) p.category = "skincare";
  if (n === 1199) p.category = "oral";
  if (n === 1200) p.category = "sunscreen";
  if (n === 1201) p.category = /\b(spf|sunscreen|zinc)\b/.test(t) ? "sunscreen" : "skincare";
  if (n === 1202) p.category = "skincare";
  if (n === 1203) {
    if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(shampoo|hair|scalp|bear tallow treatment)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1204) p.category = "protein";
  if (n === 1205 || n === 1206) p.category = "electrolytes";
  if (n === 1193) p.category = "oral";
  if (n === 1194) {
    p.category = /\b(sun stick|sun cream|sun protection|zinc)\b/.test(t) ? "sunscreen" : "skincare";
  }
  if (n === 1195) {
    if (/\b(mineral stick|sun stick|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(hair mist|skin & hair)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1196) {
    if (/\bdeodorant|armpit detox\b/.test(t)) p.category = "deodorant";
    else if (/\bbeard\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1197) p.category = "protein";
  if (n === 1198) {
    p.category = /electrolyt|hydration|hydra/.test(t) && !/\bcapsule\b/.test(t)
      ? "electrolytes"
      : "supplements";
  }
  if (n === 1171) {
    if (/\b(after sun|sunscreen|spf|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(tooth powder|toothpaste|oral)\b/.test(t)) p.category = "oral";
    else p.category = "skincare";
  }
  if (n === 1172) {
    if (/\b(sun cream|sunscreen|spf|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(tincture|magnesium oil)\b/.test(t)) p.category = "supplements";
    else p.category = "skincare";
  }
  if (n === 1173) {
    p.category = /\b(sunscreen|spf|zinc)\b/.test(t) ? "sunscreen" : "skincare";
  }
  if (n === 1174) {
    if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(shampoo|conditioner|beard|strand theory)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1175 || n === 1178) p.category = "electrolytes";
  if (n === 1176) {
    p.category = /\bdeodorant\b/.test(t) ? "deodorant" : "skincare";
  }
  if (n === 1177) {
    if (/\b(solar bee|sun balm|sunscreen|spf|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(hair|mane bee|bee silky|bee smooth)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1146) {
    if (/\b(sun balm|spf|sunscreen)\b/.test(t)) p.category = "sunscreen";
    else if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(dry shampoo|shampoo)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1147) {
    if (/\b(spf|sunscreen|sun balm|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(shampoo|conditioner|batana|rice water hair)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1148) {
    if (/\b(shampoo|conditioner|hair (mask|oil)|hinu)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1149) {
    if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(shampoo|conditioner|beard)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1150) p.category = "electrolytes";
  if (n === 1151) {
    if (/\b(sun shield|spf|sunscreen|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else p.category = "skincare";
  }
  if (n === 1152) {
    if (/\b(shampoo|hair oil|hair growth)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
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
  if (/\b(collagen facial cleanser|tallow soap|hand balm|body wash|lip balm|tallow balm)\b/.test(t) && !/\bshampoo\b/.test(t)) {
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
  if (n !== 1210 && n !== 1215 && /\b(hair spritz|solid shampoo|conditioner bar|active bar)\b/.test(t)) p.category = "hair";
  if (/\bhydrosol\b/.test(t) && n !== 1210 && n !== 1215) p.category = "hair";
  if (n === 1215 && /\bhydrosol\b/.test(t)) p.category = "skincare";
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
  if (/\b(candy stripe|the ivory|tortoiseshell toothbrush|enamel shield|flavour free|sacred clove)\b/.test(t)) {
    p.category = "oral";
  }
  if (/\b(tallow sunscreen|tallow sun block|tallow sunblock|edible sun balm|tallow zinc sun stick|sun balm|lip balm spf)\b/.test(t)) {
    p.category = "sunscreen";
  }
  if (/\b(tallow deodorant|magnesium deodorant|go & glow deodorant)\b/.test(t)) p.category = "deodorant";
  if (/\b(tallow shampoo|teen soap\/shave|beard oil)\b/.test(t)) p.category = "hair";
  if (n === 1164) {
    if (/\b(sun cream|sunscreen|zinc|spf)\b/.test(t) && !/\blip\b/.test(t)) p.category = "sunscreen";
    else if (/\bshampoo\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1165) {
    if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(shampoo|conditioner|scalp|leave[- ]?in|hair)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1166) {
    if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(hair|scalp)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1167) {
    if (/\b(whey|beef protein)\b/.test(t)) p.category = "protein";
    else if (/\bhydrate\b/.test(t)) p.category = "electrolytes";
    else p.category = "supplements";
  }
  if (n === 1168) {
    if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/kiss/.test(t) || /\b(face cleanser|clay face mask|calmendula|calm-endula|rock your body|foampop|creampop|silkpop)\b/.test(t)) {
      p.category = "skincare";
    } else p.category = "hair";
  }
  if (n === 1169) {
    if (/\b(tooth powder|toothpaste)\b/.test(t)) p.category = "oral";
    else if (/\bdeodorant\b/.test(t)) p.category = "deodorant";
    else if (/\b(hair|scalp|shampoo)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1170) {
    if (/\b(spf|sunscreen|cln-screen|sol-mate|zinc oxide lip)\b/.test(t)) p.category = "sunscreen";
    else if (/\bdeo\b/.test(t)) p.category = "deodorant";
    else p.category = "skincare";
  }
  if (n === 1193) p.category = "oral";
  if (n === 1194) {
    p.category = /\b(sun stick|sun cream|sun protection|zinc)\b/.test(t) ? "sunscreen" : "skincare";
  }
  if (n === 1195) {
    if (/\b(mineral stick|sun stick|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(hair mist|skin & hair)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1196) {
    if (/\bdeodorant|armpit detox\b/.test(t)) p.category = "deodorant";
    else if (/\bbeard\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1197) p.category = "protein";
  if (n === 1198) {
    p.category = /electrolyt|hydration|hydra/.test(t) && !/\bcapsule\b/.test(t)
      ? "electrolytes"
      : "supplements";
  }
  return p;
}

async function main() {
  const all = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const before = all.length;
  function sanitizeIngs(parts) {
    return (parts || [])
      .map((s) =>
        s
          .replace(/\s*\*?\s*All tallow creams are made[\s\S]*$/i, "")
          .replace(/\s*\*Certified Organic Ingredient[\s\S]*$/i, "")
          .replace(/\s*\*USDA Organic[\s\S]*$/i, "")
          .replace(/\s*Does not contain essential oils[\s\S]*$/i, "")
          .trim(),
      )
      .filter(
        (s) =>
          s.length > 1 &&
          s.length < 90 &&
          !/^(ohio|gf|or children under 3 years old|silicones|added colour|gluten|colour safe|cruelty-free|phthalates|parabens|palm oil|clean|and naturally energizing|sls and synthetic fragrance)$/i.test(
            s,
          ) &&
          !/contains essential oils|not recommended for pregnant|see our page on essential oils|children under 3/i.test(s) &&
          !/happiness guarantee|satisfaction guarantee|email our friendly|e mail our friendly|take our free hair quiz|add to cart|that's it|no bs|stored in an amber|it can be used|gentle enough for baby|packed with the goodness|idyll|net weight|helping you achieve|this natural hair growth|including batana|topped with dried|tallow me honey is our|for more information|see our page on essential|if you buy a product|return it to us|the cut may vary|immerse yourself|sensory journey|just push it up|providing a calming|our infusion of these|deeply hydrating and soothing|it provides a gentle|moisturizing marvel|its nourishing properties|leaves hair nourished|vegan and palm oil-free|replaces up to|plastic-free packaging|gentle ingredients|so we're here|bar saver|planning to travel|full of nourishing|leaves hair feeling|perfect travel|made with nourishing|salty scent|great for hands|reducing your environmental|outer papers contain|recycled or composted|british journal|components of essential oil|handcrafted the way your grandmother|used for centuries|saponification|^(free from|scent:|eco tube:|all of the papers|the interior|it's easy to use|instead of twisting|soft|honest|and natural|protect|and restore|this is the)$/i.test(
            s,
          ),
      );
  }

  const cleaned = all
    .filter((p) => {
      if (!isWave26(p)) return true;
      if (/\bhair oil\b/i.test(p.name)) return true;
      const n = p.name.toLowerCase();
      if (
        /\b(lip ice|tallow sugar scrub|sun cream|sun balm|mineral zinc|strawberry lemonade|plan d|whipped grass-fed|whipped tallow|tallow deodorant)\b/.test(
          n,
        )
      ) {
        return true;
      }
      if (/\b(the lifeguard|mineral melt|mug guard|bod guard|whey protein|protein bag|beef isolate|smash melon|tongue cleaner|fantastic floss|brush eco|bass toothbrush|sol sun|sol tallow|tallowlux)\b/.test(n)) {
        return !EXTRA_DROP.test(p.name) || /\b(tongue cleaner|fantastic floss|brush eco|bass toothbrush|sol |tallowlux)\b/.test(n);
      }
      const keepGarageOilSoap =
        Number(String(p.brandId).replace(/^c/, "")) === 1176 &&
        /\bsoap\b/i.test(p.name) &&
        /\bessential oil\b/i.test(p.name) &&
        !/\b(bundle|gift|hat|tee|dish|sisal)\b/i.test(p.name);
      const keepDakotaScrub =
        Number(String(p.brandId).replace(/^c/, "")) === 1171 &&
        /\b(sugar scrub|oil cleansing|exfoliator)\b/i.test(p.name);
      const keepThrivePouch = /\b(tooth powder|hydroxyapatite)\b/i.test(p.name) && /\bpouch\b/i.test(p.name);
      const keepThriveScraper = /\btongue scraper\b/i.test(p.name);
      const keepFrankieSun = /\b(sun defence|spf)\b/i.test(p.name);
      const keepFrankieCleanser = /\boil cleanser\b/i.test(p.name);
      const keepHidratePouch =
        /\b(passion orange|liliko|li hing|electro mango|coconut lime)\b/i.test(p.name) &&
        /\bpouch\b/i.test(p.name);
      const keepCarolinaTin = /\btravel tin\b/i.test(p.name) && /\btallow\b/i.test(p.name);
      const keepOhGigiOral =
        /\b(tooth powder|hydroxyapatite|oil pull|toothbrush|tongue)\b/i.test(p.name) &&
        !/\b(kit|ritual|dish)\b/i.test(p.name);
      const dropWave54Merch =
        /\b(starter kit|cavity kit|discovery set|sample set|fat burner|hydrapak|glass shaker|beanie|face cupping|soap saver|pressed powder|liquid foundation|cream concealer|brow balm|multistick|smoothing primer|lash mascara|biotin softgels|vitamin c \+|variety stick pack|reusable compact)\b|\*empty\*/i.test(
          p.name,
        );
      if (
        keepGarageOilSoap ||
        keepDakotaScrub ||
        keepThrivePouch ||
        keepThriveScraper ||
        keepFrankieSun ||
        keepFrankieCleanser ||
        keepHidratePouch ||
        keepCarolinaTin ||
        keepOhGigiOral
      ) {
        return true;
      }
      const nId = Number(String(p.brandId).replace(/^c/, ""));
      const keepWave57 =
        nId >= 1212 && nId <= 1217 &&
        (
          (nId === 1212 && /\b(tabs|toothpaste|toothbrush|hydroxyapatite)\b/i.test(p.name) && !EXTRA_DROP_WAVE57.test(p.name)) ||
          (nId === 1213 && /\b(tallow|sun shade|soap|lip)\b/i.test(p.name) && !EXTRA_DROP_WAVE57.test(p.name) && !/\b(foundation|blush|bronze|bug|cbd)\b/i.test(p.name)) ||
          (nId === 1214 && /\b(tallow|sunblock|deodorant|tooth powder|mouthwash|beard|soap|serum|balm|body wash|face wash|eye cream|lip)\b/i.test(p.name) && !EXTRA_DROP_WAVE57.test(p.name)) ||
          (nId === 1215 && /\b(deodorant|deo|serum|moisturizer|cleanser|balm|salve|hydrosol|lip balm|face polish|body powder)\b/i.test(p.name) && !EXTRA_DROP_WAVE57.test(p.name)) ||
          (nId === 1216 && /\b(electrolyt|creatine)\b/i.test(p.name) && !EXTRA_DROP_WAVE57.test(p.name)) ||
          (nId === 1217 && /\b(lion'?s mane|reishi|cordyceps|turkey tail|deodorant|tallow|soap|lip|oil)\b/i.test(p.name) && !EXTRA_DROP_WAVE57.test(p.name))
        );
      if (keepWave57) return !EXTRA_DROP_WAVE57.test(p.name);
      const keepWave56 =
        nId >= 1207 && nId <= 1211 &&
        (
          (nId === 1207 && /\b(toothpaste|hydroxyapatite)\b/i.test(p.name) && !/\b(duo|bundle|kit)\b/i.test(p.name)) ||
          (nId === 1208 && /\b(electrolyt|seawater|7-day)\b/i.test(p.name) && !EXTRA_DROP_WAVE56.test(p.name)) ||
          (nId === 1209 && /\b(lion'?s mane|reishi|cordyceps)\b/i.test(p.name) && !/\b(bundle|microgreen|beet)\b/i.test(p.name)) ||
          (nId === 1210 && /\b(tallow|sun cream|sun stick|dry shampoo|frizz|lip|lotion|soap|glow|hydrosol|magnesium oil|tush|hair)\b/i.test(p.name) && !EXTRA_DROP_WAVE56.test(p.name)) ||
          (nId === 1211 && /\b(tallow|lotion|soap|lip)\b/i.test(p.name) && !/\b(wholesale|mystery|gift|merch|tote|hat|bundle|kit|dish)\b/i.test(p.name))
        );
      if (keepWave56) return !EXTRA_DROP_WAVE56.test(p.name);
      if (dropWave54Merch) return false;
      return !(MERCH.test(p.name) || EXTRA_DROP.test(p.name) || EXTRA_DROP_WAVE38.test(p.name) || EXTRA_DROP_WAVE41.test(p.name) || EXTRA_DROP_WAVE42.test(p.name) || EXTRA_DROP_WAVE43.test(p.name) || EXTRA_DROP_WAVE46.test(p.name) || EXTRA_DROP_WAVE47.test(p.name) || EXTRA_DROP_WAVE51.test(p.name) || EXTRA_DROP_WAVE56.test(p.name) || EXTRA_DROP_WAVE57.test(p.name));
    })
    .map((p) => (isWave26(p) ? reclassify(p) : p))
    .filter(Boolean);
  const dropped = before - cleaned.length;

  const AMALLOW_DEO_BASE = [
    "Grass-fed tallow",
    "Shea butter*",
    "Jojoba oil*",
    "Candelilla wax",
    "Zinc ricinoleate",
    "Arrowroot powder*",
    "Magnesium hydroxide",
    "Kaolin clay",
    "Zeolite",
    "Birch bark extract",
    "Vitamin E (tocopherol)*",
  ];
  const AMALLOW_DEO_SCENTS = {
    "root & petal": ["Lavender*", "Palmarosa*", "Orange*", "Vanilla*", "Lemon*", "Tea Tree*"],
    everwood: ["Fir Needle*", "Lavender*", "Sandalwood*", "Vanilla*", "Bergamot*"],
    "citrus blossom": ["Lavender*", "Lemon*", "Orange*", "Vanilla*"],
    "orange creamsicle": ["Sweet Orange*", "Vanilla*"],
    unscented: [],
  };
  const KNOWN = [
    {
      test: (p) => p.brandId === "c1180" && /tallow soap/i.test(p.name) && /unscented/i.test(p.name),
      ingredients: ["Saponified grass-fed beef tallow", "Water"],
    },
    {
      test: (p) => p.brandId === "c1180" && /tallow soap/i.test(p.name) && /lavender/i.test(p.name),
      ingredients: ["Saponified grass-fed beef tallow", "Water", "Lavender essential oil"],
    },
    {
      test: (p) => p.brandId === "c1180" && /tallow soap/i.test(p.name) && /citrus/i.test(p.name),
      ingredients: ["Saponified grass-fed beef tallow", "Water", "Citrus essential oil"],
    },
    {
      test: (p) => p.brandId === "c1180" && /tallow soap/i.test(p.name) && /coffee/i.test(p.name),
      ingredients: ["Saponified grass-fed beef tallow", "Water", "Coffee"],
    },
    {
      test: (p) => p.brandId === "c1180" && /trinity balm/i.test(p.name),
      ingredients: ["Grass-fed beef tallow", "Beeswax", "Emu oil"],
    },
    {
      test: (p) => p.brandId === "c1146" && /baby bum balm/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished tallow",
        "Jojoba oil*",
        "Coconut oil*",
        "Beeswax*",
        "Non-nano zinc oxide",
      ],
    },
    {
      test: (p) => p.brandId === "c1146" && /squeezable lip balm - orange/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Organic sweet almond oil",
        "Organic vanilla essential oil",
        "Organic orange essential oil",
        "Organic triple filtered beeswax",
      ],
    },
    {
      test: (p) => p.brandId === "c1146" && /squeezable lip balm - vanilla/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Organic sweet almond oil",
        "Organic vanilla essential oil",
        "Organic triple filtered beeswax",
      ],
    },
    {
      test: (p) => p.brandId === "c1147" && /100% pure liquid batana oil/i.test(p.name),
      ingredients: ["100% pure liquid batana oil (Elaeis oleifera)"],
    },
    {
      test: (p) => p.brandId === "c1151" && /sun shield mineral sunscreen/i.test(p.name),
      ingredients: ["Non-nano zinc oxide", "Organic cold-pressed jojoba oil", "Black seed oil"],
    },
    {
      test: (p) => p.brandId === "c1152" && /based & tallowed/i.test(p.name),
      ingredients: ["Grass-fed grass-finished beef tallow"],
    },
    {
      test: (p) => p.brandId === "c1152" && /shampoo bar/i.test(p.name),
      ingredients: ["Grass-fed tallow", "Moroccan clay", "Castor oil", "Argan oil"],
    },
    {
      test: (p) => p.brandId === "c1152" && /unscented soap/i.test(p.name),
      ingredients: ["Grass-fed grass-finished beef tallow", "Distilled water", "Lye"],
    },
    {
      test: (p) => p.brandId === "c1152" && /calendula and chamomile soap/i.test(p.name),
      ingredients: [
        "Grass-fed beef tallow",
        "Coconut oil",
        "Shea butter",
        "Calendula and chamomile-infused olive oil",
        "Castor oil",
        "Water",
        "Lye",
      ],
    },
    {
      test: (p) => p.brandId === "c1152" && /tallow me honey/i.test(p.name),
      ingredients: [
        "Grass-fed beef tallow",
        "Canadian beeswax",
        "Cold-pressed organic extra-virgin olive oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1152" && /hair oil/i.test(p.name),
      ingredients: ["Black seed oil", "Rosemary essential oil"],
    },
    {
      test: (p) => p.brandId === "c1147" && /batana oil (shampoo|conditioner)/i.test(p.name),
      ingredients: [
        "Batana oil",
        "Biotin",
        "Caffeine",
        "Castor oil",
        "Rosemary oil",
        "Tea tree oil",
        "Ginger extract",
      ],
    },
    {
      test: (p) => p.brandId === "c1160" && /sun balm/i.test(p.name),
      ingredients: [
        "Grass-fed/finished beef tallow",
        "Beeswax",
        "Shea butter",
        "Castor oil",
        "Non-nano zinc oxide",
        "Carrot seed oil",
        "Vitamin E oil",
        "Manuka honey",
        "Arrowroot powder",
        "Kaolin clay",
        "Blue spirulina",
        "Lavender essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1160" && /moisturizer/i.test(p.name),
      ingredients: [
        "Grass-fed tallow",
        "Jojoba oil",
        "Lavender essential oil",
        "Bergamot essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1162" && /strawberry lemonade/i.test(p.name),
      ingredients: [
        "Electrolytes",
        "Beet root powder",
        "Vitamin B complex (B3, B5, B6, B12)",
        "Magnesium",
        "Potassium",
        "Pink Himalayan salt",
        "Monk fruit",
      ],
    },
    {
      test: (p) => p.brandId === "c1159" && /restore balm|herbal tallow/i.test(p.name),
      ingredients: [
        "Grass-fed beef tallow",
        "Calendula",
        "Comfrey",
        "Chickweed",
        "Plantain leaf",
        "Chamomile",
      ],
    },
    {
      test: (p) => p.brandId === "c1159" && /sun cream|mineral sun/i.test(p.name),
      ingredients: [
        "Grass-fed beef tallow",
        "Non-nano zinc oxide (25%)",
        "Jojoba oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1159" && /tallow deodorant/i.test(p.name),
      ingredients: ["Grass-fed beef tallow"],
    },
    {
      test: (p) => p.brandId === "c1163" && /honey sugar scrub/i.test(p.name),
      ingredients: [
        "Grass-fed organic beef tallow",
        "Organic cane sugar",
        "Organic shea butter",
        "Organic extra virgin olive oil",
        "Colorado honey",
      ],
    },
    {
      test: (p) => p.brandId === "c1163" && /lavender sugar scrub/i.test(p.name),
      ingredients: [
        "Grass-fed organic beef tallow",
        "Organic cane sugar",
        "Organic shea butter",
        "Organic extra virgin olive oil",
        "Lavender essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1163" && /sweet orange sugar scrub/i.test(p.name),
      ingredients: [
        "Grass-fed organic beef tallow",
        "Organic cane sugar",
        "Organic shea butter",
        "Organic extra virgin olive oil",
        "Sweet orange essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1163" && /blue tansy/i.test(p.name),
      ingredients: [
        "Grass-fed tallow*",
        "EVOO*",
        "Castor oil*",
        "Blackseed oil*",
        "Blue tansy essential oil*",
      ],
    },
    {
      test: (p) => p.brandId === "c1163" && /vanilla bean/i.test(p.name),
      ingredients: [
        "Grass-fed tallow*",
        "EVOO*",
        "Castor oil*",
        "Blackseed oil*",
        "Vanilla botanical extract*",
      ],
    },
  ];

  const RESTORE_MINT = [
    "Water",
    "Non-GMO glycerine",
    "Hydrated silica",
    "Non-GMO xylitol",
    "Calcium carbonate",
    "NanoXIM (nano-hydroxyapatite)",
    "Salvadora persica (miswak)",
    "Mint hydrosol",
    "Green tea extract",
    "Chicory root",
    "L-arginine",
    "Xanthan gum",
    "Potassium sorbate",
  ];
  const RESTORE_VANILLA = RESTORE_MINT.map((item) =>
    item === "Mint hydrosol" ? "Natural vanilla extract" : item,
  );
  const ORIGEN_SEAWATER = [
    "Deep ocean mineral water",
    "Sodium",
    "Potassium",
    "Magnesium",
    "Calcium",
    "92 naturally occurring trace minerals",
  ];
  const WAVE56_KNOWN = [
    {
      test: (p) => p.brandId === "c1207" && /green mint/i.test(p.name),
      ingredients: RESTORE_MINT,
    },
    {
      test: (p) => p.brandId === "c1207" && /vanilla/i.test(p.name),
      ingredients: RESTORE_VANILLA,
    },
    {
      test: (p) => p.brandId === "c1208",
      ingredients: ORIGEN_SEAWATER,
    },
    {
      test: (p) => p.brandId === "c1209" && /lion'?s mane mushroom extract/i.test(p.name),
      ingredients: ["100% Lion's Mane (Hericium erinaceus) fruiting body extract"],
    },
    {
      test: (p) => p.brandId === "c1209" && /lion'?s mane mushroom powder/i.test(p.name),
      ingredients: ["100% Lion's Mane (Hericium erinaceus) fruiting body powder"],
    },
    {
      test: (p) => p.brandId === "c1209" && /reishi/i.test(p.name),
      ingredients: ["100% Reishi (Ganoderma lucidum) fruiting body extract"],
    },
    {
      test: (p) => p.brandId === "c1209" && /cordyceps/i.test(p.name),
      ingredients: ["100% Cordyceps fruiting body extract"],
    },
    {
      test: (p) => p.brandId === "c1210" && /lip balm — peppermint/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Shea butter",
        "Organic beeswax",
        "Organic peppermint essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /lip balm — sweet orange/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Shea butter",
        "Organic beeswax",
        "Organic sweet orange essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /sugar scrub — lavender/i.test(p.name),
      ingredients: [
        "100% grass-fed beef tallow",
        "Organic cane sugar",
        "Organic cold-pressed olive oil",
        "Organic lavender essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /sugar scrub — citrus spice/i.test(p.name),
      ingredients: [
        "100% grass-fed beef tallow",
        "Organic cane sugar",
        "Organic cold-pressed olive oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /^dry shampoo$/i.test(p.name),
      ingredients: ["Organic arrowroot powder", "Kaolin clay", "Cocoa powder"],
    },
    {
      test: (p) => p.brandId === "c1210" && /frankincense and lavender/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Organic jojoba oil",
        "Organic lavender essential oil",
        "Organic frankincense essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /function coffee/i.test(p.name),
      ingredients: ["Grass-fed beef tallow", "Coffee"],
    },
    {
      test: (p) => p.brandId === "c1210" && /lavender \+ calendula/i.test(p.name),
      ingredients: [
        "Grass-fed beef tallow infused with lavender and calendula",
        "Organic jojoba oil",
        "Organic castor oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /lime in the coconut/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Organic lime essential oil",
        "Organic coconut oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /magnesium oil/i.test(p.name),
      ingredients: ["Magnesium chloride", "Distilled water"],
    },
    {
      test: (p) => p.brandId === "c1210" && /citrus spice whipped tallow/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Organic jojoba oil",
        "Organic castor oil",
        "Organic sweet orange essential oil",
        "Organic clove essential oil",
        "Cinnamon leaf essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /rose hydrosol/i.test(p.name),
      ingredients: ["100% pure rose hydrosol"],
    },
    {
      test: (p) => p.brandId === "c1210" && /sun cream \+ sun stick/i.test(p.name),
      ingredients: [
        "Organic jojoba oil",
        "Grass-fed grass-finished beef tallow",
        "Non-nano zinc oxide",
        "Organic coconut oil",
        "Organic beeswax",
        "Cocoa powder",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /^tallow soap$/i.test(p.name),
      ingredients: [
        "Saponified organic coconut oil",
        "Beef tallow",
        "Organic olive oil",
        "Organic castor oil",
        "Organic eucalyptus essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /tush tamer/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished tallow",
        "Organic olive oil",
        "Organic coconut oil",
        "Non-nano zinc oxide",
        "Bentonite clay",
        "Organic beeswax",
        "Lavender essential oil",
        "Chamomile essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /unscented whipped tallow/i.test(p.name),
      ingredients: ["Grass-fed beef tallow", "Organic jojoba oil"],
    },
    {
      test: (p) => p.brandId === "c1210" && /youthful whipped tallow/i.test(p.name),
      ingredients: [
        "Grass-fed grass-finished beef tallow",
        "Organic castor oil",
        "Organic frankincense essential oil",
        "Blue tansy essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /tallow lotion — citrus burst/i.test(p.name),
      ingredients: [
        "Distilled water (aqua)",
        "Grass-fed grass-finished beef tallow",
        "Organic jojoba oil",
        "Stearic acid",
        "Emulsifying wax NF",
        "Optiphen Plus (phenoxyethanol, caprylyl glycol, sorbic acid)",
        "Organic sweet orange essential oil",
        "Organic lemon essential oil",
      ],
    },
    {
      test: (p) => p.brandId === "c1210" && /tallow lotion — .*citrus spice/i.test(p.name),
      ingredients: [
        "Distilled water (aqua)",
        "Grass-fed grass-finished beef tallow",
        "Organic jojoba oil",
        "Stearic acid",
        "Emulsifying wax NF",
        "Optiphen Plus (phenoxyethanol, caprylyl glycol, sorbic acid)",
        "Organic sweet orange essential oil",
        "Organic clove bud essential oil",
      ],
    },
  ];

  for (const p of cleaned.filter(isWave26)) {
    if (p.ingredients?.length) {
      p.ingredients = sanitizeIngs(p.ingredients);
      if (looksLikeMarketing(p.ingredients.join(" "))) p.ingredients = [];
    }
    if (p.brandId === "c1146" && /natural non-toxic deodorant/i.test(p.name)) {
      const scent = p.name.split("—").pop().trim().toLowerCase();
      const extra = AMALLOW_DEO_SCENTS[scent] || [];
      p.ingredients = [...AMALLOW_DEO_BASE, ...extra];
    }
    for (const row of KNOWN) {
      if (row.test(p)) p.ingredients = row.ingredients;
    }
  }

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

  for (const p of cleaned.filter(isWave26)) {
    if (p.ingredients?.length) p.ingredients = sanitizeIngs(p.ingredients);
    for (const row of KNOWN) {
      if (row.test(p)) p.ingredients = row.ingredients;
    }
    if (p.brandId === "c1146" && /natural non-toxic deodorant/i.test(p.name)) {
      const scent = p.name.split("—").pop().trim().toLowerCase();
      p.ingredients = [...AMALLOW_DEO_BASE, ...(AMALLOW_DEO_SCENTS[scent] || [])];
    }
    const joined = (p.ingredients || []).join(" ");
    if (
      /powered by shopify|full page refresh|won'?t clog|dries clear|value 3-pack|clinically-tested waterblock|prevents chapping|extends your tan|layers beautifully under makeup/i.test(
        joined,
      )
    ) {
      p.ingredients = [];
    }
    for (const row of WAVE56_KNOWN) {
      if (row.test(p)) p.ingredients = row.ingredients;
    }
    if (p.brandId === "c1210" && p.ingredients?.length) {
      p.ingredients = p.ingredients.filter(
        (s) =>
          !/\b(caution|external use|avoid (eyes|contact|inhaling)|if irritation|store (at|in)|reapply|blend with|this (can be|feeling)|allow it to absorb|can also be used|container size|do not scrub|use caution|sun stick ingredients|for external|discontinue|fda approved|consulting with your doctor|not intended for children|favorite tallow|patch test|dry place|allow soap|open skin)\b/i.test(
            s,
          ) && !/^(nose|mouth|bathing|moisture)$/i.test(s),
      );
    }
    if (p.brandId === "c1211" && /lip balm/i.test(p.name)) {
      p.ingredients = [];
    }
    if (
      p.ingredients?.length &&
      /made with pure, natural|if you haven'?t tried|why not give it a try|free from chemicals/i.test(
        (p.ingredients || []).join(" "),
      )
    ) {
      p.ingredients = [];
    }
  }

  fs.writeFileSync(outJson, JSON.stringify(cleaned, null, 2));
  const wave = cleaned.filter(isWave26);
  const withIng = wave.filter((p) => p.ingredients?.length > 0).length;
  const report = {
    generatedAt: new Date().toISOString(),
    merchDropped: dropped,
    missingTried: missing.length,
    newlyFilled: filled,
    wave57Products: wave.length,
    wave57WithIngredients: withIng,
  };
  fs.writeFileSync(
    path.join(root, "data/wave57-ingredients-backfill.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
