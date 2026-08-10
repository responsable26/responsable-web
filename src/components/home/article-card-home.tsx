import Link from "next/link";

type ArticleCardHomeProps = {
  href: string;
  titulo: string;
  excerpt?: string;
  gradient: string;
};

export function ArticleCardHome({ href, titulo, excerpt, gradient }: ArticleCardHomeProps) {
  return (
    <Link
      href={href}
      className="relative block h-[580px] w-72 shrink-0 overflow-hidden rounded shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow"
      style={{ backgroundImage: gradient }}
    >
      <div className="absolute inset-x-5 bottom-5 rounded bg-white p-5">
        <h3 className="font-head text-base font-semibold text-navy">{titulo}</h3>
        {excerpt ? <p className="font-body mt-2 text-sm text-ink-soft">{excerpt}</p> : null}
        <span className="font-head mt-4 inline-flex items-center gap-2 text-sm font-semibold text-magenta">
          → Leer Más
        </span>
      </div>
    </Link>
  );
}
