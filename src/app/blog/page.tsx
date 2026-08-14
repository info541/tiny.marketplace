import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, getBlogPosts, productsForPost } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product roundups and whatever else we’re into.",
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Blog</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
        Blog
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
        Products we like, what’s in them, and a few opinions.
      </p>

      <div className="mt-10 space-y-5 sm:mt-12">
        {posts.map((post) => {
          const featured = productsForPost(post);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-line bg-white p-5 transition hover:border-ink/25 sm:p-8"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft/80">
                {formatBlogDate(post.publishedAt)} · {post.author}
              </p>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
                {post.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">{post.excerpt}</p>
              {featured.length ? (
                <div className="mt-6 flex items-center gap-2">
                  {featured.map((product) => (
                    <span
                      key={product.id}
                      className="relative h-12 w-12 shrink-0 overflow-hidden border border-line bg-mist sm:h-14 sm:w-14"
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          className="object-contain p-1.5"
                          sizes="56px"
                        />
                      ) : (
                        <span
                          className="absolute inset-0"
                          style={{ background: product.accent }}
                          aria-hidden
                        />
                      )}
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-ink-soft underline-offset-4 group-hover:text-ink group-hover:underline">
                    Read
                  </span>
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
