import Link from "next/link";

/**
 * The documented ".related-card": white card with border + --shadow-sm that
 * lifts to --shadow on hover.
 */
export function RelatedCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded border border-border bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow"
    >
      <h3 className="font-head text-lg font-semibold text-navy">{title}</h3>
      <p className="font-body text-sm text-ink-soft">{description}</p>
      <span className="font-head mt-2 text-sm font-semibold text-magenta">
        Ver servicio →
      </span>
    </Link>
  );
}
