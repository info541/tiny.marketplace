import Link from "next/link";

export function Stars({ value }: { value: number }) {
  return (
    <span className="font-semibold tracking-tight" aria-label={`${value} out of 5 stars`}>
      ★ {value.toFixed(1)}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 font-display text-[1.75rem] font-extrabold tracking-[-0.04em] sm:text-3xl md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-xl text-sm text-ink-soft sm:text-base">{subtitle}</p> : null}
      </div>
      {href && linkLabel ? (
        <Link href={href} className="btn btn-ghost !min-h-0 self-start !py-2 text-sm md:self-auto">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
