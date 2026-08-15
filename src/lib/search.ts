import { brands, categories, getBrand, products } from "@/lib/data";
import { listIngredients } from "@/lib/ingredients";

export type SearchHit =
  | {
      type: "product";
      id: string;
      href: string;
      title: string;
      subtitle: string;
      accent: string;
      imageUrl?: string;
      score: number;
    }
  | {
      type: "brand";
      id: string;
      href: string;
      title: string;
      subtitle: string;
      accent: string;
      imageUrl?: string;
      score: number;
    }
  | {
      type: "category";
      id: string;
      href: string;
      title: string;
      subtitle: string;
      mark: string;
      score: number;
    }
  | {
      type: "ingredient";
      id: string;
      href: string;
      title: string;
      subtitle: string;
      score: number;
    };

function scoreMatch(haystack: string, needle: string) {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (!n) return 0;
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  const idx = h.indexOf(n);
  if (idx === 0) return 80;
  if (idx > 0) return 50 - Math.min(idx, 20);
  // token start
  const tokens = h.split(/[\s,/()-]+/);
  if (tokens.some((t) => t.startsWith(n))) return 65;
  return 0;
}

const ingredientIndex = listIngredients();

export function searchCatalog(query: string, limit = 8): SearchHit[] {
  const needle = query.trim();
  if (needle.length < 1) return [];

  const hits: SearchHit[] = [];

  for (const product of products) {
    const brand = getBrand(product.brandId);
    const nameScore = scoreMatch(product.name, needle);
    const brandScore = brand ? scoreMatch(brand.name, needle) * 0.7 : 0;
    const descScore = scoreMatch(product.description, needle) * 0.35;
    const ingScore = Math.max(0, ...product.ingredients.map((ing) => scoreMatch(ing, needle) * 0.55));
    const score = Math.max(nameScore, brandScore, descScore, ingScore);
    if (score <= 0) continue;
    hits.push({
      type: "product",
      id: product.id,
      href: `/products/${product.slug}`,
      title: product.name,
      subtitle: brand ? `${brand.name} · $${product.price}` : `$${product.price}`,
      accent: product.accent,
      imageUrl: product.imageUrl,
      score: score + product.rating * 0.5,
    });
  }

  for (const brand of brands) {
    const score = Math.max(scoreMatch(brand.name, needle), scoreMatch(brand.tagline, needle) * 0.4);
    if (score <= 0) continue;
    hits.push({
      type: "brand",
      id: brand.id,
      href: `/brands/${brand.slug}`,
      title: brand.name,
      subtitle: brand.tagline,
      accent: brand.accent,
      imageUrl: brand.logoUrl,
      score: score + 2,
    });
  }

  for (const cat of categories) {
    const score = scoreMatch(cat.label, needle);
    if (score <= 0) continue;
    hits.push({
      type: "category",
      id: cat.id,
      href: `/browse?cat=${cat.id}`,
      title: cat.label,
      subtitle: "Category",
      mark: cat.mark,
      score: score + 1,
    });
  }

  for (const ing of ingredientIndex) {
    const score = scoreMatch(ing.name, needle);
    if (score < 50) continue;
    hits.push({
      type: "ingredient",
      id: ing.slug,
      href: `/ingredient/${ing.slug}`,
      title: ing.name,
      subtitle: ing.role,
      score: score - 5,
    });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

export type ProductSearchHit = Extract<SearchHit, { type: "product" }>;

export type CompareSuggestion = {
  slug: string;
  name: string;
  brandName: string;
  price: number;
  imageUrl?: string;
  accent: string;
};

export function searchProducts(
  query: string,
  options?: { excludeSlugs?: string[]; limit?: number },
): ProductSearchHit[] {
  const exclude = new Set(options?.excludeSlugs ?? []);
  const limit = options?.limit ?? 8;

  return searchCatalog(query, 40)
    .filter((hit): hit is ProductSearchHit => hit.type === "product")
    .filter((hit) => !exclude.has(hit.href.replace("/products/", "")))
    .slice(0, limit);
}

export function getCompareSuggestions(currentSlug: string, limit = 8): CompareSuggestion[] {
  const current = products.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const pool = products.filter((p) => p.slug !== currentSlug);
  const ranked = [
    ...pool.filter((p) => p.category === current.category),
    ...pool.filter((p) => p.category !== current.category),
  ];

  return ranked.slice(0, limit).map((p) => {
    const brand = getBrand(p.brandId);
    return {
      slug: p.slug,
      name: p.name,
      brandName: brand?.name ?? "",
      price: p.price,
      imageUrl: p.imageUrl,
      accent: p.accent,
    };
  });
}

export function highlightMatch(text: string, query: string) {
  const needle = query.trim();
  if (!needle) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const idx = lower.indexOf(needle.toLowerCase());
  if (idx < 0) return [{ text, match: false }];
  return [
    { text: text.slice(0, idx), match: false },
    { text: text.slice(idx, idx + needle.length), match: true },
    { text: text.slice(idx + needle.length), match: false },
  ].filter((part) => part.text.length > 0);
}
