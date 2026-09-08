"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturarGclid } from "@/lib/gclid";

/**
 * Guarda el gclid de la URL en cuanto aparece, en cualquier página del sitio.
 *
 * Va en el layout raíz porque el aterrizaje con ?gclid= puede ser cualquiera y
 * el formulario que lo necesita se abre mucho después, desde otra ruta.
 *
 * Se reejecuta al cambiar de ruta —de ahí la dependencia de usePathname— para
 * cubrir la navegación de cliente: al pulsar un enlace no hay carga de
 * documento, así que un efecto sin dependencias solo miraría la primera URL.
 * Se lee window.location.search y no useSearchParams a propósito: ese hook
 * obliga a envolver el árbol en un <Suspense> y aquí no aporta nada, porque
 * este componente no pinta nada.
 */
export function CapturaGclid() {
  const ruta = usePathname();
  useEffect(() => {
    capturarGclid();
  }, [ruta]);
  return null;
}
