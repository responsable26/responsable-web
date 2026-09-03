import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaContacto } from "@/components/cta-contacto";
import { RuedaCuadrantes } from "@/components/servicio/rueda-cuadrantes";
import { POSTER_HERO, VIDEO_HERO } from "@/lib/video-hero";

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
  { valor: "+200", etiqueta: "Compañías Asesoradas" },
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
            {/*
              El flanco derecho del encabezado lo ocupa la rueda, que antes
              quedaba vacío. Dos columnas desde md, con la rueda en una columna
              dimensionada al contenido (auto) y no a una fracción: manda ella
              su tamaño y el texto se queda con el resto. items-center las
              equilibra en vertical.
            */}
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
              <div>
                <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                  Conócenos
                </p>
                <h1 className="font-head mt-3 max-w-[18ch] text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-balance text-navy">
                  Una Historia ResponSable
                </h1>

                {/*
              El primer párrafo va como entradilla, a mayor cuerpo, y los ocho
              restantes en dos columnas desde lg, cuatro por columna. El
              original era un bloque corrido a ancho completo, difícil de
              entrar.
            */}
                <p className="font-body mt-8 max-w-[62ch] text-[1.2rem] text-ink-soft">
                  En ResponSable acompañamos a empresas que quieren dejar atrás
                  una sostenibilidad dispersa, reactiva o difícil de justificar.
                  Les ayudamos a entender mejor su contexto, priorizar con
                  rigor, fortalecer relaciones con sus grupos de interés y
                  traducir la sostenibilidad en decisiones que protegen la
                  operación, generan valor y construyen resiliencia.
                </p>
              </div>

              {/*
                La rueda entera con sus cuatro etiquetas: los cuatro segmentos a
                color pleno —aquí no hay cuadrante elegido que destacar— más el
                isotipo del centro. Gráfico y nada más: aria-hidden, sin
                animación y sin interacción, a diferencia de la del Home, que al
                pulsarla abre el panel de servicios. En esta página no hay panel
                que abrir.

                24rem (384px) frente a los 420px del Home: menor, como se pidió,
                y a la vez suficiente para que las etiquetas se lean. El cuerpo
                del texto va en unidades del viewBox de 400, así que el tamaño
                real es 14.5 × (ancho/400): 13.9px aquí y 12.8px en el escalón
                de md. Bajar mucho más de ahí dejaría las preguntas ilegibles,
                que es lo que decide el suelo de este tamaño.

                hidden md:block, y no apilada bajo el texto en móvil: es
                decorativa y va aria-hidden, así que no aporta nada que el texto
                no diga, y allí el encabezado ya lo sigue el banner de video. Dos
                piezas gráficas grandes seguidas, antes de la primera línea de la
                historia, empujarían el contenido real fuera de pantalla. A eso
                se suma que las etiquetas curvas son justo lo que peor se lee a
                ese tamaño. En pantallas anchas no cuesta nada: ocupa una columna
                que si no quedaría vacía.
              */}
              <RuedaCuadrantes
                etiquetas
                className="hidden w-full max-w-[22rem] md:block lg:max-w-[24rem]"
              />
            </div>

            {/*
              Banner de la historia, a ancho completo del contenedor de
              contenido: al vivir dentro del max-w-[var(--container)] de la
              sección, sus bordes caen sobre la misma retícula que el título y
              los párrafos.

              El contenedor fija la caja —proporción, esquinas redondeadas y
              recorte— y el video la rellena en absoluto con object-cover, así
              que la proporción no depende de la del archivo.

              Dos proporciones. En pantallas anchas, 21/9 (~480px de alto sobre
              el contenedor de 1120px): apaisada pero con cuerpo, para que se
              lea como banner y no como una franja. Por debajo de md se abre a
              16/10 —la misma de las tarjetas de artículo y de caso— porque a
              ~330px de ancho el 21/9 dejaría una tira de 140px, y el objetivo
              en móvil no es recortar altura sino no dispararla: 16/10 da unos
              205px, un bloque proporcionado que no empuja el texto fuera de
              pantalla.

              Es el mismo metraje que los heroes, tomado de VIDEO_HERO para no
              repetir la ruta, y con su mismo póster para que no quede un hueco
              vacío mientras carga.

              Sin `controls`: no hay barra, ni botón de play, ni ninguna
              interfaz encima. Es un elemento visual, no un reproductor, de ahí
              también aria-hidden y tabIndex -1 —mismo tratamiento que el video
              de HeroFramed—: no aporta información y no debe recibir el foco.
            */}
            <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded bg-navy md:aspect-[21/9]">
              <video
                className="absolute inset-0 size-full object-cover"
                src={VIDEO_HERO}
                poster={POSTER_HERO}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>

            {/*
              Reparto 4 y 4: en una rejilla de dos columnas la lectura baja por
              la izquierda y sigue por la derecha, así que el orden del cliente
              se conserva. El corte va por la mitad del conteo y no del alto
              —los párrafos 3 y 4 son los más largos y caen en la primera
              columna—, con lo que las dos quedan de alto parecido sin alterar
              la secuencia.
            */}
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col gap-8">
                <p className="font-body text-ink-soft">
                  ResponSable nació de una convicción: la sostenibilidad solo
                  genera valor cuando deja de ser un esfuerzo aislado y empieza
                  a formar parte de las decisiones reales del negocio.
                </p>
                <p className="font-body text-ink-soft">
                  Durante años, muchas empresas entendieron la responsabilidad
                  social empresarial como un conjunto de acciones valiosas, pero
                  dispersas. Programas comunitarios, voluntariado, donativos,
                  reportes o iniciativas ambientales que demostraban compromiso,
                  pero que no siempre estaban conectados con prioridades
                  estratégicas, riesgos, grupos de interés o resultados
                  medibles.
                </p>
                <p className="font-body text-ink-soft">
                  Con el tiempo, el entorno se volvió más exigente. Las empresas
                  empezaron a enfrentar mayores exigencias de clientes,
                  inversionistas, cadenas de suministro, comunidades,
                  autoridades y equipos internos. Ya no bastaba con hacer cosas
                  buenas. Había que demostrar por qué importaban, qué valor
                  generaban y cómo contribuían a proteger la operación,
                  fortalecer relaciones y construir resiliencia.
                </p>
                <p className="font-body text-ink-soft">
                  Desde 2011, cuando muchas empresas aún trataban la RSE como un
                  conjunto de programas aislados, ResponSable ha construido una
                  forma distinta de acompañarlas. Una forma que combina
                  estrategia, escucha, análisis, gestión social y comunicación
                  clara. No para hacer más sostenibilidad, sino para hacer la
                  sostenibilidad correcta: la que ayuda a priorizar, anticipar
                  riesgos, cuidar la licencia social para operar y enfocar
                  recursos donde realmente pueden generar valor.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <p className="font-body text-ink-soft">
                  Desde entonces, hemos acompañado a más de 200 empresas en
                  México y Latinoamérica, en distintos niveles de madurez y
                  sectores. Algunas apenas empiezan a ordenar su sostenibilidad.
                  Otras buscan elevar la sofisticación de su estrategia,
                  responder a mayores exigencias o demostrar con más claridad el
                  valor de lo que ya hacen.
                </p>
                <p className="font-body text-ink-soft">
                  Nuestro papel no es sustituir a quienes lideran la
                  sostenibilidad dentro de la empresa. Es darles estructura,
                  evidencia y criterio para tomar mejores decisiones, defender
                  prioridades ante la alta dirección, involucrar a otras áreas y
                  avanzar con mayor solidez.
                </p>
                <p className="font-body text-ink-soft">
                  Creemos que la sostenibilidad bien gestionada deja de ser
                  gasto y se convierte en inversión: una inversión que protege
                  la operación, fortalece relaciones, construye reputación y
                  genera valor real para el negocio. Y creemos también que lo
                  que se hace con rigor debe comunicarse con claridad, para
                  construir confianza y credibilidad ante los grupos de interés.
                </p>
                <p className="font-body text-ink-soft">
                  Porque al final, nuestro trabajo no se trata solo de entregar
                  estudios, estrategias o reportes. Se trata de construir
                  claridad para decidir, resiliencia para operar y valor real
                  para el negocio.
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
                  En ResponSable acompañamos a empresas a transformar su gestión
                  de sostenibilidad en decisiones estratégicas y relaciones
                  sólidas con sus grupos de interés, optimizando recursos,
                  reduciendo riesgos y fortaleciendo su licencia social para
                  operar.
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
                  Ser la consultoría líder en México y Centroamérica en
                  transformar la sostenibilidad en ventaja competitiva, mediante
                  metodologías propias, innovación y excelencia.
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
