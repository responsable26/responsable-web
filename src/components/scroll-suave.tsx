"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const ruta = usePathname();
  const primeraRuta = useRef(true);

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

  /*
    Vuelta arriba al cambiar de página.

    Next ya hace su propio scroll al inicio en cada navegación, pero con Lenis
    montado no surte efecto y el usuario aterriza donde estaba —al pie, si venía
    de pulsar un enlace del footer—. La causa está en cómo Lenis concilia los
    scrolls que no ha provocado él: su onNativeScroll solo se resincroniza
    (`animatedScroll = targetScroll = actualScroll`) cuando isScrolling vale
    false o "native". Si en ese momento está animando —isScrolling === "smooth",
    que es justo el estado en el que queda tras bajar con la rueda hasta el
    footer y hacer clic—, descarta el evento, y en el siguiente fotograma su
    bucle vuelve a escribir en el documento el animatedScroll viejo. El
    window.scrollTo de Next se aplica y se deshace en el mismo frame.

    Por eso la corrección va por dentro de Lenis y no alrededor: se le fija el
    destino a 0. `immediate` evita animar la vuelta —sería un barrido largo
    desde el pie de la página anterior— y `force` la aplica aunque la instancia
    esté detenida, cosa que ocurre si se navega desde el panel deslizante del
    header, que llama a pausarScroll() mientras está abierto. El
    window.scrollTo posterior cubre el caso sin Lenis (movimiento reducido).

    Dos exclusiones:

    - La primera ejecución, porque no es una navegación: es la carga inicial, y
      si el usuario recarga a media página el navegador le devuelve su posición
      y no somos nadie para quitársela.
    - Cualquier URL con hash. Ahí el destino no es el principio de la página
      sino un ancla concreta —"/#servicios" pulsado desde otra página—, y de
      llevarla al inicio anularíamos el salto nativo. El caso de ancla dentro
      de la misma página no llega hasta aquí: irAAncla cancela el clic, no hay
      navegación y la ruta no cambia, así que este efecto ni se dispara.
  */
  useEffect(() => {
    if (primeraRuta.current) {
      primeraRuta.current = false;
      return;
    }
    if (window.location.hash) return;
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [ruta]);

  return null;
}
