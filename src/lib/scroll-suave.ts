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

/**
 * Desplaza hasta el ancla `id` si ya existe en la página, dejando libre la
 * altura real del header fijo/sticky (medida en el momento, no cableada: el
 * header cambia de alto entre su estado normal y el "pill" al desplazarse).
 * `margenExtra` reserva además lo que ocupe cualquier otra barra fija bajo el
 * header —hoy, las pestañas de cuadrantes de /servicio/—: quien la pinta
 * conoce su alto real y lo pasa medido, en vez de cablearlo aquí.
 * Devuelve false sin hacer nada si el elemento no está en el DOM —un link a
 * "/#id" pulsado desde otra página, donde toca dejar que la navegación real
 * ocurra primero y aterrizar por el salto nativo del navegador—.
 *
 * `history.replaceState` y no `location.hash`: asignar el hash provoca un
 * salto nativo que anularía el desplazamiento suave que acabamos de lanzar.
 */
export function irAAncla(id: string, margenExtra = 0) {
  const destino = document.getElementById(id);
  if (!destino) return false;
  const header = document.querySelector("header");
  const margen = (header?.getBoundingClientRect().height ?? 0) + margenExtra + 16;
  const top = destino.getBoundingClientRect().top + window.scrollY - margen;
  const sinMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  desplazarA(top, !sinMovimiento);
  history.replaceState(null, "", `#${id}`);
  return true;
}

/** Detiene Lenis mientras hay un modal abierto. */
export function pausarScroll() {
  window.__lenis?.stop();
}

export function reanudarScroll() {
  window.__lenis?.start();
}
