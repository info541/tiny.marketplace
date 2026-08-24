/**
 * Probe Shopify products.json for wave7 candidate small clean brands.
 * Skips brands already claimed by the live catalog or wave4/5/6 drafts.
 */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CANDIDATES = [
  // sunscreen — skip claimed: soleil-toujours, solara, swellies, island-butter,
  // avasol, sol-de-ibiza, surfdurt, rebrand, fango, indie-paradiso, suntribe, sunbutter
  ["goddess-garden", "https://goddessgarden.com", "sunscreen"],
  ["suntegrity", "https://suntegrityskincare.com", "sunscreen"],
  ["unsun", "https://unsuncosmetics.com", "sunscreen"],
  ["kinfield", "https://kinfield.com", "sunscreen"],
  ["beauty-by-earth", "https://beautybyearth.com", "sunscreen"],
  ["etee", "https://myetee.com", "sunscreen"],
  ["little-hands-hawaii", "https://littlehandshawaii.com", "sunscreen"],
  ["everyday-humans", "https://everydayhumans.com", "sunscreen"],
  ["manda", "https://shopmanda.com", "sunscreen"],
  ["manda-2", "https://mandaorganic.com", "sunscreen"],
  ["kokua", "https://kokuahawaii.com", "sunscreen"],
  ["raw-love", "https://rawlovesunscreen.com", "sunscreen"],
  ["bask", "https://wearebask.com", "sunscreen"],
  ["bask-2", "https://hellobask.com", "sunscreen"],
  ["black-girl-sunscreen", "https://blackgirlsunscreen.com", "sunscreen"],
  ["we-are-feel-good", "https://wearefeelgoodinc.com.au", "sunscreen"],
  ["sunfolks", "https://sunfolks.com", "sunscreen"],
  ["waxhead", "https://waxheadsunscreen.com", "sunscreen"],
  ["waxhead-2", "https://waxhead.com", "sunscreen"],
  ["barebones", "https://barebonessuncare.com", "sunscreen"],
  ["lovin", "https://lovinsuncare.com", "sunscreen"],
  ["the-rising", "https://therisingspf.com", "sunscreen"],
  ["radiant-bloom", "https://www.radiantbloomorganic.com", "sunscreen"],
  ["tropic-sport", "https://tropicsport.com", "sunscreen"],
  ["thinksport", "https://thinksport.com", "sunscreen"],
  ["sunfolk", "https://sunfolk.com", "sunscreen"],
  ["golden-hour", "https://goldenhoursuncare.com", "sunscreen"],
  ["bare-republic-skip", "https://barerepublic.com", "sunscreen"],
  ["all-good-skip", "https://allgoodproducts.com", "sunscreen"],
  ["stream2sea-skip", "https://stream2sea.com", "sunscreen"],
  ["raw-elements-skip", "https://rawelementsusa.com", "sunscreen"],
  ["coola-skip", "https://coola.com", "sunscreen"],
  ["sun-bum-skip", "https://sunbum.com", "sunscreen"],
  ["badger-skip", "https://badgerbalm.com", "sunscreen"],

  // electrolytes
  ["jigsaw", "https://jigsawhealth.com", "electrolytes"],
  ["tailwind", "https://tailwindnutrition.com", "electrolytes"],
  ["precision-hydration", "https://precisionhydration.com", "electrolytes"],
  ["gnarly", "https://gognarly.com", "electrolytes"],
  ["key-nutrients", "https://keynutrients.com", "electrolytes"],
  ["goodonya", "https://goodonya.com", "electrolytes"],
  ["goodonya-2", "https://drinkgoodonya.com", "electrolytes"],
  ["fasting-hydration", "https://fastinghydration.com", "electrolytes"],
  ["purishh", "https://purishh.com", "electrolytes"],
  ["relyte", "https://drinkrelyte.com", "electrolytes"],
  ["unived", "https://unived.com", "electrolytes"],
  ["nuunlife-skip", "https://nuunlife.com", "electrolytes"],
  ["skratch-skip", "https://skratchlabs.com", "electrolytes"],
  ["buoy-skip", "https://justaddbuoy.com", "electrolytes"],
  ["lmnt-skip", "https://drinklmnt.com", "electrolytes"],
  ["ultima-skip", "https://ultimareplenisher.com", "electrolytes"],
  ["dripdrop-skip", "https://dripdrop.com", "electrolytes"],
  ["cure-skip", "https://curehydration.com", "electrolytes"],
  ["hydrant-skip", "https://drinkhydrant.com", "electrolytes"],
  ["untammed-skip", "https://untammed.co", "electrolytes"],
  ["nectar-skip", "https://drinknectar.com", "electrolytes"],
  ["possible-skip", "https://mypossible.com", "electrolytes"],
  ["saltt-skip", "https://drinksaltt.com", "electrolytes"],
  ["lyteshow-skip", "https://lyteline.com", "electrolytes"],
  ["sos-skip", "https://soshydration.com", "electrolytes"],

  // protein
  ["drink-wholesome", "https://drinkwholesome.com", "protein"],
  ["complement", "https://complement.com", "protein"],
  ["complement-2", "https://drinkcomplement.com", "protein"],
  ["paleovalley", "https://paleovalley.com", "protein"],
  ["gomacro", "https://gomacro.com", "protein"],
  ["iqbar", "https://eatiqbar.com", "protein"],
  ["thunderbird", "https://thunderbirdbar.com", "protein"],
  ["sprout-organic", "https://sproutorganic.com", "protein"],
  ["sapien", "https://sapien.org", "protein"],
  ["owyn-skip", "https://liveowyn.com", "protein"],
  ["koia-skip", "https://koia.com", "protein"],
  ["sunwarrior-skip", "https://sunwarrior.com", "protein"],
  ["kachava-skip", "https://kachava.com", "protein"],
  ["garden-of-life-skip", "https://www.gardenoflife.com", "protein"],
  ["vega-skip", "https://myvega.com", "protein"],
  ["amazing-grass-skip", "https://amazinggrass.com", "protein"],
  ["sprout-living-skip", "https://sproutliving.com", "protein"],
  ["nuzest-skip", "https://nuzest-usa.com", "protein"],
  ["kos-skip", "https://kos.com", "protein"],
  ["ora-skip", "https://ora.organic", "protein"],
  ["puori-skip", "https://puori.com", "protein"],
  ["mikuna-skip", "https://mikunafoods.com", "protein"],
  ["aloha-skip", "https://aloha.com", "protein"],
  ["moonvalley-skip", "https://moonvalley.me", "protein"],
  ["truvani-skip", "https://truvani.com", "protein"],
  ["orgain-skip", "https://orgain.com", "protein"],
  ["promix-skip", "https://promixnutrition.com", "protein"],

  // deodorant
  ["wild", "https://wearewild.com", "deodorant"],
  ["wild-2", "https://us.wearewild.com", "deodorant"],
  ["by-humankind", "https://byhumankind.com", "deodorant"],
  ["type-a", "https://typeadeodorant.com", "deodorant"],
  ["fresh-cult", "https://getfreshcult.com", "deodorant"],
  ["morrowen", "https://morrowen.com", "deodorant"],
  ["earth-and-pebble", "https://earthandpebble.com", "deodorant"],
  ["made-new-naturals", "https://madenewnaturals.com", "deodorant"],
  ["axilla", "https://axilla.com", "deodorant"],
  ["axilla-2", "https://shopaxilla.com", "deodorant"],
  ["ode", "https://odebody.com", "deodorant"],
  ["kosi", "https://kosideodorant.com", "deodorant"],
  ["twisted-duo", "https://www.twstdduo.com", "deodorant"],
  ["willow-valley", "https://willowvalleywellness.com", "deodorant"],
  ["nu-deo", "https://www.nu-deo.ca", "deodorant"],
  ["myro", "https://mymyro.com", "deodorant"],
  ["piperwai-skip", "https://piperwai.com", "deodorant"],
  ["lathr-skip", "https://lathr.com", "deodorant"],
  ["nuud-skip", "https://nuudcare.com", "deodorant"],
  ["crystal-skip", "https://thecrystal.com", "deodorant"],
  ["saavy-skip", "https://saavynaturals.com", "deodorant"],
  ["naturallow-skip", "https://www.naturallow.com", "deodorant"],
  ["native-skip", "https://nativecos.com", "deodorant"],
  ["schmidts-skip", "https://schmidts.com", "deodorant"],
  ["each-every-skip", "https://eachandevery.com", "deodorant"],
  ["primally-pure-skip", "https://primallypure.com", "deodorant"],
  ["salt-stone-skip", "https://saltandstone.com", "deodorant"],
  ["ursa-skip", "https://ursamajorvt.com", "deodorant"],
  ["meow-skip", "https://meowmeowtweet.com", "deodorant"],
  ["hibar-skip", "https://hibar.com", "deodorant"],
  ["ethique-skip", "https://ethique.com", "deodorant"],
  ["hume-skip", "https://hume.com", "deodorant"],
  ["lume-skip", "https://lume.deals", "deodorant"],
  ["kaia-skip", "https://kaianaturals.com", "deodorant"],
  ["little-seed-skip", "https://littleseedfarm.com", "deodorant"],
  ["fat-moon-skip", "https://fatandthemoon.com", "deodorant"],

  // oral
  ["unpaste", "https://unpaste.com", "oral"],
  ["akamai", "https://akamai.life", "oral"],
  ["akamai-2", "https://akamainaturals.com", "oral"],
  ["the-dirt", "https://getthedirt.com", "oral"],
  ["hydrophil", "https://hydrophil.com", "oral"],
  ["dr-brite", "https://drbrite.com", "oral"],
  ["livfresh", "https://getlivfresh.com", "oral"],
  ["radius", "https://radiustoothbrush.com", "oral"],
  ["desert-essence", "https://desertessence.com", "oral"],
  ["risewell-skip", "https://risewell.com", "oral"],
  ["boka-skip", "https://boka.com", "oral"],
  ["bite-skip", "https://bitetoothpastebits.com", "oral"],
  ["georganics-skip", "https://georganics.com", "oral"],
  ["davids-skip", "https://davids-usa.com", "oral"],
  ["revitin-skip", "https://revitin.com", "oral"],
  ["moon-oral-skip", "https://hellomoonoralcare.com", "oral"],
  ["spotlight-skip", "https://spotlightoralcare.com", "oral"],
  ["quip-skip", "https://getquip.com", "oral"],
  ["burst-skip", "https://burstoralcare.com", "oral"],
  ["cocofloss-skip", "https://cocofloss.com", "oral"],
  ["hismile-skip", "https://hismileteeth.com", "oral"],
  ["wellnesse-skip", "https://wellnesse.com", "oral"],
  ["humble-skip", "https://thehumble.co", "oral"],
  ["fygg-skip", "https://fygg.com", "oral"],
  ["dr-tungs-skip", "https://drtungs.com", "oral"],
  ["nobs-skip", "https://nobsoralcare.com", "oral"],
  ["uncle-harrys-skip", "https://uncleharrys.com", "oral"],
  ["primal-life-skip", "https://primallifeorganics.com", "oral"],
  ["happier-skip", "https://happierbeauty.com", "oral"],
  ["goh-skip", "https://www.greatoralhealth.com", "oral"],

  // skincare
  ["costa-brazil", "https://costabrazil.com", "skincare"],
  ["bybi", "https://bybi.com", "skincare"],
  ["upcircle", "https://upcirclebeauty.com", "skincare"],
  ["oio-lab", "https://oiolab.co", "skincare"],
  ["kypris", "https://kyprisbeauty.com", "skincare"],
  ["in-fiore", "https://infiore.net", "skincare"],
  ["circumference", "https://circumference.shop", "skincare"],
  ["wildcrafted", "https://wildcraftedorganics.com", "skincare"],
  ["eminence", "https://eminenceorganics.com", "skincare"],
  ["josh-skip", "https://joshrosebrook.com", "skincare"],
  ["odacite-skip", "https://odacite.com", "skincare"],
  ["pai-skip", "https://paiskincare.com", "skincare"],
  ["indie-lee-skip", "https://indielee.com", "skincare"],
  ["evan-healy-skip", "https://evanhealy.com", "skincare"],
  ["annmarie-skip", "https://annmariegianni.com", "skincare"],
  ["kahina-skip", "https://kahina-givingbeauty.com", "skincare"],
  ["may-lindstrom-skip", "https://maylindstrom.com", "skincare"],
  ["three-ships-skip", "https://threeshipsbeauty.com", "skincare"],
  ["one-love-skip", "https://oneloveorganics.com", "skincare"],
  ["farmaesthetics-skip", "https://farmaesthetics.com", "skincare"],
  ["living-libations-skip", "https://livinglibations.com", "skincare"],
  ["vintners-skip", "https://vintnersdaughter.com", "skincare"],
  ["well-people-skip", "https://wellpeople.com", "skincare"],
  ["earth-harbor-skip", "https://earthharbor.com", "skincare"],
  ["evolve-skip", "https://evolvebeauty.co.uk", "skincare"],
  ["mad-hippie-skip", "https://madhippie.com", "skincare"],
  ["honua-skip", "https://honuaskincare.com", "skincare"],
  ["marie-veronique-skip", "https://marieveronique.com", "skincare"],
  ["okoko-skip", "https://okokocosmetiques.com", "skincare"],
  ["mychelle-skip", "https://mychelle.com", "skincare"],
  ["rebrand-skip", "https://rebrandskincare.com", "skincare"],
  ["osea-skip", "https://oseamalibu.com", "skincare"],
  ["youth-skip", "https://youthtothepeople.com", "skincare"],
  ["tata-skip", "https://tataharperskincare.com", "skincare"],
  ["true-botanicals-skip", "https://truebotanicals.com", "skincare"],
  ["herbivore-skip", "https://herbivorebotanicals.com", "skincare"],

  // hair
  ["alaffia", "https://alaffia.com", "hair"],
  ["hairstory", "https://hairstory.com", "hair"],
  ["oway", "https://oway.us", "hair"],
  ["oway-2", "https://oway.com", "hair"],
  ["unscented-co", "https://unscentedco.com", "hair"],
  ["ene-naturals", "https://enenaturals.com", "hair"],
  ["dezia", "https://www.dezia.org", "hair"],
  ["giovanni-skip", "https://giovannicosmetics.com", "hair"],
  ["innersense-skip", "https://innersensebeauty.com", "hair"],
  ["rahua-skip", "https://rahua.com", "hair"],
  ["briogeo-skip", "https://briogeo.com", "hair"],
  ["ouai-skip", "https://theouai.com", "hair"],
  ["pattern-skip", "https://patternbeauty.com", "hair"],
  ["function-skip", "https://functionofbeauty.com", "hair"],
  ["davines-skip", "https://davines.com", "hair"],
  ["act-acre-skip", "https://actandacre.com", "hair"],
  ["mielle-skip", "https://mielleorganics.com", "hair"],
  ["fable-mane-skip", "https://fableandmane.com", "hair"],
  ["vegamour-skip", "https://vegamour.com", "hair"],
  ["verb-skip", "https://verbproducts.com", "hair"],
  ["amika-skip", "https://loveamika.com", "hair"],
  ["camille-rose-skip", "https://camillerose.com", "hair"],
  ["crown-affair-skip", "https://crownaffair.com", "hair"],
  ["melanin-skip", "https://melaninhaircare.com", "hair"],
  ["nuele-skip", "https://nuelehair.com", "hair"],
  ["sienna-skip", "https://www.siennanaturals.com", "hair"],
  ["roz-skip", "https://rozhair.com", "hair"],
  ["plaine-skip", "https://plaineproducts.com", "hair"],
  ["seen-skip", "https://helloseen.com", "hair"],

  // supplements
  ["perelel", "https://perelelhealth.com", "supplements"],
  ["host-defense", "https://hostdefense.com", "supplements"],
  ["om-mushrooms", "https://ommushrooms.com", "supplements"],
  ["jshealth", "https://jshealthvitamins.com", "supplements"],
  ["seeking-health", "https://seekinghealth.com", "supplements"],
  ["gaia-skip", "https://gaiaherbs.com", "supplements"],
  ["herb-pharm-skip", "https://herb-pharm.com", "supplements"],
  ["wenatal-skip", "https://wenatal.com", "supplements"],
  ["beauty-chef-skip", "https://thebeautychef.com", "supplements"],
  ["moon-juice-skip", "https://moonjuice.com", "supplements"],
  ["four-sigmatic-skip", "https://foursigmatic.com", "supplements"],
  ["golde-skip", "https://golde.co", "supplements"],
  ["sakara-skip", "https://sakara.com", "supplements"],
  ["cymbiotika-skip", "https://cymbiotika.com", "supplements"],
  ["megafood-skip", "https://megafood.com", "supplements"],
  ["new-chapter-skip", "https://newchapter.com", "supplements"],
  ["olly-skip", "https://olly.com", "supplements"],
  ["pendulum-skip", "https://pendulumlife.com", "supplements"],
  ["smartypants-skip", "https://smartypantsvitamins.com", "supplements"],
  ["just-thrive-skip", "https://justthrivehealth.com", "supplements"],
  ["bodybio-skip", "https://bodybio.com", "supplements"],
  ["freshcap-skip", "https://freshcap.com", "supplements"],
  ["sun-potion-skip", "https://sunpotion.com", "supplements"],
  ["needed-skip", "https://thisisneeded.com", "supplements"],
  ["anima-mundi-skip", "https://animamundiherbals.com", "supplements"],
  ["fullwell-skip", "https://fullwellfertility.com", "supplements"],
  ["real-mushrooms-skip", "https://realmushrooms.com", "supplements"],
  ["ritual-skip", "https://ritual.com", "supplements"],
  ["ag1-skip", "https://drinkag1.com", "supplements"],
  ["hum-skip", "https://humnutrition.com", "supplements"],
  ["seed-skip", "https://seed.com", "supplements"],
  ["thorne-skip", "https://thorne.com", "supplements"],
  ["mary-ruth-skip", "https://maryruthorganics.com", "supplements"],
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
const queue = [...CANDIDATES.filter(([slug]) => !slug.endsWith("-skip"))];
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
