/**
 * Drop leftover merch from wave21 and backfill missing ingredients from product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 795;
const WAVE_END = 810;
const CONCURRENCY = 12;

const MERCH =
  /\b(stuffed toy|plush|crew socks|socks\b|head wrap|tote bag|statement tote|\btote\b|silk scarf|t-?shirt|\btee\b|\bshirt\b|hoodie|sweatshirt|beanie|sticker pack|sticker\b|mug\b|apparel|poster|patch\b|keychain|storybook|\bbook\b|ebook|e-book|cookbook|journal\b|candle holder|\bcandle\b|wax melt|reed diffuser|clay diffuser|diffuser blends?|gift card|e[- ]?gift|shaker bottle|water bottle|empty bottle|shampoo bottle|conditioner bottle|nalgene bottle|team bottle|terrain bottle|fuel bottle|fanny pack|luggage tag|enamel pin|marketing card|deodorant scoop|cream applicator|deodorant applicator|refillable deodorant applicator|aluminum bottle|plastic bottle|blue bottle|brown bottle|clear bottle|clear jar|roll-on bottle|glass screw top|empty (jar|bottle|tube)|for pets?|\bpet\b|dog shampoo|dog soap|dog balm|dog paw|puppy paw|itchy ear|for dogs|daily dawg|there's a mushroom|shipping protection|package protection|post-purchase protection|product protection|vip protection|priority handling|labl guarantee|labl protect|returns & exchanges|returns\b|\bbroker\b|refill station|bottle tray|\+ shirt|shot glass|softflask|club cap|trucker hat|sun hat|wide brim|rainbow cap|canvas cap|digital (file|download)|gravity feed|mystery gift|100%\s*off|spatula|spf brush|travel brush|sample tin|imperfect|prepaid return envelope|gua sha|soap saver|soap dish|sisal bag|bamboo dish|charcoal bags?|facial scrubbie|facial rounds|storage tin|room & pillow spray|room spray|linen spray|fabric refresher|cologne spray|perfumes?|perfume bar|spf brush|printable|play pack|buy 1 get 1|makeup brush|kabuki brush|electric mixer|onesie|floor cleaner|dishwasher detergent|laundry detergent|laundry powder|laundry scent|chef soap|household essentials|neem comb|scalp massager|pill travel tin|welcome card|glass drink bottle|makeup foundation|foundation (stick|cream|liquid|powder)|concealer|mascara|eyeshadow|blush|bronzer|bronzing drops|bronzing|cheek tints?|lip & cheek|lip and cheek|boxes - bulk|foaming herbal hand soap|foaming hand soap|lipstick|lip gloss|makeup|brow boss|cc cream|skin tint|headband|face cloth|bamboo buds|defining powder|cotton buds|turkish cotton|beach towel|\btowel\b|beach blanket|konjac sponge|gift bag|air pouch|makeup bag|\bpouch\b|face mask accessories|running vest|cramper hamper|toiletry bag|recipe guide|detox book|informational insert|sample pack|classroom essent|sinus kit|washcloth|bath sponge|facial brush|body brush|beard brush|travel organiser|travel organizer|swag|academy|bundle & save|mat spray|yoga (room|mat)|storage jar|stainless steel|enema|chicken saddle|hen apron|pine needles|grow kit|grow 101|mushroom guide|travel tin|counter display|counter top box|box of 12|buy 6|racerback|\btank\b|trucker|snapback|tumbler|flask|insulated glass|bamboo spoon|plastic tumbler|storage can|measuring spoon|shaving brush|safety blades|\brazor\b|lunch bag|jute soap|gift set|gift box|self tanner|kabuki|pencil case|cosmetic case|hand sanitizer|accessories only|kit bag|bodysuit|metal travel cap|anti-slip bottle|bottle sleeve|\btesters?\b|silk bonnet|silk scrunchie|scrunchie|bulk empty|empty mouthwash|empty toothpaste|silicone sleeves?|soap holder|gua sha|setting powder|highlighter|contour stick|lash \+ brow|brow oil|bug spray|insect repellent|bamboo soap holder|baseball cap|carbon offset|carbon neutral|walking with god|loofah|sage bundle|hair wrap|mindfulness book|mystery shampoo|ambassador tee|ambassador set|cosmetic bag|silk facial sponge)\b/i;

function isWave21(p) {
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

async function main() {
  const all = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const before = all.length;
  const cleaned = all.filter((p) => !(isWave21(p) && MERCH.test(p.name)));
  const dropped = before - cleaned.length;

  const missing = cleaned.filter((p) => isWave21(p) && (!p.ingredients || p.ingredients.length === 0));
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
  const wave = cleaned.filter(isWave21);
  const withIng = wave.filter((p) => p.ingredients?.length > 0).length;
  const report = {
    generatedAt: new Date().toISOString(),
    merchDropped: dropped,
    missingTried: missing.length,
    newlyFilled: filled,
    wave21Products: wave.length,
    wave21WithIngredients: withIng,
  };
  fs.writeFileSync(
    path.join(root, "data/wave21-ingredients-backfill.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
