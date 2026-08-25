import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DeleteCommunityPostButton } from "@/components/DeleteCommunityPostButton";
import { ensureProfile, requireUser } from "@/lib/auth";
import DashboardLoading from "./loading";

export const metadata: Metadata = {
  title: "Dashboard",
};

function daysAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const { supabase, user } = await requireUser();
  const profile = await ensureProfile(supabase, user);
  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "you";

  const [
    { data: savedBrands, error: savedError },
    { data: reviews, error: reviewsError },
    { data: posts, error: postsError },
    { data: savedProducts },
  ] = await Promise.all([
    supabase
      .from("saved_brands")
      .select("created_at, brands(id, slug, name, tagline, accent, location)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("id, title, body, rating, created_at, product_id, brand_id, products(slug, name), brands(slug, name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("community_posts")
      .select("id, title, topic, body, likes, replies, created_at, tags")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("saved_products")
      .select("created_at, products(id, slug, name, accent, price, brands(name))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const schemaMissing =
    savedError?.code === "PGRST205" ||
    reviewsError?.code === "PGRST205" ||
    postsError?.code === "PGRST205" ||
    savedError?.message?.includes("schema cache") ||
    reviewsError?.message?.includes("schema cache");

  const brandRows = (savedBrands ?? []).map((row) => ({
    created_at: row.created_at as string,
    brands: asOne(row.brands as { id: string; slug: string; name: string; tagline: string; accent: string; location: string } | { id: string; slug: string; name: string; tagline: string; accent: string; location: string }[] | null),
  }));

  const reviewRows = (reviews ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    body: row.body as string,
    rating: row.rating as number,
    created_at: row.created_at as string,
    products: asOne(row.products as { slug: string; name: string } | { slug: string; name: string }[] | null),
    brands: asOne(row.brands as { slug: string; name: string } | { slug: string; name: string }[] | null),
  }));

  const postRows = (posts ?? []) as Array<{
    id: string;
    title: string;
    topic: string;
    body: string;
    likes: number;
    replies: number;
    created_at: string;
    tags: string[];
  }>;

  const productRows = (savedProducts ?? []).map((row) => {
    const product = asOne(
      row.products as
        | {
            id: string;
            slug: string;
            name: string;
            accent: string;
            price: number;
            brands: { name: string } | { name: string }[] | null;
          }
        | {
            id: string;
            slug: string;
            name: string;
            accent: string;
            price: number;
            brands: { name: string } | { name: string }[] | null;
          }[]
        | null,
    );
    return {
      created_at: row.created_at as string,
      products: product
        ? {
            ...product,
            brands: asOne(product.brands),
          }
        : null,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Hey, {displayName}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft sm:text-base">
            Your saves, reviews, and talk — all in one tiny corner.
          </p>
        </div>
        <Link href="/profile" className="btn btn-ghost btn-stack !min-h-0 self-stretch !py-2 text-sm sm:self-start md:self-auto">
          Edit profile
        </Link>
      </div>

      {schemaMissing ? (
        <div className="mt-8 rounded-[1.35rem] border border-coral/30 bg-[color-mix(in_oklab,var(--coral)_10%,white)] p-5 text-sm">
          <p className="font-bold">One more database step</p>
          <p className="mt-2 text-ink-soft">
            Run{" "}
            <code className="rounded bg-white/70 px-1.5 py-0.5 text-xs">
              supabase/migrations/20260808140000_user_dashboard.sql
            </code>{" "}
            in the{" "}
            <a
              href="https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new"
              className="font-medium text-ink underline"
              target="_blank"
              rel="noreferrer"
            >
              Supabase SQL editor
            </a>{" "}
            so saves and your reviews can persist.
          </p>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Saved brands", value: brandRows.length },
          { label: "Your reviews", value: reviewRows.length },
          { label: "Talk threads", value: postRows.length },
        ].map((stat) => (
          <div key={stat.label} className="surface rounded-[1.25rem] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">{stat.label}</p>
            <p className="mt-2 font-display text-4xl font-medium tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12 sm:mt-14">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">Saved brands</h2>
            <p className="mt-1 text-sm text-ink-soft">Makers you’re following from the marketplace.</p>
          </div>
          <Link href="/browse" className="shrink-0 text-sm font-medium text-ink underline-offset-4 hover:underline">
            Find more →
          </Link>
        </div>
        {brandRows.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandRows.map((row) => {
              const brand = row.brands;
              if (!brand) return null;
              return (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="surface relative overflow-hidden rounded-[1.25rem] p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                >
                  <div
                    className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-70"
                    style={{ background: brand.accent }}
                  />
                  <p className="relative text-xs font-bold uppercase tracking-[0.12em] text-ink-soft/70">
                    {brand.location}
                  </p>
                  <h3 className="relative mt-2 font-display text-xl font-bold tracking-[-0.02em]">{brand.name}</h3>
                  <p className="relative mt-2 text-sm text-ink-soft">{brand.tagline}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="surface rounded-[1.25rem] p-6 text-sm text-ink-soft">
            No saved brands yet. Open a brand page and tap <span className="font-semibold text-ink">Save brand</span>.
          </div>
        )}
      </section>

      <section className="mt-12 sm:mt-14">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">Saved products</h2>
          <p className="mt-1 text-sm text-ink-soft">Shelf notes for later.</p>
        </div>
        {productRows.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productRows.map((row) => {
              const product = row.products;
              if (!product) return null;
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="surface overflow-hidden rounded-[1.25rem] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                >
                  <div className="h-20" style={{ background: product.accent }} />
                  <div className="p-4">
                    <p className="text-xs font-semibold text-ink-soft">{product.brands?.name}</p>
                    <h3 className="mt-1 font-display text-lg font-bold">{product.name}</h3>
                    <p className="mt-2 font-semibold">${product.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="surface rounded-[1.25rem] p-6 text-sm text-ink-soft">
            Nothing saved yet — product saves land here once you start bookmarking.
          </div>
        )}
      </section>

      <section className="mt-12 sm:mt-14">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">Your reviews</h2>
          <p className="mt-1 text-sm text-ink-soft">Past comments you’ve left on products and brands.</p>
        </div>
        {reviewRows.length ? (
          <div className="space-y-4">
            {reviewRows.map((review) => (
              <article key={review.id} className="surface rounded-[1.25rem] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">★ {review.rating}.0</p>
                  <p className="text-xs text-ink-soft">{daysAgo(review.created_at)}d ago</p>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.02em]">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{review.body}</p>
                <p className="mt-3 text-sm font-semibold">
                  {review.products ? (
                    <Link href={`/products/${review.products.slug}`} className="text-ink underline-offset-4 hover:underline">
                      {review.products.name}
                    </Link>
                  ) : null}
                  {review.products && review.brands ? " · " : null}
                  {review.brands ? (
                    <Link href={`/brands/${review.brands.slug}`} className="text-ink underline-offset-4 hover:underline">
                      {review.brands.name}
                    </Link>
                  ) : null}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface rounded-[1.25rem] p-6 text-sm text-ink-soft">
            No reviews from you yet. When review writing ships fully, they’ll collect here.
          </div>
        )}
      </section>

      <section className="mb-8 mt-12 sm:mt-14">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">Your talk</h2>
            <p className="mt-1 text-sm text-ink-soft">Threads you’ve started in the community.</p>
          </div>
          <Link href="/community" className="shrink-0 text-sm font-medium text-ink underline-offset-4 hover:underline">
            Open talk →
          </Link>
        </div>
        {postRows.length ? (
          <div className="space-y-4">
            {postRows.map((post) => (
              <article key={post.id} className="surface rounded-[1.25rem] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">{post.topic}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{post.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{post.body}</p>
                <p className="mt-3 text-sm font-semibold text-ink-soft">
                  {post.likes} likes · {post.replies} replies
                </p>
                <DeleteCommunityPostButton postId={post.id} />
              </article>
            ))}
          </div>
        ) : (
          <div className="surface rounded-[1.25rem] p-6 text-sm text-ink-soft">
            No threads yet — hop into{" "}
            <Link href="/community" className="font-medium text-ink underline-offset-4 hover:underline">
              Talk
            </Link>{" "}
            when you’re ready to post.
          </div>
        )}
      </section>
    </div>
  );
}
