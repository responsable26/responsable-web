import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CasoCard } from "@/components/casos/caso-card";
import { CASOS_PUBLICOS } from "@/lib/casos";

const DESCRIPCION =
  "Casos de éxito de ResponSable: cómo acompañamos a empresas de distintos sectores a convertir su estrategia de sostenibilidad en resultados de negocio.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Casos de Éxito",
  description: DESCRIPCION,
  alternates: { canonical: "/casos-de-exito/" },
  /*
    NOINDEX PROVISIONAL: el índice muestra los resúmenes de los casos, que hoy
    son marcador de posición sin validar. Retirar junto con el de las páginas de
    caso cuando el cliente apruebe el contenido, y añadir ambas al sitemap.
  */
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Casos de Éxito | ResponSable",
    description: DESCRIPCION,
    url: "/casos-de-exito/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function CasosPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <div className="border-b-4 border-magenta bg-navy px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              Casos de Éxito
            </p>
            <h1 className="font-head mt-3 text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-white">
              Resultados que se pueden medir
            </h1>
            <p className="font-body mt-5 max-w-[62ch] text-[1.15rem] text-white/80">
              Cada proyecto parte de un reto concreto de negocio. Estos son
              algunos de los que hemos acompañado y lo que cambió al terminarlos.
            </p>
          </div>
        </div>

        <div className="px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CASOS_PUBLICOS.map((caso, i) => (
                <CasoCard key={caso.slug} caso={caso} index={i} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
