import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTile } from "@/components/ProductTile";
import { getIngredientBySlug, listIngredients, productsForIngredient } from "@/lib/ingredients";

export function generateStaticParams() {
  return listIngredients().map((ingredient) => ({ slug: ingredient.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = getIngredientBySlug(slug);
  return {
    title: ingredient?.name ?? "Ingredient",
    description: ingredient?.description,
  };
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ingredient = getIngredientBySlug(slug);
  if (!ingredient) notFound();

  const matching = productsForIngredient(ingredient.name);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <Link href="/ingredients" className="text-sm text-ink-soft hover:text-ink">
        ← All ingredients
      </Link>

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft/80">{ingredient.role}</p>
      <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
        {ingredient.name}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{ingredient.description}</p>

      <section className="mt-12 border-t border-line pt-10 sm:mt-16 sm:pt-12">
        <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
          Products with {ingredient.name}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {matching.length} product{matching.length === 1 ? "" : "s"} in the marketplace list this ingredient.
        </p>

        {matching.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {matching.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-line bg-white p-8 text-ink-soft">
            No products currently list this ingredient.
          </p>
        )}
      </section>
    </div>
  );
}
