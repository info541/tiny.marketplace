/**
 * Drop leftover merch from wave33 and backfill missing ingredients from product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 999;
const WAVE_END = 1007;
const CONCURRENCY = 12;

const MERCH =
  /\b(stuffed toy|plush|crew socks|socks\b|head wrap|tote bag|statement tote|\btote\b|silk scarf|t-?shirt|\btee\b|\bshirt\b|hoodie|sweatshirt|beanie|sticker pack|sticker\b|mug\b|apparel|poster|patch\b|keychain|storybook|\bbook\b|ebook|e-book|cookbook|journal\b|candle holder|\bcandle\b|wax melt|reed diffuser|clay diffuser|diffuser blends?|gift card|e[- ]?gift|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|nalgene bottle|team bottle|terrain bottle|fuel bottle|fanny pack|luggage tag|enamel pin|marketing card|deodorant scoop|cream applicator|deodorant applicator|refillable deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|for pets?|\bpet\b|dog shampoo|dog soap|dog balm|dog paw|puppy paw|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|product protection|vip protection|priority handling|labl guarantee|labl protect|returns & exchanges|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|rainbow cap|canvas cap|digital (file|download)|gravity feed|mystery gift|100%\s*off|spatula|spf brush|travel brush|sample tin|imperfect|prepaid return envelope|gua sha|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|facial scrubbie|facial rounds|storage tin|room & pillow spray|room spray|linen spray|fabric refresher|cologne spray|perfumes?|perfume bar|spf brush|printable|play pack|buy 1 get 1|makeup brush|kabuki brush|electric mixer|onesie|floor cleaner|dishwasher detergent|laundry detergent|laundry powder|laundry scent|chef soap|household essentials|neem comb|scalp massager|pill travel tin|welcome card|glass drink bottle|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|bronzing|cheek tints?|lip & cheek|lip and cheek|boxes - bulk|foaming herbal hand soap|foaming hand soap|lipstick|lip gloss|makeup|brow boss|cc cream|skin tint|headband|face cloth|bamboo buds|defining powder|cotton buds|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|\bpouch\b|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|travel organiser|travel organizer|swag|academy|bundle & save|mat spray|yoga (room|mat)|storage jar|stainless steel|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|travel tin|counter display|counter top box|box of 12|buy 6|racerback|\btank\b|trucker|snapback|tumbler|flask|insulated glass|bamboo spoon|plastic tumbler|storage can|measuring spoon|shaving brush|safety blades|\brazor\b|lunch bag|jute soap|gift set|gift box|self tanner|kabuki|pencil case|cosmetic case|hand sanitizer|accessories only|kit bag|bodysuit|metal travel cap|anti-slip bottle|bottle sleeve|\btesters?\b|silk bonnet|silk scrunchie|scrunchie|bulk empty|empty mouthwash|empty toothpaste|silicone sleeves?|soap holder|gua sha|setting powder|highlighter|contour stick|lash \+ brow|brow oil|bug spray|insect repellent|bamboo soap holder|baseball cap|carbon offset|carbon neutral|walking with god|loofah|sage bundle|hair wrap|mindfulness book|mystery shampoo|ambassador tee|ambassador set|cosmetic bag|silk facial sponge|omelette|dark fish|light fish|powder funnel|cooking tallow|goat milk ghee|goat milk cream|stout coffee|\bbbq\b|\bsteak\b|\bburger\b|\bchicken\b|\bveggie\b|mushroom cap|leather lip balm|dish scrub|dishwashing set|soap saver bag|no bugs balm|hospitality bundle|retail bundle|clinic bundle|complimentary box|empty plastic jar|pouch only|colonized grain|agar plates|grow block|growler bottle|fire cider|toiletry bag|donation|refuge|ice cube tray|sports bottle|glass bottle|application mitt|tanning mitt|self[- ]?tan|eau de parfum|cologne|nizoral|ketoconazole|conversation cards|multi-tool|gift voucher|gift pack|vat free|facial roller|eye mask|application brush|tanning mist|face tan|bronzed babe|essential oil|bath bomb|bathing ritual|\bcombs?\b|\bshorts\b|\bspawn\b|dog treats?|sleep mask|red light|elderberry syrup|golden milk|bite relief|aromatherapy|room & body spray|soap saver|dopp|aftershave|postcard|booklet|counter card|hang tag|mystery gift|no gift|gear wash|ear rinse|defog|mask strap|pump head only|wall-mounted|army style cap|lifeguard|sunshirt|world reef day|satin sleep|air cleanser|culinary|makeup bundle|gingival|aroma diffuser|printed booklet|cardstock|neoprene|explorer kit|dive essentials|custom explorer|ingredients to avoid|body wash bottle|recycled washbag|shampoo bar tray|lip brush|\byoni\b|\blingam\b|love lube|tanning oil|complete guide|serum foundation|silicone sheet|hot pink case|mint green case|reusable pump|empty pump|foraging hunt|farm foraging|electric mixer|electric whisk|wild whisk|soap remnant|soap stand|shower soap stand|\bcandles?\b|wrinkle patches|lumineux|cooking tallow|fresh beef tallow|order builder|wool batting|camocim|cajamarca|regenerative organic coffee|abundance candle|beeswax candle|konjac sponge|digital gift card|subscription perk|play mat|spectrumview|methylene blue|ghk-?cu|copper peptide|celebrity skin|at-home remedies|vip bundle|\bpup\b|compression sock|crew sock|boot sock|sleep sock|pro gear|advantage gear|mason jar candle|wood conditioner|paw protect|farm tour|fresh (king|pink|golden|black|lion)|grower's choice|mixed mushroom box|\bseltzer\b|shower cap|silk pillowcase|microfiber|hair pick|hair towel|flaxseed cap|cotton face mask|bath bunny|bath toy|bubble wand|chewing gum|mouthwash cup|energy bar|energy gel|running energy|informed sport|\btesto\b|spot dots|face cloths?|hydrogel eye|bug balm|toothbrush case|brush case|toothkeeper|\bgwp\b|wholesale|sauna hat|vibey shades|dish soap|dishwashing|cellulose cloth|loofie|empty vegan capsules|dried whole|gourmet salt|finishing salt|food topper|tea blend|tea steeper|dried elderberries|tick stick|illuminator|edgelift|satin bonnet|hair bonnet|detangle define|24 pack|sample jar|wooden soap dish|gift basket|sriracha|smoked salt|for dogs|dog blend|botanical tea|birthday bundle|slick-flex|slick-dense|slay and stay|edge lift)\b/i;

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
      const fromJs = extractIngredients(data.body_html || data.description || "");
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

const EXTRA_DROP =
  /\b(consultations?|guide to|water-based lubricant|\blubricant\b|bone meal|wash tabs|bug off|vanilla extract|migraine roller|wax wraps?|eyelash|hand mixer|active bottle|elderberry syrup kits?|foaming tallow hand soap|refillery|pearl powder|eco action|laundry detergent strips|nectar scent|natural perfume|free gifts|egyptian loofah|soap of the month|soap subscription|exfoliating soap saver|finishing sea salt|dried turkey tail|elderberry oxymel|liver tonic|toilet bowl cleaner|foaming soap dispenser|glass soap dispenser|soap standle|cleanser dispenser|electric toothbrush|replacement toothbrush|bamboo heads for electric|starter bundle - .*?\+ (bottle|jar)|organic (banana|orange|strawberry|lemon|celery|kale|spinach|collard greens|broccoli(?: sprout)?|beet|raspberry|blackberry|cranberry|acerola|acai|maqui) powder|ice cream maker|slushy machine|laying hens|whole turkey|compost garden|room mist|lash & brow|dad hat|heritage collection|tanning oil|finishing oils? set|wellness oil set|extra virgin coconut oil|discovery kit|methylene blue|cbd infused|fairness cream|shipping protection|fresh,? 4 oz|local pick-up, fresh|jade facial stone|silicone applicator|brow styling wax|herbal lash serum|powder scoop|facial wand|serum lovers bauble|tongue (cleaner|scraper)|repel botanical|aluminum display|tube key|ticked off|tallow tan|konjac|serving scoop|frother|shaker bottle|keepcap|confetti comb|jute travel|mycology poster|trucker cap|me-time tea|tallow twins hats|gua sha|sleep soak|bath soak|fragrance oil|scented fragrance|cashback|oat milk|shaker cup|doggie|nasal inhaler|bug repel|bug repellant|dermastamp|derma stamp|makeup sticks?|cheek & lip|lip tint|skin tint|glow stick|fondue)\b/i;

function reclassify(p) {
  const t = p.name.toLowerCase();
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
  if (/\b(tallow balm|whipped tallow|lip balm|love your lips|face balm|blue tansy|body butter|body scrub)\b/.test(t) && !/\bzinc\b/.test(t)) {
    p.category = "skincare";
  }
  return p;
}

async function main() {
  const all = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const before = all.length;
  const cleaned = all
    .filter((p) => !(isWave26(p) && (MERCH.test(p.name) || EXTRA_DROP.test(p.name))))
    .map((p) => (isWave26(p) ? reclassify(p) : p));
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
    wave33Products: wave.length,
    wave33WithIngredients: withIng,
  };
  fs.writeFileSync(
    path.join(root, "data/wave33-ingredients-backfill.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
