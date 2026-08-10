import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ServicioFooter } from "@/components/servicio/servicio-footer";
import { HeroFramed } from "@/components/hero-framed";
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
  /*
    The WordPress original at responsable.net/servicio/estudio-doble-materialidad/
    is still live and indexed. Without this, both versions compete for the same
    keyword and cannibalise each other. REMOVE once WordPress is switched off and
    this build serves that URL.
  */
  robots: { index: false, follow: false },
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

const ANCHORS = [
  { label: "Por qué importa", href: "#por-que-importa" },
  { label: "El proceso", href: "#proceso" },
  { label: "Preguntas frecuentes", href: "#faq" },
];

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
    answer:
      "Estudio completo, modalidad Coach, apoyo con IA o consulta a grupos de interés. La elección depende del presupuesto, la madurez interna y el nivel de evidencia requerido.",
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

      <SiteHeader anchors={ANCHORS} />

      <main id="main">
        {/* ------------------------------- HERO ------------------------------- */}
        <HeroFramed
          videoSrc="/responsable-back.mp4"
          videoPoster="/responsable-back-poster.jpg"
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
          <p className="font-body mt-4 max-w-2xl text-[1.2rem] text-white/90">
            Transforme impactos, riesgos y oportunidades en foco estratégico
          </p>
          <p className="font-body mt-4 max-w-2xl text-white/80">
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
          <div className="mx-auto grid max-w-[var(--container)] items-center gap-[clamp(2rem,5vw,4rem)] px-[clamp(1rem,4vw,2rem)] md:grid-cols-2">
            <div>
              {/* Pending asset: assets/img/doble-materialidad-infografia.svg */}
              <div
                role="img"
                aria-label="Infografía de doble materialidad: materialidad de impacto, materialidad financiera y su integración"
                className="aspect-[3/4] w-full rounded bg-[#1b2150]"
              />
            </div>
            <div>
              <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                Para orientar estrategia e informe de sostenibilidad
              </p>
              <h2
                id="decidir-title"
                className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-navy"
              >
                Doble materialidad para decidir
              </h2>
              <p className="font-body mt-4 max-w-[60ch] text-[1.15rem] text-ink-soft">
                Un estudio de doble materialidad convierte temas dispersos,
                presiones externas e iniciativas aisladas en una agenda
                priorizada. Permite identificar qué impactos genera la empresa y
                qué riesgos y oportunidades pueden afectar su operación,
                reputación, desempeño financiero o licencia social para operar.
              </p>
              <p className="font-body mt-4 max-w-[60ch] text-[1.15rem] text-ink-soft">
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
          className="bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[2fr_1fr]">
              <div>
                <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
                  Impactos, riesgos y oportunidades priorizados
                </p>
                <h2 className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-navy">
                  Temas materiales claros
                </h2>
                <p className="font-body mt-4 max-w-[60ch] text-[1.15rem] text-ink-soft">
                  El principal beneficio es dejar de gestionar la sostenibilidad
                  como una lista extensa de temas. La empresa distingue qué
                  asuntos exigen acción inmediata, cuáles pueden afectar su
                  desempeño financiero y dónde existen oportunidades que
                  conviene desarrollar.
                </p>
                <p className="font-body mt-4 max-w-[60ch] text-[1.15rem] text-ink-soft">
                  Así, puede enfocar recursos, justificar presupuesto, definir
                  responsabilidades e indicadores y sostener sus decisiones con
                  mayor trazabilidad ante Dirección. Cuando se consulta a grupos
                  de interés, el análisis también incorpora expectativas
                  externas y ayuda a anticipar tensiones que una mirada
                  exclusivamente interna podría pasar por alto.
                </p>
              </div>
              {/* Pending asset: assets/img/mundo_responsable.webp */}
              <div
                role="img"
                aria-label="Ilustración de dos personas frente a un mundo sostenible"
                className="aspect-square w-full rounded bg-[#1b2150]"
              />
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
          className="bg-navy py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            {/* Title then intro stacked and left-aligned, intro ~60% wide —
                matching the live site, which does not put them side by side. */}
            <div>
              <h2
                id="proceso-title"
                className="font-head text-[clamp(2.4rem,6vw,4rem)] leading-[1.02] font-semibold text-magenta"
              >
                Nuestro
                <br />
                Proceso
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

        {/* -------------------------------- FAQ -------------------------------- */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <p className="font-head text-center text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              Dudas habituales
            </p>
            <h2
              id="faq-title"
              className="font-head mt-3 text-center text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-navy"
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
                <h2 className="font-head text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-white">
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
              className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-navy"
            >
              Servicios relacionados
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
