"use client";

import { ChevronIcon } from "@/components/icons";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import { usePistaArrastrable } from "@/components/use-pista-arrastrable";
import type { ArticuloMeta } from "@/lib/articulos";

export function Articulos({ articulos }: { articulos: ArticuloMeta[] }) {
  /* El arrastre, el snap y la barra oculta salen del hook compartido con
     los pasos del proceso de las páginas de servicio. Aquí solo queda la
     geometría propia de este carrusel: la sangría hasta el borde del
     viewport y el ancho de tarjeta. */
  const { ref, desplazarUnPaso, propsPista, clasesPista } =
    usePistaArrastrable();

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
              onClick={() => desplazarUnPaso(-1)}
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
              onClick={() => desplazarUnPaso(1)}
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
        ref={ref}
        {...propsPista}
        className={`${clasesPista} -mt-4 -mb-10 gap-6 px-[max(1.5rem,calc((100%-var(--container))/2))] py-10 scroll-pl-[max(1.5rem,calc((100%-var(--container))/2))]`}
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
