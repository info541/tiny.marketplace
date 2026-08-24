/**
 * Probe Shopify products.json for wave8 candidate small clean brands.
 * Skips brands already claimed by the live catalog or wave4–7 drafts.
 */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CANDIDATES = [
  // sunscreen
  ["mama-sol", "https://www.shopmamasol.com", "sunscreen"],
  ["goodspread", "https://goodspreadsuncare.com", "sunscreen"],
  ["eat-my-face", "https://eatmyface.co", "sunscreen"],
  ["spooge", "https://spooge.co", "sunscreen"],
  ["saint-solaire", "https://saintsolaireskincare.com", "sunscreen"],
  ["love-sun-body", "https://lovesunbody.com", "sunscreen"],
  ["goddess-garden", "https://goddessgarden.com", "sunscreen"],
  ["suntegrity", "https://suntegrityskincare.com", "sunscreen"],
  ["unsun", "https://unsuncosmetics.com", "sunscreen"],
  ["kinfield", "https://kinfield.com", "sunscreen"],
  ["beauty-by-earth", "https://beautybyearth.com", "sunscreen"],
  ["etee", "https://myetee.com", "sunscreen"],
  ["everyday-humans", "https://everydayhumans.com", "sunscreen"],
  ["manda", "https://shopmanda.com", "sunscreen"],
  ["manda-2", "https://mandaorganic.com", "sunscreen"],
  ["kokua", "https://kokuahawaii.com", "sunscreen"],
  ["raw-love", "https://rawlovesunscreen.com", "sunscreen"],
  ["bask", "https://wearebask.com", "sunscreen"],
  ["bask-2", "https://hellobask.com", "sunscreen"],
  ["black-girl-sunscreen", "https://blackgirlsunscreen.com", "sunscreen"],
  ["sunfolks", "https://sunfolks.com", "sunscreen"],
  ["waxhead", "https://waxheadsunscreen.com", "sunscreen"],
  ["waxhead-2", "https://gowaxhead.com", "sunscreen"],
  ["barebones", "https://barebonessuncare.com", "sunscreen"],
  ["lovin", "https://lovinsuncare.com", "sunscreen"],
  ["radiant-bloom", "https://www.radiantbloomorganic.com", "sunscreen"],
  ["tropic-sport", "https://tropicsport.com", "sunscreen"],
  ["sunfolk", "https://sunfolk.com", "sunscreen"],
  ["golden-hour", "https://goldenhoursuncare.com", "sunscreen"],
  ["oyster", "https://oystersuncare.com", "sunscreen"],
  ["circular-bodies", "https://circularbodies.com", "sunscreen"],
  ["eq-love", "https://eq-love.com", "sunscreen"],
  ["kabana", "https://kabanaorganic.com", "sunscreen"],
  ["clearstem", "https://clearstemskincare.com", "sunscreen"],
  ["evereden", "https://evereden.com", "sunscreen"],

  // electrolytes
  ["jigsaw", "https://jigsawhealth.com", "electrolytes"],
  ["precision-hydration", "https://precisionhydration.com", "electrolytes"],
  ["gnarly", "https://gognarly.com", "electrolytes"],
  ["goodonya", "https://goodonya.com", "electrolytes"],
  ["goodonya-2", "https://drinkgoodonya.com", "electrolytes"],
  ["fasting-hydration", "https://fastinghydration.com", "electrolytes"],
  ["purishh", "https://purishh.com", "electrolytes"],
  ["unived", "https://unived.com", "electrolytes"],
  ["iqmix", "https://drinkiqmix.com", "electrolytes"],
  ["iqmix-2", "https://iqmix.com", "electrolytes"],
  ["hilyte", "https://gethilyte.com", "electrolytes"],
  ["trace-minerals", "https://traceminerals.com", "electrolytes"],
  ["nutribiotic", "https://nutribiotic.com", "electrolytes"],

  // protein
  ["drink-wholesome", "https://drinkwholesome.com", "protein"],
  ["complement", "https://complement.com", "protein"],
  ["paleovalley", "https://paleovalley.com", "protein"],
  ["thunderbird", "https://thunderbirdbar.com", "protein"],
  ["sprout-organic", "https://sproutorganic.com", "protein"],
  ["sapien", "https://sapien.org", "protein"],
  ["form-nutrition", "https://formnutrition.com", "protein"],
  ["pulsin", "https://pulsin.co.uk", "protein"],
  ["tropeaka", "https://tropeaka.com", "protein"],
  ["owyn", "https://liveowyn.com", "protein"],
  ["sunwarrior", "https://sunwarrior.com", "protein"],

  // deodorant
  ["honestly-phresh", "https://honestlyphresh.com", "deodorant"],
  ["by-robin", "https://www.byrobincreations.com", "deodorant"],
  ["tanit", "https://www.tanit.co", "deodorant"],
  ["wild", "https://wearewild.com", "deodorant"],
  ["wild-2", "https://us.wearewild.com", "deodorant"],
  ["by-humankind", "https://byhumankind.com", "deodorant"],
  ["type-a", "https://typeadeodorant.com", "deodorant"],
  ["fresh-cult", "https://getfreshcult.com", "deodorant"],
  ["morrowen", "https://morrowen.com", "deodorant"],
  ["earth-and-pebble", "https://earthandpebble.com", "deodorant"],
  ["made-new-naturals", "https://madenewnaturals.com", "deodorant"],
  ["axilla", "https://axilla.com", "deodorant"],
  ["ode", "https://odebody.com", "deodorant"],
  ["kosi", "https://kosideodorant.com", "deodorant"],
  ["myro", "https://mymyro.com", "deodorant"],
  ["moon-valley-organics", "https://moonvalleyorganics.com", "deodorant"],

  // oral
  ["unpaste", "https://unpaste.com", "oral"],
  ["akamai", "https://akamai.life", "oral"],
  ["the-dirt", "https://getthedirt.com", "oral"],
  ["hydrophil", "https://hydrophil.com", "oral"],
  ["dr-brite", "https://drbrite.com", "oral"],
  ["radius", "https://radiustoothbrush.com", "oral"],
  ["carifree", "https://carifree.com", "oral"],
  ["orawellness", "https://orawellness.com", "oral"],
  ["brush-with-bamboo", "https://brushwithbamboo.com", "oral"],

  // skincare
  ["costa-brazil", "https://costabrazil.com", "skincare"],
  ["bybi", "https://bybi.com", "skincare"],
  ["oio-lab", "https://oiolab.co", "skincare"],
  ["circumference", "https://circumference.shop", "skincare"],
  ["wildcrafted", "https://wildcraftedorganics.com", "skincare"],
  ["ranavat", "https://ranavat.com", "skincare"],
  ["eminence", "https://eminenceorganics.com", "skincare"],

  // hair
  ["alaffia", "https://alaffia.com", "hair"],
  ["ene-naturals", "https://enenaturals.com", "hair"],
  ["dezia", "https://www.dezia.org", "hair"],
  ["yarok", "https://yarokhair.com", "hair"],
  ["intelligent-nutrients", "https://intelligentnutrients.com", "hair"],
  ["john-masters", "https://www.johnmasters.com", "hair"],
  ["giovanni", "https://giovannicosmetics.com", "hair"],

  // supplements
  ["host-defense", "https://hostdefense.com", "supplements"],
  ["jshealth", "https://jshealthvitamins.com", "supplements"],
  ["seeking-health", "https://seekinghealth.com", "supplements"],
  ["organifi", "https://organifi.com", "supplements"],
  ["ancestral-supplements", "https://ancestralsupplements.com", "supplements"],
  ["perfect-supplements", "https://perfectsupplements.com", "supplements"],
];

async function probe(slug, base) {
  const url = `${base.replace(/\/$/, "")}/products.json?limit=50`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  const text = await res.text();
  if (!res.ok) return { slug, base, ok: false, status: res.status };
  if (!text.trimStart().startsWith("{")) return { slug, base, ok: false, status: "not-json" };
  const data = JSON.parse(text);
  const products = data.products || [];
  const titles = products.slice(0, 5).map((p) => p.title);
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
const CONCURRENCY = 10;

async function worker() {
  while (queue.length) {
    const [slug, base, cat] = queue.shift();
    try {
      const r = await probe(slug, base);
      r.cat = cat;
      results.push(r);
      const mark = r.ok ? `${r.count}p` : r.status;
      console.log(`${r.ok ? "OK" : "NO"} ${slug.padEnd(24)} ${String(mark).padEnd(8)} ${base}`);
    } catch (e) {
      results.push({ slug, base, ok: false, status: String(e.message || e), cat });
      console.log(`NO ${slug.padEnd(24)} err      ${base}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

const good = results.filter((r) => r.ok && r.count >= 3 && r.withImg >= 3);
console.log("\n=== GOOD ===");
for (const r of good.sort((a, b) => a.cat.localeCompare(b.cat) || a.slug.localeCompare(b.slug))) {
  console.log(`${r.cat.padEnd(13)} ${r.slug.padEnd(24)} ${String(r.count).padStart(3)} img=${r.withImg} var=${r.withVariants}  ${r.titles.join(" | ")}`);
}
console.log(`\ngood=${good.length} total=${results.length}`);
