import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/components/home/home-hero";
import { Intro } from "@/components/home/intro";
import { ServiciosRueda } from "@/components/home/servicios-rueda";
import { CasosExito } from "@/components/home/casos-exito";
import { Articulos } from "@/components/home/articulos";
import { CtaContacto } from "@/components/cta-contacto";
import { AbrirContactoDesdeUrl } from "@/components/abrir-contacto-desde-url";
import { ARTICULOS } from "@/lib/articulos";
import { POSTER_HERO } from "@/lib/video-hero";

const DESCRIPCION =
  "Agencia de sostenibilidad y RSE. Desde 2011 acompañamos a su empresa a anticipar riesgos y convertir la estrategia ESG en resultados medibles.";

export const metadata: Metadata = {
  /*
    Aquí sí va el título completo. El template del layout raíz solo alcanza a
    los segmentos hijos, y app/page.tsx está en el mismo segmento que
    app/layout.tsx: sin el sufijo escrito, la Home salía como «Consultoría en
    sostenibilidad y ESG» a secas.
  */
  title: "ResponSable | Consultoría en sostenibilidad y ESG",
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    title: "ResponSable | Consultoría en sostenibilidad y ESG",
    description: DESCRIPCION,
    url: "/",
    locale: "es_ES",
    images: [{ url: POSTER_HERO, width: 1280, height: 720 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function Home() {
  return (
    <>
      <AbrirContactoDesdeUrl />
      <SiteHeader transparent />
      <main>
        <HomeHero />
        <Intro />
        <ServiciosRueda />
        <CasosExito />
        {/* Los ocho más recientes: ARTICULOS ya viene ordenado descendente. */}
        <Articulos articulos={ARTICULOS.slice(0, 8)} />
        <CtaContacto />
      </main>
      <SiteFooter />
    </>
  );
}
