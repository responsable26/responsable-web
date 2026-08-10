import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaContacto } from "@/components/cta-contacto";

const DESCRIPCION =
  "Desde 2011 hemos acompañado a más de 150 empresas en México e Iberoamérica a construir estrategias de RSE que protegen su reputación y generan valor real.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Conócenos",
  description: DESCRIPCION,
  alternates: { canonical: "/nosotros/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Conócenos | ResponSable",
    description: DESCRIPCION,
    url: "/nosotros/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/** Cifras de la banda. El valor va suelto del texto para poder darle su escala. */
const CIFRAS = [
  { valor: "+150", etiqueta: "Compañías Asesoradas" },
  { valor: "+8k", etiqueta: "Lectores Mensuales" },
  { valor: "1,500", etiqueta: "Proyectos Gestionados" },
  { valor: "+15", etiqueta: "Años Trabajando" },
];

export default function NosotrosPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="bg-off-white px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
              Conócenos
            </p>
            <h1 className="font-head mt-3 max-w-[18ch] text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-balance text-navy">
              Una Historia ResponSable
            </h1>

            {/*
              El primer párrafo va como entradilla, a mayor cuerpo, y los tres
              restantes en dos columnas desde lg. El original era un bloque
              corrido de cuatro párrafos a ancho completo, difícil de entrar.
            */}
            <p className="font-body mt-8 max-w-[62ch] text-[1.2rem] text-ink-soft">
              En ResponSable creemos que la Responsabilidad Social no es
              filantropía, es estrategia de negocio. Con esa convicción fundamos
              la empresa en 2011, y con ella hemos acompañado a más de 150
              empresas en México e Iberoamérica a construir estrategias de RSE
              que protegen su reputación, fortalecen sus relaciones con grupos
              de interés y generan valor real.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <p className="font-body text-ink-soft">
                No vendemos buenas intenciones. Diseñamos soluciones a la medida
                de cada organización: a partir de un diagnóstico profundo de
                RSE, un estudio de materialidad y los objetivos concretos del
                negocio. Acompañamos a las empresas en todas sus etapas de
                madurez, porque sabemos que cada punto de partida es diferente.
              </p>
              <div className="flex flex-col gap-8">
                <p className="font-body text-ink-soft">
                  Creemos que la RSE bien ejecutada se convierte en inversión,
                  no en gasto. Y que esa inversión solo rinde frutos cuando se
                  comunica de forma estratégica, construyendo reputación
                  corporativa de manera consistente, más allá de un informe de
                  sustentabilidad.
                </p>
                <p className="font-body text-ink-soft">
                  Somos parte de ProActive Strategies, S.C. y hoy somos la
                  consultora de referencia en RSE y Desarrollo Sostenible para
                  empresas que quieren crecer con propósito.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="cifras"
          className="px-6 py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)]">
            <h2 id="cifras" className="sr-only">
              ResponSable en cifras
            </h2>
            {/*
              Sin tarjetas ni bordes: la cifra y su etiqueta se sostienen solas,
              separadas por una divisoria fina entre columnas.
            */}
            <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {CIFRAS.map((cifra) => (
                <div
                  key={cifra.etiqueta}
                  className="border-border px-2 not-first:sm:border-l lg:px-6"
                >
                  <p className="font-head text-[clamp(2.6rem,7vw,3.8rem)] leading-none font-semibold text-magenta">
                    {cifra.valor}
                  </p>
                  <p className="font-body mt-3 text-sm text-ink-soft">
                    {cifra.etiqueta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
          Misión y visión enfrentadas con la marca en medio. El original las
          colocaba en diagonal —misión arriba a la izquierda, visión abajo a la
          derecha—, lo que dejaba dos huecos vacíos. Aquí comparten fila y el
          isotipo ocupa la columna central, así que la marca separa las dos
          declaraciones en vez de flotar entre huecos.
        */}
        <section className="bg-navy px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            {/*
              «Misión» y «Visión» son los encabezados reales de sus bloques, así
              que van como h2 visibles. Antes eran eyebrows con un h2 en sr-only
              por encima, lo que duplicaba el encabezado en el árbol de
              accesibilidad: se leía «Misión y visión» y acto seguido «Misión».
            */}
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
              {/*
                El texto va alineado a la izquierda en los dos bloques: en el de
                Misión, alinearlo a la derecha obligaba a buscar el inicio de
                cada renglón. La convergencia hacia el isotipo se resuelve con la
                posición del bloque —ml-auto lo empuja hacia el centro— y no con
                la alineación de sus líneas.
              */}
              <div className="lg:ml-auto lg:max-w-[34ch]">
                <h2 className="font-head text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-white">
                  Misión
                </h2>
                <p className="font-body mt-4 text-[1.2rem] text-white/85">
                  Estamos comprometidos en co-crear con las empresas soluciones
                  estratégicas y personalizadas de Responsabilidad Social, más
                  allá de la filantropía, y alineadas a las expectativas ESG de
                  sus Grupos de Interés.
                </p>
              </div>

              <div className="flex justify-center">
                <Image
                  src="/brand/isotipo.png"
                  alt=""
                  width={500}
                  height={500}
                  sizes="(min-width: 1024px) 128px, 96px"
                  className="size-24 lg:size-32"
                />
              </div>

              <div className="lg:mr-auto lg:max-w-[34ch]">
                <h2 className="font-head text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-white">
                  Visión
                </h2>
                <p className="font-body mt-4 text-[1.2rem] text-white/85">
                  Ser reconocidos en Iberoamérica como la agencia de
                  Responsabilidad Social siempre a la vanguardia.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaContacto />
      </main>

      <SiteFooter />
    </>
  );
}
