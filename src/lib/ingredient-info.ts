/** Auto-curated ingredient explainers for product popovers */
export type IngredientInfo = {
  name: string;
  role: string;
  description: string;
};

const byNormalized = new Map<string, IngredientInfo>();

export function normalizeIngredientKey(name: string) {
  return name
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

const INGREDIENTS: IngredientInfo[] = [
  {
    "name": "25% AHA + BHA Complex",
    "role": "Chemical exfoliant blend",
    "description": "A high-strength AHA/BHA peel complex for experienced users—exfoliates dead surface cells; patch test and sun care are essential."
  },
  {
    "name": "Adaptogenic Ginseng",
    "role": "Adaptogen",
    "description": "Ginseng used as an adaptogen for alert energy and resilience—species and standardization vary."
  },
  {
    "name": "Alcohol",
    "role": "Commonly avoided",
    "description": "Drying alcohols can be avoided by sensitive skin; fatty alcohols (cetyl, stearyl) are a different, gentler category."
  },
  {
    "name": "Aloe Barbendensis Leaf Juice",
    "role": "Soothing hydrator",
    "description": "Aloe leaf juice used to hydrate and calm skin with a light, watery feel. (Often listed as Aloe barbadensis.)"
  },
  {
    "name": "Aloe Vera",
    "role": "Soothing hydrator",
    "description": "Aloe gel/juice prized for cooling, hydrating comfort—especially after sun or on irritated-feeling skin."
  },
  {
    "name": "Aluminum",
    "role": "Commonly avoided",
    "description": "Metallic aluminum compounds (not the same as aluminum zirconium salts always)—often avoided in natural deodorant shopping."
  },
  {
    "name": "Aluminum Chlorohydrate",
    "role": "Commonly avoided",
    "description": "An aluminum-based antiperspirant salt that blocks sweat. Many natural deodorants market themselves as aluminum-free."
  },
  {
    "name": "and Sodium Hyaluronate",
    "role": "Mineral",
    "description": "and Sodium Hyaluronate supplies mineral support for wellness, electrolytes, or topical function depending on the product type."
  },
  {
    "name": "and sustainably sourced.",
    "role": "Formula note",
    "description": "A sourcing or formula note from the brand rather than a single INCI active. Check the full ingredient list for the actual components."
  },
  {
    "name": "Animal products",
    "role": "Commonly avoided",
    "description": "Animal-derived ingredients (beeswax, lanolin, etc.) avoided in vegan formulas."
  },
  {
    "name": "Aqua",
    "role": "Solvent",
    "description": "Purified water—the base solvent that dissolves water-soluble actives and makes up much of lotions and serums."
  },
  {
    "name": "Aqua / Water",
    "role": "Solvent",
    "description": "Purified water used as the main solvent in emulsions, gels, and water-based formulas."
  },
  {
    "name": "Arrowroot Powder",
    "role": "Absorbent starch",
    "description": "A fine plant starch that softens texture and helps absorb moisture in powders and deodorants."
  },
  {
    "name": "Artificial Sweeteners",
    "role": "Commonly avoided",
    "description": "Lab-made sweeteners some wellness shoppers prefer to replace with monk fruit, stevia, or unsweetened formulas."
  },
  {
    "name": "Ashwagandha",
    "role": "Adaptogen",
    "description": "An adaptogenic root traditionally used to support stress resilience and balanced energy."
  },
  {
    "name": "Aspergillus Ferment",
    "role": "Ferment filtrate",
    "description": "A ferment filtrate used for gentle enzymatic support and improved skin smoothness."
  },
  {
    "name": "Astaxanthin",
    "role": "Carotenoid antioxidant",
    "description": "A potent red carotenoid antioxidant (often from algae) studied for skin and eye support."
  },
  {
    "name": "Avena Sativa (Oat) Kernel Oil",
    "role": "Emollient oil",
    "description": "Oat kernel oil that comforts dry, reactive-feeling skin with lipid nourishment."
  },
  {
    "name": "B complex (from Blend of Psidium Guajava, Ocimum Sanctum, Citrus Limon Extracts)",
    "role": "Botanical B-vitamin blend",
    "description": "A plant-extract blend traditionally used as a food-form source of B-vitamin co-factors."
  },
  {
    "name": "B12",
    "role": "B vitamin",
    "description": "Vitamin B12, involved in energy metabolism and red blood cell formation; form varies by product."
  },
  {
    "name": "Bacillus Ferment",
    "role": "Ferment filtrate",
    "description": "A probiotic-inspired ferment used to support a balanced-feeling skin microbiome."
  },
  {
    "name": "Baking Soda",
    "role": "Commonly avoided",
    "description": "Baking Soda is listed among ingredients some shoppers prefer to avoid."
  },
  {
    "name": "Bambusa Arundinacea (Bamboo) Stem Extract",
    "role": "Botanical extract",
    "description": "Bamboo is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Beeswax",
    "role": "Structuring wax",
    "description": "A natural wax that thickens balms and sticks, adds occlusive glide, and helps formulas hold their shape."
  },
  {
    "name": "Beet Amino Acid",
    "role": "Amino acids",
    "description": "Amino acids derived from beet chemistry, used for hydration support or nutrition depending on formula."
  },
  {
    "name": "Bentonite",
    "role": "Clay",
    "description": "A absorbent clay that can bind oils and impurities; common in masks and natural deodorants."
  },
  {
    "name": "Bentonite Clay",
    "role": "Clay",
    "description": "A absorbent clay that can bind oils and impurities; common in masks and natural deodorants."
  },
  {
    "name": "Benzyl Benzoate",
    "role": "Fragrance / solvent",
    "description": "An aromatic ester used in fragrance blends and as a solvent; also an EU-listed potential allergen."
  },
  {
    "name": "Benzyl Benzoate Non-GMO",
    "role": "Fragrance / solvent",
    "description": "Non-GMO benzyl benzoate used in scent systems and as a mild solvent for aromatics."
  },
  {
    "name": "Bergamot Oil",
    "role": "Essential oil",
    "description": "Bright citrus-bergamot aroma oil; bergaptene-free grades are preferred to reduce phototoxicity risk."
  },
  {
    "name": "Beta-Glucan",
    "role": "Soothing polysaccharide",
    "description": "A sugar polymer (often from oats or yeast) that helps calm and hydrate the look of stressed skin."
  },
  {
    "name": "Betaine",
    "role": "Osmolyte / hydrator",
    "description": "A moisturizing osmolyte (often sugar-beet derived) that helps skin hold water and feel comfortable."
  },
  {
    "name": "Boswellia Serrata (Frankincense) Oil",
    "role": "Oil",
    "description": "Frankincense adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Bursera Graveolens (Palo Santo) Wood Oil",
    "role": "Essential or carrier oil",
    "description": "Palo Santo oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "C13-15 Alkane",
    "role": "Emollient / solvent",
    "description": "A light hydrocarbon emollient that improves spread and can help wet pigments and UV filters."
  },
  {
    "name": "Cacao Powder",
    "role": "Food botanical",
    "description": "Cacao brings chocolate flavor plus polyphenols; used in superfood blends and drinks."
  },
  {
    "name": "Calcium",
    "role": "Mineral",
    "description": "An essential mineral for bones and teeth; in formulas it may appear as salts that support structure or oral care benefits."
  },
  {
    "name": "Calcium Carbonate",
    "role": "Mineral / abrasive",
    "description": "A mild mineral used as a buffer or gentle polishing agent in pastes and powders."
  },
  {
    "name": "Camellia Oleifera Seed Oil",
    "role": "Emollient oil",
    "description": "Tea-seed oil that absorbs elegantly while softening skin with oleic-rich lipids."
  },
  {
    "name": "Camellia Sinensis (Japanese Green Tea) Leaf Extract",
    "role": "Botanical extract",
    "description": "Japanese Green Tea is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Cananga Odorata (Ylang Ylang) Flower Oil",
    "role": "Essential or carrier oil",
    "description": "Ylang Ylang oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Caprylhydroxamic Acid",
    "role": "Chelating preservative aid",
    "description": "A gentle preservative support ingredient that helps keep water-based formulas microbiologically stable."
  },
  {
    "name": "Caprylic / Capric Triglyceride",
    "role": "Emollient (MCT fraction)",
    "description": "A lightweight fatty-acid ester that softens skin and helps formulas glide without a heavy oil feel."
  },
  {
    "name": "Caprylic/Capric Triglyceride",
    "role": "Emollient (MCT fraction)",
    "description": "A lightweight fraction of coconut/palm fatty acids that softens skin, improves spread, and feels less greasy than many oils."
  },
  {
    "name": "Caprylic/Capric Triglyceride (MCT)",
    "role": "Emollient (MCT)",
    "description": "Medium-chain triglyceride emollient that gives silky slip and helps disperse powders and oils evenly."
  },
  {
    "name": "Capryloyl Glycerin/Sebacic Acid Copolymer",
    "role": "Film former / texture",
    "description": "A polymer that improves wear, reduces shine, and can help sunscreen actives stay evenly spread."
  },
  {
    "name": "Cedarwood Oil",
    "role": "Essential oil",
    "description": "Woody cedar scent oil used for grounding fragrance in natural deodorants and balms."
  },
  {
    "name": "Cedrus Atlantica (Cedarwood) Wood Oil",
    "role": "Essential or carrier oil",
    "description": "Cedarwood oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Cera Alba (Beeswax)",
    "role": "Structuring wax",
    "description": "Beeswax (Cera Alba)—builds structure in balms and sticks while lending a protective, cushiony feel."
  },
  {
    "name": "Ceramide AP",
    "role": "Barrier lipid",
    "description": "A ceramide that supports barrier repair and a healthier-looking moisture seal."
  },
  {
    "name": "Ceramide NP",
    "role": "Barrier lipid",
    "description": "A skin-identical lipid that helps reinforce the moisture barrier and reduce dryness feel."
  },
  {
    "name": "Cetearyl Olivate",
    "role": "Emulsifier",
    "description": "Often paired with sorbitan olivate to create olive-derived emulsifying systems for lotions."
  },
  {
    "name": "Cetyl Alcohol",
    "role": "Fatty alcohol",
    "description": "A waxy fatty alcohol that thickens and softens creams—despite the name, it’s not a drying alcohol."
  },
  {
    "name": "Chelated Essential Minerals",
    "role": "Mineral blend",
    "description": "Essential minerals bound to organic ligands for better uptake in supplement formulas."
  },
  {
    "name": "Chelated Zinc",
    "role": "Chelated mineral",
    "description": "Zinc bound to an organic molecule for improved supplement absorption compared with some inorganic salts."
  },
  {
    "name": "Chloride",
    "role": "Electrolyte",
    "description": "Often paired with sodium or potassium as part of an electrolyte profile for hydration formulas."
  },
  {
    "name": "Cholesterol",
    "role": "Barrier lipid",
    "description": "A lipid naturally found in skin; in formulas it helps ceramides pack correctly for barrier support."
  },
  {
    "name": "Chromium Hydroxide Green (CI 77289)",
    "role": "Colorant",
    "description": "A mineral green colorant (CI 77289) used to tint formulas cosmetically."
  },
  {
    "name": "Cinnamomum Camphora (Ho Wood) Branch/Leaf Oil",
    "role": "Essential or carrier oil",
    "description": "Ho Wood oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Cinnamon",
    "role": "Spice botanical",
    "description": "Warm spice used for scent or flavor; concentrated cinnamon can be sensitizing on skin."
  },
  {
    "name": "Cistus Ladaniferus (Labdanum) Extract",
    "role": "Botanical extract",
    "description": "Labdanum is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Citral",
    "role": "Fragrance allergen",
    "description": "A lemony aldehyde in lemongrass and citrus oils; listed among EU fragrance allergens."
  },
  {
    "name": "Citric Acid",
    "role": "pH adjuster",
    "description": "A mild AHA used mainly to balance formula pH; at higher levels it can also gently exfoliate."
  },
  {
    "name": "Citronellol",
    "role": "Fragrance allergen",
    "description": "A rosy citrus terpene alcohol found in rose and geranium oils; potential sensitizer for some."
  },
  {
    "name": "Citronellyl Methylcrotonate",
    "role": "Fragrance component",
    "description": "A fragrance ingredient contributing fresh, citrus-floral nuances to scent blends."
  },
  {
    "name": "Citrus Aurantium Bergamia (Bergamot, Bergaptene Free) Peel Oil",
    "role": "Essential or carrier oil",
    "description": "Bergamot oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Coco-Caprylate/Caprate",
    "role": "Emollient ester",
    "description": "A coconut-derived emollient with a dry, elegant skin feel—often used to lighten richer oils."
  },
  {
    "name": "Coconut Alkanes",
    "role": "Volatile emollient",
    "description": "Lightweight coconut-derived alkanes that give slip then partially evaporate for a less oily finish."
  },
  {
    "name": "Coconut Ferment",
    "role": "Ferment",
    "description": "A coconut-based ferment that can support microbiome-friendly skin feel and mild conditioning."
  },
  {
    "name": "Coconut Oil",
    "role": "Emollient oil",
    "description": "A nourishing plant oil that softens skin and hair; solid at cooler temps and melts easily on contact."
  },
  {
    "name": "Copaifera Species (Copal) Resin Oil",
    "role": "Oil",
    "description": "Copal adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Copernicia Cerifera (Carnauba) Wax",
    "role": "Hard plant wax",
    "description": "Brazilian carnauba wax—hard and glossy—used to firm sticks and add polish."
  },
  {
    "name": "Cordyceps",
    "role": "Functional mushroom",
    "description": "A performance-oriented mushroom traditionally used for stamina and workout energy."
  },
  {
    "name": "Coumarin",
    "role": "Fragrance allergen",
    "description": "A sweet hay-like aroma compound in tonka and some florals; listed as a potential fragrance allergen."
  },
  {
    "name": "Cymbopogon Flexuosus (Lemongrass) Oil",
    "role": "Oil",
    "description": "Lemongrass adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Cymbopogon Winterianus (Citronella) Leaf Oil",
    "role": "Essential or carrier oil",
    "description": "Citronella oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Dairy",
    "role": "Commonly avoided",
    "description": "Milk-derived ingredients avoided in vegan or dairy-free routines."
  },
  {
    "name": "Dextrin Palmitate",
    "role": "Oil thickener",
    "description": "An oil-gelling agent that turns liquid oils into soft balms or sticks without beeswax."
  },
  {
    "name": "Dilauryl Citrate",
    "role": "Emollient / aid",
    "description": "A citrate ester used for emollience and as a helper ingredient in deodorant and skin-care bases."
  },
  {
    "name": "Dipteryx Odorata (Tonka Bean) Seed Extract",
    "role": "Botanical extract",
    "description": "Tonka Bean is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "DL-Alpha Tocopherol",
    "role": "Antioxidant (vitamin E)",
    "description": "A form of vitamin E added as an antioxidant to help keep oils fresh and support skin comfort."
  },
  {
    "name": "Elettaria Cardamomum (Cardamom) Seed Oil",
    "role": "Essential or carrier oil",
    "description": "Cardamom oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Essential Oil & Botanical Extract for Fragrance: Cistus Ladaniferus (Cistus) Oil",
    "role": "Essential or carrier oil",
    "description": "Cistus oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Ethylhexyl Olivate",
    "role": "Emollient ester",
    "description": "An olive-derived emollient ester that softens skin and boosts cushiony slip."
  },
  {
    "name": "Ethylhexyl Palmitate",
    "role": "Emollient ester",
    "description": "A silky ester that improves spreadability and can give mineral sunscreens a more elegant, less chalky feel."
  },
  {
    "name": "Ethylhexylglycerin",
    "role": "Preservative booster",
    "description": "A skin-conditioning ingredient that also boosts preservative systems so formulas stay fresher with milder systems."
  },
  {
    "name": "Eugenia Caryophillus (Clove) Flower Oil",
    "role": "Essential or carrier oil",
    "description": "Clove oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Eugenol",
    "role": "Fragrance allergen",
    "description": "A spicy-clove phenolic found in clove and cinnamon leaf oils; disclosed as a potential allergen."
  },
  {
    "name": "Euphorbia Cerifera (Candelilla) Wax",
    "role": "Plant wax",
    "description": "Candelilla wax, a vegan structuring wax that firms balms with a clean snap."
  },
  {
    "name": "Fermented L-Glutamine",
    "role": "Amino acid",
    "description": "Glutamine produced via fermentation—popular for gut and recovery-focused supplement routines."
  },
  {
    "name": "Fermented Rice Water",
    "role": "Ferment hydrator",
    "description": "Rice water ferment traditionally used for soft hair and hydrated, calm-feeling skin."
  },
  {
    "name": "Fillers",
    "role": "Commonly avoided",
    "description": "Bulk ingredients with little active benefit—used as a marketing “free-from” claim."
  },
  {
    "name": "Fluoride",
    "role": "Commonly avoided",
    "description": "A mineral used in many toothpastes for cavity prevention; fluoride-free oral care is an intentional alternative."
  },
  {
    "name": "Folate (Metafolin Vitamin B9)",
    "role": "B vitamin",
    "description": "A bioactive folate (5-MTHF / Metafolin) form of vitamin B9 used for methylation support."
  },
  {
    "name": "Fragrance",
    "role": "Commonly avoided",
    "description": "Fragrance is listed among ingredients some shoppers prefer to avoid."
  },
  {
    "name": "Fragrance (Parfum)",
    "role": "Scent",
    "description": "INCI listing for fragrance blends. Lovely for scent lovers; optional to avoid if you’re fragrance-sensitive."
  },
  {
    "name": "Geraniol",
    "role": "Fragrance allergen",
    "description": "A rose-scented terpene alcohol found in geranium and other oils; potential allergen for sensitive noses/skin."
  },
  {
    "name": "Ginger (Zingiber officinale) Root Extract",
    "role": "Botanical extract",
    "description": "Ginger root extract with warming, antioxidant phenolics—used in skin and wellness formulas."
  },
  {
    "name": "Ginkgo",
    "role": "Cognitive botanical",
    "description": "Ginkgo leaf traditionally used for circulation and cognitive support."
  },
  {
    "name": "Ginkgo Leaf Extract",
    "role": "Cognitive botanical",
    "description": "Standardized ginkgo leaf extract used in focus and circulation-oriented formulas."
  },
  {
    "name": "Gluconolactone",
    "role": "PHA",
    "description": "A polyhydroxy acid that offers mild exfoliation with a hydrating, often gentler feel than stronger AHAs."
  },
  {
    "name": "Gluten",
    "role": "Commonly avoided",
    "description": "Wheat-related proteins some people avoid for dietary or skin-sensitivity reasons."
  },
  {
    "name": "Glycerin",
    "role": "Humectant",
    "description": "A classic moisture magnet that pulls water into the skin’s outer layers and helps keep formulas feeling soft, not dry."
  },
  {
    "name": "Glyceryl Laurate",
    "role": "Emollient / co-emulsifier",
    "description": "A monoester that softens skin and can support emulsion stability and mild antimicrobial boost."
  },
  {
    "name": "Harsh Surfactants",
    "role": "Commonly avoided",
    "description": "Strong detergents that can disrupt the skin barrier—gentle brands highlight milder cleansing systems."
  },
  {
    "name": "Helianthus Annuus (Sunflower) Seed Oil",
    "role": "Emollient oil",
    "description": "Sunflower oil—rich in linoleic acid—softens skin and helps stabilize other oils."
  },
  {
    "name": "Helianthus Annuus (Sunflower) Seed Wax",
    "role": "Structuring wax",
    "description": "Sunflower wax that thickens sticks and balms while keeping a plant-based structure."
  },
  {
    "name": "Hemp Protein",
    "role": "Plant protein",
    "description": "A plant protein powder providing amino acids for nutrition formulas—often paired with other proteins for completeness."
  },
  {
    "name": "Himalayan Pink Salt Electrolyte",
    "role": "Electrolyte salt",
    "description": "Pink Himalayan salt used as a mineral-rich sodium source in electrolyte blends."
  },
  {
    "name": "Horsetail",
    "role": "Silica-rich herb",
    "description": "Equisetum (horsetail) traditionally used for silica content in hair, skin, and nail support blends."
  },
  {
    "name": "Hyaluronic Acid",
    "role": "Humectant",
    "description": "A moisture-binding ingredient that helps skin feel plump and hydrated by attracting and holding water."
  },
  {
    "name": "Hydrogenated Methyl Abietate",
    "role": "Resin derivative",
    "description": "A pine-resin–derived ingredient that adds tack and helps stick formulas adhere and flex."
  },
  {
    "name": "Hydroxyapatite",
    "role": "Remineralizing mineral",
    "description": "A calcium phosphate mineral similar to tooth enamel, used in oral care to help remineralize and smooth tooth surfaces."
  },
  {
    "name": "Iodine from Wild Harvested Kelp",
    "role": "Mineral",
    "description": "Iodine from Wild Harvested Kelp supplies mineral support for wellness, electrolytes, or topical function depending on the product type."
  },
  {
    "name": "Ionic Trace Minerals",
    "role": "Trace mineral blend",
    "description": "A spectrum of ionic minerals meant to complement major electrolytes in hydration products."
  },
  {
    "name": "Isoamyl Laurate",
    "role": "Emollient ester",
    "description": "A dry-touch emollient that leaves a soft, powdery finish—popular in natural deodorants and lightweight oils."
  },
  {
    "name": "Isopropyl Palmitate",
    "role": "Emollient ester",
    "description": "A light ester that enhances spread and can help reduce the white cast of mineral UV filters."
  },
  {
    "name": "Isostearic Acid",
    "role": "Fatty acid",
    "description": "A branched fatty acid used to wet pigments, stabilize dispersions, and add emollience in mineral formulas."
  },
  {
    "name": "Jasminum Grandiflorum (Jasmine) Flower Extract",
    "role": "Botanical extract",
    "description": "Jasmine is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Jojoba Oil",
    "role": "Emollient (wax ester)",
    "description": "A liquid wax ester similar to skin’s sebum—lightweight conditioning without a heavy greasy feel for many people."
  },
  {
    "name": "Junk",
    "role": "Commonly avoided",
    "description": "A casual “free-from” marketing phrase for low-quality fillers or additives."
  },
  {
    "name": "L-theanine",
    "role": "Amino acid",
    "description": "An amino acid from tea associated with calm focus—often paired with caffeine or magnesium."
  },
  {
    "name": "Laurel Lysine",
    "role": "Amino acid derivative",
    "description": "A lysine-based ingredient used for conditioning and improved skin or hair feel."
  },
  {
    "name": "Lauryl Glucoside",
    "role": "Mild surfactant",
    "description": "A sugar-based cleanser that lifts oil and dirt with a relatively gentle feel versus harsher sulfates."
  },
  {
    "name": "Lavandula Officinalis (Lavender) Flower Oil",
    "role": "Essential or carrier oil",
    "description": "Lavender oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Lecithin",
    "role": "Emulsifier / lipid",
    "description": "A phospholipid that helps emulsify oils, supports skin feel, and appears in liposomal delivery systems."
  },
  {
    "name": "Leuconostoc / Radish Root Ferment Filtrate",
    "role": "Ferment preservative aid",
    "description": "A radish-root ferment filtrate traditionally used as a natural antimicrobial support in clean beauty."
  },
  {
    "name": "Limonene",
    "role": "Fragrance allergen / terpene",
    "description": "A citrusy terpene naturally in many essential oils; listed as a potential allergen on EU labels."
  },
  {
    "name": "Linalool",
    "role": "Fragrance allergen / terpene",
    "description": "A floral-woody terpene common in lavender and other oils; disclosed as a potential fragrance allergen."
  },
  {
    "name": "Lion's Mane",
    "role": "Functional mushroom",
    "description": "A mushroom traditionally used for focus and cognitive support in modern nootropic blends."
  },
  {
    "name": "Liposomal Glutathione",
    "role": "Antioxidant",
    "description": "The body’s master antioxidant delivered in liposomes for improved stability and uptake in supplements."
  },
  {
    "name": "Liposomal Vitamin C",
    "role": "Antioxidant",
    "description": "Vitamin C delivered in liposomal form, intended to improve stability and absorption compared with some plain ascorbic acid formats."
  },
  {
    "name": "Lonicera Caprifolium (Honeysuckle) Flower Extract",
    "role": "Botanical extract",
    "description": "Honeysuckle is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Lonicera Japonica (Honeysuckle) Flower Extract",
    "role": "Botanical extract",
    "description": "Honeysuckle is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Magnesi-Om",
    "role": "Magnesium formula",
    "description": "A branded magnesium blend positioned for calm, recovery, and daily mineral top-ups."
  },
  {
    "name": "Magnesium",
    "role": "Mineral",
    "description": "An essential mineral involved in muscle relaxation, nerve function, and hundreds of enzyme reactions."
  },
  {
    "name": "Magnesium Chelate Blend (Bisglycinate and Gluconate)",
    "role": "Chelated magnesium blend",
    "description": "A mix of chelated magnesium forms designed for absorption and everyday mineral support."
  },
  {
    "name": "Magnesium Chelate Blend (Citrate, Gluconate, and Acetyl Taurinate)",
    "role": "Chelated magnesium blend",
    "description": "Multiple magnesium chelates combined for broad mineral support and varied absorption pathways."
  },
  {
    "name": "Magnesium Glycinate",
    "role": "Chelated magnesium",
    "description": "Magnesium bound to glycine—often chosen for gentle absorption and calm, evening routines."
  },
  {
    "name": "Magnesium Hydroxide",
    "role": "Alkalizing mineral",
    "description": "A magnesium compound used in some deodorants and formulas for odor control and pH balance."
  },
  {
    "name": "Magtein Magnesium L-threonate",
    "role": "Brain-targeted magnesium",
    "description": "A patented magnesium L-threonate form studied for its ability to raise magnesium levels in the brain."
  },
  {
    "name": "Maleated Soybean Oil Glyceryl/Octyldodecanol Esters",
    "role": "Emollient polymer",
    "description": "A soybean-derived ester blend that softens skin and helps disperse powders in anhydrous systems."
  },
  {
    "name": "Malic Acid",
    "role": "AHA",
    "description": "A fruit-derived AHA that can support gentle exfoliation and brighter-looking skin depending on strength."
  },
  {
    "name": "Maranta Arundinacea (Arrowroot) Root Extract",
    "role": "Absorbent botanical",
    "description": "Arrowroot-derived extract used for silky feel and light moisture absorption in clean formulas."
  },
  {
    "name": "Mentha Piperita (Peppermint) Oil",
    "role": "Oil",
    "description": "Peppermint adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Mentha Spicata (Spearmint) Oil",
    "role": "Oil",
    "description": "Spearmint adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Methylcellulose",
    "role": "Thickener",
    "description": "A plant-derived cellulose gum used to thicken and stabilize watery formulas."
  },
  {
    "name": "Methylheptylglycerin",
    "role": "Preservative aid",
    "description": "A glycerin-derived multifunctional that supports preservation and skin feel in modern clean formulas."
  },
  {
    "name": "Mini Dew",
    "role": "Branded complex",
    "description": "A branded hydration/finish complex used to give skin a dewy, soft glow."
  },
  {
    "name": "Monk Fruit Extract",
    "role": "Natural sweetener",
    "description": "A zero-calorie sweetener from monk fruit (mogrosides) used to sweeten without sugar."
  },
  {
    "name": "Multivitamin Complex A",
    "role": "Vitamin blend",
    "description": "A branded multivitamin complex providing a spread of everyday micronutrients."
  },
  {
    "name": "Myrica Pubescens (Laurel) Fruit Wax",
    "role": "Plant wax",
    "description": "Laurel fruit wax used to thicken and stabilize natural stick formulas."
  },
  {
    "name": "Natural Flavors",
    "role": "Flavoring",
    "description": "Flavor compounds derived from natural sources to improve taste in powders and drinks."
  },
  {
    "name": "Naturally Occurring in Essential Oils and Botanical Extracts: Limonene",
    "role": "Formula ingredient",
    "description": "Naturally Occurring in Essential Oils and Botanical Extracts: Limonene is part of this formula’s INCI list—used for texture, stability, scent, or performance. Tap through to ingredient search to see which other products share it."
  },
  {
    "name": "Niacinamide",
    "role": "Skin-supporting vitamin",
    "description": "A form of vitamin B3 used to support a more even-looking tone, strengthen the skin barrier, and help with oil balance."
  },
  {
    "name": "Non-GMO Zea Mays (Corn) Starch",
    "role": "Absorbent starch",
    "description": "Non-GMO corn starch used for a soft, dry finish and oil/moisture absorption."
  },
  {
    "name": "Ocimum Sanctum (Holy Basil) Oil",
    "role": "Oil",
    "description": "Holy Basil adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Octinoxate",
    "role": "Commonly avoided",
    "description": "A chemical UV filter (octyl methoxycinnamate) often excluded from reef-conscious sunscreen lists."
  },
  {
    "name": "Octyldodecyl Citrate Crosspolymer",
    "role": "Film former",
    "description": "A citrate polymer that adds flexible hold and can improve the elegance of mineral SPF textures."
  },
  {
    "name": "Organic Amla",
    "role": "Vitamin C berry",
    "description": "Amla (Indian gooseberry) is naturally rich in vitamin C and polyphenols for antioxidant support."
  },
  {
    "name": "Organic Amla Berry Extract",
    "role": "Vitamin C berry",
    "description": "Amla berry extract providing food-form vitamin C and antioxidant polyphenols."
  },
  {
    "name": "Organic Ashwagandha",
    "role": "Adaptogen",
    "description": "Organic ashwagandha root used as an adaptogen for stress and steady energy support."
  },
  {
    "name": "Organic Ashwagandha Root and Leaf Extract",
    "role": "Adaptogen",
    "description": "Ashwagandha root and leaf extract used to support calm energy and stress balance."
  },
  {
    "name": "Organic Ashwagandha Root Extract (KSM66)",
    "role": "Adaptogen",
    "description": "KSM-66 is a full-spectrum ashwagandha root extract standardized for consistent adaptogenic support."
  },
  {
    "name": "Organic Astaxanthin",
    "role": "Carotenoid antioxidant",
    "description": "Organic astaxanthin for high-ORAC antioxidant support in beauty-from-within formulas."
  },
  {
    "name": "Organic astragalus",
    "role": "Immune tonic herb",
    "description": "Astragalus root traditionally used as a deep immune and vitality tonic."
  },
  {
    "name": "Organic Astragalus Root Extract",
    "role": "Immune tonic herb",
    "description": "Astragalus root extract used in seasonal immune and qi-tonic style blends."
  },
  {
    "name": "Organic Cacao Powder",
    "role": "Food botanical",
    "description": "Organic cacao powder for rich flavor and cocoa polyphenol content."
  },
  {
    "name": "Organic Caffeine",
    "role": "Stimulant",
    "description": "Organic caffeine for alertness—often balanced with L-theanine or adaptogens in wellness drinks."
  },
  {
    "name": "Organic Chaga Sclerotia Extract",
    "role": "Functional mushroom",
    "description": "Chaga extract rich in antioxidant compounds, used in wellness elixirs and blends."
  },
  {
    "name": "Organic Cocos Nucifera (Coconut) Oil",
    "role": "Emollient oil",
    "description": "Organic coconut oil used as a soft, conditioning emollient in balms and body care."
  },
  {
    "name": "Organic epimedium",
    "role": "Traditional herb",
    "description": "Epimedium (horny goat weed) is a traditional tonic herb used in vitality blends."
  },
  {
    "name": "Organic Fair Trade Certified Butyrospermum Parkii (Shea) Butter",
    "role": "Emollient butter",
    "description": "Fair-trade organic shea butter that nourishes skin with fatty acids and a cushiony, protective feel."
  },
  {
    "name": "Organic Helianthus Annuus (Sunflower) Seed Oil",
    "role": "Emollient oil",
    "description": "Organic sunflower seed oil used as a light, linoleic-rich emollient and carrier."
  },
  {
    "name": "Organic Lion's Mane",
    "role": "Functional mushroom",
    "description": "Organic Lion’s Mane mushroom for cognitive and nerve-support focused wellness formulas."
  },
  {
    "name": "Organic Lion's Mane Mushroom Extract",
    "role": "Functional mushroom",
    "description": "Concentrated Lion’s Mane extract used for focus and everyday cognitive support."
  },
  {
    "name": "Organic maca",
    "role": "Adaptogen root",
    "description": "Andean maca root used for energy, hormone-balance folklore, and nutrient density."
  },
  {
    "name": "Organic Maca Root Extract",
    "role": "Adaptogen root",
    "description": "Concentrated maca root extract for vitality and daily energy support."
  },
  {
    "name": "Organic Olea Europaea (Olive) Oil",
    "role": "Emollient oil",
    "description": "Organic olive oil—nourishing oleic-rich oil for cushiony moisture in balms and soaps."
  },
  {
    "name": "Organic Reishi Mushroom Extract",
    "role": "Functional mushroom",
    "description": "Organic Reishi extract used for grounded calm and immune-season routines."
  },
  {
    "name": "Organic rhodiola",
    "role": "Adaptogen",
    "description": "Organic rhodiola used to support focus and resilience during demanding days."
  },
  {
    "name": "Organic RSPO Certified Elaeis Guineensis (Palm) Oil",
    "role": "Emollient oil",
    "description": "RSPO-certified palm oil used for creamy texture and structure in solid formulas."
  },
  {
    "name": "Organic Schisandra",
    "role": "Adaptogen berry",
    "description": "Organic schisandra berry used as an adaptogen for resilience and everyday vitality."
  },
  {
    "name": "Organic Schisandra Berry Powder",
    "role": "Adaptogen berry",
    "description": "Whole schisandra berry powder for adaptogenic and antioxidant support."
  },
  {
    "name": "Organically Grown Shatavari",
    "role": "Ayurvedic adaptogen",
    "description": "Organically grown shatavari root for traditional women’s wellness formulas."
  },
  {
    "name": "Origanum Majorana (Marjoram) Flower Oil",
    "role": "Essential or carrier oil",
    "description": "Marjoram oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Oryza Sativa (Rice Bran) Oil",
    "role": "Emollient oil",
    "description": "Rice bran oil used for softening slip and antioxidant tocopherols/tocotrienols."
  },
  {
    "name": "Oryza Sativa (Rice) Bran Oil",
    "role": "Emollient oil",
    "description": "Rice bran oil rich in vitamin E compounds; softens skin with a light, elegant finish."
  },
  {
    "name": "Oryza Sativa (Rice) Bran Wax",
    "role": "Structuring wax",
    "description": "Rice bran wax that builds creamy structure in sticks, balms, and butters."
  },
  {
    "name": "Our ingredients are 100% traceable",
    "role": "Formula note",
    "description": "A sourcing or formula note from the brand rather than a single INCI active. Check the full ingredient list for the actual components."
  },
  {
    "name": "Oxybenzone",
    "role": "Commonly avoided",
    "description": "A chemical UV filter that many reef- and “clean SPF” shoppers prefer to avoid."
  },
  {
    "name": "Padina Pavonica Thallus Extract",
    "role": "Brown algae extract",
    "description": "A brown seaweed extract studied for firmness and moisture-barrier support."
  },
  {
    "name": "Panthenol",
    "role": "Pro-vitamin B5",
    "description": "A soothing, hydrating ingredient that helps skin feel soft and comfortable; also used in hair care for shine and manageability."
  },
  {
    "name": "Parabens",
    "role": "Commonly avoided",
    "description": "A class of preservatives some shoppers avoid; modern formulas often use alternative preservation systems."
  },
  {
    "name": "Partially Hydrolyzed Guar Gum",
    "role": "Fiber",
    "description": "A soluble fiber (PHGG) that supports digestion and gentle regularity with less bloating for many people."
  },
  {
    "name": "Pea Protein Isolate",
    "role": "Plant protein",
    "description": "A concentrated pea protein used in shakes and powders for a dairy-free protein boost."
  },
  {
    "name": "Pearl Extract",
    "role": "Mineral beauty extract",
    "description": "Powdered pearl traditionally used in East Asian beauty for luminous-looking skin and mineral content."
  },
  {
    "name": "Pelargonium Graveolens (Geranium) Oil",
    "role": "Oil",
    "description": "Geranium adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Peppermint Oil",
    "role": "Essential oil",
    "description": "Cooling mint oil that freshens breath and can give a tingle in balms—use diluted; strong for sensitive skin."
  },
  {
    "name": "Phenoxyethanol",
    "role": "Preservative",
    "description": "A widely used preservative that protects water-containing products from microbial growth."
  },
  {
    "name": "Phthalates",
    "role": "Commonly avoided",
    "description": "Plasticizer chemicals historically used in some fragrances; many clean brands formulate without them."
  },
  {
    "name": "Physalis Angulata (Ground Cherry) Extract",
    "role": "Botanical extract",
    "description": "A ground-cherry extract used for calming and antioxidant support in skincare."
  },
  {
    "name": "Phytomelatonin",
    "role": "Plant melatonin",
    "description": "Plant-sourced melatonin used to support healthy sleep-wake rhythms."
  },
  {
    "name": "Picea Mariana (Black Spruce) Oil",
    "role": "Oil",
    "description": "Black Spruce adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Piper Nigrum (Black Pepper) Fruit Oil",
    "role": "Essential or carrier oil",
    "description": "Black Pepper oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Plastic Tube",
    "role": "Commonly avoided",
    "description": "Packaging preference note rather than a formula INCI—brands highlighting plastic-free formats."
  },
  {
    "name": "Plukenetia Volubilis (Sacha Inchi) Seed Oil",
    "role": "Emollient oil",
    "description": "Sacha inchi oil naturally high in omega-3/6 fatty acids for soft, conditioned skin."
  },
  {
    "name": "Pogostemon Cablin (Patchouli) Leaf Oil",
    "role": "Essential or carrier oil",
    "description": "Patchouli oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Polyglyceryl-3 Polyricinoleate",
    "role": "Emulsifier",
    "description": "A polyglycerol emulsifier that helps oil and water stay blended in rich creams and sunscreens."
  },
  {
    "name": "Polyglyceryl-4 Diisostearate/Polyhydroxystearate/Sebacate",
    "role": "Emulsifier",
    "description": "A versatile polyglyceryl emulsifier for stable water-in-oil systems like mineral SPF."
  },
  {
    "name": "Polyglyceryl-4 Laurate",
    "role": "Emulsifier",
    "description": "A gentle polyglyceryl surfactant/emulsifier that helps blend oil and water with a mild skin feel."
  },
  {
    "name": "Polyhydroxystearic Acid",
    "role": "Dispersant",
    "description": "A polymer used to keep mineral UV filters and pigments evenly suspended so formulas stay smooth."
  },
  {
    "name": "Polypodium leucotomos Leaf Extract",
    "role": "Fern extract",
    "description": "A fern extract researched for helping skin cope with UV-related oxidative stress (oral or topical depending on product)."
  },
  {
    "name": "Polyricinoleic acid",
    "role": "Dispersant / emulsifier aid",
    "description": "A ricinoleic-derived polymer that helps disperse pigments and stabilize anhydrous or W/O systems."
  },
  {
    "name": "Pongamia Pinnata Seed Extract",
    "role": "Botanical extract",
    "description": "Karanja/pongamia seed extract used in some mineral SPF systems to boost photoprotection aesthetics."
  },
  {
    "name": "Populus Tremuloides Bark Extract",
    "role": "Botanical extract",
    "description": "Populus Tremuloides Bark Extract is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Porphyra Umbilicalis Extract Aqua",
    "role": "Red algae extract",
    "description": "Red algae (nori family) extract used in skincare for moisture and environmental-defense storytelling."
  },
  {
    "name": "Potassium",
    "role": "Electrolyte mineral",
    "description": "An electrolyte mineral that helps regulate fluid balance and muscle function—common in hydration formulas."
  },
  {
    "name": "Potassium Alum",
    "role": "Mineral deodorant salt",
    "description": "A mineral salt crystal traditionally used to inhibit odor-causing bacteria on contact with moisture."
  },
  {
    "name": "Propanediol",
    "role": "Humectant / solvent",
    "description": "A plant-derived glycol that hydrates, improves texture, and helps dissolve other ingredients."
  },
  {
    "name": "Prototheca Moriformis (Microalgae) Oil",
    "role": "Microalgae oil",
    "description": "A microalgae-derived oil providing lightweight emollients and sustainable lipid alternatives."
  },
  {
    "name": "Purified shilajit",
    "role": "Mineral pitch",
    "description": "A purified mineral-rich resin from high mountains, used for energy and trace-mineral support."
  },
  {
    "name": "Quaternium-90 Bentonite",
    "role": "Rheology clay",
    "description": "An organoclay used to thicken and stabilize oil-based gels and suspensions (like mineral sunscreen)."
  },
  {
    "name": "Rebaudioside A (Stevia Leaf Extract)",
    "role": "Natural sweetener",
    "description": "The sweet glycoside from stevia leaves used for sugar-free sweetness."
  },
  {
    "name": "Red Orange (Citrus sinensis) Fruit Extract",
    "role": "Antioxidant fruit extract",
    "description": "Blood/red orange extract rich in vitamin C–related antioxidants for brighter-looking skin."
  },
  {
    "name": "Reishi",
    "role": "Functional mushroom",
    "description": "A traditional “mushroom of immortality,” used for calm, immunity-oriented wellness blends."
  },
  {
    "name": "Rhodiola root extract",
    "role": "Adaptogen",
    "description": "Rhodiola is an adaptogen traditionally used for mental stamina and stress-related fatigue."
  },
  {
    "name": "Rhododendron Ferrugineum (Alpenrose) Extract",
    "role": "Alpine botanical",
    "description": "Alpenrose extract used in alpine skincare stories for resilience against environmental stress."
  },
  {
    "name": "Rosa Damascena (Rose) Extract",
    "role": "Botanical extract",
    "description": "Rose is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Rosemary Extract",
    "role": "Antioxidant botanical",
    "description": "Rosemary extract helps slow oil rancidity and brings antioxidant rosmarinic compounds."
  },
  {
    "name": "Rosmarinus Officinalis (Rosemary) Leaf Extract",
    "role": "Botanical extract",
    "description": "Rosemary is included for plant-derived compounds that support skin comfort, antioxidant defense, or formula character depending on concentration."
  },
  {
    "name": "Rosmarinus Officinalis (Rosemary) Leaf Oil",
    "role": "Essential or carrier oil",
    "description": "Rosemary oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Saccharomyces Ferment",
    "role": "Yeast ferment",
    "description": "A yeast ferment filtrate delivering amino acids and minerals that help skin look revitalized."
  },
  {
    "name": "Salvia Officinalis (Sage) Oil",
    "role": "Oil",
    "description": "Sage adds emollience, slip, or scent. Plant oils condition skin; essential oils mainly scent and should stay diluted."
  },
  {
    "name": "Santalum Austrocaledonicum (Sandalwood) Wood Oil",
    "role": "Essential or carrier oil",
    "description": "Sandalwood oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Schisandra",
    "role": "Adaptogen berry",
    "description": "A five-flavor berry adaptogen traditionally used for vitality, liver support, and stress balance."
  },
  {
    "name": "Sea Salt",
    "role": "Mineral salt",
    "description": "Naturally occurring salt providing sodium and trace minerals; used for electrolytes or gentle exfoliation depending on format."
  },
  {
    "name": "Shatavari",
    "role": "Ayurvedic adaptogen",
    "description": "An Ayurvedic root traditionally used for women’s wellness and soothing adaptogenic support."
  },
  {
    "name": "Shatavari root extract",
    "role": "Ayurvedic adaptogen",
    "description": "Shatavari extract used in herbal blends for calming, restorative support."
  },
  {
    "name": "Shea Butter",
    "role": "Emollient butter",
    "description": "A rich plant butter that softens and comforts dry skin with fatty acids and a creamy melt-on-contact feel."
  },
  {
    "name": "Silica",
    "role": "Mineral / texture aid",
    "description": "A mineral ingredient used for oil absorption, silky texture, or as a dietary silica source depending on the product."
  },
  {
    "name": "Silicones",
    "role": "Commonly avoided",
    "description": "Dimethicone-type ingredients some prefer to skip for a more “natural” texture preference."
  },
  {
    "name": "Silver Ear Mushroom",
    "role": "Functional mushroom",
    "description": "Tremella (silver ear) mushroom prized for hydration—polysaccharides that hold water like a botanical HA."
  },
  {
    "name": "Simmondsia Chinensis (Jojoba) Seed Oil",
    "role": "Emollient (wax ester)",
    "description": "Jojoba seed oil—biomimetic to sebum—used to soften skin and improve slip in anhydrous formulas."
  },
  {
    "name": "SLS",
    "role": "Commonly avoided",
    "description": "Sodium lauryl sulfate—a strong cleanser that foams well but can irritate dry or sensitive skin."
  },
  {
    "name": "Sodium",
    "role": "Electrolyte mineral",
    "description": "An electrolyte that helps maintain fluid balance; in hydration mixes it replaces sodium lost through sweat."
  },
  {
    "name": "Sodium Bicarbonate (Baking Soda)",
    "role": "pH / odor control",
    "description": "Sodium bicarbonate used to neutralize odor. Effective for many people, though sensitive skin may prefer baking-soda-free formulas."
  },
  {
    "name": "Sodium Citrate",
    "role": "pH / chelator",
    "description": "A buffering salt that helps stabilize pH and can assist with chelation in water-based products."
  },
  {
    "name": "Sodium Cocoyl Apple Amino Acids",
    "role": "Mild surfactant",
    "description": "An amino-acid cleanser from coconut/apple chemistry—known for soft foam and mild skin feel."
  },
  {
    "name": "Sodium Hydroxide",
    "role": "pH adjuster",
    "description": "A strong alkali used in tiny amounts to raise pH so the finished formula sits in a skin-appropriate range."
  },
  {
    "name": "Sodium Lauryl Glucose Carboxylate",
    "role": "Mild surfactant",
    "description": "A gentle sugar-derived surfactant used in sulfate-free cleansing systems."
  },
  {
    "name": "Sodium Phytate",
    "role": "Chelator",
    "description": "A plant-derived chelator that binds metal ions to help keep formulas stable and preservatives effective."
  },
  {
    "name": "Sodium Stearoyl Glutamate",
    "role": "Emulsifier",
    "description": "An amino-acid–based emulsifier known for mildness and elegant cream textures."
  },
  {
    "name": "Sorbitan Laurate",
    "role": "Emulsifier",
    "description": "A sorbitan ester emulsifier that helps keep oil and water phases mixed."
  },
  {
    "name": "Sorbitan Olivate",
    "role": "Emulsifier",
    "description": "An olive-based emulsifier that helps form stable, skin-friendly cream textures."
  },
  {
    "name": "Sourcing",
    "role": "Formula note",
    "description": "A sourcing or formula note from the brand rather than a single INCI active. Check the full ingredient list for the actual components."
  },
  {
    "name": "Soy",
    "role": "Commonly avoided",
    "description": "Soy-derived ingredients avoided by some for allergy or personal preference."
  },
  {
    "name": "Spearmint Oil",
    "role": "Essential oil",
    "description": "A sweeter mint essential oil used for fresh scent and oral-care flavor."
  },
  {
    "name": "Spirulina Platensis Extract",
    "role": "Algae extract",
    "description": "Blue-green algae extract packed with nutrients and antioxidants for skin or ingestible formulas."
  },
  {
    "name": "Squalane",
    "role": "Emollient",
    "description": "A lightweight, stable emollient (often plant-derived) that softens skin and helps reduce water loss without heaviness."
  },
  {
    "name": "Sr-wasp spider polypeptide-1 oligopeptide-178",
    "role": "Bioengineered peptide",
    "description": "A lab-designed peptide inspired by spider silk proteins, used for film-forming and skin-feel benefits."
  },
  {
    "name": "Stearic Acid",
    "role": "Fatty acid / thickener",
    "description": "A fatty acid that helps thicken emulsions and stabilize cream textures."
  },
  {
    "name": "Stearyl/Octyldodecyl Citrate Crosspolymer",
    "role": "Film former",
    "description": "A crosslinked citrate polymer for flexible film-forming and smoother mineral sunscreen pay-off."
  },
  {
    "name": "Sucrose Stearate",
    "role": "Emulsifier",
    "description": "A sugar ester emulsifier valued for mildness and a soft skin afterfeel."
  },
  {
    "name": "Sulfates",
    "role": "Commonly avoided",
    "description": "Strong foaming surfactants (like SLS/SLES) that can feel stripping—common “free-from” claim in gentle cleansers."
  },
  {
    "name": "Sunflower Lecithin",
    "role": "Emulsifier / lipid",
    "description": "Sunflower-derived lecithin used to blend oils and support liposomal or creamy textures."
  },
  {
    "name": "Synthetic Fragrance",
    "role": "Commonly avoided",
    "description": "Synthetic Fragrance is listed among ingredients some shoppers prefer to avoid."
  },
  {
    "name": "Theobroma Cacao (Cocoa) Seed Butter",
    "role": "Emollient butter",
    "description": "Cocoa butter—rich, chocolate-scented emollient that softens skin and firms balm textures."
  },
  {
    "name": "Ting",
    "role": "Branded complex",
    "description": "A branded sensory complex used for a distinctive cooling or tingling finish in the formula."
  },
  {
    "name": "Titanium Dioxide",
    "role": "Mineral UV filter",
    "description": "A mineral sunscreen pigment that helps block UV light. Often paired with zinc oxide for broader spectrum coverage."
  },
  {
    "name": "Tocopherol",
    "role": "Antioxidant (vitamin E)",
    "description": "Vitamin E used to help protect oils and skin from oxidation. Often shows up as tocopherol or tocopheryl acetate."
  },
  {
    "name": "Tocopherol Acetate",
    "role": "Antioxidant (vitamin E)",
    "description": "A stable ester of vitamin E that helps defend formula oils and supports skin’s antioxidant defenses."
  },
  {
    "name": "Tocopheryl Acetate",
    "role": "Antioxidant (vitamin E)",
    "description": "A stable ester of vitamin E that helps defend formula oils and supports skin’s antioxidant defenses."
  },
  {
    "name": "Tocos",
    "role": "Vitamin E lipids",
    "description": "Shorthand for nutrient-dense vitamin E–rich oil fractions (tocopherols/tocotrienols) used as antioxidants."
  },
  {
    "name": "Trehalose",
    "role": "Humectant sugar",
    "description": "A protective sugar that helps cells manage moisture stress and keeps formulas feeling soft."
  },
  {
    "name": "Triethyl Citrate",
    "role": "Deodorant aid / solvent",
    "description": "An ester that can help control odor enzymatically and improve fragrance longevity in deodorants."
  },
  {
    "name": "unadulterated",
    "role": "Formula note",
    "description": "A sourcing or formula note from the brand rather than a single INCI active. Check the full ingredient list for the actual components."
  },
  {
    "name": "Undaria Pinnatifida (Wakame) Extract",
    "role": "Seaweed extract",
    "description": "Wakame seaweed extract used for hydration and marine polysaccharide benefits."
  },
  {
    "name": "Vanilla Bean",
    "role": "Flavor / scent botanical",
    "description": "Vanilla bean for cozy aroma and flavor in balms, oils, and ingestibles."
  },
  {
    "name": "Vetiveria Zizanoides (Vetiver) Root Oil",
    "role": "Essential or carrier oil",
    "description": "Vetiver oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  },
  {
    "name": "Vitamin A",
    "role": "Vitamin",
    "description": "A fat-soluble vitamin important for skin renewal and vision; in topicals, related forms (retinoids) are more common than raw vitamin A."
  },
  {
    "name": "Vitamin B Complex (Vitamin B1 B2 B3 Niacin B5 B6 B9)",
    "role": "B-vitamin blend",
    "description": "A multi-B complex covering core B vitamins involved in energy metabolism and everyday cellular function."
  },
  {
    "name": "Vitamin B12 (Methylcobalamin)",
    "role": "B vitamin",
    "description": "The methylcobalamin form of B12, used in supplements for energy metabolism and nervous-system support."
  },
  {
    "name": "Vitamin B3",
    "role": "B vitamin / niacinamide family",
    "description": "Vitamin B3—often as niacinamide in skincare—supports barrier function and a more even-looking complexion."
  },
  {
    "name": "Vitamin C",
    "role": "Antioxidant",
    "description": "An antioxidant vitamin associated with brighter-looking skin and collagen support; delivery form varies by product."
  },
  {
    "name": "Vitamin C from Organic Acerola",
    "role": "Antioxidant",
    "description": "Naturally sourced vitamin C from acerola cherry, used for antioxidant support in wellness formulas."
  },
  {
    "name": "Vitamin D",
    "role": "Vitamin",
    "description": "A fat-soluble vitamin that supports bone and immune health in supplements; not typically a primary topical active."
  },
  {
    "name": "Vitamin D2",
    "role": "Vitamin",
    "description": "An ergocalciferol form of vitamin D used in some plant-leaning supplements."
  },
  {
    "name": "Vitamin E",
    "role": "Antioxidant",
    "description": "An antioxidant vitamin that helps protect lipids from oxidation and supports skin’s natural barrier feel."
  },
  {
    "name": "Vitis Vinifera (Grape) Seed Oil",
    "role": "Emollient oil",
    "description": "Lightweight grape seed oil with a dry feel and polyphenol antioxidant story."
  },
  {
    "name": "Water",
    "role": "Solvent",
    "description": "Purified water used as the main solvent in emulsions, gels, and water-based formulas."
  },
  {
    "name": "Wildcrafted Rhodiola",
    "role": "Adaptogen",
    "description": "Wildcrafted rhodiola root traditionally used for endurance and mental clarity under stress."
  },
  {
    "name": "Wildcrafted Saw Palmetto",
    "role": "Men’s wellness herb",
    "description": "Saw palmetto berry traditionally used in men’s prostate and hair-support formulas."
  },
  {
    "name": "Witch Hazel",
    "role": "Astringent botanical",
    "description": "A toning botanical traditionally used to refresh skin and help it feel tighter and cleaner."
  },
  {
    "name": "Xanthan Gum",
    "role": "Thickener",
    "description": "A fermented polysaccharide gum that thickens water phases and stabilizes gels and serums."
  },
  {
    "name": "Xylitol",
    "role": "Sugar alcohol",
    "description": "A sweet-tasting polyol used in oral care; it doesn’t feed cavity-causing bacteria the way sugar does and can support a fresher mouthfeel."
  },
  {
    "name": "Zea Mays (Corn) Starch",
    "role": "Absorbent starch",
    "description": "Corn starch that helps formulas feel dry-touch and can absorb excess oil or sweat."
  },
  {
    "name": "Zinc",
    "role": "Essential mineral",
    "description": "A trace mineral used for immune and skin support; topical zinc salts can also help with oil and odor control."
  },
  {
    "name": "Zinc Oxide",
    "role": "Mineral UV filter",
    "description": "A mineral sunscreen agent that sits on skin and reflects UVA/UVB. Common in reef-conscious formulas and gentle enough for many sensitive skin types."
  },
  {
    "name": "Zinc Ricinoleate",
    "role": "Odor absorber",
    "description": "A zinc salt used in natural deodorants to help neutralize odor molecules rather than just masking them."
  },
  {
    "name": "Zingiber Officinale (Ginger) Root Oil",
    "role": "Essential or carrier oil",
    "description": "Ginger oil used for aroma and skin feel. Essential oils are concentrated—beautiful in small amounts, and worth patch-testing if your skin is reactive."
  }
];

for (const info of INGREDIENTS) {
  byNormalized.set(normalizeIngredientKey(info.name), info);
}

/** Alias near-duplicate spellings to a canonical entry */
const ALIASES: Record<string, string> = {
  "caprylic / capric triglyceride": "caprylic/capric triglyceride",
  "caprylic/capric triglyceride (mct)": "caprylic/capric triglyceride (mct)",
  "aloe barbendensis leaf juice": "aloe barbendensis leaf juice",
  "and sodium hyaluronate": "sodium hyaluronate",
};

export function getIngredientInfo(name: string): IngredientInfo {
  const key = normalizeIngredientKey(name);
  const alias = ALIASES[key];
  const hit = byNormalized.get(key) || (alias ? byNormalized.get(alias) : undefined);
  if (hit) return hit;

  return {
    name,
    role: "Formula ingredient",
    description: `${name} appears on this product’s ingredient list. Open its page to learn what it does and see other formulas that share it.`,
  };
}

export function getAllIngredientInfo() {
  return INGREDIENTS;
}
