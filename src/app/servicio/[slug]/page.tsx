import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ServicioFooter } from "@/components/servicio/servicio-footer";
import { HeroFramed } from "@/components/hero-framed";
import { ContactButton } from "@/components/contact-button";
import { Faq, FaqJsonLd, type FaqItem } from "@/components/faq";
import { RelatedCard } from "@/components/related-card";
import { ProcesoPasos } from "@/components/servicio/proceso-pasos";
import {
  CONTENIDO_SERVICIOS,
  getContenidoServicio,
  type BloqueServicio,
  type ContenidoServicio,
} from "@/lib/contenido-servicios";

/*
  Las diez páginas de servicio con contenido validado, sobre una sola ruta
  dinámica. Estudio de Doble Materialidad se queda fuera a propósito: tiene ruta
  estática propia en ../estudio-doble-materialidad/, y un segmento estático gana
  siempre al dinámico, así que las dos conviven sin pelearse. Tampoco está en
  CONTENIDO_SERVICIOS, de modo que generateStaticParams no puede duplicarla.

  El tratamiento visual replica el de esa página —hero enmarcado con video,
  anclas contextuales en el header, secciones alternando blanco y off-white,
  proceso sobre navy, FAQ en acordeón y banda CTA magenta—, pero resuelve dos
  cosas que aquella no tenía que resolver: que ningún documento aporta imágenes,
  y que la longitud del contenido varía mucho de un servicio a otro.
*/

const BASE = "https://responsable.net";

export function generateStaticParams() {
  return CONTENIDO_SERVICIOS.map((servicio) => ({ slug: servicio.slug }));
}

/**
 * Descripción para metadatos, derivada del primer párrafo real del documento.
 *
 * Se recorta a 160 caracteres en límite de palabra: es donde Google deja de
 * mostrarla. No se inventa una frase aparte para no tener dos textos que
 * mantener y que puedan contradecirse.
 */
function metaDescripcion(contenido: ContenidoServicio): string {
  const texto = contenido.hero.descripcion[0] ?? contenido.cta.descripcion;
  if (texto.length <= 160) return texto;
  const corte = texto.slice(0, 160);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

export async function generateMetadata(
  props: PageProps<"/servicio/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const contenido = getContenidoServicio(slug);
  if (!contenido) return {};

  const canonical = `/servicio/${contenido.slug}/`;
  const descripcion = metaDescripcion(contenido);

  return {
    // Sin sufijo de marca: lo añade el template del layout raíz.
    title: contenido.hero.titulo,
    description: descripcion,
    alternates: { canonical },
    /* Sin robots noindex, a diferencia de la página de Doble Materialidad: esa
       compite con su equivalente todavía viva en WordPress, y estas no tienen
       equivalente publicado —sus URL viejas redirigen aquí. */
    openGraph: {
      type: "website",
      siteName: "ResponSable",
      // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
      title: `${contenido.hero.titulo} | ResponSable`,
      description: descripcion,
      url: canonical,
      locale: "es_ES",
    },
    twitter: { card: "summary_large_image" },
  };
}

const ANCLAS = [
  { label: "Para qué sirve", href: "#para-que-sirve" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "El proceso", href: "#proceso" },
  { label: "Preguntas frecuentes", href: "#faq" },
];

/**
 * Los tres servicios siguientes en el catálogo, en círculo.
 *
 * Recorrer el array desde la posición actual y no cortar los tres primeros:
 * así cada página propone un trío distinto en lugar de que nueve de las diez
 * enseñen los mismos, y con diez servicios nunca se repite ni se enlaza a sí
 * misma.
 */
function relacionados(slug: string): ContenidoServicio[] {
  const actual = CONTENIDO_SERVICIOS.findIndex((s) => s.slug === slug);
  return [1, 2, 3].map(
    (salto) => CONTENIDO_SERVICIOS[(actual + salto) % CONTENIDO_SERVICIOS.length],
  );
}

/**
 * Los bloques «¿Para qué sirve?» y «Beneficios», que comparten forma.
 *
 * Dos columnas —titulares a la izquierda, párrafos a la derecha— y no una sola
 * centrada, porque es lo que absorbe la desigualdad de los documentos: hay
 * bloques de un párrafo y bloques de cinco. Con el peso tipográfico repartido
 * en dos columnas, el de un párrafo no se lee como una sección a medio escribir
 * y el de cinco no se convierte en un muro de texto de ancho completo. La
 * columna de texto va limitada a 62 caracteres por línea, la medida del resto
 * del sitio.
 */
function BloqueTexto({
  bloque,
  colorEtiqueta,
  id,
}: {
  bloque: BloqueServicio;
  colorEtiqueta: "magenta" | "teal";
  id: string;
}) {
  const tituloId = `${id}-title`;

  return (
    <div className="grid gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <div>
        <p
          className={`font-head text-[0.78rem] font-semibold tracking-[0.12em] uppercase ${
            colorEtiqueta === "magenta" ? "text-magenta" : "text-teal"
          }`}
        >
          {bloque.subtitulo}
        </p>
        <h2
          id={tituloId}
          className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-navy"
        >
          {bloque.titulo}
        </h2>
      </div>

      <div className="flex max-w-[62ch] flex-col gap-4">
        {bloque.descripcion.map((parrafo) => (
          <p key={parrafo} className="font-body text-[1.15rem] text-ink-soft">
            {parrafo}
          </p>
        ))}

        {/*
          Tabla opcional. Hoy solo la trae Acompañamiento en sostenibilidad, y
          por eso se renderiza bajo condición en lugar de reservarle sitio: sin
          datos no queda ni el encabezado ni un hueco.

          Se pinta como lista de definiciones y no como <table>: son pares
          concepto/explicación, no una retícula de datos que se lea cruzando
          filas y columnas, y en móvil una tabla de dos columnas con frases
          largas obliga a desplazamiento horizontal.
        */}
        {bloque.tabla ? (
          <dl className="mt-4 flex flex-col gap-px overflow-hidden rounded border border-border bg-border">
            <div className="grid bg-off-white px-5 py-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6">
              <span className="font-head text-[0.78rem] font-semibold tracking-[0.08em] text-navy uppercase">
                {bloque.tabla.encabezados[0]}
              </span>
              <span className="font-head text-[0.78rem] font-semibold tracking-[0.08em] text-navy uppercase max-sm:sr-only">
                {bloque.tabla.encabezados[1]}
              </span>
            </div>
            {bloque.tabla.filas.map(([concepto, valor]) => (
              <div
                key={concepto}
                className="grid bg-white px-5 py-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6"
              >
                <dt className="font-head text-base font-semibold text-navy">
                  {concepto}
                </dt>
                <dd className="font-body mt-1 text-ink-soft sm:mt-0">{valor}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

export default async function ServicioPage(
  props: PageProps<"/servicio/[slug]">,
) {
  const { slug } = await props.params;
  const contenido = getContenidoServicio(slug);
  if (!contenido) notFound();

  const { hero, paraQueSirve, beneficios, proceso, faq, cta } = contenido;
  const canonical = `${BASE}/servicio/${contenido.slug}/`;
  const descripcion = metaDescripcion(contenido);

  /*
    El primer párrafo se queda en el hero, como en la página de Doble
    Materialidad, y el resto baja a la sección siguiente. Todos los documentos
    traen al menos uno, así que ningún hero queda sin entradilla; y los que
    traen cinco —Acompañamiento— no convierten la portada en un texto largo
    sobre video, que es donde peor se lee.
  */
  const [entradilla, ...restoDescripcion] = hero.descripcion;

  const preguntas: FaqItem[] = faq.map((item) => ({
    question: item.pregunta,
    answer: item.respuesta,
  }));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: contenido.servicio,
    name: hero.titulo,
    description: descripcion,
    url: canonical,
    provider: {
      "@type": "Organization",
      name: "ResponSable",
      url: `${BASE}/`,
    },
    /* Mismo valor que declara la página de Doble Materialidad, para no abrir
       dos criterios distintos en el mismo sitio. Ver el reporte: el contenido
       apunta sobre todo a México. */
    areaServed: "ES",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios",
        item: `${BASE}/servicio/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hero.titulo,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FaqJsonLd items={preguntas} />

      <SiteHeader anchors={ANCLAS} />

      <main id="main">
        {/* ------------------------------- HERO ------------------------------- */}
        <HeroFramed
          videoSrc="/responsable-back.mp4"
          videoPoster="/responsable-back-poster.jpg"
          align="center"
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
                  {hero.titulo}
                </span>
              </li>
            </ol>
          </nav>

          {/*
            Todo alineado a la izquierda, como el hero de Doble Materialidad. El
            centrado de la variante `center` de HeroFramed es solo vertical.

            La entradilla se queda en 58 caracteres por línea y no vuelve al
            max-w-2xl de partida: a este cuerpo, 2xl da unos 84 caracteres, por
            encima de la medida de lectura cómoda incluso alineado a la
            izquierda. Con la entradilla más larga de los diez servicios, la de
            Estrategia de comunicación, salen unas siete líneas; con la más
            corta, la de Acompañamiento, algo menos de dos.
          */}
          <h1 className="font-head mt-5 max-w-3xl text-[clamp(2rem,4vw,2.75rem)] font-semibold text-white">
            {hero.titulo}
          </h1>
          <p className="font-body mt-4 max-w-2xl text-[1.2rem] text-white/90">
            {hero.subtitulo}
          </p>
          <p className="font-body mt-4 max-w-[58ch] text-white/80">
            {entradilla}
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

        {/* ------------------------------- CLAVES ------------------------------ */}
        {/*
          Los cuatro puntos descriptivos del documento, más el resto de la
          descripción general cuando la hay.

          Es también la respuesta a que no haya imágenes: cuatro enunciados
          cortos bajo un filete magenta dan ritmo visual y cortan el bloque de
          texto sin depender de ninguna ilustración. Son cuatro en los diez
          servicios, así que la retícula de cuatro columnas siempre cierra.
        */}
        <section aria-labelledby="claves-title" className="py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <h2 id="claves-title" className="sr-only">
              En qué consiste el servicio
            </h2>

            {restoDescripcion.length > 0 ? (
              <div className="flex max-w-[62ch] flex-col gap-4">
                {restoDescripcion.map((parrafo) => (
                  <p
                    key={parrafo}
                    className="font-body text-[1.15rem] text-ink-soft"
                  >
                    {parrafo}
                  </p>
                ))}
              </div>
            ) : null}

            <ul
              className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${
                restoDescripcion.length > 0 ? "mt-12" : ""
              }`}
            >
              {hero.puntos.map((punto) => (
                <li key={punto} className="border-t-2 border-magenta pt-4">
                  <p className="font-head text-[1.05rem] font-medium text-navy">
                    {punto}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------- PARA QUÉ SIRVE -------------------------- */}
        <section
          id="para-que-sirve"
          aria-labelledby="para-que-sirve-title"
          className="bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <BloqueTexto
              bloque={paraQueSirve}
              colorEtiqueta="magenta"
              id="para-que-sirve"
            />
          </div>
        </section>

        {/* ----------------------------- BENEFICIOS ---------------------------- */}
        <section
          id="beneficios"
          aria-labelledby="beneficios-title"
          className="py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <BloqueTexto
              bloque={beneficios}
              colorEtiqueta="teal"
              id="beneficios"
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
                {proceso.descripcion}
              </p>
            </div>

            {/* Rejilla hasta cuatro pasos, pista deslizable a partir de cinco.
                La decisión y las dos disposiciones viven en el componente. */}
            <ProcesoPasos pasos={proceso.pasos} />
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
              <Faq items={preguntas} />
            </div>
          </div>
        </section>

        {/* ------------------------------ BANDA CTA ---------------------------- */}
        <section id="contacto" className="px-4 sm:px-7">
          <div className="rounded-[22px] bg-magenta py-[var(--section-y)]">
            <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-8 px-[clamp(1rem,4vw,2rem)]">
              <div className="max-w-2xl">
                <h2 className="font-head text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-white">
                  {cta.subtitulo}
                </h2>
                <p className="font-body mt-3 text-white/90">{cta.descripcion}</p>
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
              {relacionados(contenido.slug).map((otro) => (
                <RelatedCard
                  key={otro.slug}
                  href={`/servicio/${otro.slug}/`}
                  title={otro.servicio}
                  /* El subtítulo del documento, que es justo una frase de
                     presentación del servicio. No se redacta un resumen aparte
                     que habría que mantener en paralelo. */
                  description={otro.hero.subtitulo}
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
