"use client";

import { useRef, useState } from "react";

/**
 * Umbral en píxeles por debajo del cual un pointerdown+pointerup se considera
 * clic y no arrastre. 8 y no 5: al pulsar con el ratón la mano desplaza unos
 * pocos píxeles, y con el umbral justo un clic con pulso se leía como arrastre.
 * Sigue muy por debajo de lo que recorre cualquier arrastre intencionado.
 */
const UMBRAL_ARRASTRE = 8;

/** Clases que definen el comportamiento de la pista, sin su geometría.
 *
 *  El gap, el padding y el ancho de cada elemento los pone quien la usa: el
 *  carrusel de artículos sangra hasta el borde del viewport y el de pasos vive
 *  dentro de una tarjeta, así que no comparten medidas. Lo que sí comparten es
 *  el snap, el desbordamiento y la barra oculta. */
const CLASES_BASE =
  "flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * El mecanismo de pista deslizable: arrastre con ratón, gesto táctil nativo,
 * scroll-snap y barra de desplazamiento oculta.
 *
 * Vivía dentro del carrusel de artículos de la Home. Se extrae aquí al aparecer
 * el segundo caso —los pasos del proceso en las páginas de servicio— para que
 * la lógica de arrastre exista una sola vez. Es un hook y no un componente
 * porque los dos carruseles colocan sus controles en sitios distintos: aquí
 * está el comportamiento, y cada uno compone su propio marcado.
 *
 * El nombre arranca en inglés y no en «usar» porque `use` no es prosa: es la
 * convención de React, y la regla react-hooks/rules-of-hooks solo reconoce como
 * hook lo que empieza por ahí.
 *
 * El movimiento reducido no necesita nada específico: `scroll-smooth` es una
 * clase, y la regla global de globals.css fuerza `scroll-behavior: auto` con
 * esa preferencia activa. El arrastre en sí no es una animación.
 */
export function usePistaArrastrable<T extends HTMLElement = HTMLDivElement>() {
  // Genérico en el tipo de elemento: el carrusel de artículos usa un <div> y la
  // pista de pasos un <ol>, y el ref tiene que encajar en los dos.
  const ref = useRef<T>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const gesto = useRef({ activo: false, x0: 0, scrollLeft: 0, movido: false });

  function desplazarUnPaso(direccion: 1 | -1) {
    const pista = ref.current;
    if (!pista) return;

    /*
      El paso se mide en cada clic en lugar de fijarse como constante: así sigue
      siendo exacto si cambian el ancho de tarjeta, el gap, o si difieren por
      breakpoint — y con anchos fluidos cambian en cada resize.
      getBoundingClientRect conserva los subpíxeles (offsetWidth los redondea, y
      el error se acumularía clic a clic).
    */
    const tarjeta = pista.firstElementChild;
    if (!tarjeta) return;
    const gap = parseFloat(getComputedStyle(pista).columnGap);
    const paso =
      tarjeta.getBoundingClientRect().width + (Number.isNaN(gap) ? 0 : gap);

    /*
      El movimiento reducido se consulta aquí y no se deja en manos del CSS: la
      regla global de globals.css fuerza `scroll-behavior: auto`, pero un
      `behavior: "smooth"` explícito en scrollBy manda sobre la propiedad
      calculada y la pista se animaría igual. Es el único punto del carrusel que
      la hoja de estilos no alcanza.
    */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    pista.scrollBy({
      left: direccion * paso,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  function onPointerDown(event: React.PointerEvent<T>) {
    // Solo ratón: en táctil y lápiz el scroll nativo ya funciona, y capturar el
    // puntero ahí rompería el gesto propio del sistema.
    if (event.pointerType !== "mouse") return;
    const pista = ref.current;
    if (!pista) return;

    /*
      Aquí solo se anota el punto de partida. Ni se captura el puntero ni se
      tocan estilos: hasta que el umbral no se supera, esto todavía puede ser
      un clic y no debe alterarse nada.
    */
    gesto.current = {
      activo: true,
      x0: event.clientX,
      scrollLeft: pista.scrollLeft,
      movido: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<T>) {
    const estado = gesto.current;
    const pista = ref.current;
    if (!estado.activo || !pista) return;

    const dx = event.clientX - estado.x0;
    if (!estado.movido) {
      if (Math.abs(dx) < UMBRAL_ARRASTRE) return;
      estado.movido = true;
      setArrastrando(true);

      /*
        La captura del puntero se toma AQUÍ, al confirmarse el arrastre, y no en
        pointerdown. Mientras hay captura activa el `click` posterior se despacha
        al elemento que captura —la pista— y no al <a> de la tarjeta, así que
        capturar antes de saber si había arrastre anulaba la navegación de todos
        los clics, superasen o no el umbral.

        Los dos estilos se desactivan también aquí y se restauran al soltar:
        - scroll-snap-type mandatorio pelearía con cada asignación de scrollLeft
          y el arrastre saldría a tirones. Al restaurarlo, encuadra solo.
        - scroll-behavior: smooth animaría cada asignación, con lo que la pista
          iría por detrás del cursor.
      */
      pista.setPointerCapture(event.pointerId);
      pista.style.scrollSnapType = "none";
      pista.style.scrollBehavior = "auto";
    }
    pista.scrollLeft = estado.scrollLeft - dx;
  }

  function terminarArrastre(event: React.PointerEvent<T>) {
    const pista = ref.current;
    if (!gesto.current.activo || !pista) return;

    gesto.current.activo = false;
    setArrastrando(false);
    // Solo hay algo que deshacer si el arrastre llegó a empezar.
    if (pista.hasPointerCapture(event.pointerId)) {
      pista.releasePointerCapture(event.pointerId);
    }
    // Quitar los inline styles devuelve el snap y el scroll suave de las clases;
    // reponer el snap mandatorio es lo que encuadra la tarjeta al soltar.
    pista.style.scrollSnapType = "";
    pista.style.scrollBehavior = "";
  }

  /*
    En fase de captura, antes de que el click llegue al <a> de la tarjeta: si
    hubo arrastre se cancela la navegación. `movido` se limpia aquí y no en
    terminarArrastre porque el click se dispara después del pointerup.
  */
  function onClickCapture(event: React.MouseEvent<T>) {
    if (!gesto.current.movido) return;
    event.preventDefault();
    event.stopPropagation();
    gesto.current.movido = false;
  }

  return {
    ref,
    desplazarUnPaso,
    /** Se extiende sobre el elemento de la pista. */
    propsPista: {
      /* Lenis calcula la orientación de cada gesto: con este atributo cede
         los horizontales a esta pista y conserva los verticales para la
         página, así que el snap y el trackpad siguen funcionando. */
      "data-lenis-prevent-horizontal": "",
      onPointerDown,
      onPointerMove,
      onPointerUp: terminarArrastre,
      onPointerCancel: terminarArrastre,
      onClickCapture,
      // Corta el arrastre nativo de enlaces e imágenes, que en un carrusel
      // aparece como el "fantasma" del elemento pegado al cursor.
      onDragStart: (event: React.DragEvent<T>) => event.preventDefault(),
    },
    /** Comportamiento y cursor. La geometría la añade quien lo usa. */
    clasesPista: `${CLASES_BASE} ${
      arrastrando
        ? "cursor-grabbing select-none [&_a]:cursor-grabbing"
        : "cursor-grab [&_a]:cursor-grab"
    }`,
  };
}
