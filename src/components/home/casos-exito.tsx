"use client";

import { useState } from "react";
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

export function CasosExito() {
  const [index, setIndex] = useState(0);
  const caso = CASOS[index];

  function goTo(delta: number) {
    setIndex((current) => (current + delta + CASOS.length) % CASOS.length);
  }

  return (
    /*
      overflow-hidden por las hojas: recorta lo que sobresalga por los lados en
      viewports estrechos, así el dibujo no añade scroll horizontal a la página.
      Ningún hijo sangra a propósito —el carrusel muestra un caso cada vez, no
      es una pista desplazable—, así que no hay nada más que recortar.
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

        <div className="mt-10 grid items-start gap-8 md:grid-cols-[45%_1fr]">
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
            justify-center y no justify-between: con between, una fila
            incompleta reparte a los extremos y deja un hueco enorme en medio.
            Centrada, un resto de dos o tres logos se lee como bloque.

            pt-10 y no py-6: la mitad inferior de la píldora invade 18px de la
            tarjeta, y con el padding simétrico anterior los logos le quedaban
            pegados. Sin overflow-hidden, para no recortar la píldora.
          */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 rounded bg-white px-8 pt-10 pb-6">
            {LOGOS.map((logo) => (
              <Image
                key={logo.archivo}
                src={`/logos-clientes/${logo.archivo}.webp`}
                alt={logo.nombre}
                width={logo.w}
                height={logo.h}
                /*
                  Seis de los ocho archivos vienen a color y dos en monocromo, así
                  que la banda mezclaba azules, rojos y verdes sin criterio.
                  grayscale los iguala en reposo; al pasar el cursor el logo
                  recupera su color y su opacidad plena.
                */
                className="h-9 w-auto opacity-60 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
