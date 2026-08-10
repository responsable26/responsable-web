import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import { ARTICULOS, type ArticuloMeta } from "@/lib/articulos";

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
 * Una sección por tipo de recurso. Hoy solo hay artículos; añadir estudios o
 * webinars es agregar una entrada más a SECCIONES, sin tocar la maquetación.
 *
 * Las secciones vacías no se renderizan: el filtro de abajo las descarta antes
 * de pintar, así que no quedan bloques huérfanos ni rótulos de «próximamente».
 */
type SeccionRecursos = {
  id: string;
  titulo: string;
  articulos: ArticuloMeta[];
  verTodos?: { href: string; label: string };
};

/** Cuántas piezas se muestran por sección en el hub. */
const POR_SECCION = 9;

function BloqueSeccion({ seccion }: { seccion: SeccionRecursos }) {
  return (
    <section aria-labelledby={seccion.id}>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <h2
          id={seccion.id}
          className="font-head text-[clamp(1.5rem,3.5vw,2.1rem)] font-semibold text-navy"
        >
          {seccion.titulo}
        </h2>
        {seccion.verTodos ? (
          <Link
            href={seccion.verTodos.href}
            className="font-head text-sm font-semibold text-magenta"
          >
            {seccion.verTodos.label} →
          </Link>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {seccion.articulos.map((articulo, i) => (
          <ArticuloCard key={articulo.slug} articulo={articulo} index={i} />
        ))}
      </div>
    </section>
  );
}

export default function RecursosPage() {
  const secciones: SeccionRecursos[] = [
    {
      id: "ultimas-noticias",
      titulo: "Últimas Noticias",
      // ARTICULOS ya viene ordenado de más reciente a más antiguo.
      articulos: ARTICULOS.slice(0, POR_SECCION),
      verTodos: {
        href: "/recursos/articulos/",
        label: "Ver todos los artículos",
      },
    },
  ];

  const visibles = secciones.filter((s) => s.articulos.length > 0);

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
          <div className="mx-auto flex max-w-[var(--container)] flex-col gap-[var(--section-y)]">
            {visibles.map((seccion) => (
              <BloqueSeccion key={seccion.id} seccion={seccion} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
