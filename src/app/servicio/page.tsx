import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiciosCuadrantes } from "@/components/servicio/servicios-cuadrantes";
import { RuedaCuadrantes } from "@/components/servicio/rueda-cuadrantes";
import { Articulos } from "@/components/home/articulos";
import { ARTICULOS } from "@/lib/articulos";

const DESCRIPCION =
  "Diagnóstico, estrategia, implementación y comunicación en sostenibilidad. Los servicios con los que acompañamos a su empresa en cada etapa.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Servicios",
  description: DESCRIPCION,
  alternates: { canonical: "/servicio/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Servicios | ResponSable",
    description: DESCRIPCION,
    url: "/servicio/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function ServicioPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/*
          Misma estructura nav/ol/li que usan las páginas de servicio
          individuales (servicio/[slug]/page.tsx), pero con la variante clara
          —barra bg-off-white con borde inferior, texto ink-soft/navy— que ya
          usan casos-de-exito/[slug] y recursos/articulos/[slug]: aquellas
          llevan el breadcrumb en blanco/70 dentro de su hero oscuro con
          video, y este índice no tiene ese hero, así que ese tratamiento de
          color quedaría invisible sobre fondo claro.
        */}
        <div className="border-b border-border bg-off-white">
          <nav
            aria-label="Ruta de navegación"
            className="mx-auto max-w-[var(--container)] px-6 py-3"
          >
            <ol className="font-body flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-navy">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-navy">
                  Servicios
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/*
          Encabezado de "Nuestros Servicios": mismo texto que pintaba
          ServiciosRueda, pero alineado a la izquierda (no centrado, como en
          el Home) y reescrito aquí porque esta página ya no monta ese
          componente —la rueda interactiva se sustituye por
          ServiciosCuadrantes, cuatro secciones desplegadas, una por
          cuadrante—. py-[var(--section-y)] completo arriba y abajo: el
          padding superior reducido de ServiciosRueda existía para que la
          sección de después de Intro, en el Home, no se sintiera con doble
          separación; aquí la sección anterior es la barra de breadcrumbs, así
          que ese recorte dejaba el título pegado a ella. Con el espaciado
          normal de sección queda igual de separado que cualquier otro par de
          secciones del sitio.
        */}
        <section
          id="servicios"
          className="scroll-mt-28 bg-off-white px-6 py-[var(--section-y)] lg:px-10"
        >
          {/*
            El flanco derecho lo ocupa la rueda completa, que antes quedaba
            vacío. Rejilla de dos columnas desde md, con el texto pegado a la
            izquierda y la rueda en su propia columna dimensionada al contenido
            (auto), no a una fracción: así la rueda manda su tamaño y el texto
            se queda con el resto.
          */}
          <div className="mx-auto grid max-w-[var(--container)] items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div>
              <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                Servicios
              </p>
              <h2 className="font-head mt-2 text-[clamp(1.6rem,4.3vw,2.6rem)] font-semibold text-navy">
                Nuestros Servicios
              </h2>
              <p className="font-body mt-4 max-w-[62ch] text-[1.05rem] text-ink-soft">
                Cuatro preguntas ordenan cualquier estrategia de sostenibilidad.
                Cada una abre un grupo de servicios diseñados para responderla
                con evidencia.
              </p>
            </div>

            {/*
              La rueda entera, con los cuatro segmentos a color pleno: en el
              encabezado todavía no hay cuadrante elegido, así que no hay
              ninguno que atenuar. Gráfico y nada más —aria-hidden, sin
              animación y sin interacción—, a diferencia de la rueda del Home.

              size-64/lg:size-80 frente al size-28 de las ruedas que encabezan
              cada sección: más del doble, para que se lea como la pieza
              principal del encabezado y ninguna de las pequeñas se confunda
              con ella.

              El anillo gira despacio, una vuelta por minuto, y el isotipo del
              centro se queda fijo. Es la única rueda animada del sitio junto a
              la del Home: las cuatro de posición de más abajo se quedan
              estáticas a propósito, porque girando todas a la vez mientras se
              baja por la página serían un estorbo. Sigue sin interacción y
              aria-hidden: gira, pero no responde a nada.

              hidden md:block, y no apilada bajo el texto en móvil: es
              decorativa y redundante allí. A ancho completo tendría que medir
              casi la pantalla para no verse ridícula, y ese bloque se metería
              justo entre el párrafo de entrada y la pastilla de pestañas,
              empujando hacia abajo la navegación y el primer cuadrante —que ya
              trae su propia rueda a la vista— sin aportar nada que el texto no
              diga. En pantallas anchas no cuesta nada porque ocupa una columna
              que si no quedaría vacía.
            */}
            <RuedaCuadrantes
              girando
              className="hidden size-64 md:block lg:size-80"
            />
          </div>
        </section>

        {/*
          Cuatro secciones ancladas, una por cuadrante, en el orden del ciclo
          (CUADRANTES ya viene en ese orden: ¿Dónde Estoy? → ¿Adónde Voy? →
          ¿Cómo lo Hago? → ¿Cómo Comunico?). Todo visible sin interacción,
          salvo el modal de cada servicio, que se conserva igual que en el
          panel de la rueda.
        */}
        <ServiciosCuadrantes />

        {/*
          Mismo componente que el Home y sin ninguna variante: su copia
          ("Últimos Artículos", el párrafo de eyebrow) ya es genérica y no
          asume que vive en la Home, así que se reutiliza tal cual. Los ocho
          más recientes, igual que en la Home.
        */}
        <Articulos articulos={ARTICULOS.slice(0, 8)} />
      </main>

      <SiteFooter />
    </>
  );
}
