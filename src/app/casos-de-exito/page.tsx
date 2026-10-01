import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ListaCasos } from "@/components/casos/lista-casos";
import { CASOS_PUBLICOS } from "@/lib/casos";
import { BASE } from "@/lib/schema-organizacion";
import { DESCRIPCION_CASOS } from "@/lib/meta-descripciones";

/* En meta-descripciones.ts: la usa también /llms.txt. */
const DESCRIPCION = DESCRIPCION_CASOS;

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Casos de Éxito",
  description: DESCRIPCION,
  alternates: { canonical: "/casos-de-exito/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Casos de Éxito | ResponSable",
    description: DESCRIPCION,
    url: "/casos-de-exito/",
    locale: "es_MX",
  },
  twitter: { card: "summary_large_image" },
};

/* CollectionPage con los casos publicados, en el orden de la página. */
const COLECCION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Casos de Éxito",
  description: DESCRIPCION,
  url: `${BASE}/casos-de-exito/`,
  inLanguage: "es-MX",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: CASOS_PUBLICOS.length,
    itemListElement: CASOS_PUBLICOS.map((caso, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE}/casos-de-exito/${caso.slug}/`,
      name: caso.cliente,
    })),
  },
};

export default function CasosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COLECCION_JSON_LD) }}
      />
      <SiteHeader />

      <main id="main" className="flex-1">
        {/*
          La sección crece con su contenido: sin alto de ventana y sin recorte.
          El único desplazamiento es el de la página, así que el visitante
          nunca queda retenido dentro del bloque.

          El navy cubre también su propio relleno, de modo que entre el header
          —navy en reposo— y el pie no queda ninguna franja de otro fondo.

          Sin relleno superior desde lg, y esto es lo que hace que el bloque de
          texto entre ya centrado: a scroll 0 el sticky todavía no engancha, así
          que la caja se queda donde la deja el flujo. Con el padding puesto,
          arrancaba entre 56 y 104px más abajo que su posición pegada y su
          centro caía unos 145px por debajo del centro de la ventana. Con
          pt-0 su posición natural coincide con la pegada y el desfase
          desaparece. El aire de arriba lo repone la columna derecha por su
          cuenta, que es la que lo necesita.
        */}
        <section className="bg-navy px-6 py-[var(--section-y)] lg:pt-0">
          <div className="mx-auto grid max-w-[var(--container)] gap-10 lg:grid-cols-2 lg:gap-16">
            {/*
              El bloque de texto se queda pegado mientras la columna de casos
              pasa por delante, y se despega solo cuando la sección termina:
              es position:sticky, no un scroll atrapado.

              Tres piezas hacen falta para que además quede centrado en la
              ventana, y no en la columna —que mide lo que la lista de casos,
              varias veces el alto visible—:
                - self-start, porque el stretch por defecto de la rejilla le
                  daría esa altura y sticky no tendría recorrido.
                - min-h de 100svh menos el header (5.25rem: py-5 más los 44px
                  del botón hamburguesa, la pieza más alta de la fila), que es
                  exactamente el alto visible.
                - justify-center dentro de esa caja.
              El top repite ese mismo descuento, así que la caja arranca justo
              bajo la barra y su borde inferior cae en el de la ventana.

              min-h y no h: en una ventana muy baja, donde el texto llegara a
              superar el alto disponible, una altura fija lo dejaría desbordando
              su caja; con el mínimo, la caja crece y el texto se ve entero,
              que es lo que importa antes que el centrado. El bloque mide hoy
              entre 264 y 327px según el ancho, así que hace falta bajar de
              unos 410px de ventana para llegar a ese caso.

              Todo desde lg. Apilado no hay nada pegado: el texto va arriba y
              los casos debajo, en flujo normal.
            */}
            <div className="lg:sticky lg:top-[5.25rem] lg:flex lg:min-h-[calc(100svh-5.25rem)] lg:flex-col lg:justify-center lg:self-start">
              <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
                Casos de Éxito
              </p>
              <h1 className="font-head mt-3 text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-white">
                Resultados que se pueden medir
              </h1>
              <p className="font-body mt-5 text-[1.15rem] text-white/80">
                Cada proyecto parte de un reto concreto de negocio. Estos son
                algunos de los que hemos acompañado y lo que cambió al
                terminarlos.
              </p>
            </div>

            {/* Repone su propio aire superior desde lg, ya que la sección
                dejó de tenerlo: quien necesita el pt-0 es la columna de la
                izquierda, no esta. */}
            <div className="lg:pt-[var(--section-y)]">
              <ListaCasos casos={CASOS_PUBLICOS} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
