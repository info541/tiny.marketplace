import type { Metadata } from "next";
import Link from "next/link";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { ReviewCard } from "@/components/ReviewCard";
import { communityPosts, reviews } from "@/lib/data";

export const metadata: Metadata = {
  title: "Talk",
};

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Community</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">
            Talk about what you’re finding
          </h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Routines, ingredient debates, brand shout-outs — a corner of the internet for people who love small shops.
          </p>
        </div>
        <button type="button" className="btn btn-lemon self-start md:self-auto" disabled>
          Start a thread (soon)
        </button>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          {communityPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="space-y-5">
          <div className="surface rounded-[1.35rem] p-5">
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">Fresh reviews</h2>
            <p className="mt-1 text-sm text-ink-soft">Straight from shoppers on the marketplace.</p>
            <div className="mt-5 space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
          <div className="rounded-[1.35rem] bg-ink p-5 text-foam">
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">Got a tiny brand?</h2>
            <p className="mt-2 text-sm text-foam/75">
              We’re building curation + Shopify storefront sync so your products can live here too.
            </p>
            <Link href="/browse" className="btn btn-lemon mt-5 !py-2 text-sm">
              Peek the shelf
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
