"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CASOS } from "@/lib/casos";
import { ChevronIcon } from "@/components/icons";
import { HojasBanda } from "@/components/home/hojas-banda";
import { VideoYoutube } from "@/components/video-youtube";

/**
 * Longitud del truncado de la descripción en el carrusel.
 *
 * Sale de la geometría del bloque: con el contenedor a 1120px la imagen ocupa
 * el 45% (504px) y, en aspecto 16:9, mide 284px de alto. La columna de texto
 * queda en 584px y el cliente, el subtítulo y el enlace se llevan unos 110px,
 * así que al párrafo le quedan ~174px. A 27px por línea son algo más de seis
 * líneas, y a ~62 caracteres por línea salen unos 373.
 *
 * Se fija en 340 para dejar margen: así las cinco descripciones ocupan el mismo
 * número de líneas y el bloque no cambia de alto al pasar de un caso a otro.
 *
 * El recorte es solo de presentación: el texto íntegro sigue en casos.ts y se
 * muestra completo en la página de cada caso.
 */
const LIMITE_DESCRIPCION = 340;

/** Corta en límite de palabra y cierra con elipsis. */
function truncar(texto: string, limite: number) {
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

const LOGOS = [
  { nombre: "Heineken México", archivo: "heineken-mexico", w: 512, h: 182 },
  { nombre: "Baker M", archivo: "baker-m", w: 800, h: 533 },
  { nombre: "Deacero", archivo: "deacero", w: 235, h: 110 },
  {
    nombre: "Pacto Mundial Red Española",
    archivo: "pacto-mundial",
    w: 235,
    h: 110,
  },
  { nombre: "MetLife", archivo: "metlife", w: 235, h: 110 },
  {
    nombre: "BMW Group Planta San Luis Potosí",
    archivo: "bmw-group",
    w: 235,
    h: 110,
  },
  { nombre: "Profuturo", archivo: "profuturo", w: 300, h: 126 },
  { nombre: "La Esperanza", archivo: "la-esperanza", w: 235, h: 110 },
];

/**
 * Una pasada completa de la secuencia de logos dentro de la pista.
 *
 * `duplicado` marca la copia que solo sirve para cerrar el bucle sin costura:
 * queda oculta a lectores de pantalla y se retira del todo con movimiento
 * reducido, donde no hay bucle que tapar.
 */
function ListaLogos({ duplicado = false }: { duplicado?: boolean }) {
  return (
    <div
      className={`marquee-grupo${duplicado ? " marquee-copia" : ""}`}
      aria-hidden={duplicado || undefined}
    >
      {LOGOS.map((logo) => (
        <div key={logo.archivo} className="marquee-hueco">
          <Image
            src={`/logos-clientes/${logo.archivo}.webp`}
            alt={duplicado ? "" : logo.nombre}
            width={logo.w}
            height={logo.h}
            /*
              Seis de los ocho archivos vienen a color y dos en monocromo, así
              que la banda mezclaba azules, rojos y verdes sin criterio.
              grayscale los iguala en reposo; al pasar el cursor el logo
              recupera su color y su opacidad plena.
            */
            className="h-9 w-auto max-w-full object-contain opacity-60 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Recorrido en px por debajo del cual el gesto no es un arrastre sino un clic.
 *
 * Es la tolerancia de pulso: nadie suelta el botón exactamente donde lo apretó,
 * y sin este margen reproducir el video o abrir «Ver el caso completo» fallaría
 * cada vez que la mano se mueve un pelo. Por debajo de 8px no se captura el
 * puntero ni se anula el clic, así que ese caso se comporta como antes.
 */
const UMBRAL_CLIC = 8;

/**
 * Recorrido necesario para cambiar de caso: el 8% del ancho del bloque, nunca
 * menos de 64px.
 *
 * Proporcional y no fijo porque el mismo gesto tiene que pedir un esfuerzo
 * parecido en un móvil de 360px y en el bloque de 1120px del desktop. El mínimo
 * cubre el extremo estrecho, donde un 8% serían 29px y se cambiaría de caso sin
 * querer.
 */
const UMBRAL_CAMBIO = 0.08;
const UMBRAL_CAMBIO_MIN = 64;

/**
 * Cuánto sigue el bloque al dedo, de 0 a 1.
 *
 * No es 1 a propósito: esto no es una pista con el caso siguiente esperando al
 * lado, sino un slider por estado que muestra uno cada vez. Con seguimiento
 * pleno el bloque se despegaría del centro sin que apareciera nada detrás y el
 * hueco delataría que no hay tal pista. A 0.35 el arrastre se acusa lo justo
 * para saber que el gesto está siendo atendido, y el retorno se lee como un
 * rebote elástico.
 */
const RESISTENCIA = 0.35;

export function CasosExito() {
  const [index, setIndex] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const pistaRef = useRef<HTMLDivElement>(null);
  const caso = CASOS[index];

  /**
   * Estado del gesto en curso. Va en un ref y no en useState porque cambia en
   * cada pointermove: pasarlo por el estado volvería a renderizar el bloque
   * —y con él la miniatura del video— decenas de veces por segundo. El
   * desplazamiento se escribe directamente en el style del nodo; a React solo
   * llega el arranque y el final del arrastre.
   */
  const gesto = useRef({
    activo: false,
    /** El eje ya se decidió y el gesto es nuestro, no de la página. */
    horizontal: false,
    /** Se superó UMBRAL_CLIC: hay que anular el clic que vendrá al soltar. */
    movido: false,
    x0: 0,
    y0: 0,
    dx: 0,
    id: -1,
  });

  function goTo(delta: number) {
    setIndex((current) => (current + delta + CASOS.length) % CASOS.length);
  }

  function desplazar(px: number) {
    const pista = pistaRef.current;
    if (pista) pista.style.transform = px ? `translate3d(${px}px,0,0)` : "";
  }

  function alPulsar(e: React.PointerEvent<HTMLDivElement>) {
    /* Solo el botón principal: con el secundario se abre el menú contextual y
       el arrastre se quedaría colgado sin pointerup. */
    if (e.pointerType === "mouse" && e.button !== 0) return;
    gesto.current = {
      activo: true,
      horizontal: false,
      movido: false,
      x0: e.clientX,
      y0: e.clientY,
      dx: 0,
      id: e.pointerId,
    };
  }

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    const g = gesto.current;
    if (!g.activo) return;
    /* Solo atiende al puntero que inició el gesto: un segundo dedo apoyado
       sobre el bloque no debe tomar el mando a media pasada. */
    if (e.pointerId !== g.id) return;
    /* Sin botones pulsados no hay arrastre. Cubre el caso de soltar el ratón
       fuera de la ventana antes de que el gesto llegue a capturar el puntero:
       ahí no llega pointerup, el gesto se quedaría abierto y el siguiente
       movimiento del ratón —ya sin pulsar— arrancaría un arrastre fantasma
       midiendo desde un origen viejo. */
    if (e.buttons === 0) {
      g.activo = false;
      return;
    }

    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;

    if (!g.horizontal) {
      /* Todavía no se sabe qué gesto es. Mientras no se supere la tolerancia de
         pulso en algún eje, no se hace nada: sigue pudiendo ser un clic. */
      if (Math.abs(dx) < UMBRAL_CLIC && Math.abs(dy) < UMBRAL_CLIC) return;
      /* Predominio vertical: el gesto es el scroll de la página. Se abandona y
         no se vuelve a mirar hasta el siguiente pointerdown, para no robarlo a
         media pasada si luego se tuerce. En táctil esto ya lo resuelve antes el
         touch-action: pan-y del contenedor, que deja el eje Y al navegador y
         nos manda un pointercancel; esta rama cubre el ratón y los punteros
         que no pasan por ahí. */
      if (Math.abs(dy) >= Math.abs(dx)) {
        g.activo = false;
        return;
      }
      g.horizontal = true;
      g.movido = true;
      pistaRef.current?.setPointerCapture(g.id);
      /* Si el pulso empezó sobre el párrafo, el navegador ya habrá pintado unos
         píxeles de selección antes de que supiéramos que esto era un arrastre.
         El select-none que entra ahora impide que crezca, pero no borra lo ya
         seleccionado. */
      window.getSelection()?.removeAllRanges();
      setArrastrando(true);
    }

    g.dx = dx;
    desplazar(dx * RESISTENCIA);
  }

  function alSoltar() {
    const g = gesto.current;
    if (!g.activo) return;
    g.activo = false;

    if (g.horizontal) {
      const ancho = pistaRef.current?.offsetWidth ?? 0;
      const umbral = Math.max(UMBRAL_CAMBIO_MIN, ancho * UMBRAL_CAMBIO);
      if (pistaRef.current?.hasPointerCapture(g.id)) {
        pistaRef.current.releasePointerCapture(g.id);
      }
      setArrastrando(false);
      /* Arrastrar a la izquierda avanza: el bloque se va por donde saldría el
         caso actual, igual que al pasar una página. */
      if (Math.abs(g.dx) >= umbral) goTo(g.dx < 0 ? 1 : -1);
    }

    /* Siempre vuelve a cero, se haya cambiado de caso o no: por debajo del
       umbral es el retorno al caso actual, y por encima es el nuevo caso
       asentándose en su sitio. */
    desplazar(0);
  }

  /** El navegador se quedó con el gesto (scroll vertical, gesto del sistema). */
  function alCancelar() {
    const g = gesto.current;
    if (!g.activo) return;
    g.activo = false;
    if (g.horizontal) setArrastrando(false);
    desplazar(0);
  }

  /**
   * Anula el clic que el navegador dispara al soltar tras un arrastre. En fase
   * de captura y en el contenedor, así que da igual sobre qué haya terminado el
   * puntero: corta antes de llegar al enlace del caso o al botón del video.
   *
   * La bandera se levanta solo al superar UMBRAL_CLIC, de modo que un clic
   * normal no pasa nunca por aquí.
   */
  function alHacerClic(e: React.MouseEvent) {
    if (!gesto.current.movido) return;
    gesto.current.movido = false;
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    /*
      overflow-hidden por las hojas: recorta lo que sobresalga por los lados en
      viewports estrechos, así el dibujo no añade scroll horizontal a la página.

      La banda de logos sí es una pista desplazable y sí sangra, pero la recorta
      su propia tarjeta, no esta sección: cuando el arrastre del slider desplaza
      el bloque del caso, este overflow-hidden es además lo que impide que ese
      desplazamiento asome por el borde de la ventana.
    */
    <section className="relative overflow-hidden bg-navy px-6 py-[var(--section-y)]">
      {/*
        Va antes que el contenido en el DOM y sin z-index: los dos son elementos
        posicionados, así que el orden de pintado lo decide el orden del árbol y
        las hojas quedan por debajo. El alto crece con el viewport y el anclaje
        es bottom-0, de modo que el cúmulo inferior de la composición cae en la
        franja de padding que queda libre bajo la tarjeta.
      */}
      <HojasBanda className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(11rem,26vw,20rem)] w-full" />

      <div className="relative mx-auto max-w-[var(--container)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              Casos de Éxito
            </p>
            <h2 className="font-head mt-2 max-w-xl text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-magenta">
              Impacto medible, valor sostenible.
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Caso anterior"
              /* Mismo tratamiento que los controles del carrusel de artículos:
                 hover #C71268, pulsado #A50E56 y transición de color. */
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white transition-colors hover:bg-[#C71268] active:bg-[#A50E56]"
            >
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Caso siguiente"
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white transition-colors hover:bg-[#C71268] active:bg-[#A50E56]"
            >
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </div>
        </div>

        {/*
          Zona de arrastre. Cubre el bloque del caso —video y texto— y no los
          botones, que siguen siendo pulsaciones normales.

          touch-action: pan-y deja el eje vertical al navegador: el scroll de la
          página nunca pasa por este código, así que el gesto no puede comérselo.
          Del eje horizontal nos ocupamos nosotros.

          onDragStart cortado: la miniatura del video es un <img> y arrastrarla
          con el ratón dispararía el arrastre nativo de HTML, con su imagen
          fantasma, en mitad del gesto.

          La transición solo existe fuera del arrastre: mientras el dedo manda,
          el bloque tiene que ir pegado a él y no persiguiéndolo. El retorno a
          cero sí se anima, y con movimiento reducido lo neutraliza la regla
          global de globals.css, que anula cualquier transition-duration del
          sitio sin necesidad de una clase aquí.

          El cursor grabbing se fuerza también en los descendientes: sin eso, el
          botón del video conservaría su cursor pointer —la regla base lo pone en
          todos los botones— y el puntero cambiaría de forma en mitad del
          arrastre. En reposo se queda como está: sobre el botón, pointer.

          select-none solo mientras se arrastra, para no perder la selección del
          párrafo el resto del tiempo.
        */}
        <div
          ref={pistaRef}
          onPointerDown={alPulsar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alCancelar}
          onDragStart={(e) => e.preventDefault()}
          onClickCapture={alHacerClic}
          className={`mt-10 grid touch-pan-y items-start gap-8 md:grid-cols-[45%_1fr] ${
            arrastrando
              ? "cursor-grabbing select-none [&_*]:cursor-grabbing"
              : "cursor-grab transition-transform duration-300"
          }`}
        >
          {/*
            key por slug: sin él, al cambiar de caso con el reproductor abierto
            React reutilizaría el componente, conservaría su estado y el iframe
            arrancaría solo con el video siguiente. Remontarlo devuelve la
            miniatura y deja la reproducción siempre en manos del usuario.

            items-start en la rejilla: por defecto las celdas se estiran al alto
            de la fila y el 16:9 del video se perdería si la columna de texto
            fuese más alta. Anclado arriba, el video conserva su proporción y
            queda alineado con el borde superior del texto, que es donde estaba
            el bloque anterior.
          */}
          <VideoYoutube
            key={caso.slug}
            id={caso.videoYoutube}
            titulo={`Testimonio de ${caso.cliente}`}
            sizes="(min-width: 1120px) 504px, (min-width: 768px) 45vw, 100vw"
          />

          <div>
            <h3 className="font-head text-2xl font-semibold text-white">
              {caso.cliente}
            </h3>
            <p className="font-head mt-1 text-sm font-medium text-white/70">
              {caso.subtitulo}
            </p>
            <p className="font-body mt-4 text-white/85">
              {truncar(caso.descripcion, LIMITE_DESCRIPCION)}
            </p>
            <Link
              href={`/casos-de-exito/${caso.slug}/`}
              className="font-head mt-6 inline-block text-sm font-semibold text-magenta"
            >
              Ver el caso completo →
            </Link>
          </div>
        </div>

        <div className="relative mt-16">
          {/*
            La píldora se monta a caballo sobre el borde superior de la tarjeta:
            top-0 la sitúa en ese borde y -translate-y-1/2 la sube justo media
            altura, así que la mitad queda sobre el navy y la mitad sobre el
            blanco. El centrado es left-1/2 + -translate-x-1/2, que no depende
            del ancho del texto.

            max-w evita el desbordamiento en pantallas estrechas: si no cupiera,
            el texto se pliega dentro de la píldora en vez de salirse. Con la
            cadena actual no llega a plegarse ni a 360px de viewport.
          */}
          <span className="font-head absolute top-0 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta px-4 py-2 text-center text-sm font-semibold text-white">
            Trabajamos Junto a los Mejores:
          </span>

          {/*
            La tarjeta es a la vez la ventana de la marquesina: el recorte lo
            hace ella, así que los logos entran y salen por sus propios bordes
            redondeados en vez de por un borde interior. Ya no lleva px: una
            pista en movimiento tiene que sangrar de lado a lado, y el aire entre
            logos lo pone el padding de cada hueco.

            pt-10 y no py-6: la mitad inferior de la píldora invade 18px de la
            tarjeta, y con el padding simétrico anterior los logos le quedaban
            pegados. Que la tarjeta recorte no afecta a la píldora, que es
            hermana suya y no hija.

            Cuántos logos se ven a la vez: 2 en móvil, 3 en tablet y 5 en
            desktop. Con los cinco de desktop en un móvil cada logo caería por
            debajo de 60px de ancho útil y no se leería la marca.
          */}
          <div className="marquee rounded bg-white pt-10 pb-6 [--marquee-visibles:2] md:[--marquee-visibles:3] lg:[--marquee-visibles:5]">
            <div className="marquee-pista">
              {/*
                Dos pasadas de la misma secuencia. La primera es la real; la
                segunda solo existe para tapar el retorno del bucle, así que va
                fuera del árbol de accesibilidad y con alt vacío —si no, cada
                cliente se anunciaría dos veces—. Los logos de la primera
                conservan su alt intacto.
              */}
              <ListaLogos />
              <ListaLogos duplicado />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
