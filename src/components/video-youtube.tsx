"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@/components/icons";

/**
 * Reproductor de YouTube con carga diferida («facade»).
 *
 * De entrada solo se pinta la miniatura y un botón: el iframe no existe en el
 * DOM hasta que se pulsa. Cinco de estos en la Home cargarían si no medio mega
 * de reproductor cada uno y abrirían conexión con Google antes de que nadie
 * haya pedido ver nada; así el rastreo de terceros solo ocurre si el usuario
 * decide reproducir.
 *
 * El embed usa youtube-nocookie.com, el dominio sin cookies de seguimiento.
 */

/** 1280×720. No existe para todos los videos: YouTube devuelve 404 y el
 *  onError de la miniatura cae al de respaldo. */
const maxres = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/** 480×360, siempre presente. Viene en 4:3 con bandas negras arriba y abajo;
 *  el object-cover del contenedor 16:9 las recorta y deja justo el fotograma. */
const respaldo = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

type VideoYoutubeProps = {
  /** ID del video en YouTube. */
  id: string;
  /**
   * Nombre del video. Sirve para el title del iframe y para el nombre
   * accesible del botón, así que debe identificar de qué video se trata:
   * varios de estos conviven en la misma página.
   */
  titulo: string;
  /** Ancho al que se muestra, para que el optimizador no sirva de más. */
  sizes: string;
  className?: string;
  /** Prioridad de carga de la miniatura. Solo para la que se ve de inicio. */
  prioridad?: boolean;
};

export function VideoYoutube({
  id,
  titulo,
  sizes,
  className,
  prioridad,
}: VideoYoutubeProps) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const [miniatura, setMiniatura] = useState(() => maxres(id));

  return (
    /*
      aspect-video en el contenedor y no en la miniatura: la caja reserva su
      alto antes de que llegue ninguna imagen, así que no hay salto de layout
      ni al cargar la miniatura ni al sustituirla por el iframe. El navy de
      fondo es el mismo degradado de respaldo que ya usaban las tarjetas, y se
      ve mientras la miniatura está en vuelo.
    */
    <div
      className={`relative aspect-video overflow-hidden rounded bg-[#1b2150] ${className ?? ""}`}
    >
      {reproduciendo ? (
        <iframe
          /* autoplay porque el iframe solo se monta tras un gesto explícito
             del usuario: sin él habría que pulsar dos veces para ver algo. */
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        /*
          Un <button> real y no un div con onClick: así entra en el orden de
          tabulación, responde a Enter y Espacio y se anuncia como botón. El
          anillo de foco es el global de :focus-visible.
        */
        <button
          type="button"
          onClick={() => setReproduciendo(true)}
          aria-label={`Reproducir: ${titulo}`}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          <Image
            src={miniatura}
            /* Decorativa: el botón que la contiene ya aporta el nombre. */
            alt=""
            fill
            sizes={sizes}
            priority={prioridad}
            onError={() =>
              setMiniatura((actual) =>
                actual === maxres(id) ? respaldo(id) : actual,
              )
            }
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {/* Velo: sube el contraste del disco sobre miniaturas claras. */}
          <span className="absolute inset-0 bg-navy/25 transition-colors group-hover:bg-navy/10" />
          <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-magenta text-white shadow-lg transition-colors group-hover:bg-[#C71268]">
            {/* Desplazado a la derecha: el centro óptico de un triángulo no
                coincide con su centro geométrico. */}
            <PlayIcon className="ml-1 size-7" />
          </span>
        </button>
      )}
    </div>
  );
}
