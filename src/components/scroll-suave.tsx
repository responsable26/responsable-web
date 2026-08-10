"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll suave global.
 *
 * Lenis hace scroll real —mueve la posición del documento, no transforma un
 * contenedor—, así que sticky, position: fixed y los listeners de `scroll` del
 * header siguen funcionando sin adaptación.
 *
 * No se inicializa con movimiento reducido: en ese caso no hay instancia y todo
 * el sitio cae al scroll nativo.
 */
export function ScrollSuave() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      /*
        Cede el gesto a cualquier scroller anidado que pueda absorberlo. Es lo
        que mantiene vivo el desplazamiento horizontal del carrusel de artículos
        sin desactivar el scroll vertical de la página sobre él.
      */
      allowNestedScroll: true,
    });
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
