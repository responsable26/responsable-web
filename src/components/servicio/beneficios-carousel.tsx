"use client";

import { ChevronIcon } from "@/components/icons";
import { usePistaArrastrable } from "@/components/use-pista-arrastrable";

export type Beneficio = { num: string; from: string; to: string };

/**
 * The ".bcar" benefits carousel: circular navy-bordered controls that go
 * magenta on hover, and slides reusing the ".shift-card" navy variant
 * (number and arrow in magenta).
 *
 * El desplazamiento es el de usePistaArrastrable, el mismo mecanismo que los
 * carruseles de casos y artículos de la Home y la pista de pasos: barra
 * oculta, arrastre con ratón, flechas de una tarjeta exacta y snap al soltar.
 */
export function BeneficiosCarousel({
  title,
  items,
}: {
  title: string;
  items: Beneficio[];
}) {
  const { ref, desplazarUnPaso, propsPista, clasesPista } =
    usePistaArrastrable<HTMLUListElement>();

  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-head max-w-2xl text-[clamp(1.15rem,2vw,1.4rem)] font-semibold text-navy">
          {title}
        </h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => desplazarUnPaso(-1)}
            aria-label="Ver beneficios anteriores"
            className="flex size-11 items-center justify-center rounded-full border border-navy text-navy transition-colors hover:border-magenta hover:text-magenta"
          >
            <ChevronIcon direction="left" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => desplazarUnPaso(1)}
            aria-label="Ver más beneficios"
            className="flex size-11 items-center justify-center rounded-full border border-navy text-navy transition-colors hover:border-magenta hover:text-magenta"
          >
            <ChevronIcon direction="right" className="size-5" />
          </button>
        </div>
      </div>

      {/* py-2 y no solo pb-2: un contenedor con overflow-x también recorta
          en vertical, y sin aire arriba el hover que eleva la tarjeta 4px le
          cortaba el borde superior. mt-6 compensa ese padding para que la
          distancia al título siga siendo la de antes. */}
      <ul
        ref={ref}
        {...propsPista}
        className={`${clasesPista} mt-6 gap-6 py-2`}
      >
        {items.map((item) => (
          <li
            key={item.num}
            /* --visible: 3 → 2 → 1, per the documented .bcar track. */
            className="w-full shrink-0 snap-start rounded bg-navy p-6 shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <span className="font-head text-2xl font-bold text-magenta">
              {item.num}
            </span>
            <p className="font-body mt-4 text-white/85">{item.from}</p>
            <p className="font-head my-1 text-xl text-magenta" aria-hidden="true">
              →
            </p>
            <p className="font-head font-semibold text-white">{item.to}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
