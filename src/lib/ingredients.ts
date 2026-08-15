import { products } from "@/lib/data";
import { getIngredientInfo, normalizeIngredientKey } from "@/lib/ingredient-info";
import type { Product } from "@/lib/types";

export type IngredientEntry = {
  slug: string;
  name: string;
  role: string;
  description: string;
  productCount: number;
};

function isCatalogIngredient(name: string) {
  const n = name.trim();
  if (n.length < 2 || n.length > 90) return false;
  if (/^(and |our ingredients|sourcing\b)/i.test(n)) return false;
  if (/unadulterated|100% traceable|sustainably sourced/i.test(n)) return false;
  return true;
}

export function slugifyIngredient(name: string) {
  return name
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCatalog() {
  const groups = new Map<string, { name: string; productIds: Set<string> }>();

  for (const product of products) {
    for (const raw of product.ingredients) {
      if (!isCatalogIngredient(raw)) continue;
      const key = normalizeIngredientKey(raw);
      const existing = groups.get(key);
      if (existing) {
        existing.productIds.add(product.id);
      } else {
        groups.set(key, { name: raw.trim(), productIds: new Set([product.id]) });
      }
    }
  }

  const usedSlugs = new Set<string>();
  const bySlug = new Map<string, IngredientEntry>();
  const byKey = new Map<string, IngredientEntry>();
  const productsByKey = new Map<string, string[]>();

  const sorted = [...groups.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name, "en"));

  for (const [key, group] of sorted) {
    const info = getIngredientInfo(group.name);
    let slug = slugifyIngredient(info.name) || slugifyIngredient(group.name);
    if (!slug) continue;
    if (usedSlugs.has(slug)) {
      let i = 2;
      while (usedSlugs.has(`${slug}-${i}`)) i += 1;
      slug = `${slug}-${i}`;
    }
    usedSlugs.add(slug);

    const entry: IngredientEntry = {
      slug,
      name: info.name,
      role: info.role,
      description: info.description,
      productCount: group.productIds.size,
    };
    bySlug.set(slug, entry);
    byKey.set(key, entry);
    productsByKey.set(key, [...group.productIds]);
  }

  return { bySlug, byKey, productsByKey, list: [...bySlug.values()] };
}

const catalog = buildCatalog();

/** Glossary index — skip one-off parse noise; rare ingredients stay reachable via product links. */
const INDEX_MIN_PRODUCTS = 2;

export function listIngredients(options?: { minProductCount?: number }) {
  const min = options?.minProductCount ?? INDEX_MIN_PRODUCTS;
  if (min <= 1) return catalog.list;
  return catalog.list.filter((entry) => entry.productCount >= min);
}

export function getIngredientBySlug(slug: string) {
  return catalog.bySlug.get(slug);
}

export function getIngredientByName(name: string) {
  return catalog.byKey.get(normalizeIngredientKey(name));
}

export function ingredientHref(name: string) {
  const entry = getIngredientByName(name);
  return entry ? `/ingredient/${entry.slug}` : `/ingredients?q=${encodeURIComponent(name)}`;
}

export function productsForIngredient(name: string): Product[] {
  const key = normalizeIngredientKey(name);
  const entry = catalog.byKey.get(key);
  const ids = new Set<string>(catalog.productsByKey.get(key) ?? []);
  if (entry) {
    const aliasKey = normalizeIngredientKey(entry.name);
    for (const id of catalog.productsByKey.get(aliasKey) ?? []) ids.add(id);
  }
  if (!ids.size) return [];
  return products.filter((product) => ids.has(product.id));
}
