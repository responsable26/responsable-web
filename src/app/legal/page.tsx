import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DESCRIPCION =
  "Información legal de ResponSable: términos y condiciones de uso del sitio y aviso de privacidad sobre el tratamiento de sus datos personales.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Legal",
  description: DESCRIPCION,
  /* Esta página es todavía un índice sin contenido: solo anuncia «Contenido
     próximamente» y enlaza los dos documentos, que llevan su propio noindex.
     No hay nada que posicionar. Retirar cuando tenga contenido real, y añadir
     entonces la ruta al sitemap. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/legal/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Legal | ResponSable",
    description: DESCRIPCION,
    url: "/legal/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function LegalPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--container)]">
          <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
            Legal
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
