"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import type { ArticuloMeta } from "@/lib/articulos";
import type { CategoriaId } from "@/lib/categorias-articulos";

/** Tarjetas por bloque. Múltiplo de 1, 2 y 3 —las columnas de la rejilla en
 *  móvil, tablet y escritorio—, así que ningún bloque deja una fila coja. */
const POR_BLOQUE = 12;

/** Parámetro de la URL con el filtro activo: /recursos/?categoria=informes. */
const PARAM = "categoria";

/** replaceState no emite ningún evento: este lo sustituye para que la lectura
 *  de la URL se entere del cambio de filtro. */
const EVENTO = "recursos:categoria";

function suscribir(avisar: () => void) {
  window.addEventListener("popstate", avisar);
  window.addEventListener(EVENTO, avisar);
  return () => {
    window.removeEventListener("popstate", avisar);
    window.removeEventListener(EVENTO, avisar);
  };
}

const categoriaEnUrl = () =>
  new URLSearchParams(window.location.search).get(PARAM);

type Entrada = { articulo: ArticuloMeta; categoria: CategoriaId };
type Categoria = { id: CategoriaId; nombre: string; total: number };

/**
 * Filtro por categoría y carga por bloques de la rejilla del Centro de Recursos.
 *
 * El HTML del servidor trae todas las tarjetas: las que quedan fuera del primer
 * bloque van con `hidden`, y el script decide qué se ve. Así los buscadores
 * reciben todos los enlaces y, sin JavaScript, una regla dentro de <noscript>
 * las muestra todas y retira los controles, que sin script no harían nada.
 *
 * "Ver más" y no scroll infinito: con 59 artículos, el visitante que siguiera
 * bajando no llegaría nunca al newsletter ni al footer.
 *
 * El filtro vive en la URL para poder compartirlo, y la URL es su única fuente:
 * se lee con useSyncExternalStore, que en el servidor devuelve "Todas". La
 * página es estática y el servidor no conoce el parámetro, así que quien entra
 * con ?categoria= ve un instante el primer bloque de "Todas" antes de filtrar.
 */
export function RejillaRecursos({
  entradas,
  categorias,
}: {
  entradas: Entrada[];
  categorias: Categoria[];
}) {
  const idEnUrl = useSyncExternalStore(suscribir, categoriaEnUrl, () => null);
  const activa = categorias.some((c) => c.id === idEnUrl)
    ? (idEnUrl as CategoriaId)
    : null;
  /* El límite va ligado a la categoría para la que se cargó: al cambiar de
     filtro vuelve solo al primer bloque, sin un efecto que lo resetee. */
  const [carga, setCarga] = useState<{
    categoria: CategoriaId | null;
    limite: number;
  }>({ categoria: null, limite: POR_BLOQUE });
  const limite = carga.categoria === activa ? carga.limite : POR_BLOQUE;
  const rejilla = useRef<HTMLDivElement>(null);
  /** Índice, entre las visibles, de la primera tarjeta del bloque recién
   *  cargado: recibe el foco para que teclado y lector de pantalla sigan donde
   *  apareció el contenido nuevo, y no se queden en el botón. */
  const enfocar = useRef<number | null>(null);

  const filtradas = activa
    ? entradas.filter((e) => e.categoria === activa)
    : entradas;
  const visibles = new Set(
    filtradas.slice(0, limite).map((e) => e.articulo.slug),
  );
  const restantes = filtradas.length - Math.min(limite, filtradas.length);

  useEffect(() => {
    if (enfocar.current === null || !rejilla.current) return;
    const tarjetas = rejilla.current.querySelectorAll<HTMLElement>(
      "[data-tarjeta]:not([hidden]) a",
    );
    tarjetas[enfocar.current]?.focus();
    enfocar.current = null;
  }, [limite]);

  function elegir(id: CategoriaId | null) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set(PARAM, id);
    else url.searchParams.delete(PARAM);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(EVENTO));
  }

  function verMas() {
    enfocar.current = limite;
    setCarga({ categoria: activa, limite: limite + POR_BLOQUE });
  }

  const nombreActiva = categorias.find((c) => c.id === activa)?.nombre;
  const etiqueta =
    "font-head shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors";

  return (
    <div className="rejilla-recursos">
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.rejilla-recursos [data-tarjeta][hidden]{display:block!important}.rejilla-recursos [data-controles]{display:none!important}</style>",
        }}
      />

      {/*
        En móvil la fila se desplaza en horizontal en vez de partirse en
        cuatro o cinco líneas de etiquetas antes del primer artículo; desde sm
        hay ancho para repartirlas en dos filas como mucho.
      */}
      <div
        data-controles
        role="group"
        aria-label="Filtrar artículos por categoría"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button
          type="button"
          aria-pressed={activa === null}
          onClick={() => elegir(null)}
          className={`${etiqueta} ${activa === null ? "border-navy bg-navy text-white" : "border-border bg-white text-navy hover:border-navy"}`}
        >
          Todas <span className="font-normal opacity-70">{entradas.length}</span>
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={activa === c.id}
            onClick={() => elegir(c.id)}
            className={`${etiqueta} ${activa === c.id ? "border-navy bg-navy text-white" : "border-border bg-white text-navy hover:border-navy"}`}
          >
            {c.nombre} <span className="font-normal opacity-70">{c.total}</span>
          </button>
        ))}
      </div>

      <p data-controles aria-live="polite" className="font-body mt-6 text-sm text-ink-soft">
        {nombreActiva
          ? `${filtradas.length} artículos en «${nombreActiva}»`
          : `Mostrando ${Math.min(limite, filtradas.length)} de ${filtradas.length} artículos`}
      </p>

      <div
        ref={rejilla}
        className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,380px))] lg:justify-center"
      >
        {entradas.map((e, i) => (
          <div
            key={e.articulo.slug}
            data-tarjeta
            hidden={!visibles.has(e.articulo.slug)}
          >
            <ArticuloCard articulo={e.articulo} index={i} />
          </div>
        ))}
      </div>

      {restantes > 0 ? (
        <div data-controles className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={verMas}
            className="font-head rounded-full border border-navy px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-magenta hover:text-magenta"
          >
            Ver más artículos
            <span className="font-normal text-ink-soft">
              {" "}
              · {restantes} restantes
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
