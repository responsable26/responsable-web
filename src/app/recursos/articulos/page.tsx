import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import { ARTICULOS } from "@/lib/articulos";

const DESCRIPTION =
  "Artículos de ResponSable sobre sostenibilidad, doble materialidad, RSE y reporte ASG, con la experiencia de más de una década acompañando a empresas.";

export const metadata: Metadata = {
  title: "Artículos",
  description: DESCRIPTION,
  alternates: { canonical: "/recursos/articulos/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    title: "Artículos | ResponSable",
    description: DESCRIPTION,
    url: "/recursos/articulos/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function ArticulosPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--container)]">
          <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
            Artículos
          </h1>
          <p className="font-body mt-3 max-w-[60ch] text-[1.15rem] text-ink-soft">
            Ideas que transforman el impacto en acción. Explore nuestros
            artículos sobre Sostenibilidad y Responsabilidad Social Empresarial.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICULOS.map((articulo, i) => (
              <ArticuloCard key={articulo.slug} articulo={articulo} index={i} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
