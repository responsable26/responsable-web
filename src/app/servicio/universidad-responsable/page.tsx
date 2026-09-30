import type { Metadata } from "next";
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
import { ProcesoPasos } from "@/components/servicio/proceso-pasos";
import { PestanasVerticales } from "@/components/servicio/pestanas-verticales";
import { InfografiaResilio } from "@/components/servicio/infografia-resilio";
import { ICONOS_USOS } from "@/components/servicio/iconos-universidad";
import {
  UNIVERSIDAD,
  type TarjetaUniversidad,
} from "@/lib/contenido-universidad";

/*
  E-learning en sostenibilidad: Universidad ResponSable.

  Ruta estática propia, como Estudio de Doble Materialidad, y no la dinámica
  de ../[slug]/: su documento trae secciones que la plantilla compartida no
  tiene —tarjetas de tres, una rejilla de seis usos, una lista de doce
  elementos— y meterlas allí como bloques opcionales complicaría las otras
  diez páginas por una sola. Un segmento estático gana siempre al dinámico, y
  el slug no está en CONTENIDO_SERVICIOS, así que no se duplica.

  El tratamiento visual es el de la plantilla dinámica: hero enmarcado con
  video, barra de anclas, secciones alternando blanco y off-white, proceso
  sobre navy, FAQ en acordeón y banda CTA magenta. Sin sección Claves ni
  Servicios relacionados, por decisión con el cliente.

  Los dos botones abren el modal de contacto: el acceso a la plataforma se
  gestiona por contacto, no por registro, y la página no enlaza a ella.
*/

const BASE = "https://responsable.net";
const CANONICAL = `/servicio/${UNIVERSIDAD.slug}/`;

export const metadata: Metadata = {
  /* absolute: el título del cliente ya lleva la marca, y el template del
     layout raíz le añadiría un segundo «| ResponSable». */
  title: { absolute: UNIVERSIDAD.seo.titulo },
  description: UNIVERSIDAD.seo.descripcion,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    title: UNIVERSIDAD.seo.titulo,
    description: UNIVERSIDAD.seo.descripcion,
    url: CANONICAL,
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/* El de Testimonios solo entra si hay testimonios, como en las demás
   páginas de servicio. */
const ANCLAS_ANTES = [
  { label: "Contenido", href: "#contenido" },
  { label: "A quién", href: "#a-quien" },
  { label: "Para qué sirve", href: "#para-que-sirve" },
  { label: "Cómo funciona", href: "#como-funciona" },
];
const ANCLA_FAQ = { label: "Preguntas frecuentes", href: "#faq" };

const CLASE_H2 =
  "font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy";
const CLASE_PARRAFO = "font-body text-[1.05rem] text-ink-soft";
const CONTENEDOR = "mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]";

/**
 * Titular a la izquierda y párrafos a la derecha, como BloqueTexto en la
 * plantilla dinámica, sin la etiqueta superior: el documento no la trae.
 * 717px = 68 caracteres a los 16.8px del párrafo, la medida de lectura del
 * sitio.
 */
function BloqueDosColumnas({
  id,
  titulo,
  parrafos,
}: {
  id: string;
  titulo: string;
  parrafos: string[];
}) {
  return (
    <div className="grid gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <h2 id={`${id}-title`} className={CLASE_H2}>
        {titulo}
      </h2>
      <div className="flex max-w-[717px] flex-col gap-4">
        {parrafos.map((parrafo) => (
          <p key={parrafo} className={CLASE_PARRAFO}>
            {parrafo}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Un elemento de lista del documento, preparado para pintarse suelto —en las
 * pestañas y el acordeón de «¿Qué puede incluir un programa?»—: mayúscula
 * inicial y sin la puntuación final («;», «.»). Cada elemento se lee aparte y
 * el punto y coma de la enumeración corrida sobra. El
 * dato conserva el texto del documento; esto es solo presentación. Las listas
 * corridas de las tarjetas no pasan por aquí y mantienen su puntuación.
 */
function paraRejilla(texto: string): string {
  const limpio = texto.replace(/[;.,]\s*$/, "");
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

/**
 * Rejilla de tarjetas de tres: una columna en móvil, tres desde lg.
 *
 * items-start: cada tarjeta mide lo que pide su contenido, sin estirarse a la
 * más alta de la fila.
 *
 * El filete superior y las viñetas van en lavanda, el color del cuadrante
 * «¿Cómo lo hago?» al que pertenece el servicio, igual que en la rueda y en
 * /servicio/. El magenta queda para los botones.
 */
function Tarjetas({
  tarjetas,
  fondo,
}: {
  tarjetas: TarjetaUniversidad[];
  fondo: "bg-white" | "bg-off-white";
}) {
  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
      {tarjetas.map((tarjeta) => (
        <article
          key={tarjeta.titulo}
          className={`rounded border-t-2 border-lavanda ${fondo} p-8`}
        >
          {/* Navy sobre lavanda al 15 % y no texto lavanda: a este cuerpo el
              lavanda sobre blanco no llega al contraste mínimo. */}
          {tarjeta.rotulo ? (
            <p className="font-head mb-3 inline-block rounded-full bg-lavanda/15 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.08em] text-navy uppercase">
              {tarjeta.rotulo}
            </p>
          ) : null}
          <h3 className="font-head text-[1.15rem] font-semibold text-navy">
            {tarjeta.titulo}
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {tarjeta.parrafos.map((parrafo) => (
              <p key={parrafo} className="font-body text-ink-soft">
                {parrafo}
              </p>
            ))}
          </div>
          {tarjeta.lista ? (
            <>
              <p className="font-body mt-3 text-ink-soft">
                {tarjeta.lista.intro}
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {tarjeta.lista.elementos.map((elemento) => (
                  <li
                    key={elemento.texto}
                    className="font-body flex gap-3 text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-lavanda"
                    />
                    <span>
                      {elemento.etiqueta ? (
                        <strong className="font-semibold text-navy">
                          {elemento.etiqueta}
                        </strong>
                      ) : null}{" "}
                      {elemento.texto}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default function UniversidadResponsablePage() {
  const {
    hero,
    apertura,
    contenidoBase,
    audiencias,
    paraQueSirve,
    programa,
    practica,
    proceso,
    faq,
    cta,
  } = UNIVERSIDAD;

  const gruposPrograma = programa.grupos.map((grupo) => ({
    titulo: grupo.titulo,
    elementos: grupo.elementos.map(paraRejilla),
  }));

  const testimonios = testimoniosDe(UNIVERSIDAD.slug);
  const anclas = [
    ...ANCLAS_ANTES,
    ...(testimonios.length > 0
      ? [{ label: "Testimonios", href: "#testimonios" }]
      : []),
    ANCLA_FAQ,
  ];

  const preguntas: FaqItem[] = faq.map((item) => ({
    question: item.pregunta,
    answer:
      item.respuesta.length === 1
        ? item.respuesta[0]
        : { paragraphs: item.respuesta },
  }));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: UNIVERSIDAD.servicio,
    name: hero.titulo,
    description: UNIVERSIDAD.seo.descripcion,
    url: `${BASE}${CANONICAL}`,
    provider: {
      "@type": "Organization",
      name: "ResponSable",
      url: `${BASE}/`,
    },
    /* Mismo valor que las demás páginas de servicio. */
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
        name: "Universidad ResponSable",
        item: `${BASE}${CANONICAL}`,
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

      <SiteHeader />
      <BarraAnclas anclas={anclas} />

      <main id="main">
        {/* ------------------------------- HERO ------------------------------- */}
        <HeroFramed
          videoSrc={VIDEO_HERO}
          videoPoster={POSTER_HERO}
          contenido="centrado"
          altoTarjeta="contenido"
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
                  Universidad ResponSable
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="font-head mt-5 max-w-3xl text-[clamp(2rem,4vw,2.75rem)] font-semibold text-white">
            {hero.titulo}
          </h1>
          <p className="font-body mt-4 max-w-2xl text-[1.1rem] text-white/90">
            {hero.subtitulo}
          </p>
          <p className="font-body mt-4 max-w-[58ch] text-white/80">
            {hero.entradilla}
          </p>

          {/* Un solo botón: sin «Ver el proceso», que ya cubre la barra de
              anclas y le restaba fuerza al principal. */}
          <div className="mt-8">
            <ContactButton variant="primary">{hero.boton}</ContactButton>
          </div>
        </HeroFramed>

        {/* ------------------------------ APERTURA ----------------------------- */}
        <section
          aria-labelledby="apertura-title"
          className="py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <BloqueDosColumnas
              id="apertura"
              titulo={apertura.titulo}
              parrafos={apertura.parrafos}
            />
          </div>
        </section>

        {/* --------------------------- CONTENIDO BASE -------------------------- */}
        <section
          id="contenido"
          aria-labelledby="contenido-title"
          /* scroll-mt-36: mismo margen que las secciones con ancla de la
             plantilla dinámica, para que el header y la barra no las tapen. */
          className="scroll-mt-36 bg-off-white py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <h2 id="contenido-title" className={CLASE_H2}>
              {contenidoBase.titulo}
            </h2>
            <p className={`${CLASE_PARRAFO} mt-4 max-w-[717px]`}>
              {contenidoBase.intro}
            </p>
            <Tarjetas tarjetas={contenidoBase.tarjetas} fondo="bg-white" />
            <InfografiaResilio {...UNIVERSIDAD.resilio} />
          </div>
        </section>

        {/* ----------------------------- AUDIENCIAS ---------------------------- */}
        <section
          id="a-quien"
          aria-labelledby="a-quien-title"
          className="scroll-mt-36 py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <h2 id="a-quien-title" className={CLASE_H2}>
              {audiencias.titulo}
            </h2>
            <Tarjetas tarjetas={audiencias.tarjetas} fondo="bg-off-white" />
          </div>
        </section>

        {/* --------------------------- PARA QUÉ SIRVE -------------------------- */}
        <section
          id="para-que-sirve"
          aria-labelledby="para-que-sirve-title"
          /* Fondo lavanda suave: la sección de la página que más se asocia al
             cuadrante, y la que rompe la alternancia blanco/off-white. */
          className="scroll-mt-36 bg-lavanda/10 py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <h2 id="para-que-sirve-title" className={CLASE_H2}>
              {paraQueSirve.titulo}
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paraQueSirve.usos.map((uso) => (
                <li
                  key={uso.titulo}
                  className="rounded border-t-2 border-lavanda bg-white p-8"
                >
                  {ICONOS_USOS[uso.icono]("size-7 text-lavanda")}
                  <h3 className="font-head mt-4 text-[1.15rem] font-semibold text-navy">
                    {uso.titulo}
                  </h3>
                  <p className="font-body mt-3 text-ink-soft">{uso.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------ PROGRAMA ----------------------------- */}
        <section
          aria-labelledby="programa-title"
          className="py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            {/*
              Dos columnas desde lg: texto a la izquierda, pestañas verticales
              a la derecha. Por debajo de lg la derecha no deja sitio a lista y
              panel lado a lado (unos 380px a 768px), así que el texto va arriba
              y los mismos grupos bajan como acordeón, con el primero abierto
              como la primera pestaña. Solo uno de los dos se muestra en cada
              ancho; el oculto queda en display:none, fuera también del árbol
              de accesibilidad.
            */}
            <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              <div>
                <h2 id="programa-title" className={CLASE_H2}>
                  {programa.titulo}
                </h2>
                <p className={`${CLASE_PARRAFO} mt-4`}>{programa.intro}</p>
                <p className={`${CLASE_PARRAFO} mt-4`}>{programa.cierre}</p>
              </div>

              <div>
                <div className="max-lg:hidden">
                  <PestanasVerticales grupos={gruposPrograma} />
                </div>
                <div className="lg:hidden">
                  <Faq
                    items={gruposPrograma.map((grupo) => ({
                      question: grupo.titulo,
                      answer: grupo.elementos,
                    }))}
                    abiertoInicial={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------ PRÁCTICA ----------------------------- */}
        <section
          aria-labelledby="practica-title"
          className="bg-off-white py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <BloqueDosColumnas
              id="practica"
              titulo={practica.titulo}
              parrafos={practica.parrafos}
            />
          </div>
        </section>

        {/* ------------------------------ PROCESO ------------------------------ */}
        <section
          id="como-funciona"
          aria-labelledby="como-funciona-title"
          className="scroll-mt-36 bg-navy py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <h2
              id="como-funciona-title"
              className="font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-magenta"
            >
              {proceso.titulo}
            </h2>

            <ProcesoPasos pasos={proceso.pasos} />

            <p className="font-body mt-8 max-w-[717px] text-white/85">
              {proceso.cierre}
            </p>
          </div>
        </section>

        {/* ---------------------------- TESTIMONIOS ---------------------------- */}
        {/* Vacía hasta que el cliente mande testimonios de capacitación: sin
            entrada en testimonios.ts no se pinta ni la sección ni su ancla. */}
        <TestimoniosServicio
          testimonios={testimonios}
          titulo={UNIVERSIDAD.testimoniosTitulo}
        />

        {/* -------------------------------- FAQ -------------------------------- */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="scroll-mt-36 bg-off-white py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
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
              <Faq items={preguntas} />
            </div>
          </div>
        </section>

        {/* ------------------------------- CIFRAS ------------------------------ */}
        {/* Refuerzo antes del cierre, en lugar de la banda de logos: el
            documento no nombra clientes. Mismo tratamiento que la banda de
            cifras de Nosotros, con el acento lavanda de la página. */}
        <section
          aria-label="ResponSable en cifras"
          className="py-[var(--section-y)]"
        >
          <div className={CONTENEDOR}>
            <dl className="mx-auto grid max-w-3xl gap-10 text-center sm:grid-cols-2 sm:gap-0">
              {UNIVERSIDAD.cifras.map((cifra) => (
                <div
                  key={cifra.valor}
                  /* flex-col-reverse: la etiqueta va antes en el DOM, como
                     pide <dt>/<dd>, y la cifra se pinta encima. */
                  className="flex flex-col-reverse border-lavanda/40 px-6 not-first:sm:border-l"
                >
                  <dt className="font-body mt-3 text-ink-soft">
                    {cifra.etiqueta}
                  </dt>
                  <dd className="font-head text-[clamp(2.6rem,7vw,3.8rem)] leading-none font-semibold text-navy">
                    {cifra.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------ BANDA CTA ---------------------------- */}
        {/* pb-[var(--section-y)]: en las demás páginas de servicio la
            separación entre esta banda y el footer la da la sección «Servicios
            relacionados», que esta página no tiene. QUITAR cuando se resuelva
            «Servicios relacionados» para esta página y Doble Materialidad. */}
        <section id="contacto" className="px-4 pb-[var(--section-y)] sm:px-7">
          <div className="rounded-[22px] bg-magenta py-[var(--section-y)]">
            <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-8 px-[clamp(1rem,4vw,2rem)]">
              <div className="max-w-2xl">
                <h2 className="font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-white">
                  {cta.titulo}
                </h2>
                {cta.parrafos.map((parrafo) => (
                  <p key={parrafo} className="font-body mt-3 text-white/90">
                    {parrafo}
                  </p>
                ))}
              </div>
              <ContactButton variant="dark">{cta.boton}</ContactButton>
            </div>
          </div>
        </section>
      </main>

      <ServicioFooter />
    </>
  );
}
