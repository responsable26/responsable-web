"use client";

import { useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import type { ArticuloMeta } from "@/lib/articulos";

/**
 * Umbral en píxeles por debajo del cual un pointerdown+pointerup se considera
 * clic y no arrastre. 8 y no 5: al pulsar con el ratón la mano desplaza unos
 * pocos píxeles, y con el umbral justo un clic con pulso se leía como arrastre.
 * Sigue muy por debajo de lo que recorre cualquier arrastre intencionado.
 */
const DRAG_THRESHOLD = 8;

export function Articulos({ articulos }: { articulos: ArticuloMeta[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  function scrollByCard(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    /*
      El paso se mide en cada clic en lugar de fijarse como constante: así sigue
      siendo exacto si cambian el ancho de tarjeta, el gap, o si difieren por
      breakpoint — y con el ancho fluido de abajo cambian en cada resize.
      getBoundingClientRect conserva los subpíxeles (offsetWidth los redondea, y
      el error se acumularía clic a clic).
    */
    const card = scroller.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(scroller).columnGap);
    const step = card.getBoundingClientRect().width + (Number.isNaN(gap) ? 0 : gap);

    scroller.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Solo ratón: en táctil y lápiz el scroll nativo ya funciona, y capturar el
    // puntero ahí rompería el gesto propio del sistema.
    if (event.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    /*
      Aquí solo se anota el punto de partida. Ni se captura el puntero ni se
      tocan estilos: hasta que el umbral no se supera, esto todavía puede ser
      un clic y no debe alterarse nada.
    */
    drag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const scroller = scrollerRef.current;
    if (!state.active || !scroller) return;

    const dx = event.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      state.moved = true;
      setDragging(true);

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
      scroller.setPointerCapture(event.pointerId);
      scroller.style.scrollSnapType = "none";
      scroller.style.scrollBehavior = "auto";
    }
    scroller.scrollLeft = state.scrollLeft - dx;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!drag.current.active || !scroller) return;

    drag.current.active = false;
    setDragging(false);
    // Solo hay algo que deshacer si el arrastre llegó a empezar.
    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    // Quitar los inline styles devuelve el snap y el scroll suave de las clases;
    // reponer el snap mandatorio es lo que encuadra la tarjeta al soltar.
    scroller.style.scrollSnapType = "";
    scroller.style.scrollBehavior = "";
  }

  /*
    En fase de captura, antes de que el click llegue al <a> de la tarjeta: si
    hubo arrastre se cancela la navegación. `moved` se limpia aquí y no en
    endDrag porque el click se dispara después del pointerup.
  */
  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  }

  return (
    /*
      La sección no lleva px-6: la pista tiene que poder llegar al borde derecho
      del viewport, y un padding en la sección la detendría antes. Cada hijo se
      encarga de su propio gutter.
    */
    <section className="py-[var(--section-y)]">
      {/*
        max-w-[--container+3rem] + px-6 reproduce la geometría de un contenedor
        de 1120px con px-6 por fuera: con box-sizing:border-box el contenido
        queda en min(1120px, 100%-48px).
      */}
      <div className="mx-auto max-w-[calc(var(--container)+3rem)] px-6">
        {/*
          items-end deja los controles al pie de la columna de texto, que es lo
          que los sitúa a la altura del párrafo y no del título. Antes vivían
          arriba a la derecha, donde se cruzaban con el botón del header (fixed
          en la Home, sticky en el resto).
        */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {/*
              Eyebrow decorativo: <p> y no un encabezado, para no meter un nivel
              entre el h1 del hero y este h2. Reusa la tipografía del eyebrow de
              Casos de Éxito; solo cambia el color, teal allí sobre navy.
            */}
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
              Recursos
            </p>
            {/*
              Escala de encabezado de sección: el clamp anterior llegaba a
              3.6rem y competía con el h1 del hero. Se conserva la forma fluida
              y la proporción entre extremos, reducida en torno a un 27%.
            */}
            <h2 className="font-head mt-2 text-[clamp(1.6rem,4.3vw,2.6rem)] font-semibold text-navy">
              Últimos Artículos
            </h2>
            <p className="font-body mt-4 max-w-[60ch] text-ink-soft">
              Ideas que transforman el impacto en acción. Explore nuestros
              artículos sobre Sostenibilidad y Responsabilidad Social
              Empresarial.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Artículo anterior"
              /*
                Hover del botón circular con borde, calcado del carrusel de
                beneficios (servicio/beneficios-carousel.tsx): el borde y el
                icono pasan a magenta. active: no existía en ningún botón del
                sitio; se añade un fondo magenta al 10% como estado pulsado.
              */
              className="flex size-11 items-center justify-center rounded-full border border-navy text-navy transition-colors hover:border-magenta hover:text-magenta active:bg-magenta/10"
            >
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Artículo siguiente"
              /*
                Hover del botón magenta sólido, con el mismo #C71268 que usan
                ContactButton --primary y el CTA del header. El pulsado baja un
                tono más para que se distinga del hover.
              */
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white transition-colors hover:bg-[#C71268] active:bg-[#A50E56]"
            >
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/*
        La pista es hija directa de la sección, así que su 100% es el ancho de
        página completo — a diferencia de 100vw, no incluye la scrollbar, que es
        lo que provocaría desbordamiento horizontal en desktop.

        El padding replica el gutter del encabezado, y scroll-padding-left lo
        iguala para que snap-start ancle la tarjeta en el gutter y no contra el
        borde del viewport.

        La barra de scroll se oculta en los dos motores; el desbordamiento sigue
        activo, así que gesto, controles y arrastre siguen funcionando.

        py-10 existe por el recorte vertical: overflow-x:auto obliga a overflow-y
        a computar a auto (la especificación no permite un eje visible y el otro
        no), así que la pista recortaba el translate del hover y la sombra de la
        tarjeta. El padding da el hueco; -mt-4 y -mb-10 lo descuentan del flujo
        para que el ritmo vertical de la sección quede igual que antes:
        -mt-4 = mt-6 anterior (24px) − py-10 (40px).
      */}
      <div
        ref={scrollerRef}
        /* Lenis calcula la orientación de cada gesto: con este atributo cede
           los horizontales a esta pista y conserva los verticales para la
           página, así que el snap y el trackpad siguen funcionando. */
        data-lenis-prevent-horizontal=""
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        // Corta el arrastre nativo de enlaces e imágenes, que en un carrusel
        // aparece como el "fantasma" del elemento pegado al cursor.
        onDragStart={(event) => event.preventDefault()}
        className={`-mt-4 -mb-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1.5rem,calc((100%-var(--container))/2))] py-10 scroll-pl-[max(1.5rem,calc((100%-var(--container))/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging
            ? "cursor-grabbing select-none [&_a]:cursor-grabbing"
            : "cursor-grab [&_a]:cursor-grab"
        }`}
      >
        {articulos.map((articulo, index) => (
          /*
            Ancho fluido para que entren exactamente 4 tarjetas y media en la
            franja visible: 4 completas más la quinta cortada por el borde del
            viewport, que es lo que hace que se lea como continuidad.

            (100vw − gutter) es esa franja, menos los 4 gap de 1.5rem que caen
            entre las cinco, dividido entre 4.5. Aquí sí procede 100vw: el ancho
            de tarjeta no puede desbordar la página porque la pista recorta.
          */
          <div
            key={articulo.slug}
            className="w-[80vw] shrink-0 snap-start sm:w-[45vw] lg:w-[calc((100vw-max(1.5rem,calc((100vw-var(--container))/2))-6rem)/4.5)]"
          >
            <ArticuloCard articulo={articulo} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
