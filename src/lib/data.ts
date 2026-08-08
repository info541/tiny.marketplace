import type { Brand, CommunityPost, Product, Review } from "./types";

export const categories = [
  { id: "sunscreen", label: "Sunscreen", mark: "☀" },
  { id: "deodorant", label: "Deodorant", mark: "✦" },
  { id: "protein", label: "Protein", mark: "◎" },
  { id: "skincare", label: "Skincare", mark: "◇" },
  { id: "hair", label: "Hair care", mark: "∿" },
  { id: "oral", label: "Oral care", mark: "○" },
] as const;

export const brands: Brand[] = [
  {
    id: "b1",
    slug: "solara-lab",
    name: "Solara Lab",
    tagline: "SPF that feels like a second skin",
    story:
      "Two surfers in San Diego got tired of sticky, chalky sunscreen. Solara Lab makes mineral formulas that disappear into skin and still hold up after a full day outside.",
    location: "San Diego, CA",
    founded: 2019,
    categories: ["sunscreen", "skincare"],
    accent: "#F4A261",
    rating: 4.8,
    reviewCount: 312,
    followerCount: 1840,
  },
  {
    id: "b2",
    slug: "pine-and-alum",
    name: "Pine & Alum",
    tagline: "Deodorant that actually lasts",
    story:
      "Born in a Portland garage after one too many aluminum-free fails. Pine & Alum blends botanicals with smart mineral salts — no white cast, no mystery chemicals.",
    location: "Portland, OR",
    founded: 2021,
    categories: ["deodorant"],
    accent: "#2A9D8F",
    rating: 4.6,
    reviewCount: 528,
    followerCount: 3201,
  },
  {
    id: "b3",
    slug: "nourish-co",
    name: "Nourish Co.",
    tagline: "Clean protein, zero chalk",
    story:
      "A small batch protein brand that sources pea and hemp from regenerative farms. Smooth shakes, transparent labels, flavors that taste like food — not candy.",
    location: "Boulder, CO",
    founded: 2020,
    categories: ["protein"],
    accent: "#E76F51",
    rating: 4.7,
    reviewCount: 891,
    followerCount: 5120,
  },
  {
    id: "b4",
    slug: "dewdrop",
    name: "Dewdrop",
    tagline: "Skin that drinks water",
    story:
      "Minimalist skincare from a Brooklyn chemist who believes fewer ingredients done right beat a 40-step routine. Hydration-first, fragrance-free options galore.",
    location: "Brooklyn, NY",
    founded: 2018,
    categories: ["skincare"],
    accent: "#7EB8D4",
    rating: 4.9,
    reviewCount: 1204,
    followerCount: 8900,
  },
  {
    id: "b5",
    slug: "root-ritual",
    name: "Root Ritual",
    tagline: "Hair care rooted in botanicals",
    story:
      "Scalp-first hair care using cold-pressed oils and fermented botanicals. Made in small batches on a family farm outside Asheville.",
    location: "Asheville, NC",
    founded: 2022,
    categories: ["hair"],
    accent: "#9B7EBD",
    rating: 4.5,
    reviewCount: 267,
    followerCount: 1450,
  },
  {
    id: "b6",
    slug: "mint-theory",
    name: "Mint Theory",
    tagline: "Toothpaste you can pronounce",
    story:
      "Hydroxyapatite toothpaste without the plastic tube guilt. Refillable glass jars, gentle whitening, flavors that feel grown-up.",
    location: "Austin, TX",
    founded: 2023,
    categories: ["oral"],
    accent: "#45B69C",
    rating: 4.4,
    reviewCount: 189,
    followerCount: 980,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "daily-sheer-spf50",
    brandId: "b1",
    name: "Daily Sheer SPF 50",
    category: "sunscreen",
    price: 32,
    description:
      "A weightless mineral sunscreen with non-nano zinc oxide. No white cast, reef-conscious, and built for everyday wear under makeup or alone.",
    ingredients: [
      "Zinc Oxide",
      "Squalane",
      "Niacinamide",
      "Hyaluronic Acid",
      "Vitamin E",
      "Coconut Alkanes",
    ],
    freeFrom: ["Oxybenzone", "Octinoxate", "Fragrance", "Parabens"],
    rating: 4.9,
    reviewCount: 214,
    accent: "#F4A261",
    badge: "Staff pick",
  },
  {
    id: "p2",
    slug: "sport-stick-spf40",
    brandId: "b1",
    name: "Sport Stick SPF 40",
    category: "sunscreen",
    price: 24,
    description:
      "Pocket-sized mineral stick for reapplying on the go. Melts on contact — great for runners, kids, and anyone who hates liquid SPF mid-hike.",
    ingredients: [
      "Zinc Oxide",
      "Beeswax",
      "Jojoba Oil",
      "Shea Butter",
      "Tocopherol",
    ],
    freeFrom: ["Oxybenzone", "Octinoxate", "Parabens"],
    rating: 4.7,
    reviewCount: 98,
    accent: "#E9C46A",
  },
  {
    id: "p3",
    slug: "cedar-bergamot-deo",
    brandId: "b2",
    name: "Cedar + Bergamot Deo",
    category: "deodorant",
    price: 18,
    description:
      "Cream deodorant with magnesium and potassium alum. Fresh woody scent that stays put through workouts without clogging pores.",
    ingredients: [
      "Magnesium Hydroxide",
      "Potassium Alum",
      "Arrowroot Powder",
      "Coconut Oil",
      "Bergamot Oil",
      "Cedarwood Oil",
      "Shea Butter",
    ],
    freeFrom: ["Aluminum Chlorohydrate", "Baking Soda", "Phthalates"],
    rating: 4.6,
    reviewCount: 341,
    accent: "#2A9D8F",
    badge: "Community fave",
  },
  {
    id: "p4",
    slug: "unscented-everyday",
    brandId: "b2",
    name: "Unscented Everyday",
    category: "deodorant",
    price: 16,
    description:
      "The same sweat-fighting formula, zero scent. Ideal for sensitive skin and anyone who wants their perfume to do the talking.",
    ingredients: [
      "Magnesium Hydroxide",
      "Potassium Alum",
      "Arrowroot Powder",
      "Coconut Oil",
      "Shea Butter",
      "Vitamin E",
    ],
    freeFrom: ["Aluminum Chlorohydrate", "Baking Soda", "Fragrance"],
    rating: 4.5,
    reviewCount: 187,
    accent: "#264653",
  },
  {
    id: "p5",
    slug: "vanilla-hemp-protein",
    brandId: "b3",
    name: "Vanilla Hemp Protein",
    category: "protein",
    price: 42,
    description:
      "25g plant protein per scoop from hemp + pea. Naturally sweetened with monk fruit. Mixes smooth — no gritty aftertaste.",
    ingredients: [
      "Hemp Protein",
      "Pea Protein Isolate",
      "Monk Fruit Extract",
      "Vanilla Bean",
      "Sunflower Lecithin",
      "Sea Salt",
    ],
    freeFrom: ["Dairy", "Soy", "Gluten", "Artificial Sweeteners"],
    rating: 4.8,
    reviewCount: 456,
    accent: "#E76F51",
    badge: "Best seller",
  },
  {
    id: "p6",
    slug: "cacao-recovery",
    brandId: "b3",
    name: "Cacao Recovery Blend",
    category: "protein",
    price: 46,
    description:
      "Post-workout blend with protein, magnesium glycinate, and real cacao. Tastes like a mocha, recovers like a pro.",
    ingredients: [
      "Pea Protein Isolate",
      "Cacao Powder",
      "Magnesium Glycinate",
      "Hemp Protein",
      "Monk Fruit Extract",
      "Cinnamon",
    ],
    freeFrom: ["Dairy", "Soy", "Gluten", "Whey"],
    rating: 4.7,
    reviewCount: 203,
    accent: "#6D4C41",
  },
  {
    id: "p7",
    slug: "cloud-serum",
    brandId: "b4",
    name: "Cloud Serum",
    category: "skincare",
    price: 38,
    description:
      "A featherweight hyaluronic + ceramides serum that plumps without stickiness. Five ingredients. That's the whole story.",
    ingredients: [
      "Hyaluronic Acid",
      "Ceramide NP",
      "Glycerin",
      "Panthenol",
      "Aqua",
    ],
    freeFrom: ["Fragrance", "Essential Oils", "Alcohol", "Silicones"],
    rating: 4.9,
    reviewCount: 672,
    accent: "#7EB8D4",
    badge: "Editor's love",
  },
  {
    id: "p8",
    slug: "barrier-balm",
    brandId: "b4",
    name: "Barrier Balm",
    category: "skincare",
    price: 28,
    description:
      "Nighttime balm for compromised barriers. Squalane, cholesterol, and fatty acids in a jar you will scrape clean.",
    ingredients: [
      "Squalane",
      "Cholesterol",
      "Ceramide AP",
      "Shea Butter",
      "Jojoba Oil",
    ],
    freeFrom: ["Fragrance", "Essential Oils", "Parabens"],
    rating: 4.8,
    reviewCount: 389,
    accent: "#A8DADC",
  },
  {
    id: "p9",
    slug: "scalp-tonic",
    brandId: "b5",
    name: "Scalp Tonic",
    category: "hair",
    price: 34,
    description:
      "Leave-in tonic with rosemary, peppermint, and fermented rice water. Wakes up sleepy scalps without weighing hair down.",
    ingredients: [
      "Rosemary Extract",
      "Peppermint Oil",
      "Fermented Rice Water",
      "Aloe Vera",
      "Niacinamide",
      "Witch Hazel",
    ],
    freeFrom: ["Sulfates", "Silicones", "Parabens"],
    rating: 4.5,
    reviewCount: 142,
    accent: "#9B7EBD",
  },
  {
    id: "p10",
    slug: "hap-toothpaste",
    brandId: "b6",
    name: "nHA Toothpaste",
    category: "oral",
    price: 22,
    description:
      "Nano-hydroxyapatite toothpaste in a refillable jar. Remineralizes enamel gently — no harsh whitening burn.",
    ingredients: [
      "Hydroxyapatite",
      "Xylitol",
      "Calcium Carbonate",
      "Coconut Oil",
      "Spearmint Oil",
      "Bentonite Clay",
    ],
    freeFrom: ["Fluoride", "SLS", "Titanium Dioxide", "Plastic Tube"],
    rating: 4.4,
    reviewCount: 156,
    accent: "#45B69C",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    brandId: "b1",
    author: "Maya K.",
    rating: 5,
    title: "Finally, SPF that doesn't pill",
    body: "I wear this under foundation every day. Zero white cast on my medium-deep skin and it plays nice with my Dewdrop serum. Solara gets it.",
    helpful: 48,
    daysAgo: 3,
  },
  {
    id: "r2",
    productId: "p3",
    brandId: "b2",
    author: "Jordan T.",
    rating: 5,
    title: "Survived a Texas summer",
    body: "I was skeptical of cream deodorants. This one made it through 90° days and a spin class. The cedar scent is subtle, not cologne-y.",
    helpful: 72,
    daysAgo: 7,
  },
  {
    id: "r3",
    productId: "p5",
    brandId: "b3",
    author: "Sam R.",
    rating: 4,
    title: "Actually mixes without a blender",
    body: "Shaken in a bottle with oat milk — smooth. Vanilla is real, not perfume. Wish the bag was a little bigger but quality over quantity.",
    helpful: 31,
    daysAgo: 12,
  },
  {
    id: "r4",
    productId: "p7",
    brandId: "b4",
    author: "Priya N.",
    rating: 5,
    title: "Five ingredients. Miraculous.",
    body: "My reactive skin usually freaks out at new serums. Cloud Serum is the first thing that hydrated without a flare. Obsessed.",
    helpful: 95,
    daysAgo: 2,
  },
  {
    id: "r5",
    brandId: "b2",
    author: "Chris L.",
    rating: 4,
    title: "Solid brand, great people",
    body: "Reached out about a sensitive-skin swap and they sent samples of the unscented. Tiny brands that care like this are why I shop here.",
    helpful: 22,
    daysAgo: 18,
  },
  {
    id: "r6",
    productId: "p10",
    brandId: "b6",
    author: "Alex M.",
    rating: 5,
    title: "Glass jar > plastic tube",
    body: "Taste is clean spearmint. Teeth feel smoother after two weeks. Refill program is easy. Mint Theory is onto something.",
    helpful: 19,
    daysAgo: 9,
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "c1",
    author: "lena.shops.small",
    topic: "Finds",
    title: "Anyone else replace their whole bathroom with tiny brands?",
    body: "Started with Pine & Alum, now I'm fully Solara + Dewdrop + Mint Theory. Curious what your 'complete swap' looks like.",
    replies: 34,
    likes: 128,
    hoursAgo: 4,
    tags: ["routine", "swap"],
  },
  {
    id: "c2",
    author: "zinc.or.bust",
    topic: "Ingredients",
    title: "Non-nano zinc: what % actually works for you?",
    body: "Solara's Daily Sheer is 20% and I don't burn. Curious if anyone's found a lower % that still holds for outdoor runs.",
    replies: 21,
    likes: 67,
    hoursAgo: 11,
    tags: ["sunscreen", "zinc oxide"],
  },
  {
    id: "c3",
    author: "protein.nerd",
    topic: "Taste test",
    title: "Nourish Co. cacao vs. the big brands",
    body: "Blind tasted with roommates. Nourish won 3–1. The magnesium in the recovery blend is a quiet hero for my sleep.",
    replies: 15,
    likes: 89,
    hoursAgo: 26,
    tags: ["protein", "review"],
  },
  {
    id: "c4",
    author: "sensitive.skin.club",
    topic: "Help",
    title: "Fragrance-free deodorant that doesn't itch?",
    body: "Baking soda wrecks me. Trying Pine & Alum Unscented next — any other free-from lists I should filter for?",
    replies: 42,
    likes: 156,
    hoursAgo: 8,
    tags: ["deodorant", "sensitive"],
  },
  {
    id: "c5",
    author: "apothecary.alex",
    topic: "Brands",
    title: "Root Ritual scalp tonic — week 3 update",
    body: "Less itch, more volume at the crown. Smells like a spa walk through a herb garden. Supporting Asheville feels good too.",
    replies: 9,
    likes: 44,
    hoursAgo: 40,
    tags: ["hair", "update"],
  },
];

export const popularIngredients = [
  "Zinc Oxide",
  "Hyaluronic Acid",
  "Niacinamide",
  "Squalane",
  "Magnesium Hydroxide",
  "Hemp Protein",
  "Hydroxyapatite",
  "Ceramide NP",
  "Monk Fruit Extract",
  "Rosemary Extract",
  "Shea Butter",
  "Pea Protein Isolate",
];

export const avoidIngredients = [
  "Oxybenzone",
  "Octinoxate",
  "Aluminum Chlorohydrate",
  "Baking Soda",
  "Fragrance",
  "Parabens",
  "SLS",
  "Artificial Sweeteners",
];

export function getBrand(idOrSlug: string) {
  return brands.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
}

export function getProduct(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function productsForBrand(brandId: string) {
  return products.filter((p) => p.brandId === brandId);
}

export function reviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function reviewsForBrand(brandId: string) {
  return reviews.filter((r) => r.brandId === brandId);
}

export function searchByIngredient(query: string, mode: "contains" | "free-from" = "contains") {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  if (mode === "free-from") {
    return products.filter(
      (p) =>
        p.freeFrom.some((i) => i.toLowerCase().includes(q)) ||
        !p.ingredients.some((i) => i.toLowerCase().includes(q)),
    );
  }
  return products.filter(
    (p) =>
      p.ingredients.some((i) => i.toLowerCase().includes(q)) ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}
