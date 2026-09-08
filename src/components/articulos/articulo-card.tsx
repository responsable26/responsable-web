import Image from "next/image";
import Link from "next/link";
import { formatFecha, type ArticuloMeta } from "@/lib/articulos";

/** Degradados de respaldo para las articulos que el export no traía con imagen. */
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, var(--color-navy), #2b3266)",
  "linear-gradient(135deg, var(--color-teal), #0e7c72)",
  "linear-gradient(135deg, var(--color-magenta), #b3105e)",
];

export function ArticuloCard({ articulo, index = 0 }: { articulo: ArticuloMeta; index?: number }) {
  return (
    <Link
      href={`/recursos/articulos/${articulo.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded border border-border bg-white shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow"
    >
      <div
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-navy"
        style={
          articulo.imagen
            ? undefined
            : { backgroundImage: FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length] }
        }
      >
        {articulo.imagen ? (
          <Image
            src={articulo.imagen.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <time dateTime={articulo.fecha} className="font-body text-xs text-ink-soft">
          {formatFecha(articulo.fecha)}
        </time>
        {/*
          line-clamp fija el alto del título y del extracto en 3 líneas cada uno.
          Sin eso, un título largo empuja el resto de la fila del grid y las
          tarjetas dejan de terminar a la misma altura.
        */}
        <h3 className="font-head mt-2 line-clamp-3 text-base font-semibold text-navy">
          {articulo.titulo}
        </h3>
        <p className="font-body mt-2 line-clamp-3 text-sm text-ink-soft">{articulo.excerpt}</p>
        <span className="font-head mt-auto pt-4 text-sm font-semibold text-magenta">
          → Leer Más
        </span>
      </div>
    </Link>
  );
}
