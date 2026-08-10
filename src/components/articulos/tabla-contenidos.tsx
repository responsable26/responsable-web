"use client";

import { useEffect, useId, useMemo, useState, type MouseEvent } from "react";
import { ChevronIcon } from "@/components/icons";
import type { EntradaIndice } from "@/lib/indice-articulo";

/** Desplaza hasta el ancla dejando libre la altura del header fijo. */
function irAlAncla(id: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  const header = document.querySelector("header");
  const margen = (header?.getBoundingClientRect().height ?? 0) + 16;
  const top = destino.getBoundingClientRect().top + window.scrollY - margen;
  const sinMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top, behavior: sinMovimiento ? "auto" : "smooth" });
  // replaceState y no location.hash: asignar el hash provoca un salto nativo
  // que anularía el desplazamiento suave que acabamos de lanzar.
  history.replaceState(null, "", `#${id}`);
}

export function TablaContenidos({ indice }: { indice: EntradaIndice[] }) {
  const [activo, setActivo] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);
  const listaId = useId();

  const ids = useMemo(
    () => indice.flatMap((e) => [e.id, ...e.hijos.map((h) => h.id)]),
    [indice],
  );

  useEffect(() => {
    const nodos = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodos.length === 0) return;

    /*
      La banda de observación cubre solo el tramo superior del viewport: así se
      marca como activa la sección que el lector tiene delante y no la que
      asoma por abajo. Entre las visibles gana la más alta.
    */
    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles.length > 0) setActivo(visibles[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    nodos.forEach((n) => observador.observe(n));
    return () => observador.disconnect();
  }, [ids]);

  function alPulsar(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    irAlAncla(id);
    setAbierto(false);
  }

  function enlace(id: string, texto: string, anidado: boolean) {
    const esActivo = activo === id;
    return (
      <a
        href={`#${id}`}
        onClick={(e) => alPulsar(e, id)}
        aria-current={esActivo ? "location" : undefined}
        className={`font-body block border-l-2 py-1 text-sm transition-colors ${
          anidado ? "pl-6" : "pl-3"
        } ${
          esActivo
            ? "border-magenta font-medium text-navy"
            : "border-border text-ink-soft hover:text-navy"
        }`}
      >
        {texto}
      </a>
    );
  }

  return (
    <nav aria-labelledby={`${listaId}-titulo`}>
      {/* En móvil el índice es un desplegable cerrado; desde lg está siempre
          abierto y el botón desaparece. */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls={listaId}
        className="font-head flex w-full items-center justify-between gap-3 rounded-sm border border-border bg-white px-4 py-3 text-sm font-semibold text-navy lg:hidden"
      >
        <span id={`${listaId}-titulo`}>En este artículo</span>
        <ChevronIcon
          direction={abierto ? "down" : "right"}
          className="size-4 shrink-0 text-magenta transition-transform"
        />
      </button>

      <p
        aria-hidden="true"
        className="font-head hidden text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase lg:block"
      >
        En este artículo
      </p>

      <ol
        id={listaId}
        className={`mt-3 flex flex-col gap-1 lg:mt-4 lg:flex ${
          abierto ? "flex" : "hidden"
        }`}
      >
        {indice.map((entrada) => (
          <li key={entrada.id}>
            {enlace(entrada.id, entrada.texto, false)}
            {entrada.hijos.length > 0 ? (
              <ol className="flex flex-col gap-1">
                {entrada.hijos.map((hijo) => (
                  <li key={hijo.id}>{enlace(hijo.id, hijo.texto, true)}</li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
