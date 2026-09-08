import Image from "next/image";
import Link from "next/link";
import type { Caso } from "@/lib/casos";

/** Degradados de respaldo, los mismos que usan las tarjetas de artículo. */
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, var(--color-navy), #2b3266)",
  "linear-gradient(135deg, var(--color-teal), #0e7c72)",
  "linear-gradient(135deg, var(--color-magenta), #b3105e)",
];

/**
 * Tarjeta de caso. No reutiliza ArticuloCard porque los campos no coinciden:
 * un artículo se identifica por título y fecha, y un caso por cliente y sector,
 * sin fecha. Forzar el mismo componente habría exigido mapear campos con
 * significados distintos.
 *
 * Lo que sí se conserva es el tratamiento visual: misma proporción de miniatura,
 * mismo borde, misma sombra y el mismo degradado de respaldo, para que ambas
 * rejillas se lean como el mismo sistema.
 */
export function CasoCard({ caso, index = 0 }: { caso: Caso; index?: number }) {
  return (
    <Link
      href={`/casos-de-exito/${caso.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded border border-border bg-white shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow"
    >
      <div
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-navy"
        style={
          caso.imagen
            ? undefined
            : { backgroundImage: FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length] }
        }
      >
        {caso.imagen ? (
          <Image
            src={caso.imagen.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
          {caso.sector}
        </p>
        <h3 className="font-head mt-2 text-lg font-semibold text-navy">
          {caso.cliente}
        </h3>
        <p className="font-body mt-2 line-clamp-3 text-sm text-ink-soft">
          {caso.resumen}
        </p>
        <span className="font-head mt-auto pt-4 text-sm font-semibold text-magenta">
          → Ver caso
        </span>
      </div>
    </Link>
  );
}
