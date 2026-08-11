import Link from "next/link";
import { BrandMarquee } from "@/components/BrandMarquee";
import { BrandTile } from "@/components/BrandTile";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { ProductTile } from "@/components/ProductTile";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeading } from "@/components/ui";
import { brands, categories, communityPosts, products, reviews } from "@/lib/data";

export default function HomePage() {
  const featured = products.filter((p) => p.badge).slice(0, 3);
  const latestTalk = communityPosts.slice(0, 3);
  const spotlightReviews = reviews.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="market-grid absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, color-mix(in oklab, #e7f2ec 88%, transparent) 0%, color-mix(in oklab, #e7f2ec 55%, transparent) 42%, transparent 68%), linear-gradient(160deg, #1f8a7a 0%, #0f5c52 38%, #142821 100%)",
          }}
        />
        <div className="absolute inset-y-0 right-0 hidden w-[54%] md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(242,226,122,0.45),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(255,90,60,0.28),transparent_50%)]" />
          <div className="animate-floaty absolute left-[12%] top-[18%] h-44 w-28 rotate-[-18deg] rounded-[1.5rem] border border-white/30 bg-white/20 shadow-2xl backdrop-blur-md" />
          <div className="animate-floaty absolute right-[18%] top-[28%] h-56 w-36 rotate-[10deg] rounded-[1.75rem] border border-white/25 bg-[color-mix(in_oklab,#f2e27a_70%,white)] shadow-2xl delay-2" />
          <div className="animate-floaty absolute bottom-[18%] left-[28%] h-40 w-40 rounded-full border border-white/20 bg-[color-mix(in_oklab,#ff5a3c_55%,white)] opacity-90 delay-1" />
          <div className="absolute right-[8%] bottom-[22%] max-w-[14rem] rounded-2xl border border-white/25 bg-white/15 p-4 text-sm text-white/90 backdrop-blur-md">
            <p className="font-display text-lg font-bold">Small brands. Real labels.</p>
            <p className="mt-1 text-white/75">Sunscreen · deodorant · electrolytes · more</p>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-12 sm:px-5 sm:py-16 md:px-8">
          <p className="animate-rise font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-[-0.05em] text-ink sm:text-5xl md:text-7xl lg:text-8xl">
            the tiny
            <br />
            marketplace
          </p>
          <p className="animate-rise delay-1 mt-5 max-w-md text-base text-ink-soft sm:mt-6 sm:text-lg md:text-xl">
            Discover small cosmetic brands, peek inside the ingredients, and talk about what actually works.
          </p>
          <div className="animate-rise delay-2 mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap">
            <Link href="/browse" className="btn btn-primary btn-stack">
              Start browsing
            </Link>
            <Link href="/ingredients" className="btn btn-ghost btn-stack">
              Search ingredients
            </Link>
          </div>
        </div>
      </section>

      <BrandMarquee />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Start in the bathroom cabinet"
          subtitle="Cosmetics & wellness first — sunscreen, deodorant, protein, electrolytes, skincare, hair, and oral care from brands worth rooting for."
        />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/browse?cat=${cat.id}`}
              className="surface group rounded-[1.25rem] p-3 text-center transition hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="font-display text-xl text-teal-deep sm:text-2xl" aria-hidden>
                {cat.mark}
              </span>
              <p className="mt-1.5 font-display text-base font-bold tracking-[-0.02em] sm:mt-2 sm:text-lg">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 md:px-8">
        <SectionHeading
          eyebrow="Staff picks"
          title="Little brands, loud formulas"
          subtitle="Hand-picked products with transparent labels and reviews from people who actually use them."
          href="/browse"
          linkLabel="See all"
        />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
        <SectionHeading
          eyebrow="Meet the makers"
          title="Shops behind the products"
          subtitle="Every listing maps back to a small brand — follow the ones that feel like your people."
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {brands.slice(0, 6).map((brand) => (
            <BrandTile key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-[color-mix(in_oklab,var(--mist)_55%,white)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
          <SectionHeading
            eyebrow="Ingredient radar"
            title="Know what’s in it — and what isn’t"
            subtitle="Filter by zinc oxide, skip fragrance, hunt hemp protein. Advanced ingredient search built for curious shoppers."
            href="/ingredients"
            linkLabel="Open search"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Contains", body: "Find products with niacinamide, hydroxyapatite, or your favorite active." },
              { title: "Free from", body: "Dodge oxybenzone, baking soda, SLS — one tap on the avoid list." },
              { title: "Talk it out", body: "Compare notes with other tiny-shoppers in the community threads." },
            ].map((item) => (
              <div key={item.title} className="surface rounded-[1.25rem] p-5">
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="What people are saying"
          href="/community"
          linkLabel="Join the talk"
        />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {spotlightReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-5 sm:pb-20 md:px-8">
        <SectionHeading
          eyebrow="Community"
          title="Shop talk, not sales pitches"
          subtitle="Routines, ingredient debates, brand love letters — pull up a chair."
          href="/community"
          linkLabel="See all threads"
        />
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {latestTalk.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
