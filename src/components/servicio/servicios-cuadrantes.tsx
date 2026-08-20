"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { ServicioModal } from "@/components/home/servicio-modal";
import {
  ARROW_TRANSFORM,
  COLORES,
  CUNAS,
} from "@/components/home/servicios-rueda";
import { CUADRANTES, type Servicio } from "@/lib/servicios";

/**
 * Los cuatro cuadrantes del Home, desplegados en vertical y siempre visibles,
 * para /servicio/: nada detrás de clic salvo la ficha de cada servicio (mismo
 * modal que ya abre el panel de la rueda). Sustituye a <ServiciosRueda /> en
 * esa página; el Home conserva la rueda interactiva sin cambios.
 *
 * Reutiliza tres piezas exportadas de servicios-rueda.tsx en vez de
 * reescribirlas: CUNAS[i].arco (el trazado del segmento de flecha de ese
 * cuadrante, en coordenadas originales de arrows.svg), ARROW_TRANSFORM (la
 * misma transformación que lo lleva al viewBox de 400×400) y COLORES (el
 * mapa color↔contraste ya vigente en el resto del sitio). Así el icono y el
 * acento de cada sección son literalmente los mismos datos que pinta la
 * rueda, no una aproximación redibujada a mano.
 */

/**
 * Anclas de cada cuadrante, en el mismo orden que CUADRANTES (numero 1→4):
 * permiten enlazar directo a "/servicio/#donde-estoy" desde otra página.
 */
const ANCLAS = ["donde-estoy", "adonde-voy", "como-lo-hago", "como-comunico"];

export function ServiciosCuadrantes() {
  const [servicioModal, setServicioModal] = useState<Servicio | null>(null);
  /* Botón que abrió el modal, para devolverle el foco al cerrar. Mismo
     mecanismo que ServiciosRueda (disparador + efecto), reproducido aquí
     porque este componente gestiona su propio modal en vez de compartir el
     de la rueda. */
  const disparador = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (servicioModal === null && disparador.current) {
      disparador.current.focus();
      disparador.current = null;
    }
  }, [servicioModal]);

  function abrirServicio(servicio: Servicio, boton: HTMLButtonElement) {
    disparador.current = boton;
    setServicioModal(servicio);
  }

  return (
    <>
      {CUADRANTES.map((cuadrante, index) => {
        const color = COLORES[cuadrante.colorToken];
        const tituloId = `${ANCLAS[index]}-title`;

        return (
          <section
            key={cuadrante.numero}
            id={ANCLAS[index]}
            aria-labelledby={tituloId}
            /*
              scroll-mt-28: mismo valor que el resto de anclas del sitio
              (.articulo-prose h2/h3, #proceso/#faq en servicio/[slug]), para
              que el header fijo/sticky no tape el destino al llegar por hash.

              Alterna bg-off-white/bg-white entre cuadrantes, igual que las
              secciones de servicio/[slug]/page.tsx (para-que-sirve, off-white;
              beneficios, blanco): con cuatro secciones seguidas del mismo
              color se leerían como una sola pieza en vez de cuatro distintas.
            */
            className={`scroll-mt-28 px-6 py-[var(--section-y)] lg:px-10 ${
              index % 2 === 0 ? "bg-off-white" : "bg-white"
            }`}
          >
            <div className="mx-auto grid max-w-[var(--container)] gap-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              {/*
                Columna izquierda: mismo ancho de columna de título
                (minmax(0,20rem)) que BloqueTexto en servicio/[slug]/page.tsx,
                para que estas secciones lean como parte de la misma familia
                de páginas de servicio.
              */}
              <div>
                {/*
                  El segmento de flecha, no las cuatro: aquí es un icono de
                  identificación de sección, no la rueda completa. Mismo
                  viewBox 400×400 y mismo ARROW_TRANSFORM que la rueda, así
                  que el trazado cae exactamente donde caería dentro de ella
                  —solo que aquí solo se dibuja el suyo—. No animado: esta
                  vista no anima nada, a diferencia del indicador de
                  interactividad de la rueda.
                */}
                <svg
                  viewBox="0 0 400 400"
                  aria-hidden="true"
                  className="size-20"
                >
                  <path
                    d={CUNAS[index].arco}
                    transform={ARROW_TRANSFORM}
                    className={color.relleno}
                  />
                </svg>

                <h2
                  id={tituloId}
                  className={`font-head mt-4 border-l-4 ${color.acento} pl-4 text-2xl font-semibold text-navy`}
                >
                  {cuadrante.pregunta}
                </h2>

                <p className="font-body mt-4 text-ink-soft">
                  {cuadrante.intro}
                </p>
              </div>

              {/*
                Columna derecha: el listado completo de servicios del
                cuadrante, siempre visible. Cada fila es el mismo botón que ya
                usa el panel de la rueda —abre ServicioModal, que decide por
                su cuenta si añade el enlace a la página propia según
                servicio.href/noEnlazable—, así que el comportamiento al
                hacer clic es idéntico, no una reimplementación.
              */}
              <ul className="flex flex-col gap-3">
                {cuadrante.servicios.map((servicio) => (
                  <li key={servicio.nombre}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={(event) =>
                        abrirServicio(servicio, event.currentTarget)
                      }
                      className="font-body flex w-full items-center justify-between gap-4 rounded-sm border border-border bg-white px-4 py-3 text-left text-sm text-ink transition-colors hover:border-magenta"
                    >
                      <span>{servicio.nombre}</span>
                      <ChevronIcon
                        direction="right"
                        className="size-4 shrink-0 text-magenta"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <ServicioModal
        servicio={servicioModal}
        onClose={() => setServicioModal(null)}
      />
    </>
  );
}
