import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/components/home/home-hero";
import { Intro } from "@/components/home/intro";
import { Servicios } from "@/components/home/servicios";
import { ServiciosRueda } from "@/components/home/servicios-rueda";
import { CasosExito } from "@/components/home/casos-exito";
import { Articulos } from "@/components/home/articulos";
import { CtaContacto } from "@/components/cta-contacto";
import { AbrirContactoDesdeUrl } from "@/components/abrir-contacto-desde-url";
import { ARTICULOS } from "@/lib/articulos";

export default function Home() {
  return (
    <>
      <AbrirContactoDesdeUrl />
      <SiteHeader transparent />
      <main>
        <HomeHero />
        <Intro />
        {/* Infografía nueva, a comparar con la sección de pestañas de abajo. */}
        <ServiciosRueda />
        <Servicios />
        <CasosExito />
        {/* Los ocho más recientes: ARTICULOS ya viene ordenado descendente. */}
        <Articulos articulos={ARTICULOS.slice(0, 8)} />
        <CtaContacto />
      </main>
      <SiteFooter />
    </>
  );
}
