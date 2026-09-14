"use client";

import { useState } from "react";
import { VideoYoutube } from "@/components/video-youtube";
import type { Testimonio } from "@/lib/testimonios";

/** Quita un marcador entre corchetes al principio: mientras el contenido sea de
 *  muestra, la inicial saldría "[" en todas las tarjetas y no habría maqueta
 *  que evaluar. Con contenido real la expresión no encuentra nada. */
function sinMarcador(texto: string): string {
  return texto.replace(/^\[[^\]]*\]\s*/, "").trim();
}

/**
 * Las tarjetas de testimonios, en masonry.
 *
 * Es cliente y no servidor por una sola razón: solo un video puede sonar a la
 * vez. El estado de cuál se reproduce vive aquí, por encima de las tarjetas,
 * con el mismo mecanismo que ListaCasos en el índice de casos: `activo` en
 * false repliega el iframe de los demás y devuelve su miniatura. La sección que
 * lo monta sigue siendo de servidor.
 *
 * Una tarjeta con video no es otro tipo de tarjeta: es la misma con el video
 * encima de la cita, dentro del padding, y sin ninguna marca adicional. La
 * miniatura con su botón de reproducir ya dice que ahí hay un video.
 */
export function RejillaTestimonios({
  testimonios,
}: {
  testimonios: readonly Testimonio[];
}) {
  const [enReproduccion, setEnReproduccion] = useState<number | null>(null);

  return (
    /*
      Masonry con multicolumna y no con rejilla: las citas van de nueve a casi
      setenta palabras, y una rejilla obligaría a igualar alturas —o a recortar
      el texto, que aquí no es una opción—. El navegador equilibra las columnas
      solo, así que no quedan huecos, y no hace falta medir nada en JavaScript
      ni recalcular al redimensionar. Un video suma a su tarjeta la altura de
      unas seis líneas de cita, un desnivel más del mismo tipo; y como
      VideoYoutube reserva su caja 16:9 antes de cargar, reproducirlo no cambia
      la altura ni reequilibra las columnas.

      El coste conocido es que el flujo va por columnas y no por filas: quien
      recorra la fila superior de izquierda a derecha lee el primero, el
      tercero y el quinto. Se acepta porque los testimonios son piezas
      independientes y no hay una secuencia que romper; el orden del DOM se
      conserva intacto, así que lectores de pantalla y teclado los recorren en
      el orden escrito.

      break-inside-avoid impide que una tarjeta se parta entre dos columnas,
      que es el único fallo visual real de esta técnica. El mb-6 de cada
      tarjeta hace de separación vertical: gap-6 solo resuelve el eje
      horizontal en multicolumna.
    */
    <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
      {testimonios.map((testimonio, index) => {
        /* Sin persona, la empresa pasa a ser la atribución principal y no hay
           segunda línea. El cargo solo se muestra acompañando a un nombre. */
        const principal = testimonio.nombre ?? testimonio.empresa;
        const secundaria = testimonio.nombre
          ? [testimonio.cargo, testimonio.empresa].filter(Boolean).join(", ")
          : "";

        return (
          /* Clave por posición: la lista es estática, y ni el nombre —que puede
             faltar— ni la empresa —que puede repetirse— sirven de clave. */
          <figure
            key={index}
            className="mb-6 break-inside-avoid rounded border border-border bg-white p-6 shadow-sm"
          >
            {testimonio.videoYoutube ? (
              <VideoYoutube
                id={testimonio.videoYoutube}
                titulo={`Testimonio de ${testimonio.nombre ? `${testimonio.nombre}, ${testimonio.empresa}` : testimonio.empresa}`}
                /* Ancho de la tarjeta menos su padding y borde: tres columnas
                   desde lg (con el contenedor a tope desde 1280px), dos desde
                   sm y una por debajo. */
                sizes="(min-width: 1280px) 340px, (min-width: 1024px) calc((100vw - 7rem) / 3 - 3.125rem), (min-width: 640px) calc((100vw - 5.5rem) / 2 - 3.125rem), calc(100vw - 5.125rem)"
                className="mb-5"
                activo={enReproduccion === index}
                onReproducir={() => setEnReproduccion(index)}
              />
            ) : null}

            <blockquote className="font-body text-[1.05rem] text-ink">
              «{testimonio.cita}»
            </blockquote>

            <figcaption className="mt-5 flex items-center gap-3">
              {/* Inicial y no retrato: no hay fotos de los citados, y un avatar
                  genérico diría menos que la letra. Sale de la misma línea que
                  la atribución principal —el nombre o, sin persona, la
                  empresa—, así que nunca queda vacía. aria-hidden porque el
                  texto completo va justo al lado. */}
              <span
                aria-hidden="true"
                className="font-head flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
              >
                {sinMarcador(principal).slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="font-head block text-sm font-semibold text-navy">
                  {principal}
                </span>
                {secundaria ? (
                  <span className="font-body block text-sm text-ink-soft">
                    {secundaria}
                  </span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
