"use client";

import { useEffect, useState, type RefObject } from "react";

/*
  Las tres piezas que comparten las dos barras de anclajes del sitio: la
  pastilla de cuadrantes de /servicio/ (servicios-cuadrantes.tsx) y la barra de
  secciones de cada página de servicio (barra-anclas.tsx).

  Vivían dentro de la primera. Se extraen aquí porque la segunda necesitaba
  exactamente lo mismo, y mantener dos copias de un observador con un rootMargin
  calibrado a mano es la forma más segura de que acaben divergiendo.
*/

/**
 * Separación entre el header y la barra que va debajo, en px.
 *
 * Es el mismo hueco (12px, pt-3) con el que el header despega su propio pill
 * del borde de la pantalla. Va como número y no como clase porque entra en
 * cuentas: el `top` de la barra y el margen que se reserva al desplazarse a
 * una sección.
 */
export const SEPARACION = 12;

/**
 * Alto real del header, para colocar debajo lo que vaya pegado.
 *
 * ResizeObserver y no el evento de scroll: lo que importa es el alto del
 * header, no la posición de la página. Observando su caja de borde se recogen
 * tanto el cambio de estado normal↔pill como los fotogramas intermedios de su
 * transición de 300ms —así la barra acompaña al header en vez de saltar al
 * final— y también los reflows por cambio de ancho de ventana, que ningún
 * listener de scroll vería.
 */
export function useAltoHeader(): number {
  const [alto, setAlto] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const medir = () => setAlto(header.getBoundingClientRect().height);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(header, { box: "border-box" });
    return () => observador.disconnect();
  }, []);

  return alto;
}

/**
 * ¿Está ya pegada bajo el header la barra cuyo centinela se pasa?
 *
 * IntersectionObserver sobre un centinela y no lectura de posiciones en cada
 * scroll: el centinela ocupa la posición de flujo de la barra, y el recorte
 * superior del root —el alto real del header más la separación— es exactamente
 * la línea a la que la barra se pega. Mientras el centinela quede por debajo de
 * esa línea, está suelta; en cuanto la cruza, está pegada.
 *
 * El margen inferior desmesurado extiende el root muy por debajo del viewport:
 * sin él, un centinela que aún no ha entrado en pantalla tampoco intersecaría y
 * se leería como "pegada" desde lo alto de la página.
 *
 * Depende de `altoHeader` porque el header cambia de alto: el observador se
 * recrea con cada valor nuevo, que son un puñado durante su transición y
 * ninguno el resto del tiempo.
 */
export function usePegada(
  centinela: RefObject<HTMLElement | null>,
  altoHeader: number,
): boolean {
  const [pegada, setPegada] = useState(false);

  useEffect(() => {
    const nodo = centinela.current;
    if (!nodo) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setPegada(!entrada.isIntersecting),
      { rootMargin: `-${Math.round(altoHeader) + SEPARACION}px 0px 9999px 0px` },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [centinela, altoHeader]);

  return pegada;
}

/**
 * Índice de la sección que ocupa la franja de lectura, dentro de `ids`.
 *
 * IntersectionObserver y no cálculos atados al scroll: el navegador ya sabe qué
 * secciones cruzan la franja y avisa solo cuando eso cambia.
 *
 * rootMargin recorta el viewport a una banda fina alrededor de su 45% —la
 * altura de lectura—, no a la línea justo bajo la barra: en porcentaje no hay
 * que recalcularla cada vez que el header cambia de alto, y con secciones
 * largas siempre hay exactamente una cruzándola. El conjunto `visibles` existe
 * para el instante en que dos se solapan en la banda (el borde entre
 * secciones): gana la primera en orden de documento, que es la que se está
 * dejando atrás, en vez de depender del orden en que lleguen las entradas. Si
 * no cruza ninguna —por encima de la primera o por debajo de la última— se
 * conserva la última marcada.
 *
 * Arranca en 0: por encima de la primera sección, la primera pestaña es la
 * lectura correcta de "por dónde vas".
 */
export function useSeccionActiva(ids: readonly string[]): number {
  const [activo, setActivo] = useState(0);
  /* La lista se declara literal en cada página, así que su identidad cambia en
     cada render aunque el contenido no; la clave estable evita recrear el
     observador sin motivo. */
  const clave = ids.join("|");

  useEffect(() => {
    const orden = clave.split("|");
    const secciones = orden
      .map((id) => document.getElementById(id))
      .filter((nodo): nodo is HTMLElement => nodo !== null);
    if (secciones.length === 0) return;

    const visibles = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visibles.add(entrada.target.id);
          else visibles.delete(entrada.target.id);
        }
        const indice = orden.findIndex((id) => visibles.has(id));
        if (indice !== -1) setActivo(indice);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secciones.forEach((seccion) => observador.observe(seccion));
    return () => observador.disconnect();
  }, [clave]);

  return activo;
}
