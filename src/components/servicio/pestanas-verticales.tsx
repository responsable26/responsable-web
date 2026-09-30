"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

export type GrupoPestana = { titulo: string; elementos: string[] };

/**
 * Pestañas verticales: la lista de pestañas a la izquierda y el panel del
 * grupo activo a la derecha, con sus elementos como lista simple.
 *
 * Solo para escritorio. En pantallas estrechas no caben lista y panel lado a
 * lado, así que quien la monta la sustituye por un acordeón (Faq) con los
 * mismos grupos.
 *
 * Patrón de pestañas de WAI-ARIA con activación automática: las flechas
 * arriba/abajo mueven el foco y cambian de pestaña, Inicio y Fin van a la
 * primera y a la última, y solo la pestaña activa entra en el orden de
 * tabulación. La activa se marca con la píldora navy de la barra de anclas.
 */
export function PestanasVerticales({ grupos }: { grupos: GrupoPestana[] }) {
  const [activa, setActiva] = useState(0);
  const baseId = useId();
  const pestanasRef = useRef<(HTMLButtonElement | null)[]>([]);

  function alPulsarTecla(event: KeyboardEvent<HTMLButtonElement>) {
    const ultima = grupos.length - 1;
    const destino = {
      ArrowDown: activa === ultima ? 0 : activa + 1,
      ArrowUp: activa === 0 ? ultima : activa - 1,
      Home: 0,
      End: ultima,
    }[event.key];
    if (destino === undefined) return;
    event.preventDefault();
    setActiva(destino);
    pestanasRef.current[destino]?.focus();
  }

  return (
    <div className="grid grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-8">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex flex-col gap-1"
      >
        {grupos.map((grupo, indice) => {
          const esActiva = indice === activa;
          return (
            <button
              key={grupo.titulo}
              ref={(el) => {
                pestanasRef.current[indice] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${indice}`}
              aria-selected={esActiva}
              aria-controls={`${baseId}-panel-${indice}`}
              tabIndex={esActiva ? 0 : -1}
              onClick={() => setActiva(indice)}
              onKeyDown={alPulsarTecla}
              className={`font-head rounded-full px-5 py-3 text-left text-sm font-semibold transition-colors duration-300 ease-out ${
                esActiva
                  ? "bg-navy text-white"
                  : "text-ink-soft hover:text-navy"
              }`}
            >
              {grupo.titulo}
            </button>
          );
        })}
      </div>

      {grupos.map((grupo, indice) => (
        <div
          key={grupo.titulo}
          role="tabpanel"
          id={`${baseId}-panel-${indice}`}
          aria-labelledby={`${baseId}-tab-${indice}`}
          hidden={indice !== activa}
          className="rounded border-t-2 border-magenta bg-off-white p-8"
        >
          <ul className="flex flex-col gap-3">
            {grupo.elementos.map((elemento) => (
              <li
                key={elemento}
                className="font-body flex gap-3 text-[1.05rem] text-navy"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-magenta"
                />
                {elemento}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
