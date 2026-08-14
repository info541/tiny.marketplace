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
