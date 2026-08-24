/**
 * Probe Shopify products.json for candidate small clean brands.
 * Prints a compact report: status, product count, sample titles.
 */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CANDIDATES = [
  // sunscreen
  ["soleil-toujours", "https://soleiltoujours.com", "sunscreen"],
  ["solara-suncare", "https://solarasuncare.com", "sunscreen"],
  ["goddess-garden", "https://goddessgarden.com", "sunscreen"],
  ["suntegrity", "https://suntegrityskincare.com", "sunscreen"],
  ["unsun", "https://unsuncosmetics.com", "sunscreen"],
  ["kinfield", "https://kinfield.com", "sunscreen"],
  ["beauty-by-earth", "https://beautybyearth.com", "sunscreen"],
  ["avasol", "https://avasol.com", "sunscreen"],
  ["etee", "https://myetee.com", "sunscreen"],
  ["etee-2", "https://etee.store", "sunscreen"],
  ["sol-de-ibiza", "https://soldeibiza.com", "sunscreen"],
  ["sunbutter", "https://sunbutterskincare.com", "sunscreen"],
  ["surfdurt", "https://surfdurt.com", "sunscreen"],
  ["little-hands-hawaii", "https://littlehandshawaii.com", "sunscreen"],
  ["everyday-humans", "https://everydayhumans.com", "sunscreen"],
  ["manda", "https://shopmanda.com", "sunscreen"],
  ["manda-2", "https://mandaorganic.com", "sunscreen"],
  ["island-butter", "https://islandbutter.com", "sunscreen"],
  ["island-butter-2", "https://shopislandbutter.com", "sunscreen"],
  ["kokua", "https://kokuahawaii.com", "sunscreen"],
  ["kokua-2", "https://kokuasuncare.com", "sunscreen"],
  ["rebrand-skincare", "https://rebrandskincare.com", "sunscreen"],
  ["fango", "https://fangosuncare.com", "sunscreen"],
  ["raw-love", "https://rawlovesunscreen.com", "sunscreen"],
  ["thrive-bodyshield", "https://thrivecausemetics.com", "sunscreen"],
  // electrolytes
  ["cure", "https://curehydration.com", "electrolytes"],
  ["hydrant", "https://drinkhydrant.com", "electrolytes"],
  ["swellies", "https://swellies.com", "electrolytes"],
  ["swellies-2", "https://getswellies.com", "electrolytes"],
  ["purishh", "https://purishh.com", "electrolytes"],
  ["untammed", "https://untammed.co", "electrolytes"],
  ["possible", "https://mypossible.com", "electrolytes"],
  ["nectar", "https://drinknectar.com", "electrolytes"],
  ["nectar-2", "https://nectarhydration.com", "electrolytes"],
  ["saltt", "https://drinksaltt.com", "electrolytes"],
  ["sos", "https://soslive.com", "electrolytes"],
  ["sos-2", "https://sos-hydration.com", "electrolytes"],
  ["lyteshow", "https://lyteline.com", "electrolytes"],
  ["jigsaw", "https://jigsawhealth.com", "electrolytes"],
  // protein
  ["sprout-living", "https://sproutliving.com", "protein"],
  ["nuzest", "https://nuzest-usa.com", "protein"],
  ["nuzest-2", "https://nuzest.com", "protein"],
  ["kos", "https://kos.com", "protein"],
  ["mikuna", "https://mikunafoods.com", "protein"],
  ["ora-organic", "https://ora.organic", "protein"],
  ["moonvalley", "https://moonvalley.me", "protein"],
  ["sunwarrior", "https://sunwarrior.com", "protein"],
  ["aloha", "https://aloha.com", "protein"],
  ["complement", "https://drinkcomplement.com", "protein"],
  ["complement-2", "https://complement.com", "protein"],
  ["drink-wholesome", "https://drinkwholesome.com", "protein"],
  ["puori", "https://puori.com", "protein"],
  ["kachava", "https://www.kachava.com", "protein"],
  // deodorant
  ["nuud", "https://nuudcare.com", "deodorant"],
  ["nuud-2", "https://nuud.shop", "deodorant"],
  ["nuud-3", "https://www.nuud.com", "deodorant"],
  ["crystal", "https://thecrystal.com", "deodorant"],
  ["crystal-2", "https://crystaldeodorant.com", "deodorant"],
  ["wild", "https://wearewild.com", "deodorant"],
  ["piperwai", "https://piperwai.com", "deodorant"],
  ["morrowen", "https://morrowen.com", "deodorant"],
  ["lathr", "https://lathr.com", "deodorant"],
  ["earth-and-pebble", "https://earthandpebble.com", "deodorant"],
  ["made-new-naturals", "https://madenewnaturals.com", "deodorant"],
  ["naturallow", "https://www.naturallow.com", "deodorant"],
  ["by-humankind", "https://byhumankind.com", "deodorant"],
  ["type-a", "https://typeadeodorant.com", "deodorant"],
  ["fresh-cult", "https://getfreshcult.com", "deodorant"],
  ["fresh-cult-2", "https://freshcult.com", "deodorant"],
  // oral
  ["fygg", "https://fygg.com", "oral"],
  ["dr-tungs", "https://drtungs.com", "oral"],
  ["unpaste", "https://unpaste.com", "oral"],
  ["akamai", "https://akamai.life", "oral"],
  ["akamai-2", "https://akamainaturals.com", "oral"],
  ["uncle-harrys", "https://uncleharrys.com", "oral"],
  ["the-dirt", "https://getthedirt.com", "oral"],
  ["the-dirt-2", "https://thedirt.com", "oral"],
  ["hydrophil", "https://hydrophil.com", "oral"],
  ["happier-beauty", "https://happierbeauty.com", "oral"],
  ["dr-brite", "https://drbrite.com", "oral"],
  ["primal-life", "https://primallifeorganics.com", "oral"],
  ["nobs", "https://nobs.com", "oral"],
  ["nobs-2", "https://nobsoralcare.com", "oral"],
  ["livfresh", "https://getlivfresh.com", "oral"],
  ["great-oral-health", "https://www.greatoralhealth.com", "oral"],
  // skincare
  ["earth-harbor", "https://earthharbor.com", "skincare"],
  ["evolve-beauty", "https://evolvebeauty.co.uk", "skincare"],
  ["mad-hippie", "https://madhippie.com", "skincare"],
  ["honua", "https://honuaskincare.com", "skincare"],
  ["marie-veronique", "https://marieveronique.com", "skincare"],
  ["costa-brazil", "https://costabrazil.com", "skincare"],
  ["okoko", "https://okokocosmetiques.com", "skincare"],
  ["mychelle", "https://mychelle.com", "skincare"],
  ["eminence", "https://eminenceorganics.com", "skincare"],
  // hair
  ["melanin-haircare", "https://melaninhaircare.com", "hair"],
  ["alaffia", "https://alaffia.com", "hair"],
  ["giovanni", "https://giovannicosmetics.com", "hair"],
  ["hairstory", "https://hairstory.com", "hair"],
  ["plaine-products", "https://plaineproducts.com", "hair"],
  ["oway", "https://oway.com", "hair"],
  ["oway-2", "https://oway.us", "hair"],
  ["unscented-co", "https://unscentedco.com", "hair"],
  ["sienna-naturals", "https://www.siennanaturals.com", "hair"],
  ["nuele", "https://nuelehair.com", "hair"],
  ["ene-naturals", "https://enenaturals.com", "hair"],
  ["dezia", "https://www.dezia.org", "hair"],
  ["roz", "https://rozhair.com", "hair"],
  ["seen", "https://helloseen.com", "hair"],
  // supplements
  ["sun-potion", "https://sunpotion.com", "supplements"],
  ["needed", "https://thisisneeded.com", "supplements"],
  ["anima-mundi", "https://animamundiherbals.com", "supplements"],
  ["fullwell", "https://fullwellfertility.com", "supplements"],
  ["wenatal", "https://wenatal.com", "supplements"],
  ["perelel", "https://perelelhealth.com", "supplements"],
  ["host-defense", "https://hostdefense.com", "supplements"],
  ["om-mushrooms", "https://ommushrooms.com", "supplements"],
  ["real-mushrooms", "https://realmushrooms.com", "supplements"],
  ["gaia-herbs", "https://gaiaherbs.com", "supplements"],
  ["herb-pharm", "https://herb-pharm.com", "supplements"],
  ["beauty-chef", "https://thebeautychef.com", "supplements"],
  ["jshealth", "https://jshealthvitamins.com", "supplements"],
];

async function probe(slug, base) {
  const url = `${base.replace(/\/$/, "")}/products.json?limit=50`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(10000),
  });
  const text = await res.text();
  if (!res.ok) return { slug, base, ok: false, status: res.status };
  if (!text.trimStart().startsWith("{")) return { slug, base, ok: false, status: "not-json" };
  const data = JSON.parse(text);
  const products = data.products || [];
  const titles = products.slice(0, 4).map((p) => p.title);
  const withImg = products.filter((p) => p.images?.[0]?.src || p.image?.src).length;
  const withVariants = products.filter((p) => (p.variants || []).length > 1).length;
  return {
    slug,
    base,
    ok: true,
    status: res.status,
    count: products.length,
    withImg,
    withVariants,
    titles,
  };
}

const results = [];
const queue = [...CANDIDATES];
const CONCURRENCY = 8;

async function worker() {
  while (queue.length) {
    const [slug, base, cat] = queue.shift();
    try {
      const r = await probe(slug, base);
      r.cat = cat;
      results.push(r);
      const mark = r.ok ? `${r.count}p` : r.status;
      console.log(`${r.ok ? "OK" : "NO"} ${slug.padEnd(22)} ${String(mark).padEnd(8)} ${base}`);
    } catch (e) {
      results.push({ slug, base, ok: false, status: String(e.message || e), cat });
      console.log(`NO ${slug.padEnd(22)} err      ${base}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

const good = results.filter((r) => r.ok && r.count >= 3);
console.log("\n=== GOOD ===");
for (const r of good.sort((a, b) => a.cat.localeCompare(b.cat) || a.slug.localeCompare(b.slug))) {
  console.log(`${r.cat.padEnd(13)} ${r.slug.padEnd(22)} ${String(r.count).padStart(3)}  ${r.titles.join(" | ")}`);
}
console.log(`\ngood=${good.length} total=${results.length}`);
