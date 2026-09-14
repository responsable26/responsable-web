import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { BarraAnclas } from "@/components/servicio/barra-anclas";
import { TestimoniosServicio } from "@/components/servicio/testimonios-servicio";
import { testimoniosDe } from "@/lib/testimonios";
import { ServicioFooter } from "@/components/servicio/servicio-footer";
import { HeroFramed } from "@/components/hero-framed";
import { POSTER_HERO, VIDEO_HERO } from "@/lib/video-hero";
import { ContactButton } from "@/components/contact-button";
import { Faq, FaqJsonLd, type FaqItem } from "@/components/faq";
import { RelatedCard } from "@/components/related-card";
import {
  BeneficiosCarousel,
  type Beneficio,
} from "@/components/servicio/beneficios-carousel";

const CANONICAL =
  "https://responsable.net/servicio/estudio-doble-materialidad/";
const DESCRIPTION =
  "Realizamos su estudio de doble materialidad: identificamos impactos, riesgos y oportunidades ASG y los convertimos en decisiones de negocio. Alineado a CSRD y ESRS.";

export const metadata: Metadata = {
  // Sin sufijo de marca: el template del layout raíz añade "| ResponSable".
  title: "Estudio de Doble Materialidad para Empresas",
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    title: "Estudio de Doble Materialidad para Empresas | ResponSable",
    description: DESCRIPTION,
    url: CANONICAL,
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/* Los anclajes se componen en el render y no como una constante única: el de
   Testimonios solo entra si esa página tiene testimonios, para no dejar un
   enlace apuntando a un id que no existe. */
const ANCHORS_ANTES = [
  { label: "Por qué importa", href: "#por-que-importa" },
  { label: "El proceso", href: "#proceso" },
];
const ANCHORS_FAQ = { label: "Preguntas frecuentes", href: "#faq" };

const BENEFICIOS: Beneficio[] = [
  { num: "01", from: "De muchos temas", to: "a prioridades claras" },
  {
    num: "02",
    from: "De una visión general",
    to: "a impactos y efectos en el negocio",
  },
  { num: "03", from: "De percepciones", to: "a criterios trazables" },
  { num: "04", from: "De esfuerzos dispersos", to: "a recursos enfocados" },
  { num: "05", from: "De una matriz", to: "a una ruta de acción" },
  { num: "06", from: "De comunicar acciones", to: "a explicar prioridades" },
];

/*
  La infografía de "Doble materialidad para decidir", leída del archivo de
  public al renderizar en el servidor (la página es estática: ocurre en el
  build). public/servicios/<slug>/<rol> es la fuente única y se inserta tal
  cual, salvo la declaración <?xml ?>: el archivo la lleva para abrirse bien
  en editores como Illustrator, pero dentro de HTML no es válida.
*/
const INFOGRAFIA_DOBLE_MATERIALIDAD = readFileSync(
  path.join(
    process.cwd(),
    "public/servicios/estudio-doble-materialidad/infografia.svg",
  ),
  "utf8",
).replace(/^<\?xml[^>]*\?>\s*/, "");

const PASOS = [
  {
    num: "1",
    title: "Entender el contexto",
    text: "Analizamos estrategia, operación, documentos internos, cadena de valor, referentes y benchmark sectorial para identificar temas potencialmente relevantes.",
  },
  {
    num: "2",
    title: "Identificar los IROs",
    text: "Identificamos los impactos que genera la empresa y los riesgos y oportunidades de sostenibilidad que pueden afectar su desempeño y continuidad.",
  },
  {
    num: "3",
    title: "Evaluar la materialidad",
    text: "Aplicamos consultas y sesiones de trabajo para valorar la materialidad de impacto y financiera, y consolidarlas mediante criterios claros y trazables.",
  },
  {
    num: "4",
    title: "Convertir en decisiones",
    text: "Traducimos los resultados en prioridades y recomendaciones para orientar la estrategia, la gestión de riesgos, el informe y el diálogo con grupos de interés.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Qué es un estudio de doble materialidad?",
    answer:
      "Es un ejercicio estratégico que identifica temas de sostenibilidad relevantes desde dos perspectivas: impactos de la empresa en su entorno y efectos en el desempeño del negocio.",
  },
  {
    question: "¿Para qué sirve en términos de negocio?",
    answer:
      "Sirve para priorizar impactos, riesgos y oportunidades, orientar la estrategia de sostenibilidad, enfocar recursos, fortalecer el informe de sostenibilidad y tomar mejores decisiones.",
  },
  {
    question: "¿Qué son los IROs?",
    answer:
      "IROs significa Impactos, Riesgos y Oportunidades. Ayudan a entender qué efectos genera la empresa, qué riesgos debe anticipar y qué oportunidades puede aprovechar.",
  },
  {
    question: "¿Se necesita consulta a grupos de interés?",
    answer:
      "No forzosamente y no siempre con la misma profundidad. En ResponSable sí recomendamos incluir consulta, porque fortalece la trazabilidad y contrasta la visión interna con expectativas externas.",
  },
  {
    question: "¿Qué opciones de alcance existen?",
    answer: {
      paragraphs: [
        "Podemos realizar un estudio completo de doble materialidad, guiar a su equipo para desarrollarlo internamente, usar herramientas de IA para acelerar el análisis, incorporar la perspectiva de grupos de interés o enfocar el alcance en materialidad financiera.",
        "Esta última opción puede ser útil para empresas que necesitan preparar insumos alineados con las NIS o con las NIIF de sostenibilidad, cuando el objetivo principal es identificar riesgos y oportunidades con posibles efectos en el negocio. La elección depende del presupuesto, la madurez interna, el uso esperado de los resultados y el nivel de evidencia requerido.",
      ],
    },
  },
  {
    question: "¿Cómo saber qué alcance conviene?",
    answer: [
      "Completo si ResponSable lidera el proceso.",
      "Coach si el equipo interno ejecuta con guía experta.",
      "Con IA optimiza presupuesto.",
      "Con consulta fortalece evidencia externa.",
    ],
  },
  {
    question: "¿Incluye cuantificación financiera?",
    answer:
      "Puede incluirse como adicional para estimar, en IROs priorizados, rangos de impacto financiero por horizonte temporal, con supuestos validados por Finanzas.",
  },
  {
    question: "¿Qué recibimos al final?",
    answer:
      "Matrices de impacto, financiera y doble materialidad; descripción de IROs; hallazgos y recomendaciones para estrategia, informe de sostenibilidad y toma de decisiones.",
  },
];

const RELACIONADOS = [
  {
    title: "Distintivo ESR",
    description:
      "Le acompañamos en la obtención del Distintivo Empresa Socialmente Responsable.",
  },
  {
    title: "Comité de Sostenibilidad",
    description:
      "Diseñamos y ponemos en marcha su comité interno de sostenibilidad.",
  },
  {
    title: "Reconocimientos y Certificaciones",
    description:
      "Preparamos a su organización para reconocimientos y certificaciones en RSE.",
  },
];

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Estudio de doble materialidad",
  name: "Estudio de Doble Materialidad",
  description:
    "Estudio de doble materialidad para empresas: identificamos impactos, riesgos y oportunidades ASG (IROs) y los convertimos en decisiones de negocio, alineado a CSRD, ESRS y GRI.",
  url: CANONICAL,
  provider: {
    "@type": "Organization",
    name: "ResponSable",
    url: "https://responsable.net/",
  },
  areaServed: "ES",
  audience: {
    "@type": "Audience",
    audienceType:
      "Empresas sujetas a CSRD y organizaciones con estrategia de sostenibilidad",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://responsable.net/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Servicios",
      item: "https://responsable.net/",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Estudio de Doble Materialidad",
      item: CANONICAL,
    },
  ],
};

export default function EstudioDobleMaterialidadPage() {
  const testimonios = testimoniosDe("estudio-doble-materialidad");
  const anclas = [
    ...ANCHORS_ANTES,
    ...(testimonios.length > 0
      ? [{ label: "Testimonios", href: "#testimonios" }]
      : []),
    ANCHORS_FAQ,
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <FaqJsonLd items={FAQ_ITEMS} />

      <SiteHeader />
      {/* Fuera del header a propósito: aparece al salir el hero y se retira
          al volver arriba, mientras el header mantiene el menú principal. */}
      <BarraAnclas anclas={anclas} />

      <main id="main">
        {/* ------------------------------- HERO ------------------------------- */}
        <HeroFramed
          videoSrc={VIDEO_HERO}
          videoPoster={POSTER_HERO}
          contenido="centrado"
        >
          <nav
            aria-label="Ruta de navegación"
            className="font-body text-[0.9rem]"
          >
            <ol className="flex flex-wrap items-center gap-2 text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/servicio/" className="hover:text-white">
                  Servicios
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  Estudio de Doble Materialidad
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="font-head mt-5 max-w-3xl text-[clamp(2rem,4vw,2.75rem)] font-semibold text-white">
            Estudio de Doble Materialidad
          </h1>
          <p className="font-body mt-4 max-w-2xl text-[1.1rem] text-white/90">
            Transforme impactos, riesgos y oportunidades en foco estratégico
          </p>
          {/* 58 caracteres por línea, la misma medida que la entradilla del hero
              de las diez páginas de servicio. max-w-2xl daba unos 84 a este
              cuerpo, por encima de una medida de lectura cómoda. Solo cambia el
              ancho del párrafo: la alineación inferior y el alto del hero se
              conservan. */}
          <p className="font-body mt-4 max-w-[58ch] text-white/80">
            Cuando todos los temas de sostenibilidad parecen importantes,
            priorizar se vuelve difícil. El estudio de doble materialidad ayuda
            a distinguir qué impactos genera la empresa sobre las personas y el
            medio ambiente, y qué riesgos y oportunidades pueden afectar su
            desempeño financiero. En ResponSable convertimos ese análisis en
            foco estratégico para decidir dónde actuar, qué reportar y cómo
            asignar mejor los recursos.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ContactButton variant="primary">Solicitar propuesta</ContactButton>
            <a
              href="#proceso"
              className="font-head shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-off-white"
            >
              Ver el proceso
            </a>
          </div>
        </HeroFramed>

        {/* ------------------ DOBLE MATERIALIDAD PARA DECIDIR ------------------ */}
        <section
          aria-labelledby="decidir-title"
          className="py-[var(--section-y)]"
        >
          {/*
            Los párrafos de esta sección y de "Temas materiales claros" van a
            717px, 68 caracteres a 1.05rem: la medida del sitio, la misma que
            BloqueTexto en las demás páginas de servicio. En px y no en ch (ver
            §2 de globals.css).

            Dos columnas desde lg y no desde md: la infografía escala con su
            columna, y a 768px esa columna mide ~334px, con las preguntas a
            menos de 8px. Por debajo de lg se apila y la infografía se topa a
            520px, centrada, donde las preguntas quedan en ~19px.
          */}
          <div className="mx-auto grid max-w-[var(--container)] items-center gap-[clamp(2rem,5vw,4rem)] px-[clamp(1rem,4vw,2rem)] lg:grid-cols-2">
            <div>
              {/*
                Incrustada en línea y no con next/image, por tres razones: como
                <img> el SVG no expone su <title> y <desc> —el nombre accesible
                saldría solo del alt, que duplicaría la descripción—, no puede
                usar la Poppins de la página y no se podría animar. Sin alt ni
                role añadidos: el propio SVG trae role="img" y aria-labelledby.

                Fondo off-white y no blanco: la sección es blanca y las cajas de
                las preguntas del SVG también, con borde de color.
              */}
              <div
                className="mx-auto max-w-[520px] overflow-hidden rounded bg-off-white lg:max-w-none [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: INFOGRAFIA_DOBLE_MATERIALIDAD }}
              />
            </div>
            <div>
              <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                Para orientar estrategia e informe de sostenibilidad
              </p>
              <h2
                id="decidir-title"
                className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy"
              >
                Doble materialidad para decidir
              </h2>
              <p className="font-body mt-4 max-w-[717px] text-[1.05rem] text-ink-soft">
                Un estudio de doble materialidad convierte temas dispersos,
                presiones externas e iniciativas aisladas en una agenda
                priorizada. Permite identificar qué impactos genera la empresa y
                qué riesgos y oportunidades pueden afectar su operación,
                reputación, desempeño financiero o licencia social para operar.
              </p>
              <p className="font-body mt-4 max-w-[717px] text-[1.05rem] text-ink-soft">
                Con esa lectura, Dirección y el área de sostenibilidad pueden
                decidir qué gestionar primero, alinear la estrategia, fortalecer
                el informe de sostenibilidad y sostener conversaciones más
                sólidas con grupos de interés. El valor no está en producir una
                matriz, sino en transformar información compleja en criterios
                claros para decidir.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------- TEMAS MATERIALES CLAROS ---------------------- */}
        <section
          id="por-que-importa"
          /* scroll-mt-36 (9rem = 144px): el aterrizaje por hash desde otra
             página, y el salto nativo sin JS, no pasan por irAAncla y no miden
             nada, así que el margen tiene que estar en la sección. 144px cubre
             el header (80px desde lg), los 12px de separación y los 48px de la
             barra de anclajes. Mismo valor que las secciones de /servicio/, que
             resuelven el mismo solapamiento. */
          className="scroll-mt-36 bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[2fr_1fr]">
              <div>
                <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
                  Impactos, riesgos y oportunidades priorizados
                </p>
                <h2 className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy">
                  Temas materiales claros
                </h2>
                <p className="font-body mt-4 max-w-[717px] text-[1.05rem] text-ink-soft">
                  El principal beneficio es dejar de gestionar la sostenibilidad
                  como una lista extensa de temas. La empresa distingue qué
                  asuntos exigen acción inmediata, cuáles pueden afectar su
                  desempeño financiero y dónde existen oportunidades que
                  conviene desarrollar.
                </p>
                <p className="font-body mt-4 max-w-[717px] text-[1.05rem] text-ink-soft">
                  Así, puede enfocar recursos, justificar presupuesto, definir
                  responsabilidades e indicadores y sostener sus decisiones con
                  mayor trazabilidad ante Dirección. Cuando se consulta a grupos
                  de interés, el análisis también incorpora expectativas
                  externas y ayuda a anticipar tensiones que una mirada
                  exclusivamente interna podría pasar por alto.
                </p>
              </div>
              {/*
                Foto con tratamiento de marca para que no se lea como stock
                pegado. No es el del hero: allí el video va bajo un velo navy al
                90%, que funciona como fondo de texto pero aquí dejaría la foto
                casi invisible. En su lugar, la saturación baja al 55% —las
                notas adhesivas son de colores fluorescentes y compiten con el
                magenta y el teal del sitio— y un velo navy en multiply al 25%
                tiñe los blancos del fondo hacia la paleta sin tapar a nadie.

                La foto es 3:2 y la caja cuadrada: object-cover recorta los
                laterales y la persona del centro queda entera; el hombre de la
                derecha queda cortado por el borde.
              */}
              <div className="relative aspect-square w-full overflow-hidden rounded bg-navy">
                <Image
                  src="/servicios/estudio-doble-materialidad/temas-materiales.webp"
                  alt="Tres personas colocan notas adhesivas de colores sobre un panel de vidrio durante una sesión de trabajo en una oficina."
                  fill
                  /* Columna de 1fr en la rejilla 2fr_1fr desde md: un tercio
                     del contenedor menos el hueco entre columnas. */
                  sizes="(min-width: 1280px) 384px, (min-width: 768px) calc((100vw - 8rem) / 3), calc(100vw - 2rem)"
                  className="object-cover saturate-[0.55]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-navy opacity-25 mix-blend-multiply"
                />
              </div>
            </div>

            <BeneficiosCarousel
              title="6 Beneficios que Habilitas con la Doble Materialidad"
              items={BENEFICIOS}
            />
          </div>
        </section>

        {/* ------------------------------ PROCESO ------------------------------ */}
        <section
          id="proceso"
          aria-labelledby="proceso-title"
          /* Ver la nota de scroll-mt en la primera sección con ancla. */
          className="scroll-mt-36 bg-navy py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            {/* Title then intro stacked and left-aligned, intro ~60% wide —
                matching the live site, which does not put them side by side. */}
            <div>
              {/* Al tope de los H2 de sección y en una línea: el salto entre
                  "Nuestro" y "Proceso" y el interlineado 1.02 eran de cuando
                  este título iba a tamaño de hero (64px). */}
              <h2
                id="proceso-title"
                className="font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-magenta"
              >
                Nuestro Proceso
              </h2>
              <p className="font-body mt-6 max-w-[62%] min-w-[18rem] text-white/85">
                Realizamos el estudio de doble materialidad con una metodología
                estructurada para pasar del análisis de contexto a la matriz de
                doble materialidad, los Impactos, Riesgos y Oportunidades (IROs)
                priorizados y las recomendaciones estratégicas.
              </p>
            </div>

            <div className="mt-12 rounded bg-white p-8 shadow sm:p-12">
              <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {PASOS.map((paso) => (
                  <li key={paso.num}>
                    <span className="font-head flex size-11 items-center justify-center rounded-full bg-magenta text-lg font-bold text-white">
                      {paso.num}
                    </span>
                    <h3 className="font-head mt-4 text-[1.15rem] font-semibold text-navy">
                      {paso.title}
                    </h3>
                    <p className="font-body mt-2 text-sm text-ink-soft">
                      {paso.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------------------- TESTIMONIOS ---------------------------- */}
        <TestimoniosServicio testimonios={testimonios} />

        {/* -------------------------------- FAQ -------------------------------- */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          /* Ver la nota de scroll-mt en la primera sección con ancla. */
          className="scroll-mt-36 bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <p className="font-head text-center text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              Dudas habituales
            </p>
            <h2
              id="faq-title"
              className="font-head mt-3 text-center text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy"
            >
              Preguntas frecuentes
            </h2>

            <div className="mx-auto mt-10 max-w-3xl">
              <Faq items={FAQ_ITEMS} />
            </div>
          </div>
        </section>

        {/* ------------------------------ BANDA CTA ---------------------------- */}
        {/* Full-bleed band with the same 1.75rem margin as the hero card; the
            copy inside sits in the shared container. */}
        <section id="contacto" className="px-4 sm:px-7">
          <div className="rounded-[22px] bg-magenta py-[var(--section-y)]">
            <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-8 px-[clamp(1rem,4vw,2rem)]">
              <div className="max-w-2xl">
                <h2 className="font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-white">
                  Ordene sus temas materiales con criterio de negocio
                </h2>
                <p className="font-body mt-3 text-white/90">
                  Priorice sus impactos, riesgos y oportunidades con criterio de
                  negocio, y convierta la doble materialidad en la base para
                  orientar su estrategia de sostenibilidad, su informe de
                  sostenibilidad y sus decisiones de negocio.
                </p>
              </div>
              <ContactButton variant="dark">Contáctenos</ContactButton>
            </div>
          </div>
        </section>

        {/* ------------------------ SERVICIOS RELACIONADOS ---------------------- */}
        <section
          aria-labelledby="related-title"
          className="bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              Siga explorando
            </p>
            <h2
              id="related-title"
              className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy"
            >
              Servicios relacionados
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,380px))] lg:justify-center">
              {RELACIONADOS.map((servicio) => (
                <RelatedCard
                  key={servicio.title}
                  href="/servicio/"
                  title={servicio.title}
                  description={servicio.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <ServicioFooter />
    </>
  );
}
