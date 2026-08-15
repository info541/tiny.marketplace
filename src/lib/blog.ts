import { categories, getProduct } from "./data";
import type { BlogPost, Product } from "./types";

const amazonFallback: Record<string, string> = {
  "whole-care-natural-peppermint-toothpaste-with-fluoride":
    "https://www.amazon.com/Toms-Maine-Fluoride-Toothpaste-Peppermint/dp/B004I7756S?linkCode=ll2&tag=22258941-20&language=en_US&ref_=as_li_ss_tl",
};

export function blogDisplayName(name: string) {
  return name.replaceAll("-", " ");
}

export function formatBlogPrice(price: number) {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export function amazonShopUrl(product: Product) {
  if (product.affiliateUrl?.includes("amazon.com")) return product.affiliateUrl;
  return amazonFallback[product.slug];
}

export function categoryLabel(category: Product["category"]) {
  return categories.find((item) => item.id === category)?.label ?? category;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "5-products-we-actually-use",
    title: "5 products we actually use",
    excerpt:
      "Toothpaste, deodorant, SPF, a moisturizer, and a magnesium powder. Nothing fancy, just stuff we like.",
    publishedAt: "2026-08-14",
    author: "tiny",
    productSlugs: [
      "whole-care-natural-peppermint-toothpaste-with-fluoride",
      "palo-santo-frankincense-deodorant",
      "daily-defender-sunscreen",
      "deeper-dive-moisturizer",
      "magnesi-om",
    ],
    body: [
      {
        type: "paragraph",
        text: "First post! We picked five products from the shop that we actually use. Not a whole routine, just the regular stuff.",
      },
      {
        type: "heading",
        text: "Tom’s of Maine Whole Care",
      },
      {
        type: "paragraph",
        text: "Basic peppermint toothpaste with fluoride. It’s been around forever, the label is easy to read, and it tastes like toothpaste. Hard to mess this one up.",
      },
      { type: "product", slug: "whole-care-natural-peppermint-toothpaste-with-fluoride" },
      {
        type: "heading",
        text: "Humble Palo Santo & Frankincense",
      },
      {
        type: "paragraph",
        text: "Deodorant with no aluminum, from Santa Fe. This is their strongest scent (they rate it 5/5) and it’s still under $12. Has baking soda in it, so if that bothers your skin they make a version without it.",
      },
      { type: "product", slug: "palo-santo-frankincense-deodorant" },
      {
        type: "heading",
        text: "Freaks of Nature Daily Defender SPF 30",
      },
      {
        type: "paragraph",
        text: "Mineral sunscreen for everyday. Zinc oxide, no chemical filters, no fragrance. It’s light enough to wear in the morning and not think about until you need to reapply.",
      },
      { type: "product", slug: "daily-defender-sunscreen" },
      {
        type: "heading",
        text: "Freaks of Nature Deeper Dive Hydrator",
      },
      {
        type: "paragraph",
        text: "A moisturizer with eight ingredients. Squalane, some oils, a little ferment. We use it after SPF or at night. Short list, does the job.",
      },
      { type: "product", slug: "deeper-dive-moisturizer" },
      {
        type: "heading",
        text: "Moon Juice magnesium",
      },
      {
        type: "paragraph",
        text: "Magnesium powder you mix with water before bed. No fillers, lots of reviews. That’s pretty much it.",
      },
      { type: "product", slug: "magnesi-om" },
      {
        type: "paragraph",
        text: "That’s five. Shop them on Amazon below, or open the product page if you want more.",
      },
    ],
  },
  {
    slug: "deodorant-under-12",
    title: "Deodorant under $12",
    excerpt:
      "Four Humble Brands sticks we keep coming back to — aluminum-free, Santa Fe–made, and none of them break the bank.",
    publishedAt: "2026-08-12",
    author: "tiny",
    productSlugs: [
      "bergamot-ginger-deodorant",
      "mountain-lavender-deodorant",
      "unscented-deodorant",
      "baking-soda-free-sensitive-skin-unscented-deodorant",
    ],
    body: [
      {
        type: "paragraph",
        text: "Deodorant is one of those things you don’t need to overthink. Humble Brands makes aluminum-free sticks in Santa Fe for about eleven bucks. Here are four we actually rotate through.",
      },
      {
        type: "heading",
        text: "Bergamot & Ginger",
      },
      {
        type: "paragraph",
        text: "Light scent (they rate it 2/5), citrus-meets-spice, gender-neutral. Good everyday pick if you want something that shows up without taking over the room.",
      },
      { type: "product", slug: "bergamot-ginger-deodorant" },
      {
        type: "heading",
        text: "Mountain Lavender",
      },
      {
        type: "paragraph",
        text: "Also a 2/5 on intensity. Soft lavender, not the heavy spa kind. Easy morning stick when you want something calm.",
      },
      { type: "product", slug: "mountain-lavender-deodorant" },
      {
        type: "heading",
        text: "Unscented",
      },
      {
        type: "paragraph",
        text: "Literally nothing on the scent scale. Same base as the others — MCT, corn starch, baking soda, beeswax — just no essential oils. Great if fragrance bothers you or you layer other products.",
      },
      { type: "product", slug: "unscented-deodorant" },
      {
        type: "heading",
        text: "Baking soda–free unscented",
      },
      {
        type: "paragraph",
        text: "If regular natural deodorant makes your pits mad, start here. Magnesium hydroxide instead of baking soda, still unscented, still under $12.",
      },
      { type: "product", slug: "baking-soda-free-sensitive-skin-unscented-deodorant" },
      {
        type: "paragraph",
        text: "That’s the under-$12 lineup. Grab one scent, or try the sensitive version if your skin is picky.",
      },
    ],
  },
  {
    slug: "mineral-spf-we-pack",
    title: "Mineral SPF we pack",
    excerpt:
      "A face lotion, a stick for reapplying, and a spray for arms and legs. All zinc, no chemical filters.",
    publishedAt: "2026-08-10",
    author: "tiny",
    productSlugs: [
      "peak-performance-sunscreen",
      "sun-stick-spf50",
      "solar-shield-spray",
    ],
    body: [
      {
        type: "paragraph",
        text: "We don’t mess with chemical filters much. These three Freaks of Nature mineral SPFs cover face, touch-ups, and the rest of the body without oxybenzone or octinoxate.",
      },
      {
        type: "heading",
        text: "Peak Performance SPF 50",
      },
      {
        type: "paragraph",
        text: "Zinc + titanium face-and-body lotion. Lightweight for SPF 50, no fragrance, and it doesn’t feel greasy after it settles. This is the one we put on before leaving the house.",
      },
      { type: "product", slug: "peak-performance-sunscreen" },
      {
        type: "heading",
        text: "Peak Performance Sun Stick SPF 50",
      },
      {
        type: "paragraph",
        text: "Same protection idea, stick format. Easy to throw in a bag and swipe on ears, nose, and cheekbones without digging for a bottle. No fragrance either.",
      },
      { type: "product", slug: "sun-stick-spf50" },
      {
        type: "heading",
        text: "Solar Shield SPF 30 Spray",
      },
      {
        type: "paragraph",
        text: "Full-body mineral spray with aloe and green tea in the mix. Useful for arms, legs, and the spots lotion is annoying to spread. Still zinc-based, still fragrance-free.",
      },
      { type: "product", slug: "solar-shield-spray" },
      {
        type: "paragraph",
        text: "Lotion in the morning, stick for reapply, spray when you’re covering more skin. That’s the whole kit.",
      },
    ],
  },
  {
    slug: "evening-wind-down",
    title: "Evening wind-down",
    excerpt:
      "Magnesium before bed, a little hydration, and one stress formula for the days that need it.",
    publishedAt: "2026-08-08",
    author: "tiny",
    productSlugs: ["sleepy-magnesi-om", "mini-dew", "superyou"],
    body: [
      {
        type: "paragraph",
        text: "Not a complicated night routine — just three Moon Juice things we mix into water when we want to slow down.",
      },
      {
        type: "heading",
        text: "Sleepy Magnesi-Om",
      },
      {
        type: "paragraph",
        text: "Magnesium plus plant melatonin and L-theanine. Mix with water before bed. Same vibe as regular Magnesi-Om, but pointed at sleep.",
      },
      { type: "product", slug: "sleepy-magnesi-om" },
      {
        type: "heading",
        text: "Mini Dew",
      },
      {
        type: "paragraph",
        text: "Electrolytes and minerals — Himalayan salt, chelated minerals, trace minerals. We use it in the evening when water alone feels flat, or after a long day outside.",
      },
      { type: "product", slug: "mini-dew" },
      {
        type: "heading",
        text: "SuperYou",
      },
      {
        type: "paragraph",
        text: "Daily cortisol support: ashwagandha, amla, shatavari, rhodiola. More of a daytime/evening stress formula than a sleep powder, but it pairs well with the wind-down stack on loud weeks.",
      },
      { type: "product", slug: "superyou" },
      {
        type: "paragraph",
        text: "Powder, sip, done. Nothing fancy — just the stuff that helps the day end.",
      },
    ],
  },
];

export function formatBlogDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function productsForPost(post: BlogPost) {
  return post.productSlugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
}
