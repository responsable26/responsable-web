import Link from "next/link";

type ArticleCardProps = {
  href: string;
  titulo: string;
  excerpt?: string;
  gradient: string;
};

/**
 * The generic ".article-card" pattern with a colour block instead of a
 * thumbnail. Superseded for anything note-related by components/articulos/articulo-card,
 * which renders the real featured image; kept only as the documented base
 * pattern for a future card that genuinely has no image.
 */
export function ArticleCard({ href, titulo, excerpt, gradient }: ArticleCardProps) {
  return (
    <Link
      href={href}
      className="w-72 shrink-0 overflow-hidden rounded bg-white shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow"
    >
      <div className="aspect-[4/3]" style={{ backgroundImage: gradient }} />
      <div className="p-5">
        <h3 className="font-head text-base font-semibold text-navy">{titulo}</h3>
        {excerpt ? <p className="font-body mt-2 text-sm text-ink-soft">{excerpt}</p> : null}
        <span className="font-head mt-4 inline-flex items-center gap-2 text-sm font-semibold text-magenta">
          → Leer Más
        </span>
      </div>
    </Link>
  );
}
