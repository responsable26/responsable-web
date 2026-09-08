"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { irAAncla } from "@/lib/scroll-suave";
import {
  SEPARACION,
  useAltoHeader,
  useSeccionActiva,
} from "@/components/servicio/use-barra-anclas";

export type Ancla = { label: string; href: string };

/**
 * Barra de secciones de una página de servicio.
 *
 * Sustituye a la navegación contextual que el header montaba en su propia
 * fila: ahora el header muestra el menú principal completo, igual que en el
 * resto del sitio, y las secciones viven en esta pieza aparte.
 *
 * Aparece cuando el hero sale del área visible y se retira al volver arriba.
 * `position: fixed` y no sticky, que es lo que resuelve el requisito de que su
 * entrada no desplace el contenido: un elemento fijo está fuera del flujo, así
 * que montarse y desmontarse no mueve un píxel de la página. Un sticky
 * condicional sí daría ese salto.
 *
 * Va siempre montada y solo desplazada fuera de vista cuando toca ocultarla,
 * porque una transición necesita los dos estados en el DOM; `inert` la saca
 * entretanto del foco y del árbol de accesibilidad.
 *
 * Su lenguaje visual es el de la pastilla de cuadrantes de /servicio/ —blanca,
 * completamente redondeada, text-xs, sombra suave y 12px por debajo del
 * header—, y comparte con ella las piezas de use-barra-anclas.ts. Es
 * deliberado: al desplazarse, el header del sitio se recoge en una pastilla
 * flotante centrada, y una barra a ancho completo por debajo se leería
 * descolgada.
 */
export function BarraAnclas({ anclas }: { anclas: readonly Ancla[] }) {
  const [visible, setVisible] = useState(false);
  const pastillaRef = useRef<HTMLElement>(null);
  const altoHeader = useAltoHeader();
  const activo = useSeccionActiva(anclas.map((a) => a.href.slice(1)));

  /*
    El disparador es el propio hero: mientras se vea, aunque sea un borde, la
    barra no aparece; en cuanto sale del todo, entra. Se observa por id y no
    por una ref pasada desde la página porque el hero lo pinta HeroFramed, que
    es un componente de servidor y no puede sostener una ref.

    Sin umbral: basta con que deje de intersecar. Al volver arriba, el propio
    observador lo detecta y la barra se retira sin lógica aparte.
  */
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observador = new IntersectionObserver(([entrada]) =>
      setVisible(!entrada.isIntersecting),
    );
    observador.observe(hero);
    return () => observador.disconnect();
  }, []);

  /*
    Al pulsar una pestaña, el desplazamiento pasa por irAAncla con el alto real
    de esta barra sumado al margen: como está fuera del flujo, el scroll-margin
    de la sección no la tiene en cuenta y el título aterrizaría debajo. Mismo
    mecanismo que la pastilla de /servicio/.
  */
  function irASeccion(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const alto = pastillaRef.current?.getBoundingClientRect().height ?? 0;
    if (irAAncla(id, alto + SEPARACION)) event.preventDefault();
  }

  return (
    /*
      El envoltorio ocupa todo el ancho pero solo se ve la pastilla, así que
      pointer-events-none evita que sus bandas transparentes intercepten los
      clics del contenido que pasa por debajo.

      z-40: por debajo del header (z-50), de su panel deslizante y de los
      modales (z-60), y por encima del contenido de las secciones.

      `top` en línea porque es un valor medido: el header cambia de alto entre
      sus dos estados y un valor fijo dejaría hueco en uno y solapamiento en el
      otro.
    */
    <div
      style={{ top: altoHeader + SEPARACION }}
      inert={!visible}
      className={`pointer-events-none fixed inset-x-0 z-40 px-6 transition-[transform,opacity] duration-300 ease-out lg:px-10 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <nav
        ref={pastillaRef}
        aria-label="Secciones de la página"
        /* 38rem (608px) y no 36: con la entrada de Testimonios las páginas
           dinámicas pasan a cinco pestañas, 560px medidos sobre los avances
           reales de Poppins Medium a 12px más el px-3 de cada pestaña, el gap-1
           y el p-1.5 de la pastilla. Sobre 576px quedaban 16px, y mientras la
           webfont carga se compone con la de respaldo, de métricas parecidas
           pero no idénticas: con ese margen podía asomar la barra de
           desplazamiento durante ese intervalo. Con 608px sobran 48px. */
        className="pointer-events-auto mx-auto max-w-[38rem] overflow-x-auto rounded-full bg-white p-1.5 shadow-sm"
      >
        <ul className="flex items-center gap-1">
          {anclas.map((ancla, index) => {
            const activa = index === activo;
            return (
              /* flex-none por debajo de sm: antes que encoger las etiquetas
                 hasta lo ilegible, la pastilla se desplaza en horizontal.
                 Desde sm se reparten el ancho a partes iguales. */
              <li key={ancla.href} className="flex-none sm:flex-1">
                <a
                  href={ancla.href}
                  onClick={(event) => irASeccion(event, ancla.href.slice(1))}
                  aria-current={activa ? "true" : undefined}
                  /* La activa se marca con una píldora navy concéntrica, no
                     con un subrayado: dentro de una pastilla redondeada, una
                     línea al pie no encaja. Blanco sobre navy da 13.85:1, muy
                     por encima del mínimo AA para este cuerpo; el magenta se
                     quedaría en 4.30:1, insuficiente a 12px. */
                  className={`font-head block rounded-full px-3 py-2.5 text-center text-xs font-medium whitespace-nowrap transition-colors duration-300 ease-out ${
                    activa
                      ? "bg-navy text-white"
                      : "text-ink-soft hover:text-navy"
                  }`}
                >
                  {ancla.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
