import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DESCRIPCION =
  "Términos y condiciones de uso del sitio de ResponSable: alcance de la información publicada y condiciones bajo las que se ofrece.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Términos y Condiciones",
  description: DESCRIPCION,
  alternates: { canonical: "/legal/terminos-y-condiciones/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Términos y Condiciones | ResponSable",
    description: DESCRIPCION,
    url: "/legal/terminos-y-condiciones/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function TerminosYCondicionesPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--container)]">
          <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
            Términos y condiciones
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
