import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">{review.author}</p>
          <p className="text-xs text-ink-soft">{review.daysAgo}d ago</p>
        </div>
        <p className="text-sm font-medium">★ {review.rating}.0</p>
      </div>
      <h3 className="mt-3 font-display text-lg font-medium tracking-tight">{review.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{review.body}</p>
      <p className="mt-4 text-xs text-ink-soft/70">{review.helpful} found this helpful</p>
    </article>
  );
}
