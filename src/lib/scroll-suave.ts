import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Envoltorios sobre Lenis con respaldo nativo.
 *
 * Lenis no se inicializa con `prefers-reduced-motion: reduce`, y puede fallar al
 * cargar. En ambos casos `window.__lenis` no existe y estas funciones caen al
 * comportamiento nativo, así que el sitio sigue siendo navegable.
 */
export function desplazarA(destino: number, suave: boolean) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(destino, { immediate: !suave });
    return;
  }
  window.scrollTo({ top: destino, behavior: suave ? "smooth" : "auto" });
}

/** Detiene Lenis mientras hay un modal abierto. */
export function pausarScroll() {
  window.__lenis?.stop();
}

export function reanudarScroll() {
  window.__lenis?.start();
}
