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
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-xl text-ink-soft">{subtitle}</p> : null}
      </div>
      {href && linkLabel ? (
        <Link href={href} className="btn btn-ghost !py-2 text-sm">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
