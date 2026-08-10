import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DESCRIPCION =
  "Aviso de privacidad de ResponSable: qué datos personales recabamos, con qué finalidad los tratamos y cómo puede ejercer sus derechos.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Aviso de Privacidad",
  description: DESCRIPCION,
  alternates: { canonical: "/legal/aviso-privacidad/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Aviso de Privacidad | ResponSable",
    description: DESCRIPCION,
    url: "/legal/aviso-privacidad/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function AvisoPrivacidadPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--container)]">
          <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
            Aviso de privacidad
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
