import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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

      <main id="main" className="flex-1 px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--container)]">
          <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
            Servicio
          </h1>
          <p className="font-body mt-4 text-ink-soft">
            Contenido próximamente.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
