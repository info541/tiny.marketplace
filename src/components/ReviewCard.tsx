import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="surface rounded-[1.25rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{review.author}</p>
          <p className="text-xs text-ink-soft">{review.daysAgo}d ago</p>
        </div>
        <p className="rounded-full bg-lemon px-2.5 py-1 text-sm font-bold">★ {review.rating}.0</p>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold tracking-[-0.02em]">{review.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{review.body}</p>
      <p className="mt-4 text-xs font-semibold text-ink-soft/70">{review.helpful} found this helpful</p>
    </article>
  );
}
