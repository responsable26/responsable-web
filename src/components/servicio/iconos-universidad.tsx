/*
  Íconos de línea de las seis tarjetas de «¿Para qué sirve la Universidad
  ResponSable?». SVG propio, como icons.tsx: el sitio no usa librería de
  íconos. Mismo lenguaje en los seis —rejilla de 24, trazo de 1.5, puntas y
  uniones redondeadas, sin relleno— y color por currentColor, que pone quien
  los monta. Decorativos: el título de la tarjeta ya dice lo mismo.
*/

import type { ReactNode } from "react";
import type { IconoUso } from "@/lib/contenido-universidad";

function Icono({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const ICONOS_USOS: Record<IconoUso, (className?: string) => ReactNode> =
  {
    /** Tres bloques apilados, como cimientos. */
    base: (className?: string) => (
      <Icono className={className}>
        <rect x="3" y="15" width="18" height="5" rx="1" />
        <rect x="5.5" y="9.5" width="13" height="5" rx="1" />
        <rect x="8" y="4" width="8" height="5" rx="1" />
      </Icono>
    ),
    /** Tres personas, una delante y dos detrás. */
    grupos: (className?: string) => (
      <Icono className={className}>
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
        <circle cx="5" cy="9.5" r="2" />
        <path d="M1.5 18a3.5 3.5 0 0 1 4.6-3.3" />
        <circle cx="19" cy="9.5" r="2" />
        <path d="M22.5 18a3.5 3.5 0 0 0-4.6-3.3" />
      </Icono>
    ),
    /** Puerta abierta con una flecha que entra. */
    induccion: (className?: string) => (
      <Icono className={className}>
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
        <path d="M3 12h11" />
        <path d="m10 8 4 4-4 4" />
      </Icono>
    ),
    /** Maletín con una hoja. */
    negocio: (className?: string) => (
      <Icono className={className}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M9.5 17c0-3 2.2-5 5.5-5 0 3.3-2.2 5-5.5 5Z" />
        <path d="m9.5 17 2.5-2.5" />
      </Icono>
    ),
    /** Dos flechas en círculo. */
    continuidad: (className?: string) => (
      <Icono className={className}>
        <path d="M3 12a9 9 0 0 1 15.7-6L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15.7 6L3 16" />
        <path d="M8 16H3v5" />
      </Icono>
    ),
    /** Gráfica de barras ascendente con línea de tendencia. */
    seguimiento: (className?: string) => (
      <Icono className={className}>
        <path d="M3 3v18h18" />
        <path d="M8 17v-3" />
        <path d="M13 17v-5" />
        <path d="M18 17v-8" />
        <path d="m7 10 4-3 3 2 5-5" />
      </Icono>
    ),
  };
