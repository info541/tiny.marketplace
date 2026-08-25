"use cache";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { BlogProductEmbed } from "@/components/BlogProductEmbed";
import {
  amazonShopUrl,
  blogDisplayName,
  formatBlogDate,
  formatBlogPrice,
  getBlogPost,
  getBlogPosts,
  productsForPost,
} from "@/lib/blog";
import { getBrand, getProduct } from "@/lib/data";

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  cacheLife("max");
  cacheTag("blog", `blog:${slug}`);
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  cacheLife("max");
  cacheTag("blog", `blog:${slug}`);

  const post = getBlogPost(slug);
  if (!post) notFound();
  const featured = productsForPost(post);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <Link href="/blog" className="text-sm text-ink-soft hover:text-ink">
        ← Blog
      </Link>

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft/80">
        {formatBlogDate(post.publishedAt)} · {post.author}
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{post.excerpt}</p>

      {featured.length ? (
        <ol className="mt-8 divide-y divide-line border border-line bg-white">
          {featured.map((product) => {
            const brand = getBrand(product.brandId);
            const shopUrl = amazonShopUrl(product);
            return (
              <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate font-medium leading-tight">
                    {brand ? `${brand.name} ` : ""}
                    {blogDisplayName(product.name)}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">{formatBlogPrice(product.price)}</p>
                </div>
                {shopUrl ? (
                  <a
                    href={shopUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="shrink-0 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Amazon
                  </a>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className="mt-10 border-t border-line pt-10 sm:mt-12 sm:pt-12">
        {post.body.map((block, index) => {
          if (block.type === "heading") {
            return (
              <h2
                key={`${block.type}-${index}`}
                className="mt-12 font-display text-2xl font-medium tracking-tight first:mt-0 sm:text-3xl"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "paragraph") {
            return (
              <p key={`${block.type}-${index}`} className="mt-5 text-base leading-relaxed text-ink sm:text-[1.05rem]">
                {block.text}
              </p>
            );
          }
          const product = getProduct(block.slug);
          if (!product) return null;
          return <BlogProductEmbed key={`${block.slug}-${index}`} product={product} />;
        })}
      </div>
    </article>
  );
}
