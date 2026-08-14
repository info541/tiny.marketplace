import { BrandMosaic } from "@/components/BrandMosaic";
import { CategoryShopGrid, HomeHero } from "@/components/HomeHero";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { ProductTile } from "@/components/ProductTile";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeading } from "@/components/ui";
import { communityPosts, products, reviews } from "@/lib/data";

export default function HomePage() {
  const featured = products.filter((p) => p.badge).slice(0, 4);
  const latestTalk = communityPosts.slice(0, 3);
  const spotlightReviews = reviews.slice(0, 3);

  return (
    <>
      <HomeHero />
      <CategoryShopGrid />
      <BrandMosaic />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-20 md:px-8">
        <SectionHeading
          eyebrow="Staff picks"
          title="Little brands, loud formulas"
          subtitle="Hand-picked products with transparent labels and reviews from people who actually use them."
          href="/browse"
          linkLabel="See all"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-20 md:px-8">
          <SectionHeading
            eyebrow="Ingredient radar"
            title="Know what’s in it — and what isn’t"
            subtitle="Filter by zinc oxide, skip fragrance, hunt hemp protein. Advanced ingredient search built for curious shoppers."
            href="/ingredients"
            linkLabel="Open search"
          />
          <div className="grid divide-y divide-line border border-line bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              { title: "Contains", body: "Find products with niacinamide, hydroxyapatite, or your favorite active." },
              { title: "Free from", body: "Dodge oxybenzone, baking soda, SLS — one tap on the avoid list." },
              { title: "Talk it out", body: "Compare notes with other tiny-shoppers in the community threads." },
            ].map((item) => (
              <div key={item.title} className="p-6 sm:p-8">
                <h3 className="font-display text-2xl font-medium tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-20 md:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="What people are saying"
          href="/community"
          linkLabel="Join the talk"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {spotlightReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-5 sm:pb-24 md:px-8">
        <SectionHeading
          eyebrow="Community"
          title="Shop talk, not sales pitches"
          subtitle="Routines, ingredient debates, brand love letters — pull up a chair."
          href="/community"
          linkLabel="See all threads"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {latestTalk.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
