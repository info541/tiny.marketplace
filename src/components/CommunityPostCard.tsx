import Link from "next/link";
import type { CommunityPost } from "@/lib/types";

export function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <article className="border border-line bg-white p-5 transition hover:bg-mist/60">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
        <span className="border border-line px-2 py-0.5 text-ink">{post.topic}</span>
        <span>@{post.author}</span>
        <span>·</span>
        <span>{post.hoursAgo}h ago</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-medium tracking-tight">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={`/ingredients?q=${encodeURIComponent(tag)}`} className="chip !py-1 text-xs">
            #{tag}
          </Link>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-sm text-ink-soft">
        <span>{post.likes} likes</span>
        <span>{post.replies} replies</span>
      </div>
    </article>
  );
}
