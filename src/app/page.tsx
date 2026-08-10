import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/components/home/home-hero";
import { Intro } from "@/components/home/intro";
import { Servicios } from "@/components/home/servicios";
import { CasosExito } from "@/components/home/casos-exito";
import { Articulos } from "@/components/home/articulos";
import { CtaImagen } from "@/components/home/cta-imagen";
import { Newsletter } from "@/components/home/newsletter";
import { ARTICULOS } from "@/lib/articulos";

export default function Home() {
  return (
    <>
      <SiteHeader transparent />
      <main>
        <HomeHero />
        <Intro />
        <Servicios />
        <CasosExito />
        {/* Los ocho más recientes: ARTICULOS ya viene ordenado descendente. */}
        <Articulos articulos={ARTICULOS.slice(0, 8)} />
        <CtaImagen />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
