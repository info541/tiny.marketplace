/**
 * Fetch Shopify catalogs for wave59 brands (c1223+).
 * - Keeps every on-niche product (no 25-item cap)
 * - Expands flavor / scent / shade variants into their own listings
 * - Skips merch, events, gift cards, wholesale-only SKUs
 * - Extracts ingredients from product HTML
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands as seedBrands } from "./catalog-brands-seed-wave59.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1223;
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
  /\b(spf\s*\d+|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sunbalms?|sun[- ]?balms?|sunguard|sun protection|sun lotion|sun cream|after[- ]?sun|sun protectant|sunup|sun milk|zinc oxide|\bzinc\b|antiperspir|underarm|\bdeo\b|toothpaste|toothbrush|tooth powder|zahnputz|floss|mouthwash|mouth rinse|mouth sores|healthy gums|healthy teeth|oral (care|health|spray)|hydroxyapatite|n[- ]?ha|theobromine|oil pull|tongue clean|tablets?|shampoo|conditioner|hairwash|hair wash|dry shampoo|hair clay|shikakai|champi|pomade|grooming balm|hair (oil|mask|serum|care|cream|butter|gummies)|beard|scalp|leave[- ]?in|protein|whey|casein|collagen|creatine|pea protein|chocho|meal shake|drink mix|wellness powder|immune support|daily (calm|energy|hydration)|vitamin|supplement|capsule|softgel|probiotic|synbiotic|colostrum|biotin|adaptogen|nootropic|lion'?s mane|reishi|chaga|cordyceps|turkey tail|mushroom coffee|(flow|zen|mojo|mush love) coffee|mushroom|tonic|powder|magnesium|gummies|gummy|prenatal|serums?|moisturizer|moisturiser|cleanser|face wash|facial|toner|retinol|niacinamide|bakuchiol|\bbooster\b|cream|lotion|oil|mask|balm|souffl|mist|essence|exfoliant|lips?|body (lotion|butter|wash|cream|oil|bar)|soap|tallow|organ|greens?|superfood|multi for|hydust|sweetpeace|bite|servings|morning ritual|afternoon ritual|ort|daily hustle|daily joy|mineral defense|\brefill\b|n[- ]?hap|nanoxim|recovery drink|hydration salts?|hydration drops?|hydration hero|salty einstein|salty goddess|salty turbo|lazy lightning|electric energy|plant protein|clear protein|greens and reds|prebiotic deodorant|ceramide jelly|hydra drench|hydra-lite|weightless shampoo|weightless condition|forager'?s blend|shampoo bars?|conditioner bars?|hydrosol|armpit detox)\b|deodor|electrolyt|hydrat/i;

const FLAVOR_OPTION = /flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|scented|finish|constitutive|herb|fluord|fluoride|the taste|dry shampoo colour|style|tint|skin tone|formula|whip|blend|select|infusi[oó]n|\bmaku\b|botanical bars|choose your scent|select one|\bmaterial\b|^product$|^variants$/i;

/** Convert shop-native prices that would otherwise look like USD luxury SKUs. */
const FX_TO_USD = {
  "xotic-mushrooms": 0.65,
};

const WAVE59_EXTRA =
  /\b(create any bundle|custom bundle|gift card|ultimate skin care bundle|whipped body balm bundle|mineral renewal bath|bath salts|bug off|bamboo soap tray|exfoliating soap saver|tallow tails|pet balm|pet salve|electric toothbrush|replacement heads|clean air pod|replacement filter|toxin-free home guide|nontoxic family guide|fluoride detox guide|skin & hair optimization|sleep optimization|testosterone maximization|microplastic detox|merino wool|organic cotton boxers|blue light blocking|filtered showerhead|replacement shower filter|horse bristle electric|boar bristle electric)\b/i;

const WAVE58_EXTRA =
  /\b(subscription|whitening pen|sore gums|mouthwash spray for kids|lorem ipsum|shower tray|shower organization|lip gloss|bug spray|handheld electric frother|glass bottle|kaizen sweatshirt|hydration sample|coffee sample|sample pack|spicule)\b/i;

const WAVE57_EXTRA =
  /\b(the explorer|195 tabs|3 month supply|5 bamboo|tallow cream foundation|sculpt & bronze|cream blush|bug block|tick & mosquito|relief cbd|cbd tallow|whole ranch kit|reset bundle|bear essentials bundle|farm to skin essentials|summer starter|complete summer|calm bear|skin recovery bundle|lip duo|lip care bundle|grass-fed tallow chips|tallow candle|laundry detergent|reusable laundry|tallow-popped popcorn|tallow pet|am\/pm bundle|perfect pair bundle|all american pet|fruit & veggie|cooking tallow|hot honey|raw honey|mamabear bundle|self care bundle|5 pack|2 pack|x2 qty|bum balm|papabear essential|bear hands soap|neem mouthwash|golden aura|amour fou|botanical lip gloss|wooden spoon|local artisan mask|hydee starter|creatine bundle|mixed pack|mixed bundle|everyday bundle|protein oats bundle|ultra bundle|hydee digital|hydee drink bottle|on-the-go oats|protein oats|everyday electrolytes — blackcurrant 8|casual alchemical|beeswax, coconut oil, tallow candle|free lip balm|free tallow gift|free soap gift|free 4oz|free lip balm gift|all encompass bundle|grand family bundle|starter kit|gift bundle|goat milk laundry|bag size encompass)\b/i;

const WAVE56_EXTRA =
  /\b(restore duo|choose any two|48 pouch complete|elite athlete protocol|recharge 24 pack|daily powder bundle|daily mushroom tincture bundle|microgreens powder|beet microgreens|beet root powder|citrus spice fall bundle|build your own bundle|youthful bundle|tallow lip stain|tallow cheek tint|lash and brow|bath shots?|lavender bath soak|detox bath soak|winter simmer|solid dish soap|gift certificate|gift wrap|roller ball|elderberry kit|hand sanitizer|bug spray|immunity \+ strength|rest \+ relax|age away|splash spray|mystery (box|soap|bag)|bath soak)\b/i;

const WAVE55_EXTRA =
  /\b(damaged packaging|waitlist|cookie dough|chocolate almond coconut|chocolate coconut peanut|brownie batter|peanut butter honey almond|protein ball|ultimate protein ball|copper peptide|methylene blue|stem cell|complete tallow system|under eye lift|tightening eye serum|balm set|serum and tallow|pure tallow soap bundle|foaming liquid soap|glass dispenser|soap dispenser|deluxe bundle|gua sha|mini tallow lip balm bundle|tallow lip balm bundle|scalp massager|hair & scalp treatment bundle|laundry detergent|dish soap bundle|tallow dish soap|essentials bundle|ceramic little tallow|farmhouse soap dish|trucker hat|little tallow co t-shirt|little tallow co crewneck|jade stone|wooden tablespoon|bamboo dish brush|glitter sticker|talk tallow|logo sticker|farm fresh sticker|keep calm tallow|natural loofah|natural wood soap dish|refill tallow laundry|tallow liquid soap trio|1200mg sodium|600mg sodium)\b/i;

const WAVE54_EXTRA =
  /\b(starter kit|cavity kit|tooth powder bundle|your mouth matters|your kid'?s mouth matters|the dental diet|breath: the new science|oral ph strips|ph strips|dryft mouth tape|mouth tape|discovery (skincare )?set|sample set|find your shade|empty\*|eco-refill|refillable palette|reusable compact|pressed powder|liquid foundation|cream concealer|brow balm|multistick|smoothing primer|natural lash mascara|baby bundle|three soap bundle|two soap bundle|armpit bundle|beanie|gua sha|face cupping|soap saver|glass shaker|hydrapak|fat burner|saw palmetto|nitric oxide|krill oil|evening primrose|elderberry|apple cider vinegar|ashwagandha|maximum keto|biotin softgels|vitamin c \+|variety stick pack|variety pack)\b|reusable compact|\*empty\*/i;

const WAVE54_SKIP =
  /\b(soap dish|tallow soap set|lanolin baby collection|golden hour collection|don'?t-know-what-to-get|everyday essentials|summer sun bundle|gift card|pure-fume|travel sized|satin body spray|tallow candle|sensitive skin rescue set|ultimate facial trio|gift box|haircare bar duos|skin hydration duo|eczema care trio|skin repair duo|oat bath soak|epsom salts|kawakawa duo gift|pamper gift|dream gift|refresh gift|mum and baby gift|adventure gift|room and pillow mist|bugs away|bug off|holiday kickoff|newsletter|refillable bottle|laundry detergent|dishwasher|glass cleaner|surface cleaner|fruit and veggie|dish soap|stain remover|wax melts|essential oil|copper peptide|multi-stick|eyeliner|mascara|skin tint|lip plumping|lash and brow|cosmetics bag|skin care bag|amber bottle|white pump|short 8oz|long 8oz|back office fee|starter kit|starter set|routine set|daily routine set|skin care set|hair care set|home set|home starter|favorites starter|bff set|lash duo|contour set|master blaster|neem-o|hands on the go|boo boo stick|headache stick|face & body bundle|everyday bundle|oral care reset bundle|father'?s day|balm making session|perfume balm|lip balm 4 pack|dream cream trio)\b|serum \+|cleanser and moisturizer \+|collagen peptides \+|night serum \+|face moisturizer \+|body lotion \+/i;

const WAVE51_SKIP =
  /\b(beeswax candle|all purpose seasoning|problem skin pack|detox tea|elderberry syrup|fire cider|am \+ pm ritual|ritual set|skincare duo|bamboo deodorant|digital gift card|scented room|lather collection|foaming hand soap|soap bits|sisal soap|soap saver pouch|talavera soap dish|soap dish|premium bottle|intro bottle|intro pack|discovery pack|sample pack|variety pack|3 pack \| sugar|24 pack -|gift with|100% off|garage originals soap bundle|gentleman soap bundle|starter pack gift|3 bar handmade|snapback hat|trucker hat|graphic t-shirt|raise the bar|aloha clean|sisal soap saver|wooden soap dish|wooden soap saver|beach trio|renewal duo|collagen boost xl|glow duo|hair repair duo|men'?s duo|anti-aging ritual|starter kit|tallow and honey gift|mixed berry\s+ws|orange lemon\s+ws|variety pouch ws|microfiber towel|stainless steel water|pos counter|display box|variety pouch|variety pack)\b/i;

const WAVE50_SKIP =
  /\b(milk bath|glass dipper|soap sack|balm bindle|sudsy soap sale|get moist|plant one on me|become a nurturer|sponsorship|crew neck|massage gun|luffa|cork case|try me|cold shipping upgrade|spray applicator|silicone facial|mystery skincare|cln-scents|sunday skin|midnight psalm|upper room|the veil|naturally[- ]derived perfume|laundry bundle|complete hair restore|better sleep roller|tinted beauty balm|eye cream applicator|soft eye pad|jade roller|gift wraping|gift wrapping|christmas collection|white christmas|wooden box|infused honeys?|wild vinegar|herbal shrub|aromatic infusion|custom\*?\s*natural deodorant|\*custom\*|route package|functional pre-workout|health first bundle|danny'?s favorites|1 vanilla \+ 1 chocolate|face discovery|hair \+ body routine|travel essentials|herbal rituals|self care pack|love your skin|beard & hair|go pink|thyme to balance|pop box|the lazy girl|the complete morning|the summer glow|sun smart skincare set|sweet dreams skincare duo|the serum suite|the summer series|ultimate spa night|be hydrated regimen|be clear regimen|be calm regimen|be bright regimen|barrier builders|un-tinted spf \+|hot girl walks|collegiate crew|let god carry|nourish mii kit|starter box|starter kit|wash-day pair|2-step face reset|deodorant discovery|bar soap \d+-pack|men'?s 5 bar|2 lb country|retreat collection|honey collection|fit crew|whatnot simple|wn spring bundle|love & lux|halloween bundle|yuletide|evening star|country christmas|winter solstice|silicon s|microfiber towel|detangling brush|triple bond repair|original face serum gift|make skincare clean again|make america healthy|camouflage trucker|the cln on the go|the acne solution|regimen \(full|regimen \(travel|soap on a rope)\b/i;

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

function looksLikeMarketing(raw) {
  return /\b(why tallow|the no list|quantity variant|add to cart|subscription|deferred|nourish and protect without|if you wouldn|if you can.?t pronounce|versatile tallow|sourcing our|lightly scented with|not recommended for pregnant|see our page on essential oils|contains essential oils some essential|handcrafted the way your grandmother|tallow has been used for centuries|the process of turning beef tallow|mirrors our skin'?s natural)\b/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 24) return false;
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc/i.test(raw)) {
    return true;
  }
  if (parts.length >= 2 && /tallow|oil|wax|butter|zinc|beeswax/i.test(raw) && /,/.test(raw)) return true;
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
  const markerRe =
    /(?:base\s+ingredients?(?:\s*\([^)]*\))?|key\s+ingredients?|(?:full\s+)?ingredients?|inci(?:\s+list)?|composition)\s*[:\-–]\s*([^\n]{12,1500})/gi;
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
    ["sunscreen", /\b(spf|sunscreen|sun\s?screen|sunblock|sun butter|sun paste|sunpaste|sunbalm|sun[- ]?balm|sunguard|sun protection|sun stick|sun lotion|sun cream|after[- ]?sun|sun protectant|mineral defense|zinc stick|tinted zinc|mineral zinc|surfscreen)\b/],
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
  if (brand?.slug === "elektra") return "electrolytes";
  if (brand?.slug === "primals") {
    if (/\b(toothpaste|toothbrush|tongue|oral|tablet)\b/.test(t)) return "oral";
    if (/\b(shampoo|conditioner|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "papr") return "deodorant";
  if (brand?.slug === "tallowhead") {
    if (/\b(sunscreen|spf|zinc)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\bbeard\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "mill-creek-tallow") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|beard)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "xotic-mushrooms") return "supplements";
  if (brand?.slug === "dr-brite") return "oral";
  if (brand?.slug === "humble-goat") return "protein";
  if (brand?.slug === "short-story") return "electrolytes";
  if (brand?.slug === "live-kaizen") {
    if (/\b(coffee|mushroom)\b/.test(t) && !/electrolyt|hydrat/.test(t)) return "supplements";
    return "electrolytes";
  }
  if (brand?.slug === "archwood") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "essential-toothpaste") return "oral";
  if (brand?.slug === "heavenly-tallow") {
    if (/\b(sun shade|sun cream|mineral 50|zinc)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "papabear") {
    if (/\b(sunblock|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(tooth powder|mouthwash|oral)\b/.test(t)) return "oral";
    if (/\b(beard|shampoo)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "hands-organic") {
    if (/\b(deodorant|deo detox|underarm)\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "hydee") {
    if (/\bcreatine\b/.test(t) && !/electrolyt/.test(t)) return "supplements";
    return "electrolytes";
  }
  if (brand?.slug === "encompass-farming") {
    if (/\b(lion'?s mane|reishi|cordyceps|turkey tail|extract)\b/.test(t)) return "supplements";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "restore-oral") return "oral";
  if (brand?.slug === "origen") return "electrolytes";
  if (brand?.slug === "fresh-harvest") return "supplements";
  if (brand?.slug === "tallow-spot") {
    if (/\b(sun cream|sun stick|sun cream \+|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(dry shampoo|frizz|hair growth|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "prairie-soap") return "skincare";
  if (brand?.slug === "stop-oral") return "oral";
  if (brand?.slug === "palm-pine") return "sunscreen";
  if (brand?.slug === "healthyderm") {
    if (/\b(spf|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "tallow-me-now") return "skincare";
  if (brand?.slug === "little-tallow-co") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|hair|scalp|bear tallow treatment)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "simply-fuel") return "protein";
  if (brand?.slug === "hydrojoy" || brand?.slug === "bodyflow") return "electrolytes";
  if (brand?.slug === "wonder-oral") return "oral";
  if (brand?.slug === "rain-valley") {
    if (/\b(sun stick|sun cream|sun protection|zinc)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "candid-naturals") {
    if (/\b(mineral stick|sun stick|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(hair mist|skin & hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "simply-tallow") {
    if (/\bdeodorant|armpit detox\b/.test(t)) return "deodorant";
    if (/\bbeard\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "nutristrength") return "protein";
  if (brand?.slug === "zeal") {
    if (/electrolyt|hydration|hydra/.test(t) && !/\bcapsule\b/.test(t)) return "electrolytes";
    return "supplements";
  }
  if (brand?.slug === "oh-gigi") return "oral";
  if (brand?.slug === "weluxia") {
    if (/\b(castor oil|skin)\b/.test(t)) return "skincare";
    if (/\b(toxin binder|pearl powder|supplement)\b/.test(t)) return "supplements";
    return "oral";
  }
  if (brand?.slug === "starling") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "pravi") {
    if (/\b(whey|protein)\b/.test(t)) return "protein";
    if (/\b(electrolyt|hydrate)\b/.test(t)) return "electrolytes";
    return "supplements";
  }
  if (brand?.slug === "hidrate-808") return "electrolytes";
  if (brand?.slug === "surfyogis") return "sunscreen";
  if (brand?.slug === "marroomi") return "skincare";
  if (brand?.slug === "tallow-company") {
    if (/\b(hair|beard)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "carolina-tallow") return "skincare";
  if (brand?.slug === "thrive-made-simple") {
    if (/\b(tooth powder|toothbrush|tongue scraper|oral)\b/.test(t)) return "oral";
    return "skincare";
  }
  if (brand?.slug === "purely-tallow") {
    if (/\b(sunscreen|spf|zinc|sun)\b/.test(t)) return "sunscreen";
    if (/\b(hair|beard|aftershave|after shave)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "frankie-apothecary") {
    if (/\b(spf|sun defence|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(shampoo|conditioner|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "zoes-kawakawa") {
    if (/\b(aftershave|beard)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "pure-haven") {
    if (/\b(sunstick|after sun|after-sun|mineral sun)\b/.test(t)) return "sunscreen";
    if (/\b(toothpaste|oral)\b/.test(t)) return "oral";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(collagen peptides|beauty booster)\b/.test(t)) return "supplements";
    if (/\b(shampoo|conditioner|hair|scalp|detangler|dry shampoo|texturizing|styling cream|sea salt spray|curl enhancing)\b/.test(t)) {
      return "hair";
    }
    return "skincare";
  }
  if (brand?.slug === "dakota-tallow") {
    if (/\b(after sun|sunscreen|spf|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(tooth powder|toothpaste|oral)\b/.test(t)) return "oral";
    return "skincare";
  }
  if (brand?.slug === "black-ivy-apothecary") {
    if (/\b(sun cream|sunscreen|spf|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(tincture|magnesium oil)\b/.test(t)) return "supplements";
    return "skincare";
  }
  if (brand?.slug === "sun-and-honey") {
    if (/\b(sunscreen|spf|zinc)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "harley-and-quinn") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|beard|strand theory)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "vaya" || brand?.slug === "net-hydrate") return "electrolytes";
  if (brand?.slug === "garage-brand-soap") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "tallow-and-honey") {
    if (/\b(solar bee|sun balm|sunscreen|spf|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(hair|mane bee|bee silky|bee smooth)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "vellum-st") {
    if (/\b(sun cream|sunscreen|spf|zinc)\b/.test(t)) return "sunscreen";
    if (/\bshampoo\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "tyme-soap") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|scalp|leave[- ]?in|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "nourish-mii") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(hair|scalp)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "kono-nutrition") {
    if (/\b(whey|beef protein)\b/.test(t)) return "protein";
    if (/\bhydrate\b/.test(t)) return "electrolytes";
    return "supplements";
  }
  if (brand?.slug === "solidu") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/kiss/.test(t)) return "skincare";
    if (/\b(face cleanser|clay face mask|calmendula|calm-endula|rock your body|foampop|creampop|silkpop)\b/.test(t)) {
      return "skincare";
    }
    if (/\b(shampoo|conditioner|hair|beard|exotic|pink|grandma said|no knots|hair candy|it'?s thyme|balance|neemph|ghaya|kerai|hair drops)\b/.test(t)) {
      return "hair";
    }
    return "hair";
  }
  if (brand?.slug === "home-body-field-goods") {
    if (/\b(tooth powder|toothpaste)\b/.test(t)) return "oral";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(hair|scalp|shampoo)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "cln-and-drty") {
    if (/\b(spf|sunscreen|cln-screen|sol-mate|zinc oxide lip)\b/.test(t)) return "sunscreen";
    if (/\bdeo\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "velvet-cow") {
    if (/\b(sun cream|sunscreen|zinc|spf)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(beard|after shave|aftershave)\b/.test(t)) return "hair";
    if (/\bmagnesium (magic )?spray\b/.test(t)) return "supplements";
    return "skincare";
  }
  if (brand?.slug === "surfing-cow") {
    if (/\b(sun balm|mineral tallow sun)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "solrx") return "sunscreen";
  if (brand?.slug === "plan-d") return "electrolytes";
  if (brand?.slug === "wildflower-tallow") return "skincare";
  if (brand?.slug === "forah") {
    if (/\b(spf|sunscreen|sun milk|surf balm|zinc)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "neptune-health") {
    if (/\b(spf|sunscreen|sun balm|mineral spray)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "field-flower-tallow") {
    if (/\b(sun barrier|spf|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "holycow") {
    if (/\b(shampoo|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "sote") {
    if (/\bcreatine\b/.test(t)) return "supplements";
    return "electrolytes";
  }
  if (brand?.slug === "himalayan-hydration") return "electrolytes";
  if (brand?.slug === "amallow") {
    if (/\b(sun balm|spf|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(dry shampoo|shampoo)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "dersie") {
    if (/\b(spf|sunscreen|sun balm|zinc)\b/.test(t)) return "sunscreen";
    if (/\b(shampoo|conditioner|batana|rice water hair|hair)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "cooki-haircare") {
    if (/\b(shampoo|conditioner|hair (mask|oil)|hinu)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "wayward-chickadee") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|beard)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "salty-hydration") return "electrolytes";
  if (brand?.slug === "honeysuckle-rose") {
    if (/\b(sun shield|spf|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "tallowed-and-free") {
    if (/\b(shampoo|hair oil|hair growth)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "laro-london") return "oral";
  if (brand?.slug === "cove-suncare" || brand?.slug === "skinmetal") return "sunscreen";
  if (brand?.slug === "ancient-nature") {
    if (/\b(sun balm|spf|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "allnat") return "skincare";
  if (brand?.slug === "drgn-salt" || brand?.slug === "electrolete") return "electrolytes";
  if (brand?.slug === "protein-b") return "protein";
  if (brand?.slug === "kind2") return "hair";
  if (brand?.slug === "soapwalla") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "halo-toothpaste") return "oral";
  if (brand?.slug === "tallowshine") {
    if (/\b(sun shield|spf|sunscreen|zinc)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "magsol") return "deodorant";
  if (brand?.slug === "saltivate") return "electrolytes";
  if (brand?.slug === "vaer-skin") return "skincare";
  if (brand?.slug === "wicked-protein") return "protein";
  if (brand?.slug === "wander-wash") {
    if (/\bdeodorant\b/.test(t) || /\bstick\b/.test(t) && /\b(purple|desert|teal|green|yellow|red|blue)\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|beard)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "primal-basics") {
    if (/\b(toothpaste|hydroxyapatite|n[- ]?ha)\b/.test(t)) return "oral";
    return "skincare";
  }
  if (brand?.slug === "sun-zapper" || brand?.slug === "reef-safe-australia") return "sunscreen";
  if (brand?.slug === "thallo") {
    if (/\b(zinc|outdoor stick|sun)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "naturalcare-nz") {
    if (/\b(shampoo|conditioner|hair|scalp|leave[- ]?in)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "stone-and-spear") {
    if (/\b(sun balm|sun lip)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|scalp|beard|pomade|hair|baby shampoo)\b/.test(t)) return "hair";
    if (/\b(toothpaste|tooth powder)\b/.test(t)) return "oral";
    return "skincare";
  }
  if (brand?.slug === "friendly-soap") {
    if (/\bshampoo\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "good-intentions" || brand?.slug === "elation-hydration") return "electrolytes";
  if (brand?.slug === "farmbody") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|conditioner|beard|hair)\b/.test(t)) return "hair";
    if (/\bafter[- ]?sun\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "pure-choice-farms") {
    if (/\b(whey|protein)\b/.test(t)) return "protein";
    return "supplements";
  }
  if (brand?.slug === "peg-paste") return "oral";
  if (brand?.slug === "sunkissed-by-heaven") {
    if (/\b(spf|sunscreen|sunblock)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "grass-fed-beauty") {
    if (/\bsun balm\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "tallowl") return "skincare";
  if (brand?.slug === "hallowed-homestead") {
    if (/\b(summer balm|sun block|sunblock)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "desert-light-farm") {
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "kruger-farm") {
    if (/\b(sunblock|spf|sunscreen)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "gaia-organics-tallow") {
    if (/\b(sunblock|spf|sunscreen)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "luxe-tallow") {
    if (/\b(sun stick|sun balm|solar)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "kris-organics") {
    if (/\b(sun block|sunblock|suncare)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    if (/\b(shampoo|shave bar|beard)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "ceelike") return "oral";
  if (brand?.slug === "danyelli-laurette") {
    if (/\b(shampoo|conditioner|masque bar|zen combo)\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "tiffs-tallow") {
    if (/\b(mineral barrier|fun in the sun|sun ritual)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "wild-prairie" && /\b(zinc|sun balm)\b/.test(t)) return "sunscreen";
  if (brand?.slug === "tallow-and-bloom") {
    if (/\bsun balm\b/.test(t)) return "sunscreen";
    if (/\bbeard\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "pasture-and-posies") {
    if (/\b(sun stick|sun shield)\b/.test(t)) return "sunscreen";
    if (/\bdeodorant\b/.test(t)) return "deodorant";
    return "skincare";
  }
  if (brand?.slug === "bloom-tallow" && /\bdeodorant\b/.test(t)) return "deodorant";
  if (brand?.slug === "bloom-and-branch") {
    if (/\b(sunblock|zinc)\b/.test(t)) return "sunscreen";
    if (/\bbeard\b/.test(t)) return "hair";
    return "skincare";
  }
  if (brand?.slug === "soulful-bloom") {
    if (/\bnatural sun\b/.test(t)) return "sunscreen";
    return "skincare";
  }
  if (brand?.slug === "farm-to-skin") {
    if (/\b(sun prime|zinc oxide)\b/.test(t)) return "sunscreen";
    return "skincare";
  }
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
  if (/\bhydrosol\b/.test(t)) return "skincare";
  if (/\b(shampoo|conditioner|hair (oil|mask|serum|cleanser|gummies|spritz)|scalp|curl (cleanser|cream|conditioner)|protein booster|oil blend|dry shampoo|active bar)\b/.test(t) && !/\blip\b/.test(t)) {
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
    SKIP_TITLE.test(title) ||
    SKIP_TITLE_EXTRA.test(title) ||
    WAVE59_EXTRA.test(title) ||
    WAVE58_EXTRA.test(title) ||
    WAVE57_EXTRA.test(title) ||
    WAVE56_EXTRA.test(title) ||
    WAVE55_EXTRA.test(title) ||
    WAVE54_SKIP.test(title) ||
    WAVE54_EXTRA.test(title) ||
    WAVE51_SKIP.test(title) ||
    WAVE50_SKIP.test(title) ||
    SKIP_TYPE.test(type) ||
    SKIP_TAGS.test(tags);
  if (WAVE59_EXTRA.test(title) || WAVE58_EXTRA.test(title) || WAVE57_EXTRA.test(title) || WAVE56_EXTRA.test(title) || WAVE54_SKIP.test(title) || WAVE54_EXTRA.test(title)) return false;
  if (brand.slug === "elektra" && /\b(starter pack|full tub|elektra|berry splash)\b/i.test(title) && !WAVE59_EXTRA.test(title)) {
    return true;
  }
  if (brand.slug === "primals" && /\b(toothpaste tablets|tongue scraper|bamboo toothbrush|shampoo|conditioner|body wash|body lotion)\b/i.test(title) && !WAVE59_EXTRA.test(title) && !/\b(electric|guide|shower|air pod|boxers|glasses|wool)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "papr" && !/\bbundle\b/i.test(title) && !WAVE59_EXTRA.test(title)) {
    return true;
  }
  if (brand.slug === "tallowhead" && /\b(sunscreen|deodorant|balm|cleanser|cream|lip|beard)\b/i.test(title) && !WAVE59_EXTRA.test(title) && !/\b(gift card|bundle)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "mill-creek-tallow" && /\b(tallow|deodorant|shampoo|soap|lip|beard|rosanera)\b/i.test(title) && !WAVE59_EXTRA.test(title) && !/\b(bath salt|bug off|tray|saver|pet)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "xotic-mushrooms" && /\b(lion'?s mane|reishi|cordyceps|extract)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "dr-brite" && /\b(toothpaste|mouthwash|mint|chai|kids|berry)\b/i.test(title) && !WAVE58_EXTRA.test(title) && !/\b(pen|sore gums|spray for kids|lorem)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "humble-goat" && /\bwhey|protein\b/i.test(title) && !/\bsubscription\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "short-story" && /\b(intro|daily|servings|electrolyt|lemon)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "live-kaizen" && /\b(electrolyte|hydrat|mushroom coffee)\b/i.test(title) && !WAVE58_EXTRA.test(title) && !/\b(frother|bottle|sweatshirt|sample)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "archwood" && /\b(deodorant|shampoo|conditioner|serum|soap|lotion|lip balm|cleanser|mask|cream|wash|scrub|oil|facial)\b/i.test(title) && !WAVE58_EXTRA.test(title) && !/\b(bug|tray|gloss|spicule)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "papabear" && /\b(5 pack|2 pack|bundle|kit|gift card|pet |laundry|candle|popcorn|chips?|honey|cooking tallow)\b/i.test(title)) return false;
  if (brand.slug === "encompass-farming" && /\b(x2 qty|laundry|candle|bundle|gift|alchemical|free )\b/i.test(title)) return false;
  if (brand.slug === "essential-toothpaste" && /\b(tabs|toothpaste|toothbrush|hydroxyapatite)\b/i.test(title) && !WAVE57_EXTRA.test(title) && !/\b(explorer|195|5 bamboo|3 month)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "heavenly-tallow" && /\b(tallow|sun shade|soap|lip)\b/i.test(title) && !WAVE57_EXTRA.test(title) && !/\b(foundation|blush|bronze|bug|cbd)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "papabear" && /\b(tallow|sunblock|deodorant|tooth powder|mouthwash|beard|soap|serum|balm|body wash|face wash|eye cream|lip)\b/i.test(title) && !WAVE57_EXTRA.test(title) && !/\b(bundle|kit|gift|pet|laundry|candle|popcorn|chip|honey|cooking|veggie|5 pack)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "hands-organic" && /\b(deodorant|deo|serum|moisturizer|cleanser|balm|salve|hydrosol|lip balm|face polish|body powder)\b/i.test(title) && !WAVE57_EXTRA.test(title) && !/\b(perfume|gloss|spoon|mask set)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "hydee" && /\b(electrolyt|creatine)\b/i.test(title) && !WAVE57_EXTRA.test(title) && !/\b(bundle|oats|bottle|gift)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "encompass-farming" && /\b(lion'?s mane|reishi|cordyceps|turkey tail|deodorant|tallow|soap|lip|oil)\b/i.test(title) && !WAVE57_EXTRA.test(title) && !/\b(laundry|candle|bundle|gift|alchemical|free )\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "restore-oral" && /\b(toothpaste|hydroxyapatite)\b/i.test(title) && !/\b(duo|bundle|kit)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "origen" && /\b(electrolyt|seawater|7-day)\b/i.test(title) && !WAVE56_EXTRA.test(title)) {
    return true;
  }
  if (brand.slug === "fresh-harvest" && /\b(lion'?s mane|reishi|cordyceps)\b/i.test(title) && !/\b(bundle|microgreen|beet)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tallow-spot" && /\b(tallow|sun cream|sun stick|dry shampoo|frizz|lip|lotion|soap|glow|hydrosol|magnesium oil|tush|hair)\b/i.test(title) && !WAVE56_EXTRA.test(title)) {
    return true;
  }
  if (brand.slug === "prairie-soap" && /\b(tallow|lotion|soap|lip)\b/i.test(title) && !/\b(wholesale|mystery|gift|merch|tote|hat|bundle|kit|dish)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "wonder-oral" && /\b(tooth powder|toothbrush|tongue clean|floss)\b/i.test(title) && !/\b(kit|bundle|ebook|book|strip|tape|gift)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "rain-valley" && /\b(tallow|hydrosol|sun stick|sun cream|lip)\b/i.test(title)) return true;
  if (brand.slug === "candid-naturals" && /\b(mineral stick|tallow|serum|mist|mask|magnesium body|body elixir)\b/i.test(title) && !/\b(set|palette|compact|foundation|concealer|mascara|blush|bronzer|eyeshadow|primer|brow|multistick|highlight)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "simply-tallow" && /\b(tallow|deodorant|soap|lip|beard|serum|tonic|sugar scrub|armpit detox|vanilla bean)\b/i.test(title) && !/\b(bundle|beanie|sticker|gua sha|cupping|soap saver|gift)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "nutristrength" && /\b(whey|pea protein|protein)\b/i.test(title) && !/\bshaker\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "zeal" && /\b(electrolyte|hydration|collagen peptides|creatine|magnesium|probiotic gummies|sbo probiotic)\b/i.test(title) && !/\b(bottle|hydrapak|fat burner|saw palmetto|nitric|krill|primrose|biotin|elderberry|apple cider|ashwagandha|keto|vitamin c)\b/i.test(title)) {
    return true;
  }
  if (skipped) {
    const keepDespiteEssentialOil =
      /\b(tallow|deodorant|toothpaste|tooth powder|whey|protein|sun butter|zinc balm|body butter|hair oil|facewash|face wash|face oil)\b/i.test(title) &&
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
    const keepSaltivate =
      brand.slug === "saltivate" &&
      /electrolyt/i.test(title) &&
      !/\b(wholesale|case of)\b/i.test(title);
    const keepGarageSoap =
      brand.slug === "garage-brand-soap" &&
      /\b(soap|deodorant)\b/i.test(title) &&
      !/\b(bundle|gift|hat|tee|shirt|dish|sisal|starter pack)\b/i.test(title);
    const keepDakotaScrub =
      brand.slug === "dakota-tallow" &&
      /\b(sugar scrub|oil cleansing|exfoliator)\b/i.test(title);
    const keepThrivePouch =
      brand.slug === "thrive-made-simple" &&
      /\b(tooth powder|hydroxyapatite)\b/i.test(title) &&
      /\bpouch\b/i.test(title);
    const keepFrankieCleanser =
      brand.slug === "frankie-apothecary" &&
      /\boil cleanser\b/i.test(title);
    const keepPurelyAftershave =
      brand.slug === "purely-tallow" &&
      /\baftershave\b/i.test(title);
    const keepHidratePouch =
      brand.slug === "hidrate-808" &&
      /\b(passion orange|liliko|li hing|electro mango|coconut lime)\b/i.test(title);
    const keepOhGigiOral =
      brand.slug === "oh-gigi" &&
      /\b(tooth powder|hydroxyapatite|oil pull|toothbrush|tongue)\b/i.test(title) &&
      !/\b(kit|ritual|dish|gua sha|mouth tape)\b/i.test(title);
    const keepCarolinaTin =
      brand.slug === "carolina-tallow" &&
      /\btravel tin\b/i.test(title) &&
      /\btallow\b/i.test(title);
    if (
      !keepDespiteEssentialOil &&
      !keepSample &&
      !keepTallowAftershave &&
      !keepProteinBag &&
      !keepSunmudTin &&
      !keepSaltivate &&
      !keepGarageSoap &&
      !keepDakotaScrub &&
      !keepThrivePouch &&
      !keepFrankieCleanser &&
      !keepPurelyAftershave &&
      !keepHidratePouch &&
      !keepOhGigiOral &&
      !keepCarolinaTin
    ) {
      return false;
    }
  }
  if (brand.slug === "oh-gigi") {
    return (
      /\b(tooth powder|toothbrush|oil pull|tongue (scraper|cleaner)|hydroxyapatite|brushpods)\b/i.test(hay) &&
      !WAVE54_EXTRA.test(title) &&
      !/\b(kit|ritual|duo|bundle|dish|gua sha|mouth tape|gift)\b/i.test(title)
    );
  }
  if (brand.slug === "weluxia") {
    return (
      /\b(tooth|oil pull|mouthwash|gum|miswak|hydroxyapatite|toothbrush|tongue|castor|toxin)\b/i.test(hay) &&
      !WAVE54_EXTRA.test(title) &&
      !/\b(kit|trio set|spatula|syringe|holder|cup|spoon)\b/i.test(title)
    );
  }
  if (brand.slug === "starling") {
    return (
      /\b(deodorant|serum|cream|oil|cleanser|balm|lip mask|squalane|bakuchiol)\b/i.test(hay) &&
      !WAVE54_EXTRA.test(title) &&
      !/\b(set|consultation|gua sha|roller|soak)\b/i.test(title)
    );
  }
  if (brand.slug === "pravi") {
    return (
      /\b(whey|protein|electrolyt|hydrate|creatine)\b/i.test(hay) &&
      !WAVE54_EXTRA.test(title) &&
      !/\b(bundle|bottle|hoodie|tee|snapback|bag|gift)\b/i.test(title)
    );
  }
  if (brand.slug === "hidrate-808") {
    return /\b(pouch|passion orange|liliko|li hing|electro mango|coconut lime)\b/i.test(hay);
  }
  if (brand.slug === "surfyogis") {
    return /\b(surfscreen|zinc)\b/i.test(hay) && !/\b(bundle|hat|try me)\b/i.test(title);
  }
  if (brand.slug === "marroomi") {
    return (
      /\b(tallow|lip balm|moisturizer)\b/i.test(hay) &&
      !WAVE54_EXTRA.test(title) &&
      !/\b(trio|collection|duo|bundle|shipping|b[áa]lsamo)\b/i.test(title)
    );
  }
  if (brand.slug === "tallow-company") {
    return /\b(tallow|chapstick|soap|balm)\b/i.test(hay);
  }
  if (brand.slug === "carolina-tallow") {
    return (
      /\b(tallow|soap|lip|balm)\b/i.test(hay) &&
      !/\b(gift card|soap saver|variety pack)\b/i.test(title)
    );
  }
  if (brand.slug === "thrive-made-simple") {
    if (/^hydroxyapatite tooth powder$/i.test(title)) return false;
    if (/^tooth powder refill pouch/i.test(title) && !/minty|unflavou?red/i.test(title)) {
      return false;
    }
    return (
      /\b(tooth powder|toothbrush|tongue scraper|tallow)\b/i.test(hay) &&
      !WAVE54_SKIP.test(title) &&
      !/\bbundle\b/i.test(title)
    );
  }
  if (brand.slug === "purely-tallow") {
    return (
      /\b(tallow|sunscreen|lotion|balm|lip|oil cleanser|overnight mask|salt scrub|aftershave|hair|soap|baby)\b/i.test(
        hay,
      ) &&
      !WAVE54_SKIP.test(title) &&
      !/\b(set|collection|bundle|candle|perfume|dish|travel sized|pure-fume)\b/i.test(title)
    );
  }
  if (brand.slug === "frankie-apothecary") {
    return (
      /\b(kawakawa|kumarahou|kūmarahou|spf|sun defence|shampoo|conditioner|serum|facial oil|cleanser|lip|belly|balm)\b/i.test(
        hay,
      ) &&
      !WAVE54_SKIP.test(title) &&
      !/\b(set|duo|trio|gift|soak|epsom)\b/i.test(title)
    );
  }
  if (brand.slug === "zoes-kawakawa") {
    return (
      /\b(balm|lip|mist|aftershave|beard|lanolin)\b/i.test(hay) &&
      !WAVE54_SKIP.test(title) &&
      !/\b(gift|bugs away|room and pillow|pillow mist)\b/i.test(title)
    );
  }
  if (brand.slug === "pure-haven") {
    if (/\btrio\b|4 pack|\bset\b|\bduo\b|\s\+\s/i.test(title)) return false;
    if (/\b(laundry|dishwasher|glass cleaner|surface cleaner|dish soap|fruit and veggie|stain|wax melt|essential oil|copper peptide|multi-stick|eyeliner|mascara|skin tint|lip plumping|lash|bag|pump|bottle|newsletter|holiday|bug off|neem-o|hands on the go|boo boo|headache stick|room spray|hand soap|starter|routine)\b/i.test(title)) {
      return false;
    }
    return /\b(toothpaste|deodorant|shampoo|conditioner|after sun|sunstick|serum|moisturizer|cleanser|toner|lotion|cream|oil|balm|scrub|mask|body wash|body butter|lip balm|dry shampoo|scalp|detangler|hair|magnesium|blemish|exfoliator|shave|bar soap|baby|mom balm|dream cream|comfort oil|argan|hyaluronic|collagen peptides)\b/i.test(
      hay,
    );
  }
  if (brand.slug === "dakota-tallow") {
    return (
      /\b(tallow|facial|cream|butter|balm|lip|tooth powder|after sun|eczema|belly|diaper|lotion|exfoliator|sugar scrub|shea)\b/i.test(
        hay,
      ) && !WAVE51_SKIP.test(title) && !/\b(candle|seasoning|gift card)\b/i.test(title)
    );
  }
  if (brand.slug === "black-ivy-apothecary") {
    return (
      /\b(sun cream|sunscreen|spf|face cream|balm|serum|toner|oil|cleanser|magnesium|tincture|elixir)\b/i.test(
        hay,
      ) && !WAVE51_SKIP.test(title) && !/\b(tea|elderberry|fire cider)\b/i.test(title)
    );
  }
  if (brand.slug === "sun-and-honey") {
    return (
      /\b(sunscreen|spf|restoration balm|tallow)\b/i.test(hay) &&
      !WAVE51_SKIP.test(title) &&
      !/\b(duo|ritual|set)\b/i.test(title)
    );
  }
  if (brand.slug === "harley-and-quinn") {
    return (
      /\b(soap|shampoo|conditioner|deodorant|beard|creme|cream|lotion|lip|magnesium|body milk|repair balm|whipped soap|soap drops|strand theory)\b/i.test(
        hay,
      ) &&
      !WAVE51_SKIP.test(title) &&
      !/\b(dish|applicator|gift card|room spray|hand soap|sisal|bits)\b/i.test(title)
    );
  }
  if (brand.slug === "vaya") {
    return (
      /\b(electrolyte|watermelon|lemon lime|raspberry|grape)\b/i.test(hay) &&
      !WAVE51_SKIP.test(title) &&
      !/\b(bottle|intro|discovery|sample|variety|3 pack|24 pack|100% off)\b/i.test(title)
    );
  }
  if (brand.slug === "garage-brand-soap") {
    return (
      /\b(soap|deodorant)\b/i.test(hay) &&
      !WAVE51_SKIP.test(title) &&
      !/\b(bundle|gift|hat|tee|shirt|dish|sisal|starter pack)\b/i.test(title)
    );
  }
  if (brand.slug === "tallow-and-honey") {
    return (
      /\b(bee|tallow|serum|toner|lip|sun balm|hair)\b/i.test(hay) &&
      !WAVE51_SKIP.test(title) &&
      !/\b(duo|trio|bundle|ritual|starter kit|gift card)\b/i.test(title)
    );
  }
  if (brand.slug === "net-hydrate") {
    return (
      /\b(mixed berry|orange lemon)\b/i.test(title) &&
      !/\b(ws|towel|bottle|display|variety|pouch)\b/i.test(title)
    );
  }
  if (brand.slug === "vellum-st") {
    return (
      /\b(tallow|lard|sun cream|soap|balm|fluff|shampoo|lip|hog wash|oink ment|fat marshmallow|roygbvb|wyebrook|triple c)\b/i.test(
        hay,
      ) && !WAVE50_SKIP.test(title)
    );
  }
  if (brand.slug === "tyme-soap") {
    return (
      /\b(bar|soap|deodorant|shampoo|conditioner|lotion|tallow|toner|lip|serum|scalp|body wash|leave[- ]?in|cleansing scrub|skin conditioning)\b/i.test(
        hay,
      ) && !WAVE50_SKIP.test(title) && !/\b(laundry|bundle|collection|kit|system|roller|brush|comb|bonnet|pillowcase|towel)\b/i.test(title)
    );
  }
  if (brand.slug === "nourish-mii") {
    return (
      /\b(deodorant|hair|scalp|lip|body butter|shea)\b/i.test(hay) &&
      !WAVE50_SKIP.test(title) &&
      !/\b(sponsorship|kit)\b/i.test(title)
    );
  }
  if (brand.slug === "kono-nutrition") {
    return (
      /\b(whey|hydrate|mag-mend|magnesium|beef protein|astaxanthin|vitamin d)\b/i.test(hay) &&
      !WAVE50_SKIP.test(title) &&
      !/\b(pre-workout|e-?book|crew|hat|tee|frother|gift card|protection|bundle|sample|favorites)\b/i.test(title)
    );
  }
  if (brand.slug === "solidu") {
    return (
      /\b(deodorant|face cleanser|clay face mask|calmendula|calm-endula|rock your body|foampop|creampop|silkpop|exotic|pink|grandma said|no knots|hair candy|it'?s thyme|balance|neemph|ghaya|kerai|hair drops|beard drops)\b|kiss/i.test(
        hay,
      ) &&
      !WAVE50_SKIP.test(title) &&
      !/\b(duo|routine|set|try me|luffa|cork|pack|ritual|travel|testers?)\b/i.test(title)
    );
  }
  if (brand.slug === "home-body-field-goods") {
    return (
      /\b(deodorant|tooth powder|hair|soap|face oil|face tonic|hydrosol|body butter|shaving|magnesium rub|mask|facewash|allover oil)\b/i.test(
        hay,
      ) &&
      !WAVE50_SKIP.test(title) &&
      !/\b(honey|vinegar|candle|herbal tea|tea blend|shrub|bath bomb|gift|custom|aromatic|bundle|kit)\b/i.test(title)
    );
  }
  if (brand.slug === "cln-and-drty") {
    if (/\bspf\s*\+\s*lip\b/i.test(title)) return false;
    return (
      /\b(cln-screen|sol-mate|spf|sunscreen|deo|serum|moisturizer|cleanser|toner|mask|cream|oil|lip balm|blemish|acne|miracle balm|core cream|cln wash|skin bluff|rosewater|freshly peeled|night shift|peace treaty|a-team|new romantic|clout stick|lull|glow|dew you|charcoal scrub|cancel culture|goodbye acne|kween)\b/i.test(
        hay,
      ) &&
      !WAVE50_SKIP.test(title) &&
      !/\b(hat|tee|tote|perfume|regimen|bundle|set|kit|bag|brush|applicator|mystery|crew|maha|cold shipping upgrade)\b/i.test(title)
    );
  }
  if (brand.slug === "velvet-cow") {
    if (
      /\b(gift card|bug repellent|shower steamer|bath soak|epsom)\b/i.test(title)
    ) {
      return false;
    }
    return /\b(deodorant|sun cream|zinc|tallow|lip balm|beard|face cream|body butter|sugar scrub|magnesium|restore balm|diaper cream)\b/i.test(
      title,
    );
  }
  if (brand.slug === "surfing-cow") {
    if (/\bbundle\b/i.test(title)) return false;
    return /\b(sun balm|moisturizer|whipped tallow)\b/i.test(title);
  }
  if (brand.slug === "solrx") {
    if (
      /\b(cap|carabiner|beach bag|bundle|refillable|continuous spray|waterblock|16oz|32oz|20 pack|bulk pump)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(mineral|zinc|aftersun|after-sun|lip ice)\b/i.test(title);
  }
  if (brand.slug === "plan-d") {
    if (/\b(bottle of water|sample pack|shipping|theft protection)\b/i.test(title)) {
      return false;
    }
    return /\b(strawberry|lemonade|hydrat|electrolyt|plan d)\b/i.test(title);
  }
  if (brand.slug === "wildflower-tallow") {
    if (/\b(bundle|cooking|epsom|soak|organic grass-fed tallow$)\b/i.test(title)) return false;
    if (/^organic grass-fed tallow$/i.test(title)) return false;
    return /\b(tallow cream|serum|lip balm|sugar scrub|whipped)\b/i.test(title);
  }
  if (brand.slug === "forah") {
    if (
      /\b(konjac|towel|discovery kit|mesh bag|everyday set|tote|zipper bag|gift card|accessories)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(spf|sunscreen|sun milk|surf balm|cleansing oil|serum)\b/i.test(title);
  }
  if (brand.slug === "neptune-health") {
    if (
      /\b(trinity|everything bundle|protectmyorder|protect my order|exfoliator|starter kit|buy \d|get \d free|ultimate moisture)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    if (/\bneptune grass fed tallow sunscreen\b/i.test(title)) return false;
    if (/\bneptune tallow & manuka honey balm\b/i.test(title) && !/lip/i.test(title)) return false;
    if (/\bgrass fed tallow & honey balm - usa small batch\b/i.test(title)) return false;
    if (/\bgrass fed tallow & manuka honey balm\b/i.test(title)) return false;
    return /\b(sunscreen|mineral spray|tallow balm|honey balm|magnesium|lip balm)\b/i.test(title);
  }
  if (brand.slug === "field-flower-tallow") {
    if (
      /\b(bundle|gift bag|gift card|imperfect|sampler|custom full|soap bundle)\b/i.test(title)
    ) {
      return false;
    }
    return /\b(deodorant|sun barrier|tallow|soap|lip balm|serum|balm|baby balm)\b/i.test(title);
  }
  if (brand.slug === "holycow") {
    if (/\b(sample size|sampler set|4 pack|large - 4oz|sample set)\b/i.test(title)) return false;
    return /\b(soap|tallow|lip balm|balm)\b/i.test(title);
  }
  if (brand.slug === "sote") {
    if (
      /\b(hat|hoodie|shorts|uniform|variety pack|gift card|bottle|sticker|dad hat|merino)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(electrolyt|creatine|salt of the earth)\b/i.test(title);
  }
  if (brand.slug === "himalayan-hydration") {
    if (/\b(mixed|sampler)\b/i.test(title)) return false;
    return /\b(hidrate|hydrat|berry|lemon|grapefruit)\b/i.test(title);
  }
  if (brand.slug === "amallow") {
    if (
      /\b(sampler|ritual|bundle|trio|candle|perfume|leather|t-?shirt|tee\b|gift card|egift|daily ritual|lauryn|everything tallow|on the go|pick your)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(deodorant|tallow|sun balm|dry shampoo|lip balm|soap|cleanser|serum|bum balm)\b/i.test(title);
  }
  if (brand.slug === "dersie") {
    if (/\b(pack of|ritual set|duo|shampoo and conditioner)\b/i.test(title)) return false;
    return /\b(sunscreen|spf|tallow|balm|magnesium cream|shampoo|conditioner|batana oil)\b/i.test(title) &&
      !/\bpack of\b/i.test(title);
  }
  if (brand.slug === "cooki-haircare") {
    if (
      /\b(jumbo|duo|bundle|starter|gift|tin drainage|travel tin|brush|comb|loofah|dish|saver|massager|build your own|pack for)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(shampoo bar|conditioner bar|hair mask|hair growth oil|hinu|hand & body soap|hand and body soap)\b/i.test(
      title,
    );
  }
  if (brand.slug === "wayward-chickadee") {
    if (
      /\b(pouch|candle|gift card|konjac|mosquito|black fly|soap saver|storage tin|soap.?shampoo dish|sample box|skincare set|washcloth|available september)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(shampoo|conditioner|deodorant|soap|serum|lip balm|hand balm|body balm|body wash)\b/i.test(title);
  }
  if (brand.slug === "salty-hydration") return /\b(electrolyt|hydrat|passion orange|mango|salty)\b/i.test(title);
  if (brand.slug === "honeysuckle-rose") {
    if (/\b(set|bundle|bug bite|tinted lip)\b/i.test(title)) return false;
    return /\b(sun shield|sunscreen|deodorant|tallow|serum|balm|cleansing oil|body butter|eye cream|lip balm)\b/i.test(
      title,
    );
  }
  if (brand.slug === "tallowed-and-free") {
    if (/\b(tote|candle|mist|senses)\b/i.test(title)) return false;
    return /\b(tallow|soap|shampoo|hair oil|lip balm|balm)\b/i.test(title);
  }
  if (brand.slug === "laro-london") {
    if (/\b(washbag|travel edit|signature edit|quarterly)\b/i.test(title)) return false;
    return /\b(toothpaste|mouthwash|mouth rinse|toothbrush)\b/i.test(title);
  }
  if (brand.slug === "cove-suncare") return /\bspf\b/i.test(title);
  if (brand.slug === "skinmetal") {
    if (/\b(retail|display|socks|shirt|keychain|hat|beanie|trucker|headband|double down)\b/i.test(title)) {
      return false;
    }
    return /\bspf\b/i.test(title);
  }
  if (brand.slug === "ancient-nature") {
    if (/\b(discovery trio|\btrio\b)\b/i.test(title)) return false;
    return true;
  }
  if (brand.slug === "allnat") {
    if (/\b(try it all|bestsellers set|try 2|bundle|set–|set -)\b/i.test(title)) return false;
    return true;
  }
  if (brand.slug === "drgn-salt") {
    if (/\b(hat|headband|starter kit|bundle)\b/i.test(title)) return false;
    return /\belectrolyte\b/i.test(title);
  }
  if (brand.slug === "electrolete") {
    if (/\b(hat|tank|t-shirt|tee|shirt)\b/i.test(title)) return false;
    return /\b(hydrat|limon|electrolyt)\b/i.test(title);
  }
  if (brand.slug === "protein-b") {
    if (/\b(flight|sample)\b/i.test(title)) return false;
    return /\b(clear whey|protein)\b/i.test(title);
  }
  if (brand.slug === "kind2") {
    if (
      /\b(loofah|jade|hair ties?|hairbrush|yak chew|dog|gift card|sisal|diatomite|tray|gloves|cellulite|starter set|better hair bundle|concentrated shampoo bars|concentrated conditioner bars)\b/i.test(
        title,
      )
    ) {
      return false;
    }
    return /\b(shampoo|conditioner)\b/i.test(title);
  }
  if (brand.slug === "soapwalla") {
    if (
      /\b(gift card|tote|gift wrapp|shipping insurance|travel bag|tailor-made|quartet|trio|set|kit|tasting menu|daily routine|basics|the spray|soaking salts|everyday wash|into the garden|collection)\b/i.test(
        title,
      ) ||
      /\(\s*travel\s*\)/i.test(title)
    ) {
      return false;
    }
    return true;
  }
  if (brand.slug === "halo-toothpaste") return /\b(toothpaste|tablet|hydroxyapatite)\b/i.test(title);
  if (brand.slug === "tallowshine") {
    if (/\b(blush|imperfect|bundle)\b/i.test(title)) return false;
    return /\b(sun shield|balm|cream|butter|lip|cleansing|magnesium)\b/i.test(title);
  }
  if (brand.slug === "magsol") return /\bdeodorant\b/i.test(title);
  if (brand.slug === "saltivate") {
    if (/\b(wholesale|case of|tumbler|bottle|shaker|towel|organizer|merch|variety pack)\b/i.test(title)) {
      return false;
    }
    return /electrolyt/i.test(title);
  }
  if (brand.slug === "vaer-skin") {
    if (/\b(ritual|collection|complete 4|set)\b/i.test(title)) return false;
    return /\bbalm\b/i.test(title);
  }
  if (brand.slug === "wicked-protein") {
    if (/\b(order protect|shaker|t-?shirt|tee\b|bundle|amazon|variety 12|logo athletic|protein power)\b/i.test(title)) return false;
    return /\b(protein|whey)\b/i.test(title);
  }
  if (brand.slug === "wander-wash") {
    if (/\b(t-?shirt|tee\b|tank top|gift card|shower caddy|travel stack|soap bundle)\b/i.test(title)) return false;
    return true;
  }
  if (brand.slug === "primal-basics") return true;
  if (brand.slug === "sun-zapper") {
    if (/\b(sample|trial|mosquito|citronella|concealer|contour|blush|beauty 3-pack|x 4 pack|value pack|rainbow value|beach x 4)\b/i.test(title)) {
      return false;
    }
  }
  if (brand.slug === "reef-safe-australia") {
    if (/\b(1kg|2kg|bulk|mosquito)\b/i.test(title)) return false;
  }
  if (brand.slug === "thallo" && /\b(copper|peptide serum)\b/i.test(title)) return false;
  if (brand.slug === "naturalcare-nz") {
    if (/\b(combo|bundle|set\b|caddy|dish|comb|brush|massager|tin|soap saver|shower)\b/i.test(title)) {
      return false;
    }
  }
  if (brand.slug === "stone-and-spear") {
    if (
      /\b(eyeshadow|lipstick|blush|brow gel|lip gloss|eyelash|perfume|cologne|hat\b|candle|gift card|sanitizer|soap dish|discovery set|sample set|ritual|kit\b|collection|bundle & save|bug|tanning|toothbrush|pouch|gift)\b/i.test(
        title,
      )
    ) {
      return false;
    }
  }
  if (brand.slug === "friendly-soap") {
    if (/\bnaked & natural\b/i.test(title)) return false;
    if (/\b\d+\s*x\b/i.test(title)) return false;
    if (
      /\b(scraps?|pack\b|\d+ pack|tote|bag|hamper|gift|laundry|kitchen|toilet|loofah|konjac|soap rack|soap box|soap saver|dish brush|dog shampoo|nail brush|cloth|sponge|voucher|produce bag|pumice|pads|cook'?s soap|my 12|eco-lifestyle|tranquil)\b/i.test(
        title,
      )
    ) {
      return false;
    }
  }
  if (brand.slug === "good-intentions") {
    if (/\b(t-?shirt|tee\b|tank|hoodie|shipping)\b/i.test(title)) return false;
  }
  if (brand.slug === "elation-hydration" && /\bbundle\b/i.test(title)) return false;
  if (brand.slug === "farmbody") {
    if (
      /\b(gift|workshop|dishwasher|laundry|dish soap|hand soap|bug|primer|set\b|combo|card)\b/i.test(title)
    ) {
      return false;
    }
  }
  if (brand.slug === "pure-choice-farms") {
    if (/^whey protein isolate$/i.test(title.trim())) return false;
    if (
      /\b(hoodie|shirt|tee\b|tank|bottle|gift card|combos?|flight|charcuterie|board|wheyts|cropped)\b/i.test(
        title,
      )
    ) {
      return false;
    }
  }
  if (brand.slug === "peg-paste") {
    if (/\b(trio|commitment|complete set|full ritual|enamel collection|signature six|lover|bundle|kids collection|family|voyager|holistic collection|gentle ritual|mint ritual)\b/i.test(title)) {
      return false;
    }
  }
  if (brand.slug === "grass-fed-beauty" && /\bmethylene blue\b/i.test(title)) return false;
  if (brand.slug === "tallowl" && /\btrio bundle\b/i.test(title)) return false;
  if (brand.slug === "hallowed-homestead" && /\b(summer glow bundle|tallow trio|sample box|pure beef tallow)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "desert-light-farm" && /\bfull facial set\b/i.test(title)) return false;
  if (brand.slug === "kruger-farm" && /\b(bundle|trio|gift set)\b/i.test(title)) return false;
  if (brand.slug === "luxe-tallow" && /\b(must have|triple fighting|face duo|full moisture|sets?)\b/i.test(title)) {
    return false;
  }
  if (
    brand.slug === "kris-organics" &&
    /\b(bundle|kit|ritual|gift|collection|sampler|dish soap|soap dish|soap net|bug|loofah|sachet|roll on|crate|pixie dust|headache|love story|earth elements|lavender mist|kitchen|dish brush|spa bag|spa baby|wooden crate|gift card|bath soak|body butter set|salve set)\b/i.test(
      title,
    )
  ) {
    return false;
  }
  if (brand.slug === "tiffs-tallow" && /\b(soap dish|shipping protection|sun ritual|nurturing ritual|signature ritual)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "wild-prairie" && /\b(graze tallow|wax melt|pamper tallow bundle|bundle of)\b/i.test(title)) return false;
  if (brand.slug === "tallow-and-bloom" && /\b(pure pair)\b/i.test(title)) return false;
  if (brand.slug === "pasture-and-posies" && /\broller bottle\b/i.test(title)) return false;
  if (brand.slug === "bloom-and-branch" && /\b(bug off|room spray|beeswax candle|wax melt|beeswax wrap)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "soulful-bloom" && /\b(sniffer|nasal inhaler|migraine|sampler bag|buzz off)\b/i.test(title)) {
    return false;
  }
  if (brand.slug === "danyelli-laurette" && /\bcandle\b/i.test(title)) return false;
  if (
    brand.slug === "ceelike" &&
    /\b(orthodontic wax|breath capsule|mouth pearl|color-correcting stick|teeth strips|portable mouthwash stick|mouthwash sticks|pearl toothbrush|nasal stick|u-shaped|end tuft|daily oral care (set|kit)|duo set|oral (care|spray) duo|twin care|hydro care combo|portable freshness|5-pack set|dual care pack)\b/i.test(
      title,
    )
  ) {
    return false;
  }
  if (
    brand.slug === "farm-to-skin" &&
    /\b(routine|set\b|duo\b|gift card|gift bag|gua sha|cupping|dry brush|shammy|travel pouch|beach clean|candle|sample discovery|steam sample|100% off|home spa|minimalist set|healthy skin trio|the precursor|mother'?s day)\b/i.test(
      title,
    )
  ) {
    return false;
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
  if (brand.slug === "primal-basics" && /\b(toothpaste|tallow|serum|lip|hydroxyapatite)\b/i.test(title)) return true;
  if (brand.slug === "sun-zapper" && /\b(spf|zinc|sunscreen|sunblock|sun cream)\b/i.test(title) && !/\b(sample|mosquito|beauty 3-pack|value pack|x 4 pack)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "reef-safe-australia" && /\b(spf|zinc|sunscreen)\b/i.test(title) && !/\b(1kg|2kg|bulk|mosquito)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "thallo" && /\b(tallow|zinc|cleanser|balm)\b/i.test(title) && !/\bcopper\b/i.test(title)) return true;
  if (brand.slug === "naturalcare-nz" && /\b(shampoo|conditioner|leave[- ]?in|serum|oil|tallow|soap|lip)\b/i.test(title) && !/\b(combo|bundle|set|caddy|dish|comb|brush|massager|tin)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "stone-and-spear" && /\b(sun balm|deodorant|shampoo|conditioner|tooth|tallow|soap|balm|cream|serum|toner|cleanser|lip|beard|pomade|aftershave|shave)\b/i.test(title) && !/\b(eyeshadow|lipstick|blush|perfume|cologne|hat|candle|discovery|sample set|ritual|kit|collection|bug|tanning)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "friendly-soap" && /\b(shampoo|soap|shaving|cleansing|detox|travel bar|sports soap|mechanic|gardener|foot soap)\b/i.test(title) && !/\b(scraps?|pack|tote|laundry|kitchen|dog|hamper|gift)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "good-intentions" && /\b(electrolyt|salt|hydrat)\b/i.test(title) && !/\b(shirt|hoodie|tank|shipping)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "elation-hydration" && /\bhydrat\b/i.test(title) && !/\bbundle\b/i.test(title)) return true;
  if (brand.slug === "farmbody" && /\b(deodorant|shampoo|conditioner|tallow|soap|cream|serum|balm|lotion|oil|lip|beard|after[- ]?sun|mask|cleanser)\b/i.test(title) && !/\b(gift|workshop|dishwasher|laundry|dish soap|hand soap|bug|primer|set|combo)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "pure-choice-farms" && /\b(whey|protein|greens?|tropics|superfood)\b/i.test(title) && !/\b(hoodie|shirt|combos?|flight|bottle|gift|board)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "peg-paste" && /\b(toothpaste|kids|enamel shield|flavour free|natural mint|intense mint|sacred clove|toothbrush|ivory|sage|tortoiseshell|candy stripe)\b/i.test(title) && !/\b(trio|commitment|ritual|collection|bundle|lover|family|voyager)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "sunkissed-by-heaven" && /\b(tallow|sunscreen|spf|moisturizer)\b/i.test(title)) return true;
  if (brand.slug === "grass-fed-beauty" && /\b(tallow|sun balm|lip|scrub|whip|cream|balm)\b/i.test(title) && !/\bmethylene\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tallowl" && /\b(balm|oil|serum|tallow|lip)\b/i.test(title) && !/\btrio\b/i.test(title)) return true;
  if (brand.slug === "hallowed-homestead" && /\b(tallow|summer balm|sun block|deodorant|soap|lip)\b/i.test(title) && !/\b(bundle|trio|sample|pure beef)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "desert-light-farm" && /\b(tallow|balm|serum|toner|cleanser|deodorant|lip|desert|honey)\b/i.test(title) && !/\bfull facial set\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "kruger-farm" && /\b(tallow|sunblock|spf|lip)\b/i.test(title) && !/\b(bundle|trio|gift set)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "gaia-organics-tallow" && /\b(tallow|sunblock|spf|lip|butter|balm|moisturizer)\b/i.test(title)) return true;
  if (brand.slug === "luxe-tallow" && /\b(sun stick|sun balm|deodorant|tallow|oil|essence|cleanser|serum|crème|creme)\b/i.test(title) && !/\b(set|duo|must have|triple)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "kris-organics" && /\b(tallow|sun block|deodorant|butter|soap|balm|serum|oil|cleanser|salve|shampoo|lip|mask|scrub|cream|anoint|nectar|elixir|radiance)\b/i.test(title) && !/\b(bundle|kit|ritual|gift|dish soap|bug|loofah|sachet|roll on|crate|sampler|mist|kitchen)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tiffs-tallow" && /\b(tallow|mineral barrier|fun in the sun|deodorant|soap|scrub)\b/i.test(title) && !/\b(ritual|soap dish|shipping)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "wild-prairie" && /\b(tallow|zinc|sun balm|lip)\b/i.test(title) && !/\b(graze|wax melt|bundle)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "tallow-and-bloom" && /\b(tallow|sun balm|lip|beard)\b/i.test(title) && !/\bpair\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "pasture-and-posies" && /\b(tallow|sun stick|sun shield|deodorant|serum|itch stick|lip|lotion)\b/i.test(title) && !/\broller\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "bloom-tallow" && /\b(tallow|bare|original|meadowflower|coconut cloud|herbal harmony|deodorant|lip|diaper)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "bloom-and-branch" && /\b(tallow|sunblock|zinc|soap|chapstick|beard|salve|bum balm)\b/i.test(title) && !/\b(bug|room spray|candle|wrap|wax melt)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "soulful-bloom" && /\b(tallow|natural sun|serum|lip|bum butter|cuticle)\b/i.test(title) && !/\b(sniffer|migraine|sampler|buzz off)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "danyelli-laurette" && /\b(shampoo|conditioner|soap|masque|zen combo)\b/i.test(title) && !/\bcandle\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "ceelike" && /\b(toothpaste|mouthwash|tooth powder|oral (care|spray)|smile mist|hydroxyapatite|tablet|toothbrush|floss|tongue gel)\b/i.test(title) && !/\b(wax|pearl|strip|nasal|u-shaped|end tuft|duo set|kit|combo)\b/i.test(title)) {
    return true;
  }
  if (brand.slug === "farm-to-skin" && /\b(sun prime|cleanser|essence|serum|moisturizer|soap|oil|eye revive|brightening|balm)\b/i.test(title) && !/\b(routine|set|duo|gift|gua sha|brush|candle|pouch)\b/i.test(title)) {
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
  return raw.images?.[0]?.src || raw.image?.src || raw.images?.[1]?.src;
}

function flavorOptionIndex(raw, brand) {
  const options = raw.options || [];
  if (brand?.slug === "mill-creek-tallow") {
    const scent = options.findIndex((o) => /scent|essential|oils/i.test(o.name || ""));
    if (scent >= 0) return scent;
  }
  if (brand?.slug === "tallow-spot") {
    const sun = options.findIndex(
      (o) => /size/i.test(o.name || "") && (o.values || []).some((v) => /sun (stick|cream)/i.test(v)),
    );
    if (sun >= 0) return sun;
    const lotionScent = options.findIndex(
      (o) => /8 oz/i.test(o.name || "") && (o.values || []).some((v) => /citrus|lavender|spice|burst/i.test(v)),
    );
    if (lotionScent >= 0) return lotionScent;
  }
  const scored = options.map((o, i) => {
    const name = o.name || "";
    if (!FLAVOR_OPTION.test(name)) return { i, score: -1 };
    let score = 1;
    if (/flavor|flavour|scent|fragrance|smell|aroma|colour|color|shade|tint/i.test(name)) score = 3;
    if (/^product$|^variants$|formula|whip|blend|select/i.test(name)) score = 1;
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
      ["-sS", "-L", "-A", UA, "--max-time", "25", url],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
    );
    if (!text.trimStart().startsWith("{")) throw err;
    return JSON.parse(text);
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

function mapOne(raw, brand, brandId, index, variant, flavorLabel) {
  const baseTitle = (raw.title || "").trim();
  let flavorClean = flavorLabel
    ? String(flavorLabel)
        .replace(/\s+\d+(\.\d+)?\s*(oz|ounce)(\s+net\s+wt\.?)?$/i, "")
        .replace(/\s+\d+(\.\d+)?\s*ounce net wt\.?$/i, "")
        .trim()
    : flavorLabel;
  if (flavorClean && /^\s*\d+(\.\d+)?\s*(oz|ml|g|kg|lb)\s*$/i.test(flavorClean)) flavorClean = null;
  let title = flavorClean ? `${baseTitle} — ${flavorClean}` : baseTitle;
  if (brand.slug === "tallowed-and-free" && /based & tallowed/i.test(baseTitle) && flavorLabel) {
    title = /whipped/i.test(flavorLabel) && !/not whipped/i.test(flavorLabel)
      ? "Based & Tallowed Unscented Tallow Balm — Whipped 75 ml"
      : "Based & Tallowed Unscented Tallow Balm — Regular 100 ml";
  }
  if (brand.slug === "peg-paste" && /\bpump\b/i.test(raw.product_type || "") && !/\bpump\b/i.test(title)) {
    title = `${title} Pump`;
  }
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
  const flavorSlug = flavorClean ? `-${slugify(flavorClean)}` : "";
  const idCore = `${brand.slug.replace(/[^a-z0-9]+/g, "").slice(0, 10)}${String(index + 1).padStart(3, "0")}${flavorSlug.replace(/-/g, "").slice(0, 12)}`;
  const slugPrefix = `${brand.slug}-`;
  const slugRoom = Math.max(12, 140 - slugPrefix.length - flavorSlug.length);
  const productSlug = `${slugPrefix}${handle.slice(0, slugRoom)}${flavorSlug}`;
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
    slug: productSlug,
    brandId,
    name: title.slice(0, 180),
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
  const flavorIdx = flavorOptionIndex(raw, brand);
  const variants = raw.variants || [];
  const skipFlavorExpand =
    brand.slug === "elektra" ||
    brand.slug === "primals" ||
    brand.slug === "papr" ||
    brand.slug === "xotic-mushrooms" ||
    brand.slug === "dr-brite" ||
    brand.slug === "humble-goat" ||
    brand.slug === "short-story" ||
    (brand.slug === "archwood" && /constitutive/i.test((raw.options || []).map((o) => o.name).join(" "))) ||
    (brand.slug === "live-kaizen" && /mushroom coffee/i.test(raw.title || "")) ||
    brand.slug === "essential-toothpaste" ||
    brand.slug === "heavenly-tallow" ||
    brand.slug === "encompass-farming" ||
    brand.slug === "restore-oral" ||
    brand.slug === "fresh-harvest" ||
    brand.slug === "stop-oral" ||
    brand.slug === "palm-pine" ||
    brand.slug === "healthyderm" ||
    brand.slug === "tallow-me-now" ||
    brand.slug === "simply-fuel" ||
    brand.slug === "bodyflow" ||
    brand.slug === "wonder-oral" ||
    brand.slug === "nutristrength" ||
    brand.slug === "oh-gigi" ||
    brand.slug === "weluxia" ||
    brand.slug === "starling" ||
    brand.slug === "pravi" ||
    brand.slug === "hidrate-808" ||
    brand.slug === "surfyogis" ||
    brand.slug === "marroomi" ||
    brand.slug === "tallow-company" ||
    brand.slug === "thrive-made-simple" ||
    brand.slug === "frankie-apothecary" ||
    brand.slug === "zoes-kawakawa" ||
    brand.slug === "sun-and-honey" ||
    brand.slug === "tallow-and-honey" ||
    brand.slug === "net-hydrate" ||
    brand.slug === "vaya" ||
    brand.slug === "garage-brand-soap" ||
    brand.slug === "black-ivy-apothecary" ||
    brand.slug === "home-body-field-goods" ||
    brand.slug === "kono-nutrition" && /hydrate/i.test(raw.title || "") ||
    brand.slug === "surfing-cow" ||
    brand.slug === "solrx" ||
    brand.slug === "plan-d" ||
    brand.slug === "wildflower-tallow" ||
    brand.slug === "forah" ||
    brand.slug === "neptune-health" ||
    brand.slug === "field-flower-tallow" ||
    brand.slug === "sote" ||
    brand.slug === "himalayan-hydration" ||
    brand.slug === "cooki-haircare" ||
    brand.slug === "honeysuckle-rose" ||
    brand.slug === "dersie" ||
    (brand.slug === "zeal" && /\((lemon|fruit|red white|white gummy|orange|peach|black cherry|blue raspberry|passion|cherry|raspberry|strawberry|pink|cucumber|unflavored|chocolate|vanilla)[^)]*\)/i.test(raw.title || ""));
  if (brand.slug === "tallowed-and-free" && /based & tallowed/i.test(raw.title || raw.handle || "")) {
    const out = [];
    const seen = new Set();
    for (const v of variants) {
      const label = v.option1 || v.title;
      if (!label || /^default title$/i.test(label)) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const mapped = mapOne(raw, brand, brandId, index, v, label);
      if (mapped) out.push(mapped);
    }
    if (out.length) return out;
  }
  if (!skipFlavorExpand && flavorIdx >= 0 && variants.length > 1) {
    const seen = new Set();
    const out = [];
    for (const v of variants) {
      const label = [v.option1, v.option2, v.option3][flavorIdx];
      if (!label || /^default title$/i.test(label)) continue;
      if (/\b(variety pack|staple flavors?|limited flavors?|mix of|mix vanilla|duo\b|toothbrush|brush eco|bass -|rows of bristles|donate it|3 pack|7 pack|4 lip balms|3 shampoo|3 soaps|3 cleanser|3 tins|bundle & save|single bottle|bulk bag|bundle of|twin pack|three pack|family pack|pump x2|x2 100g|i want all|1 vanilla \+ 1|vanilla \+ 1 chocolate)\b/i.test(label)) continue;
      if (/^\s*\d+(\.\d+)?\s*(oz|ml|g|kg|lb|count|ct|pack)(\s+net\s+wt)?\s*$/i.test(label)) continue;
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
    path.join(root, "data/catalog-products-manifest-wave59.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        wave59Products: waveCount,
        wave59BrandsWithProducts: perBrand.filter((b) => b.kept > 0).length,
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
    path.join(root, "data/wave59-selected.json"),
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
    `\nDone total=${all.length} wave59=${waveCount} brandsWithProducts=${perBrand.filter((b) => b.kept > 0).length} failures=${failures.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
