import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RejillaRecursos } from "@/components/recursos/rejilla-recursos";
import { ARTICULOS, formatFecha, type ArticuloMeta } from "@/lib/articulos";
import { CATEGORIAS, categoriaDe } from "@/lib/categorias-articulos";

const DESCRIPCION =
  "Estudios, perspectivas y artículos de ResponSable: las herramientas que necesita para convertir su estrategia de sostenibilidad en resultados tangibles.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Centro de Recursos",
  description: DESCRIPCION,
  alternates: { canonical: "/recursos/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Centro de Recursos | ResponSable",
    description: DESCRIPCION,
    url: "/recursos/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/**
 * El artículo más reciente, a todo el ancho sobre la rejilla.
 *
 * Siempre automático por fecha: no hay selección manual que mantener, y el
 * destacado cambia solo al publicar. Toda la pieza es un enlace, como las
 * tarjetas de la rejilla.
 */
function Destacado({ articulo }: { articulo: ArticuloMeta }) {
  const categoria = categoriaDe(articulo.slug);
  return (
    <Link
      href={`/recursos/articulos/${articulo.slug}/`}
      className="group grid overflow-hidden rounded border border-border bg-white shadow-sm transition-shadow duration-150 hover:shadow lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      {/* Mismo degradado de respaldo que las tarjetas, por si el artículo más
          reciente llegara sin imagen destacada. */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-navy lg:aspect-auto lg:min-h-[26rem]"
        style={
          articulo.imagen
            ? undefined
            : { backgroundImage: "linear-gradient(135deg, var(--color-navy), #2b3266)" }
        }
      >
        {articulo.imagen ? (
          <Image
            src={articulo.imagen.src}
            alt=""
            fill
            sizes="(min-width: 1328px) 747px, (min-width: 1024px) 58vw, calc(100vw - 3rem)"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
          Lo más reciente · {categoria.nombre}
        </p>
        <time
          dateTime={articulo.fecha}
          className="font-body mt-3 text-sm text-ink-soft"
        >
          {formatFecha(articulo.fecha)}
        </time>
        <h2 className="font-head mt-2 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-balance text-navy">
          {articulo.titulo}
        </h2>
        <p className="font-body mt-4 text-[1.05rem] text-ink-soft">
          {articulo.excerpt}
        </p>
        <span className="font-head mt-6 text-sm font-semibold text-magenta">
          → Leer artículo
        </span>
      </div>
    </Link>
  );
}

export default function RecursosPage() {
  // Se ordena aquí y no se confía en el orden del archivo generado: el
  // destacado tiene que ser el más reciente pase lo que pase con el export.
  const ordenados = [...ARTICULOS].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const [destacado, ...resto] = ordenados;

  /* El destacado no se repite en la rejilla, ni en "Todas" ni al filtrar. */
  const entradas = resto.map((articulo) => ({
    articulo,
    categoria: categoriaDe(articulo.slug).id,
  }));
  const categorias = CATEGORIAS.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    total: entradas.filter((e) => e.categoria === c.id).length,
  }));

  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* Remate magenta como borde inferior del propio hero: así la línea
            acompaña al bloque navy sin necesitar un elemento aparte. */}
        <div className="border-b-4 border-magenta bg-navy px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-white">
              Perspectivas ResponSables
            </h1>
            <p className="font-body mt-5 max-w-[62ch] text-[1.15rem] text-white/80">
              Explore nuestros estudios, perspectivas y demás artículos.
              Encuentre las herramientas que necesita para liderar el cambio y
              transformar su estrategia de sostenibilidad en resultados
              tangibles más rápido.
            </p>
          </div>
        </div>

        <div className="px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            {destacado ? <Destacado articulo={destacado} /> : null}

            <section
              aria-labelledby="todos-los-articulos"
              className="mt-[var(--section-y)]"
            >
              <h2
                id="todos-los-articulos"
                className="font-head mb-6 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy"
              >
                Todos los artículos
              </h2>
              <RejillaRecursos entradas={entradas} categorias={categorias} />
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
