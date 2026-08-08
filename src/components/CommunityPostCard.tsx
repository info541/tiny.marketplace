import Link from "next/link";
import type { CommunityPost } from "@/lib/types";

export function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <article className="surface rounded-[1.25rem] p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft/70">
        <span className="rounded-full bg-mist px-2 py-0.5 text-teal-deep">{post.topic}</span>
        <span>@{post.author}</span>
        <span>·</span>
        <span>{post.hoursAgo}h ago</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.02em]">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={`/ingredients?q=${encodeURIComponent(tag)}`} className="chip !py-1 text-xs">
            #{tag}
          </Link>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-sm font-semibold text-ink-soft">
        <span>{post.likes} likes</span>
        <span>{post.replies} replies</span>
      </div>
    </article>
  );
}
