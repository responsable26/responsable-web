"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import { ContactButton } from "@/components/contact-button";
import type { Servicio } from "@/lib/servicios";

/** Selector de lo que puede recibir foco dentro del panel, para el atrapado. */
const ENFOCABLES =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Ficha de un servicio. Sigue el patrón del modal de contacto —overlay fijo,
 * bloqueo del scroll del body, cierre con Escape y foco inicial en el botón de
 * cerrar— y añade lo que aquel no tiene: cierre por clic en el overlay y foco
 * atrapado mientras está abierto.
 *
 * La devolución del foco al disparador la hace quien lo abre, que es el único
 * que sabe de qué botón salió.
 */
export function ServicioModal({
  servicio,
  onClose,
}: {
  servicio: Servicio | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();

  useEffect(() => {
    if (!servicio) return;

    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Atrapado del foco: al llegar a un extremo se salta al contrario en vez
      // de dejar que el tabulador se escape al documento de detrás.
      const foco = panelRef.current?.querySelectorAll<HTMLElement>(ENFOCABLES);
      if (!foco || foco.length === 0) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicio, onClose]);

  if (!servicio) return null;

  // noEnlazable manda sobre href: nunca se pinta el enlace.
  const enlazable = Boolean(servicio.href) && !servicio.noEnlazable;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      /* mousedown y no click: si el gesto empieza dentro del panel y termina
         fuera, un click en el overlay cerraría el modal sin que se pretendiera. */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[rgba(10,12,30,0.6)] p-4"
    >
      {/*
        max-w-4xl y no 2xl: con dos columnas y servicios de cinco o seis
        viñetas, 672px obligaba a estirarse mucho en vertical. A 896px cada
        columna ronda los 400px y la ficha baja de altura sin llegar a pantalla
        completa. Los servicios con menos viñetas no quedan vacíos porque la
        columna izquierda carga ahora también con las acciones.
      */}
      <div
        ref={panelRef}
        className="animate-modal-in relative w-full max-w-4xl rounded bg-white shadow motion-reduce:animate-none"
      >
        <button
          ref={cerrarRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-off-white"
        >
          <CloseIcon className="size-4" />
        </button>

        {/* Dos columnas con divisoria fina. Al apilarse en móvil la línea pasa
            a horizontal: es el borde superior de la segunda columna. */}
        <div className="grid gap-6 p-6 pt-12 sm:gap-10 sm:p-8 sm:pt-12 md:grid-cols-2">
          <div className="md:pr-8">
            <h2
              id={tituloId}
              className="font-head text-xl font-semibold text-navy"
            >
              {servicio.nombre}
            </h2>
            <p className="font-body mt-3 text-sm text-ink-soft">
              {servicio.descripcion}
            </p>

            {/* Acciones bajo la descripción, alineadas a la izquierda. Sin
                justify-*: con un solo botón no queda hueco a la derecha. */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ContactButton variant="primary" size="sm">
                Contáctanos
              </ContactButton>

              {enlazable ? (
                <Link
                  href={servicio.href as string}
                  className="font-head rounded border border-navy px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-magenta hover:text-magenta"
                >
                  Ver más
                </Link>
              ) : null}
            </div>
          </div>

          <div className="border-t border-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
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
          </div>
        </div>
      </div>
    </div>
  );
}
