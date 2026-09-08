"use client";

import { useState } from "react";
import Link from "next/link";
import { VideoYoutube } from "@/components/video-youtube";
import type { Caso } from "@/lib/casos";

/**
 * La columna de casos del índice: video, sector, cliente y enlace a la ficha.
 *
 * Es cliente y no servidor por una sola razón: solo un video puede sonar a la
 * vez. Como varios están a la vista en la misma columna, el estado de cuál se
 * reproduce tiene que vivir por encima de ellos —el mismo mecanismo que usa el
 * carrusel de la Home, allí gobernado por la tarjeta activa y aquí por el
 * último clic—. La página que lo monta sigue siendo de servidor y conserva sus
 * metadatos.
 *
 * `activo` en false repliega el iframe y devuelve la miniatura, así que al
 * arrancar uno los demás dejan de consumir recursos en vez de quedarse
 * pausados de fondo.
 *
 * No tiene desplazamiento propio en ningún tamaño: los casos fluyen con el
 * scroll de la página y la columna crece con su contenido. Lo que se queda
 * quieto mientras esta columna pasa es el bloque de texto de la izquierda,
 * con position:sticky —que se despega solo al terminar la sección—, y no un
 * scroll anidado, que retendría al visitante dentro del bloque.
 */
export function ListaCasos({ casos }: { casos: Caso[] }) {
  const [enReproduccion, setEnReproduccion] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-24">
      {casos.map((caso) => (
        <article key={caso.slug}>
          <VideoYoutube
            id={caso.videoYoutube}
            titulo={`Testimonio de ${caso.cliente}`}
            /* A partir de lg la columna es la mitad del contenedor menos el
               gap. Por debajo ocupa el ancho del viewport menos su gutter. */
            sizes="(min-width: 1024px) 528px, calc(100vw - 3rem)"
            activo={enReproduccion === caso.slug}
            onReproducir={() => setEnReproduccion(caso.slug)}
          />

          {/* Sobre navy el magenta se queda en 3.22:1, suficiente para un
              rótulo en versalitas pero no para texto corrido; el teal llega a
              5.27:1 y es además el color de eyebrow que el sitio ya usa sobre
              este fondo. */}
          <p className="font-head mt-5 text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
            {caso.sector}
          </p>
          <h2 className="font-head mt-2 text-[clamp(1.4rem,3vw,1.75rem)] font-semibold text-white">
            {caso.cliente}
          </h2>

          {/* Botón y no enlace de texto: es la acción de la pieza, al mismo
              nivel que el reproductor que tiene encima. */}
          <Link
            href={`/casos-de-exito/${caso.slug}/`}
            className="font-head mt-4 inline-block rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C71268] focus-visible:outline-white"
          >
            Ver más
          </Link>
        </article>
      ))}
    </div>
  );
}
