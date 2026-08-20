"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CASOS, type Caso } from "@/lib/casos";
import { ChevronIcon } from "@/components/icons";
import { HojasBanda } from "@/components/home/hojas-banda";
import { VideoYoutube } from "@/components/video-youtube";
import { usePistaArrastrable } from "@/components/use-pista-arrastrable";

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

              La altura es el eje que se fija (h-12) y el ancho queda en auto:
              los logos no comparten proporción (de 1.5:1 el de Baker M a
              2.81:1 el de Heineken), así que igualarlos por altura es lo que
              los alinea ópticamente. Subir esta misma altura para todos —y no
              una transform:scale por logo, que multiplicaría el desajuste ya
              existente entre proporciones— es lo que los agranda sin
              desequilibrarlos entre sí. max-w-full seguiría conteniendo dentro
              de su hueco a cualquier logo cuya proporción lo desborde.
            */
            className="h-12 w-auto max-w-full object-contain opacity-60 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Una tarjeta de caso: video a la izquierda, atribución/titular/descripción y
 * enlace a la derecha.
 *
 * El titular semántico es el servicio (`subtitulo`) y no el cliente: es el
 * término que alguien podría buscar, y el cliente no. El cliente sigue
 * presente y legible justo encima, como línea de atribución —prueba
 * social—, pero ya no es un encabezado: con el servicio ocupando el h3, un
 * segundo encabezado en la misma tarjeta competiría por la misma jerarquía
 * sin aportar una sección nueva al esquema de la página.
 */
function TarjetaCaso({ caso, activo }: { caso: Caso; activo: boolean }) {
  /*
    h-full: la pista de fuera estira cada wrapper de tarjeta (items-stretch)
    al alto del más alto de la fila, así que sin esto el fondo blanco de las
    tarjetas más cortas se quedaría por debajo del de sus vecinas asomando al
    lado. items-start dentro del grid conserva la proporción del video pese a
    la tarjeta ahora más alta.

    py separado de px (antes p-* único) para poder subir solo el aire
    vertical: arriba y abajo del contenido, a partes iguales, sin tocar el
    margen lateral. El video fija su propia altura por su aspect-ratio, así
    que este padding no lo estira a él —solo agranda el marco blanco que lo
    rodea—, y la subida es moderada (+33/+25/+20% por breakpoint) para que la
    tarjeta no crezca desproporcionada respecto a esa altura.
  */
  return (
    <div className="h-full rounded bg-white px-6 py-8 shadow sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="grid items-start gap-8 md:grid-cols-[45%_1fr]">
        <VideoYoutube
          id={caso.videoYoutube}
          titulo={`Testimonio de ${caso.cliente}`}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
          activo={activo}
        />

        <div>
          <p className="font-head text-sm font-semibold text-ink-soft">
            {caso.cliente}
          </p>
          <h3 className="font-head mt-1 text-2xl font-semibold text-navy">
            {caso.subtitulo}
          </h3>
          {/*
            line-clamp y no un recorte por caracteres: el ancho de la columna
            de texto ya no es un valor fijo de contenedor —cambia con el
            recorte lateral del carrusel y con el padding de la tarjeta por
            breakpoint—, así que un límite en caracteres solo sería exacto
            para un ancho concreto. line-clamp-4 iguala la altura visible de
            las cinco tarjetas sea cual sea ese ancho. El texto íntegro sigue
            en casos.ts y se muestra completo en la página de cada caso.
          */}
          <p className="font-body mt-4 line-clamp-4 text-ink-soft">
            {caso.descripcion}
          </p>
          <Link
            href={`/casos-de-exito/${caso.slug}/`}
            className="font-head mt-6 inline-block text-sm font-semibold text-magenta"
          >
            Ver el caso completo →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CasosExito() {
  /*
    Mismo mecanismo de arrastre, snap y flechas que el carrusel de artículos y
    la pista de pasos de las páginas de servicio (usePistaArrastrable): un
    caso por card, con los adyacentes asomando por los lados.
  */
  const { ref, desplazarUnPaso, propsPista, clasesPista } =
    usePistaArrastrable();

  /*
    Qué caso es «el activo» —el único al que se le permite seguir
    reproduciendo su video— se decide por cuánto de su tarjeta es visible
    dentro de la pista, no por cuál sea el primero en el DOM ni por un cálculo
    aparte de scrollLeft: un IntersectionObserver con `root` en la propia
    pista ya recibe ese dato hecho, y sigue siendo válido tras el arrastre,
    las flechas o un resize, sin duplicar la geometría del carrusel aquí.

    ratiosPorIndice guarda el último ratio conocido de cada tarjeta —el
    observer solo entrega en cada llamada las que cruzaron un umbral, no el
    conjunto completo— para poder recalcular en cada callback cuál es, de
    todas, la más visible ahora mismo. La tarjeta activa real siempre llega a
    ratio 1 (cabe entera en la pista, por diseño del carrusel), así que gana
    siempre a cualquier vecina asomando por el lado, por ancha que sea esa
    porción en pantallas muy anchas.
  */
  const [indiceActivo, setIndiceActivo] = useState(0);
  const ratiosPorIndice = useRef(new Map<number, number>());

  useEffect(() => {
    const pista = ref.current;
    if (!pista) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const indice = Number(
            (entry.target as HTMLElement).dataset.indiceCaso,
          );
          ratiosPorIndice.current.set(indice, entry.intersectionRatio);
        }

        let mejorIndice = 0;
        let mejorRatio = -1;
        ratiosPorIndice.current.forEach((ratio, indice) => {
          if (ratio > mejorRatio) {
            mejorRatio = ratio;
            mejorIndice = indice;
          }
        });
        setIndiceActivo(mejorIndice);
      },
      { root: pista, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const tarjetas = pista.querySelectorAll<HTMLElement>("[data-indice-caso]");
    tarjetas.forEach((tarjeta) => observer.observe(tarjeta));

    return () => observer.disconnect();
  }, [ref]);

  return (
    /*
      overflow-hidden por las hojas: recorta lo que sobresalga por los lados en
      viewports estrechos, así el dibujo no añade scroll horizontal a la página.

      La banda de logos sí es una pista desplazable y sí sangra, pero la recorta
      su propia tarjeta, no esta sección: cuando el arrastre del slider desplaza
      el bloque del caso, este overflow-hidden es además lo que impide que ese
      desplazamiento asome por el borde de la ventana.
    */
    <section className="relative overflow-hidden bg-navy py-[var(--section-y)]">
      {/*
        Va antes que el contenido en el DOM y sin z-index: los dos son elementos
        posicionados, así que el orden de pintado lo decide el orden del árbol y
        las hojas quedan por debajo. El alto crece con el viewport y el anclaje
        es bottom-0, de modo que el cúmulo inferior de la composición cae en la
        franja de padding que queda libre bajo la tarjeta.
      */}
      <HojasBanda className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(11rem,26vw,20rem)] w-full" />

      {/*
        La sección ya no lleva px-6: la pista de tarjetas, más abajo, tiene que
        poder sangrar hasta el borde del viewport. Este bloque y el de la
        píldora/marquesina reproducen ese gutter por su cuenta con el mismo
        truco que articulos.tsx (max-w del contenedor + 3rem, con px-6): con
        box-sizing:border-box el contenido queda en min(1120px, 100%-48px),
        igual que antes.
      */}
      <div className="relative mx-auto max-w-[calc(var(--container)+3rem)] px-6">
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
              onClick={() => desplazarUnPaso(-1)}
              aria-label="Caso anterior"
              /* Mismo tratamiento que los controles del carrusel de artículos:
                 hover #C71268, pulsado #A50E56 y transición de color. */
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white transition-colors hover:bg-[#C71268] active:bg-[#A50E56]"
            >
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => desplazarUnPaso(1)}
              aria-label="Caso siguiente"
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white transition-colors hover:bg-[#C71268] active:bg-[#A50E56]"
            >
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/*
        El eyebrow, el título y las flechas quedan fuera de esta pista, en el
        bloque de arriba con su propio gutter (mx-auto max-w+px-6); esta pista
        en cambio es hija directa de la sección —que ya no lleva px-6— para
        poder sangrar de lado a lado del viewport.

        El recorte lateral —lo que deja asomar a los casos vecinos, cortados
        contra el borde de la pantalla y no contra el contenedor de 1120px—
        es el propio ancho de tarjeta (lg:w-[var(--caso-card)], definida en
        globals.css) más el padding horizontal de la pista
        (lg:px-[calc((100%-var(--caso-card))/2)]): con scroll-snap-align:center,
        ese padding es lo que centra la tarjeta activa dejando el resto
        repartido a partes iguales a los lados. .caso-carrusel es el marco
        estático que además atenúa esas tarjetas vecinas con un fundido hacia
        el navy de la sección (ver globals.css): no compite por lectura con la
        tarjeta activa, pero conserva su silueta como pista de que hay más
        contenido.

        Por debajo de lg no hay recorte: la tarjeta pasa a w-full y solo queda
        el px-6 del gutter general, porque con un caso ya en dos columnas
        (desde md) o en una sola (antes de md) no queda ancho de sobra para
        asomar nada sin dejar la tarjeta activa demasiado angosta.
      */}
      <div className="caso-carrusel mt-10">
        <div
          ref={ref}
          {...propsPista}
          className={`${clasesPista} items-stretch gap-8 px-6 lg:gap-10 lg:px-[calc((100%-var(--caso-card))/2)]`}
        >
          {CASOS.map((caso, indice) => (
            <div
              key={caso.slug}
              data-indice-caso={indice}
              className="w-full shrink-0 snap-center lg:w-[var(--caso-card)]"
            >
              <TarjetaCaso caso={caso} activo={indice === indiceActivo} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[calc(var(--container)+3rem)] px-6">
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

            z-10: mismo caso que la columna sticky de la rueda de servicios
            (servicios-rueda.tsx) —dos elementos posicionados en el mismo
            contexto de apilamiento, y sin z-index gana el que va después en
            el DOM—. Aquí la tarjeta .marquee es position:relative (globals.css,
            para anclar sus veladuras de borde) y va después que esta píldora
            absolute, así que sin z-index la tapaba pese a estar "detrás" en
            la lectura visual del diseño. z-10 la devuelve a su sitio sin
            tocar el orden del DOM.
          */}
          <span className="font-head absolute top-0 left-1/2 z-10 max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal px-4 py-2 text-center text-sm font-semibold text-white">
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
