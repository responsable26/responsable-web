import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  FormularioContacto,
  type CampoConfig,
} from "@/components/formulario-contacto/formulario-contacto";

/**
 * Estructura de las dos páginas de solicitud, /proveedores/ y
 * /trabaja-con-nosotros/: son idénticas salvo el texto y el juego de campos.
 * Vivían copiadas en cada archivo, y esa duplicación es justo la que hace que
 * dos páginas que deben verse iguales acaben separándose al primer retoque que
 * se aplique solo a una. Cada página aporta su contenido; la composición es
 * esta y solo esta.
 *
 * Los metadatos no viven aquí: son de cada ruta.
 */
export function PaginaSolicitud({
  breadcrumb,
  eyebrow,
  titulo,
  intro,
  etiquetaFormulario,
  tituloFormulario,
  campos,
  etiquetaEnvio,
}: {
  /** Último tramo de la ruta de navegación, el de la página actual. */
  breadcrumb: string;
  eyebrow: string;
  titulo: string;
  intro: string;
  /** Encabezado invisible que nombra la región del formulario. */
  etiquetaFormulario: string;
  /** Encabezado visible sobre los campos. */
  tituloFormulario: string;
  campos: readonly CampoConfig[];
  etiquetaEnvio: string;
}) {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/*
          Misma estructura nav/ol/li y la misma variante clara —barra
          bg-off-white con borde inferior, texto ink-soft/navy— que usan
          casos-de-exito/[slug] y recursos/articulos/[slug]. "Inicio" y no
          "Home" como aquellas: es el rótulo que ya usa /servicio/, y estas
          páginas se suman a ese lado del sitio.

          Va por encima de las dos columnas, a ancho completo, y no dentro de
          la izquierda: es la ruta de la página entera.
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
                  {breadcrumb}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <section className="bg-off-white px-6 py-[var(--section-y)] lg:px-10">
          {/*
            Texto y formulario en la misma sección y en dos columnas desde lg,
            no apilados en dos secciones: así el formulario entra en pantalla
            con el texto y no hay que descubrirlo bajando.

            Las columnas no son iguales: 0.85fr y 1fr dan al formulario el lado
            ancho, que es quien lo necesita —dentro lleva una rejilla de dos
            campos por fila—, y dejan al texto un ancho de lectura cómodo sin
            estirarlo.

            items-start las alinea por el borde superior, como se pidió. Con esa
            alineación la columna de texto termina antes que la tarjeta, que es
            bastante más alta; para que la diferencia no se lea como un
            desequilibrio, el párrafo pierde su tope de 62ch —la propia columna
            ya lo acota— y sube un escalón de cuerpo, de 1.05 a 1.15rem. Gana
            unas dos líneas y la jerarquía con el titular queda mejor repartida.

            Por debajo de lg la rejilla es de una columna y el orden del DOM
            —texto y después formulario— es ya el correcto de lectura, así que
            no hace falta reordenar nada.
          */}
          <div className="mx-auto grid max-w-[var(--container)] items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                {eyebrow}
              </p>
              <h1 className="font-head mt-2 text-[clamp(1.8rem,4.6vw,2.8rem)] font-semibold text-navy">
                {titulo}
              </h1>
              <p className="font-body mt-4 text-[1.15rem] text-ink-soft">
                {intro}
              </p>
            </div>

            {/*
              FormularioContacto viene estilado para fondo oscuro (etiquetas en
              blanco, campos en blanco), así que va dentro de una tarjeta navy y
              no suelto sobre el fondo claro. El radio de 22px es el de la
              tarjeta de HeroFramed. El relleno se queda por debajo del que
              tenía a ancho completo: en una columna, un px-12 dejaba los campos
              demasiado estrechos.
            */}
            <section aria-labelledby="formulario-solicitud">
              <h2 id="formulario-solicitud" className="sr-only">
                {etiquetaFormulario}
              </h2>
              <div className="rounded-[22px] bg-navy px-6 py-10 sm:px-10 sm:py-12">
                <div className="mx-auto w-full max-w-[34rem]">
                  <FormularioContacto
                    titulo={tituloFormulario}
                    campos={campos}
                    etiquetaEnvio={etiquetaEnvio}
                  />
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
