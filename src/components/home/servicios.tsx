"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
import { CUADRANTES, type Cuadrante } from "@/lib/servicios";

/*
  Color de la tarjeta del cuadrante y color de texto sobre ella. El texto no se
  elige por estética sino por contraste medido contra cada fondo (AA pide 4.5:1
  en texto normal; el intro va a 14px, así que aplica ese umbral):

    amarillo #feb80a  navy 7.96  ·  blanco 1.74   -> navy
    magenta  #ea157a  navy 3.22  ·  blanco 4.30   -> blanco (ver nota abajo)
    lavanda  #738ac8  navy 4.09  ·  ink    4.96   -> ink, navy no llega
    teal     #1ab39f  navy 5.27  ·  blanco 2.63   -> navy

  Criterio: se prefiere navy, que es el color estructural de marca, y solo se
  escala a ink (#1a1c2e, el mismo del cuerpo de texto) cuando navy no alcanza
  4.5:1 — que es el caso del lavanda.

  NOTA SOBRE EL MAGENTA — es una decisión de marca consciente, no un descuido:
  #ea157a con texto blanco da 4.30:1 y NO alcanza el mínimo AA de 4.5:1 para
  texto normal. Ningún color de texto lo alcanza sobre este fondo (navy 3.22,
  ink 3.91), así que blanco es el mejor disponible, y es además la combinación
  que el sitio ya usa en el CTA del header, la tarjeta del newsletter y las
  pestañas activas. La alternativa que sí cumpliría es #C71268 (5.65:1 con
  blanco), que ya existe en el proyecto como color de hover de los botones
  primarios. Cambiarlo aquí es decisión de marca, no de implementación.
*/
const CARD_STYLES: Record<Cuadrante["colorToken"], string> = {
  amarillo: "bg-amarillo text-navy",
  magenta: "bg-magenta text-white",
  lavanda: "bg-lavanda text-ink",
  teal: "bg-teal text-navy",
};

export function Servicios() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Índice del servicio abierto dentro del cuadrante activo, o null.
  const [openServicio, setOpenServicio] = useState<number | null>(null);
  const tablistId = useId();
  const activeCuadrante = CUADRANTES[activeIndex];

  function selectCuadrante(index: number) {
    setActiveIndex(index);
    // Cerrar el desplegable al cambiar de pestaña: si no, la fila abierta del
    // cuadrante anterior se traslada por índice a un servicio distinto.
    setOpenServicio(null);
  }

  return (
    <section id="servicios" className="bg-off-white px-6 py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        <h2 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
          Nuestros Servicios
        </h2>

        <div
          role="tablist"
          aria-label="Cuadrantes de servicios"
          className="mt-8 flex flex-wrap gap-3"
        >
          {CUADRANTES.map((cuadrante, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={cuadrante.numero}
                role="tab"
                type="button"
                id={`${tablistId}-tab-${cuadrante.numero}`}
                aria-selected={isActive}
                aria-controls={`${tablistId}-panel-${cuadrante.numero}`}
                onClick={() => selectCuadrante(index)}
                className={`font-head rounded-[12px] px-5 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "bg-magenta text-white" : "bg-navy text-white/85 hover:text-white"
                }`}
              >
                {cuadrante.numero}. {cuadrante.pregunta}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel-${activeCuadrante.numero}`}
          aria-labelledby={`${tablistId}-tab-${activeCuadrante.numero}`}
          className="mt-6 grid gap-6 md:grid-cols-[30%_1fr]"
        >
          <div className={`rounded p-6 ${CARD_STYLES[activeCuadrante.colorToken]}`}>
            <h3 className="font-head text-xl font-semibold">{activeCuadrante.pregunta}</h3>
            <p className="font-body mt-3 text-sm">{activeCuadrante.intro}</p>
          </div>

          <ul className="flex flex-col gap-3">
            {activeCuadrante.servicios.map((servicio, index) => {
              const isOpen = openServicio === index;
              const btnId = `${tablistId}-s-${activeCuadrante.numero}-${index}`;
              const panelId = `${tablistId}-sp-${activeCuadrante.numero}-${index}`;

              return (
                <li
                  key={servicio.nombre}
                  className="overflow-hidden rounded-sm border border-border bg-white"
                >
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenServicio(isOpen ? null : index)}
                    className="font-body flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-ink"
                  >
                    <span>{servicio.nombre}</span>
                    {/*
                      El chevron ya existía y sugería que la fila lleva a algún
                      sitio; ahora cumple esa promesa girando a 90° al abrir.
                      Cambiar `direction` en vez de encadenar otra clase rotate-*
                      evita que rotate-0 y rotate-90 convivan y se resuelvan por
                      orden en la hoja generada.
                    */}
                    <ChevronIcon
                      direction={isOpen ? "down" : "right"}
                      className="size-4 shrink-0 text-navy transition-transform duration-150"
                    />
                  </button>

                  {/*
                    Colapso por grid-template-rows, la misma técnica del
                    acordeón de faq.tsx: anima sin medir alturas en JS.
                  */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className={`grid transition-[grid-template-rows] duration-200 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-border px-5 py-4">
                        <ul className="flex flex-col gap-2">
                          {servicio.puntos.map((punto) => (
                            <li
                              key={punto}
                              className="font-body flex gap-2 text-sm text-ink-soft"
                            >
                              <span aria-hidden="true" className="text-magenta">
                                •
                              </span>
                              <span>{punto}</span>
                            </li>
                          ))}
                        </ul>

                        {servicio.href ? (
                          <Link
                            href={servicio.href}
                            className="font-head mt-4 inline-block text-sm font-semibold text-magenta"
                          >
                            Ver servicio →
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
