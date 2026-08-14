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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Community</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Talk about what you’re finding
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
            Routines, ingredient debates, brand shout-outs — a corner of the internet for people who love small shops.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-stack self-stretch sm:self-start md:self-auto" disabled>
          Start a thread (soon)
        </button>
      </div>

      <div className="mt-10 grid gap-8 sm:mt-12 sm:gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4 sm:space-y-5">
          {communityPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="space-y-4 sm:space-y-5">
          <div className="border border-line bg-white p-4 sm:p-5">
            <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">Fresh reviews</h2>
            <p className="mt-1 text-sm text-ink-soft">Straight from shoppers on the marketplace.</p>
            <div className="mt-5 space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
          <div className="bg-ink p-4 text-white sm:p-5">
            <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">Got a tiny brand?</h2>
            <p className="mt-2 text-sm text-white/70">
              We’re building curation + Shopify storefront sync so your products can live here too.
            </p>
            <Link href="/browse" className="btn btn-ghost mt-5 !min-h-0 !border-white/40 !py-2 !text-white text-sm hover:!border-white">
              Peek the shelf
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
