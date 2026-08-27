/**
 * Fetch Shopify catalogs for wave86 brands (c1385+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent variants into their own listings
 * - Skips merch, gift cards, bundles, kits
 * - Extracts ingredients from product HTML
 * - Converts cart.js currency (EUR × 1.08, GBP × 1.27, AUD × 0.65, CAD × 0.73, NZD × 0.60)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave86.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1385;
const WAVE_END = WAVE_START + seedBrands.length - 1;

const FX = { EUR: 1.08, GBP: 1.27, AUD: 0.65, CAD: 0.73, NZD: 0.6, BHD: 2.65 };

const SKIP_TITLE =
  /\b(gift card|e[- ]?gift|gift certificate|store credit|membership|subscription box|not for sale|tester only|wholesale|100%\s*off|t-?shirt|\btee\b|hoodie|sweatshirt|\bhat\b|tote bag|\btote\b|sticker|mug\b|apparel|book\b|ebook|e-guide|workshop|event|free gift|for pets?|\bpet\b|dog soap|dog shampoo|shipping protection|package protection|\bcandle\b|soap savers?|soap dish|sisal bag|sample pack|sample set|gift set|gift box|gift basket|bundle & save|starter kit|discovery kit|variety pack|3[- ]pack|6[- ]pack|family pack|couples pack)\b/i;

const WAVE86_EXTRA =
  /\b(gift card|e-gift|gift pack|gift set|gift basket|mystery (box|gift)|shipping protection|package protection|savedby|navidium|build your (own )?bundle|bundles?\b|duo\b|duet\b|trio\b|variety pack|holiday gift|shaker bottle|shakers?\b|whisk\b|sampler pack|cashback|enamel pin|empty bottle|frother|mixer|water bottle|sachet|sample kit|sweatshirt|hoodie|\bhat\b|scrunchie|pillowcase|keychain|tote|socks|tumbler|straws?|complimentary|e-?book|consultation|sponsorship|walking with god|sisal|soap dish|stainless steel bottle|wholesale|subscription gift|joint support bundle)\b/i;

const NICHE =
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sunbalms?|sun[- ]?balms?|sun cream|sun protectant|after sun|zinc oxide|\bzinc\b|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|tooth powder|tooth suds|floss|mouthwash|mouth rinse|oil pull|tongue clean|oral (care|health)|hydroxyapatite|n[- ]?ha|remineraliz|shampoo|conditioner|hair (oil|mask|serum|care|juice|bar|clay)|scalp|beard|protein|whey|casein|collagen|creatine|electrolyte|hydration|vitamin|supplement|capsule|probiotic|lion'?s mane|reishi|chaga|cordyceps|turkey tail|shiitake|oyster mushroom|mushroom|tincture|serums?|moisturizer|cleanser|cream|lotion|oil|mask|balm|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|lip|hydrosol|magnesium|shaving|gum|pomade|complexion|dry shampoo|face wash)\b|deodorants?|electrolytes?|hydrat|wpi\b/i;

const FLAVOR_OPTION =
  /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|scented|types?|blend|choose your scent|select one|inci|essential oil|choose product|single\/bundle|hair color|hue|formula|choose your flavou?r/i;

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
  return /\b(how to (use|apply)|directions?|why (we|our|tallow|you.?ll)|add to cart|subscription|if you haven'?t tried|love & gratitude|shipping|refund|free from|ours doesn'?t|let it dissolve|swish for|easy to use daily|sip it|we prioritize clean|upgrade your daily|does not make any medical|from farm to formula|product (benefits?|highlights?)|perfect for|process\/ethos|scent family|airy notes|elevate your|reconnect with|simple, natural ingredients|gentle ingredients that keep you fresh|ingredients are always|fuel your body|nourish and replenish|this product is not intended|naturally strengthen|why you.?ll love|clean\. powerful\. proven|no sugar\. no fillers|ingredients with a purpose|users report|customers report|customers rave|outperforming|nutritional information|food supplements should|add a pea-sized|don'?t forget to brush|there.?s one key ingredient|hydroxyapatite \(hap\) is the same mineral|all of the flavor in each of our products|star ingredients include|key ingredients sodium|uses: (focus|stress|antiviral|exercise)|we couldn'?t find a toothpaste|what.?s inside each stick|same clean-ingredient philosophy|zero sugar — sweetened|the power smoothie|protein upgrade|add to smoothies|shake vigorously|feed only as directed|instructions for use|consult your veterinarian|naturally sweet drink|morning smoothie|milk alternative|electrolytes you.?ll actually|stevia free real fruit|handmade with love|never outsource|70\+\s*trace minerals|sweetened with (pure )?monk fruit|no sugar alcohols|hydrolysed bovine collagen|to support healthy bones|help protect strands|boost resilience|to strengthen, smooth|you.?ll notice|shield your skin|then soaking in alcohol|ultrasonic extractor|we bottle our|highly adsorbent|draws out dirt|helps resolve acne|offers intense hydration|aluminum-free, all-natural solution|nourishing spf protection|that actually works|handcrafted with nourishing|long-lasting moisture|cooling peppermint sensation|creamy lather that|hydrate with our everyday|stand your ground|learn more about|every element of ground|premium, all-natural odor|water resistance|lab-tested|no white cast|melts makeup|skin-loving vitamins|long-lasting hydration|awaken the senses|peaceful shoreline|invigorating start|hand-poured in small batches|chemistry experiment|boosts moisture|enhances shine|feels as good as it smells|everyday hydration that feels|you can pronounce|you could eat|designed for shoppers who want|biomimetic mineral that supports|premium nano|strengthen enamel, reduce sensitivity|bright, uplifting|handcrafted with thoughtfully selected|this bar is loaded|peppermint oil cools|tired of the lack|asian-inspired|real fruit powder is sourced|goji berries are packed|convenient, wholesome protein|where your food comes from|we start by working with farmers|cold-processed microfiltration|performance first|simple ingredients\.|metal tube|made in canada|helps smooth fine lines|delivers vitamins and peptides|deeply hydrates and repairs|modern skincare overloads|your skin can heal itself|dual extract|fruiting body|replaces what you lose|your body doesn'?t sweat|experience sun protection|experience a fresh, clean mouth|luxury meets convenience|your skin deserves hydration|no aluminum\. no synthetic)\b/i.test(
    raw || "",
  );
}

function hasInciToken(raw) {
  return /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|hydrobeef|cocoa|glycine|stevia|alcohol|honey|jojoba|goat milk|creatine|whey|theobromine|sorbitol|silica|dates|cacao|cinnamon|inulin|lecithin|monk fruit|kakadu|hyaluronic|aloe|bentonite|calcium|lard|beeswax|sci|btms|isethionate|cocamidopropyl|arrowroot|coconut|colostrum|emu/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw) || !hasInciToken(raw)) return false;
  if (parts.length > 28) return false;
  if (parts.length >= 5) return true;
  if (
    parts.length >= 3 &&
    /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium|gum|xylitol|hydroxyapatite|clay|shea|hydrobeef|cocoa|glycine|stevia|alcohol|honey|jojoba|goat milk|creatine|whey|theobromine|sorbitol|silica|dates|cacao|cinnamon|inulin|lecithin|monk fruit|kakadu|hyaluronic|aloe|bentonite|calcium|colostrum|emu/i.test(
      raw,
    )
  ) {
    return true;
  }
  if (
    parts.length >= 2 &&
    /tallow|oil|wax|butter|zinc|beeswax|xylitol|hydroxyapatite|hydrobeef|alcohol|goat milk|whey|dates|fruiting|collagen|colostrum|emu/i.test(
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
    /ingredients?\s*<\/(?:strong|b|span|h\d|p)>\s*:?\s*([^<]{12,1500})/i,
  );
  if (strong) {
    const raw = stripHtml(strong[1]);
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw)) return parts;
  }
  const text = stripHtml(html);
  const markerRe =
    /(?:base\s+ingredients?(?:\s*\([^)]*\))?|key\s+ingredients?|(?:full\s+)?ingredients?(?:\s+list)?|active(?:\s+ingredients?)?|inactive(?:\s+ingredients?)?|inci(?:\s+list)?|composition)\s*[:\-–]\s*([^\n]{12,1500})/gi;
  let best = [];
  for (const mm of text.matchAll(markerRe)) {
    const raw = mm[1].trim();
    if (looksLikeMarketing(raw)) continue;
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw) && parts.length >= best.length) best = parts;
  }
  if (best.length) return best;

  const inci = text.match(
    /\b(?:Aqua|Water|Eau|Glycerin|Sorbitol|Jojoba|Tallow|Organic Sunflower|Australian Grass Fed|Non-Nano Zinc|Hydrolysed Collagen|Whey Protein Isolate|Aloe Barbadensis|Hydrated Silica|Organic Whey|Colostrum|Emu Oil)\b(?:\s*\/\s*(?:Aqua|Water|Eau))?[^.]{0,40}(?:,\s*[A-Za-z0-9*][^,]{1,100}){3,60}/i,
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
    if (/\binactive:\s*/i.test(s) && !s.toLowerCase().startsWith("inactive:")) {
      const [active, ...rest] = s.split(/\binactive:\s*/i);
      if (active.trim()) {
        const zinc = active.replace(/^\d+%\s*/i, "").trim();
        if (zinc) clean.push(zinc.replace(/\*+$/g, "").trim());
      }
      s = rest.join(" ").trim();
      if (!s) continue;
    }
    if (
      /\b(product (benefits?|highlights?)|perfect for|elevate your|take your|from farm to formula|process\/ethos|scent family|how to|directions?|q:|note:|we recommend|best for:|reconnect with|love & gratitude|does not make any medical|disclaimer|no added sugar|no artificial|safety information|keep out of reach|for external use|zero sugar|designed to align|just clean hydration|ideal for those|this product has not been evaluated|available blends|why you.?ll love|add a pea-sized|brush twice|application|apply (body|liberally)|locally sourced|why i'?|handmade and hand-tested|handmade in reno|handcrafted in the usa|real customer reviews|salt lake city|limited edition packaging|perfect after a workout|clean hands|clear conscience|glow naturally|sleep deeper|confident protection|give your (skin|locks)|use as part of your daily|heals scarring|balances skin tone|artificial colors|synthetic preservatives|what.?s inside|same clean-ingredient|organic lucuma|patent pending|handmade with love|100% australian made|recyclable materials|vegan friendly|vegan, gluten-free|ensuring that it is suitable|grown on our own farm|whole fresh fruiting|half wild-foraged|to support healthy|contributes to growth|help protect strands|70\+\s*trace|sweetened with|no sugar alcohols|each bar is unique|you.?ll notice|shield your skin|then soaking|ultrasonic|we bottle our|highly adsorbent|draws out dirt|helps resolve|offers intense|cruelty free|leaping bunny|bars vary in size|that actually works|cooling peppermint|creamy lather|stand your ground|learn more about|designed for shoppers|biomimetic mineral|fda disclaimer|not intended to diagnose|replaces what you lose)\b/i.test(
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
      .replace(/\*+$/g, "")
      .replace(/[)(]+$/g, "")
      .replace(/^[)(]+/g, "")
      .replace(/\s+and\s+$/i, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+\([^)]*(soothes|polishes|strengthens|helps|freshens|thickens|derived)[^)]*\)/gi, "")
      .replace(/\s*\.?\d+(\.\d+)?\s*oz\s*\|.*$/i, "")
      .replace(/\s*100%\s*australian.*$/i, "")
      .replace(/\s*recyclable materials.*$/i, "")
      .replace(/\s+Weight:\s*.*$/i, "")
      .replace(/\s+Net wt\.?\s*.*$/i, "")
      .replace(/\s*\*Organic All-natural.*$/i, "")
      .replace(/\s*\*Organic\s*$/i, "")
      .trim();
    if (/^inactive:?$/i.test(s) || /^active:?$/i.test(s) || /^vegan$/i.test(s) || /^weight:?$/i.test(s) || /^net wt/i.test(s)) {
      if (/^weight:?$/i.test(s) || /^net wt/i.test(s)) break;
      continue;
    }
    if (
      /gluten[- ]free|no gluten|\bvegan\b|non-gmo|and amino proteins|this bar strengthens|proteins strengthen|infused with a |help restore shine|restore softness|and protect$|sku\/item|suggested shelf life|plastic (flip|atomizer)|swish around|swish with|spit out|dispense in the palm|use frequently|why isn'?t our|well suited for delicate|precise application|ancestral approach|formulated with just four|wildly nourishing|certified organic/i.test(
        s,
      )
    ) {
      break;
    }
    s = s.replace(/^and\s+/i, "").replace(/\s+for smooth$/i, "").trim();
    if (
      /^(cruelty-free|non-toxic|all-natural|pure|virgin|unrefined|cold-pressed|hexane-free|soothing|repairing|emollient butter for deep)$/i.test(
        s,
      )
    ) {
      continue;
    }
    if (
      /^helps\b/i.test(s) ||
      / — /.test(s) ||
      /wont wash out|scent worth leaning|thats not all|our belnd|variations in size|minimizes the appearance|your skin|that works|rich in skin|every one you|works the moment|barrier repair|no white cast|no detergents|boosts moisture/i.test(
        s,
      )
    ) {
      break;
    }
    if (s.length > 90 || s.length < 2) continue;
    if (
      /\b(cleanse|nurture|highlights|benefits|routine|skincare|creamy lather|daily shower|refreshing cleanse|silky glide)\b/i.test(
        s,
      ) &&
      !/oil|butter|tallow|clay|wax|extract|oxide|acid|salt|magnesium|glycerin|hydroxyapatite|xylitol|beeswax|shea|goat milk|whey|dates|collagen|colostrum|emu/i.test(
        s,
      )
    ) {
      continue;
    }
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
    ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|sun butter|sun[- ]?balm|sun cream|sun protectant|zinc stick|mineral zinc|mineral sun|mineral stick|after sun|sun lotion|sun balm)\b/],
    ["deodorant", /deodorants?|antiperspir|underarm|\bdeo\b|pit stop/],
    ["supplements", /\b(lion'?s mane|reishi|chaga|cordyceps|shiitake|maitake|oyster mushroom|turkey tail|mushroom (complex|tincture|extract|powder|immunity|cacao|beet|turmeric|matcha)|adaptogen|creatine|vitamin d|magnesium|shilajit|maca|chlorella|d-?ribose|capsule|knotweed|dual extract|tincture|propolis|trifecta|ashwagandha|turmeric|beet root|milk thistle|dandelion|calendula|poria|tremella|meshima|pine pollen|schizandra|astragalus|pearl beauty|resveratrol|fulvic|camu camu|liver capsules|longevity|collagen|bioelectric)\b/],
    ["electrolytes", /\b(electrolytes?|hydration (powder|packet|mix|stick)|drink mix|stick packs?|hydrate|recovery plus)\b/],
    ["oral", /\b(toothpaste|toothbrush|floss|mouthwash|oral care|hydroxyapatite|oil pull|tongue clean|teeth|tooth powder|tooth suds|retainer cleaner|mouth rinse|dry mouth|gum serum|enamel|remineral\w*|tooth and gum|tooth whitener|pumice polish|breath freshener|oral swish)\b/],
    ["hair", /\b(shampoo|conditioner|hair|scalp|beard|hair bar|hair clay|leave[- ]?in|dry shampoo|hair gel)\b/],
    ["protein", /\b(protein|whey|casein|pea protein|beef protein|wpi|oat milk|peanut butter protein|clear (whey )?isolate)\b/],
    ["skincare", /\b(serums?|moisturizer|cleanser|cream|toner|mask|facial|skin|body (lotion|butter|wash|cream|oil|bar)|lip|soap|balm|oil|tallow|hydrosol|lotion|scrub|shaving|diaper|face wash|colostrum|salve|belly)\b/],
  ];
  for (const [cat, re] of rules) {
    if (re.test(hay)) return cat;
  }
  return brandCategories[0] || "skincare";
}

function refineCategory(category, title, brand) {
  const t = title.toLowerCase();
  if (brand?.slug === "ulyana-organics") {
    if (/tooth powder|remineral/i.test(t)) return "oral";
    if (/deodorants?/.test(t)) return "deodorant";
    if (/sun cream|sun balm|zinc/.test(t) && !/salve|oil|butter/.test(t)) return "sunscreen";
    if (/shampoo|hair mask|beard oil/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "purelyte") return "electrolytes";
  if (brand?.slug === "opportuniteas") {
    if (/collagen/.test(t) && !/protein|whey|vegan/.test(t)) return "supplements";
    return "protein";
  }
  if (brand?.slug === "seaker-sun") return "sunscreen";
  if (brand?.slug === "made-new-naturals") {
    if (/shampoo|conditioner/.test(t)) return "hair";
    if (/deodorants?/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "tilted-cap") return "supplements";
  return category;
}

function isOnNiche(raw, brand) {
  const title = raw.title || "";
  const type = raw.product_type || "";
  const handle = raw.handle || "";
  const hay = `${title} ${type} ${handle}`;
  if (SKIP_TITLE.test(title) || WAVE86_EXTRA.test(title)) return false;
  if (Number((raw.variants || [])[0]?.price || 0) <= 0) return false;
  if (brand.slug === "ulyana-organics") {
    if (
      /\b(complimentary|e-?book|guide|bundle|tea blend|herbal blend|candle|sisal|infuser|dry brush|gua sha|consultation|tincture|loose leaf|tonic|elderberry|bug (bite|spray)|linen|aromatherapy|roller|bath (powder|salt)|oil of oregano)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    if (/-copy$/.test(handle)) return false;
    return /\b(tooth powder|deodorants?|sun cream|shampoo|dry shampoo|tallow|soap|lip|butter|lotion|salve|toner|oil|balm|mask|cream|soother)\b/i.test(
      hay,
    );
  }
  if (brand.slug === "purelyte") {
    if (/\b(wholesale|sample|trial|bottle|gift with|carton|satchel)\b/i.test(title)) return false;
    return /\b(electrolyte|hydration mix|purelyte)\b/i.test(hay);
  }
  if (brand.slug === "opportuniteas") {
    if (
      /\b(tea|matcha|mct|coffee|inulin|wheatgrass|coconut milk|bundle|2 pack|joint)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(whey|protein|collagen)\b/i.test(hay);
  }
  if (brand.slug === "seaker-sun") {
    return /\b(sun balm|zinc|sunscreen)\b/i.test(hay);
  }
  if (brand.slug === "made-new-naturals") {
    if (/\b(walking with god|sponsorship|gift card|sisal|soap dish|trio)\b/i.test(title)) {
      return false;
    }
    return /\b(shampoo|conditioner|deodorants?|tallow|soap|lip|stick|balm)\b/i.test(hay);
  }
  if (brand.slug === "tilted-cap") {
    if (/\b(bundle)\b/i.test(title)) return false;
    return /\b(tincture|lion|reishi|turkey tail|maitake)\b/i.test(hay);
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
    .replace(/\s*\((travel|gift|value).*$/i, "")
    .replace(/\s*—\s*(best value|starter|most popular|most purchased).*$/i, "")
    .replace(/\s*[-–—]\s*\d+\s*sticks?.*$/i, "")
    .replace(/,\s*\d+(\.\d+)?\s*(oz|fl\.?\s*oz).*$/i, "")
    .replace(/,\s*1 oz tin.*$/i, "")
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
  if (brand?.slug === "seaker-sun" || brand?.slug === "tilted-cap") return -1;
  if (brand?.slug === "ulyana-organics") {
    if (handle === "coconut-oil-shampoo-bar") {
      return options.findIndex((o) => /^option$/i.test(o.name || ""));
    }
    return options.findIndex((o) =>
      /^(scent|hue option|hair color|options)$/i.test(o.name || ""),
    );
  }
  if (brand?.slug === "purelyte") {
    return options.findIndex((o) => /flavou?r/i.test(o.name || ""));
  }
  if (brand?.slug === "opportuniteas") {
    return options.findIndex((o) => /flavou?r/i.test(o.name || ""));
  }
  if (brand?.slug === "made-new-naturals") {
    return options.findIndex((o) => /formula|scent|flavou?r/i.test(o.name || ""));
  }
  const scored = options.map((o, i) => {
    const name = o.name || "";
    if (!FLAVOR_OPTION.test(name)) return { i, score: -1 };
    let score = 1;
    if (/flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|tint|types?|blend|essential oil|choose product|hair color|formula/i.test(name))
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

async function fetchCurrency(base, brand) {
  try {
    const data = await fetchJson(`${base.replace(/\/$/, "")}/cart.js`);
    let currency = String(data.currency || "USD").toUpperCase();
    if (brand?.slug === "purelyte" && currency === "USD") currency = "AUD";
    return currency;
  } catch {
    return brand?.slug === "purelyte" ? "AUD" : "USD";
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

function pickVariant(variants, brand) {
  if (!variants?.length) return undefined;
  const scored = variants.map((v, i) => {
    const hay = `${v.option1 || ""} ${v.option2 || ""} ${v.option3 || ""} ${v.title || ""}`;
    let score = 0;
    if (/\b(single|single pack|1 pack|1 box|default title|50 g|50g|30 ml|30g|30 g|100 g|100g|1\.5oz|1\.5 oz|90 servings|full size|unsweetened|1 jar|1 bar|bentonite clay|2 oz\. amber jar|2 oz\. jar with powder|full\b|1lb|1 lb|single tin)\b/i.test(hay))
      score += 8;
    if (/\b(two-pack|2-pack|three-pack|3-pack|four-pack|4-pack|2 boxes|4 boxes|6 boxes|0\.5oz|0\.5 oz|20 servings|3x90|250 g|250g|500 g|500g|1 kg|1kg|5g|sample size|refill only|2 jars|3 jars|5 jars|2 bars|3 bars|4 oz\. amber|8 oz|plus 4 oz|plus 8 oz|2\.5lb|5lb|small\b)\b/i.test(hay))
      score -= 8;
    if (brand?.slug === "ulyana-organics") {
      if (/bentonite clay/i.test(hay)) score += 6;
      if (/white kaolin/i.test(hay)) score -= 4;
      if (/2 oz\. jar with powder(?! plus)/i.test(hay)) score += 10;
      if (/refillable|plus \d+ oz/i.test(hay)) score -= 14;
      if (/2 oz\. amber jar/i.test(hay)) score += 8;
      if (/4 oz\. amber jar/i.test(hay)) score -= 8;
    }
    if (brand?.slug === "made-new-naturals") {
      if (/\bfull\b/i.test(hay)) score += 10;
      if (/\bsmall\b/i.test(hay)) score -= 12;
    }
    if (brand?.slug === "opportuniteas") {
      if (/\b1\s*lb\b/i.test(hay)) score += 10;
      if (/\b(2\.5|5)\s*lb\b/i.test(hay)) score -= 12;
    }
    if (brand?.slug === "seaker-sun") {
      if (/single tin/i.test(hay)) score += 12;
      if (/two-pack|2-pack/i.test(hay)) score -= 14;
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
  if (brand.slug === "ulyana-organics") {
    if (/^remineralizing tooth powder/i.test(baseTitle)) baseTitle = "Ulyana Remineralizing Tooth Powder";
    if (/^tallow & probiotic deodorant/i.test(baseTitle)) baseTitle = "Ulyana Tallow & Probiotic Deodorant";
    if (/^tallow sun cream/i.test(baseTitle)) baseTitle = "Ulyana Tallow Sun Cream";
    if (/^natural dry shampoo/i.test(baseTitle)) baseTitle = "Ulyana Dry Shampoo";
    if (/^coconut shampoo bar/i.test(baseTitle)) baseTitle = "Ulyana Coconut Shampoo Bar";
    if (/^the classic tallow face butter/i.test(baseTitle)) baseTitle = "Ulyana Classic Tallow Face Butter";
    if (/^tallow body lotion/i.test(baseTitle)) baseTitle = "Ulyana Tallow Body Lotion";
    if (/^tallow lip balms?$/i.test(baseTitle)) baseTitle = "Ulyana Tallow Lip Balm";
    if (/^cocoa butter lip balms?$/i.test(baseTitle)) baseTitle = "Ulyana Cocoa Butter Lip Balm";
    if (/^tinted tallow lip stain/i.test(baseTitle)) baseTitle = "Ulyana Tinted Tallow Lip Stain";
    if (!/^ulyana\b/i.test(baseTitle)) baseTitle = `Ulyana ${baseTitle}`;
  }
  if (brand.slug === "purelyte") {
    baseTitle = "Purelyte Electrolyte Powder";
  }
  if (brand.slug === "opportuniteas") {
    if (/whey protein isolate/i.test(baseTitle)) baseTitle = "Opportuniteas Grass Fed Whey Isolate";
    else if (/whey protein powder concentrate/i.test(baseTitle)) baseTitle = "Opportuniteas Grass Fed Whey Concentrate";
    else if (/vegan protein/i.test(baseTitle)) baseTitle = "Opportuniteas Organic Chocolate Vegan Protein";
    else if (/collagen/i.test(baseTitle)) baseTitle = "Opportuniteas Grass-Fed Collagen Peptides";
    if (!/^opportuniteas\b/i.test(baseTitle)) baseTitle = `Opportuniteas ${baseTitle}`;
  }
  if (brand.slug === "seaker-sun") {
    baseTitle = "Seaker Mineral Zinc Oxide Sun Balm";
  }
  if (brand.slug === "made-new-naturals") {
    if (/^shampoo bars?$/i.test(baseTitle)) baseTitle = "Made New Shampoo Bar";
    if (/^conditioner bar$/i.test(baseTitle)) baseTitle = "Made New Conditioner Bar";
    if (/^tallow deodorant$/i.test(baseTitle)) baseTitle = "Made New Tallow Deodorant";
    if (/^tallow balm$/i.test(baseTitle)) baseTitle = "Made New Tallow Balm";
    if (/^tallow lip balm$/i.test(baseTitle)) baseTitle = "Made New Tallow Lip Balm";
    if (/^on-the-go tallow stick$/i.test(baseTitle)) baseTitle = "Made New On-The-Go Tallow Stick";
    if (!/^made new\b/i.test(baseTitle)) baseTitle = `Made New ${baseTitle}`;
  }
  if (brand.slug === "tilted-cap") {
    if (/turkey tail/i.test(baseTitle)) baseTitle = "Tilted Cap Turkey Tail Dual Extract Tincture";
    if (/reishi/i.test(baseTitle)) baseTitle = "Tilted Cap Reishi Dual Extract Tincture";
    if (/lion'?s mane/i.test(baseTitle)) baseTitle = "Tilted Cap Lion's Mane Dual Extract Tincture";
  }
  let flavorClean = flavorLabel ? String(flavorLabel).trim() : flavorLabel;
  if (flavorClean) flavorClean = lotionScentLabel(flavorClean);
  if (flavorClean && /^\s*\d+(\.\d+)?\s*(oz|ml|g|kg|lb|fl\.?\s*oz)\s*$/i.test(flavorClean)) {
    flavorClean = null;
  }
  if (flavorClean) {
    flavorClean = flavorClean
      .replace(/\s+\d+(\.\d+)?\s*(oz|ounce|ml|g|sticks?|lb|lbs|kg)(\s+net\s+wt\.?)?$/i, "")
      .replace(/\s*[-–—]\s*\d+\s*sticks?.*$/i, "")
      .replace(/\bLIMITED EDITION:\s*/i, "")
      .replace(/\s+only$/i, "")
      .replace(/\s+whey$/i, "")
      .replace(/\s*🍂|\s*🌿|\s*🌸/g, "")
      .trim();
  }
  if (
    flavorClean &&
    /^(default title|single|1 pack|2 pack|3 pack|30 servings|60 servings|90 servings|2oz|4oz|3oz|1oz|6g|scented|buy one|buy two|buy three|1 jar|2 jars|1 tub|2 tubs|3 tubs|250g|500g|1 kg|1 lb\.?|2 lbs\.?|3 lbs\.?|12 pack|24 pack|36 pack|spf 30|spf 50|30 spf|50 spf|1 lbs|3 lbs|box|no box|no packaging|boxes|no boxes|plastic bottle|glass bottle|variety pack|quantity|full size|travel size|2lb|4lb|76g|full|small|1lb|2\.5lb|5lb|single tin|two-pack|2 oz\. amber jar|4 oz\. amber jar)$/i.test(
      flavorClean,
    )
  ) {
    flavorClean = null;
  }
  if (flavorClean && /\b(months? supply|servings per|per tub|per pouch|lb\.?|lbs\.?|bundle pack|puck refill|variety|quantity|set|amber jar|refillable|plus \d+ oz)\b/i.test(flavorClean)) {
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
  if (
    brand.slug === "opportuniteas" ||
    brand.slug === "tilted-cap" ||
    brand.slug === "made-new-naturals"
  ) {
    ingredients = [];
  }
  if (brand.slug === "ulyana-organics") {
    const text = stripHtml(body);
    if (/tooth powder/i.test(title) && /bentonite|calcium carbonate/i.test(text)) {
      ingredients = [
        "Bentonite Clay",
        "Calcium Carbonate",
        "Baking Soda",
        "Organic Cinnamon",
        "Pink Himalayan Salt",
        "Organic Cloves",
        "Organic Peppermint Essential Oil",
      ];
    } else if (/sun cream/i.test(title) && /zinc oxide|tallow/i.test(text)) {
      ingredients = [
        "Grass-Fed Beef Tallow",
        "Non-Nano Zinc Oxide",
        "Organic Extra Virgin Olive Oil",
        "Coconut Oil",
        "Beeswax",
        "Carrot Seed Oil",
        "Red Raspberry Seed Oil",
        "Sea Buckthorn Oil",
        "Cranberry Seed Oil",
      ];
    } else {
      ingredients = [];
    }
  }
  if (brand.slug === "purelyte") {
    ingredients = [
      "Pink Himalayan Salt",
      "Potassium Citrate",
      "Organic Citric Acid",
      "Magnesium Lactate",
      "Calcium Citrate",
      /lemon/i.test(title)
        ? "Lemon Lime Fruit Powder"
        : /pineapple/i.test(title)
          ? "Pineapple Fruit Powder"
          : /raspberry/i.test(title)
            ? "Raspberry Fruit Powder"
            : "Blackcurrant Fruit Powder",
      "Natural Flavour",
      "Organic Stevia",
    ];
  }
  if (brand.slug === "seaker-sun") {
    ingredients = ["Non-Nano Zinc Oxide", "Beeswax", "Jojoba Oil", "Vitamin E"];
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
      label = lotionScentLabel(label);
      if (!label) continue;
      if (/^\s*\d+(\.\d+)?\s*(oz|ml|g|kg|lb|count|ct|pack|fl\.?\s*oz|servings?|sticks?)/i.test(label))
        continue;
      if (/\b(months? supply|servings per|per tub|per pouch|tubs?|lbs?\.?|bundle pack|quantity)\b/i.test(label))
        continue;
      if (
        /^(scented|buy one|buy two|buy three|1 jar|2 jars|1 pack|2 pack|3 pack|box|no box|no packaging|plastic bottle|glass bottle|variety pack|full size|travel size|2lb|4lb|76g|full|small|1lb|2\.5lb|5lb)$/i.test(
          label,
        )
      )
        continue;
      if (/\b(bundle|variety|pack|set|fan favorites|amber jar|refillable)\b/i.test(label) && !/creamsicle/i.test(label)) continue;
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
        pickVariant(flavorVars, brand),
        label,
        currency,
      );
      if (mapped) out.push(mapped);
    }
    if (out.length) return out;
  }
  const mapped = mapOne(raw, brand, brandId, index, pickVariant(variants, brand), null, currency);
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
      const currency = await fetchCurrency(base, brand);
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
    path.join(root, "data/catalog-products-manifest-wave86.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave86Products: waveCount,
        wave86BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
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
    path.join(root, "data/wave86-selected.json"),
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
    `\nDone total=${all.length} wave86=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
