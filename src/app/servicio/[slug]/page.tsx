import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { BarraAnclas } from "@/components/servicio/barra-anclas";
import { TestimoniosServicio } from "@/components/servicio/testimonios-servicio";
import { testimoniosDe } from "@/lib/testimonios";
import { ServicioFooter } from "@/components/servicio/servicio-footer";
import { HeroFramed } from "@/components/hero-framed";
import { POSTER_HERO, VIDEO_HERO } from "@/lib/video-hero";
import { ContactButton } from "@/components/contact-button";
import { Faq, FaqJsonLd, type FaqItem } from "@/components/faq";
import { FAQ_INTROS } from "@/lib/faq-intros";
import { RelatedCard } from "@/components/related-card";
import { ProcesoPasos } from "@/components/servicio/proceso-pasos";
import {
  CONTENIDO_SERVICIOS,
  getContenidoServicio,
  type BloqueServicio,
  type ContenidoServicio,
} from "@/lib/contenido-servicios";
import { AREA_SERVIDA, ORG_REF } from "@/lib/schema-organizacion";

/*
  Las diez páginas de servicio con contenido validado, sobre una sola ruta
  dinámica. Estudio de Doble Materialidad se queda fuera a propósito: tiene ruta
  estática propia en ../estudio-doble-materialidad/, y un segmento estático gana
  siempre al dinámico, así que las dos conviven sin pelearse. Tampoco está en
  CONTENIDO_SERVICIOS, de modo que generateStaticParams no puede duplicarla.

  El tratamiento visual replica el de esa página —hero enmarcado con video,
  anclas contextuales en el header, secciones alternando blanco y off-white,
  proceso en tarjeta, FAQ en acordeón y banda CTA magenta—, pero resuelve dos
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
      locale: "es_MX",
    },
    twitter: { card: "summary_large_image" },
  };
}

/* Los anclajes se componen en el render y no como una constante única: el de
   Testimonios solo entra si esa página tiene testimonios, para no dejar un
   enlace apuntando a un id que no existe. */
const ANCLAS_ANTES = [
  { label: "Para qué sirve", href: "#para-que-sirve" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "El proceso", href: "#proceso" },
];
const ANCLAS_FAQ = { label: "Preguntas frecuentes", href: "#faq" };

/* Servicios cuya entradilla del hero se abre a 4xl (unos 100 caracteres por
   línea) en vez de los 58ch generales. Solo para entradillas largas, donde la
   columna estrecha las alargaba hasta siete líneas. Opt-in por slug. */
const ENTRADILLA_ANCHA = new Set([
  "estrategia-de-comunicacion-en-sostenibilidad",
]);

/* Servicios con más aire vertical en el hero, arriba del breadcrumb y debajo
   de los botones. Se añade desde aquí y no en HeroFramed, que comparten todas
   las páginas con hero. Opt-in por slug. */
const HERO_AMPLIO = new Set(["estrategia-de-comunicacion-en-sostenibilidad"]);

/* Servicios con margen blanco también arriba y abajo de la banda CTA magenta,
   no solo a los lados: la banda deja de tocar las secciones vecinas y queda
   enmarcada como la tarjeta del hero, con el mismo margen. Opt-in por slug. */
const CTA_CON_MARGEN = new Set([
  "estrategia-de-comunicacion-en-sostenibilidad",
]);

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
    (salto) =>
      CONTENIDO_SERVICIOS[(actual + salto) % CONTENIDO_SERVICIOS.length],
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
  sobreNavy = false,
  infografia,
  apilado = false,
}: {
  bloque: BloqueServicio;
  colorEtiqueta: "magenta" | "teal";
  id: string;
  /** Título y párrafos en claro, para secciones con fondo navy. */
  sobreNavy?: boolean;
  /**
   * Infografía (SVG en línea o imagen JPG). Con ella el bloque pasa a dos
   * columnas desde lg —infografía a la izquierda, y a la derecha etiqueta,
   * título y párrafos apilados— en vez de título a la izquierda y párrafos a
   * la derecha.
   */
  infografia?: Infografia;
  /** Uso interno: etiqueta, título y párrafos en una sola columna. */
  apilado?: boolean;
}) {
  const tituloId = `${id}-title`;

  if (infografia) {
    return (
      <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
        {/*
          Misma caja para los dos formatos: gris claro, esquinas redondeadas;
          por debajo de lg se apila, topada a 520px y centrada.

          El SVG va incrustado en línea, como el de Doble Materialidad:
          conserva su <title>/<desc> como nombre accesible y puede usar la
          Poppins de la página. El JPG pasa por next/image con sus dimensiones
          reales, así que no hay salto de layout al cargar.
        */}
        {infografia.tipo === "svg" ? (
          <div
            className={`${CAJA_INFOGRAFIA} [&_svg]:block [&_svg]:h-auto [&_svg]:w-full`}
            dangerouslySetInnerHTML={{ __html: infografia.svg }}
          />
        ) : (
          <div className={CAJA_INFOGRAFIA}>
            <Image
              src={infografia.src}
              width={infografia.ancho}
              height={infografia.alto}
              alt={infografia.alt}
              sizes="(min-width: 1024px) 540px, (min-width: 560px) 520px, 100vw"
              className="block h-auto w-full"
            />
          </div>
        )}
        <BloqueTexto
          bloque={bloque}
          colorEtiqueta={colorEtiqueta}
          id={id}
          sobreNavy={sobreNavy}
          apilado
        />
      </div>
    );
  }

  return (
    <div
      className={
        apilado
          ? "flex flex-col gap-4"
          : "grid gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
      }
    >
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
          className={`font-head mt-3 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold ${
            sobreNavy ? "text-white" : "text-navy"
          }`}
        >
          {bloque.titulo}
        </h2>
      </div>

      {/*
        717px = 68 caracteres a los 16.8px del párrafo. 68 es la medida de
        lectura única del sitio: la misma que usa el cuerpo de los artículos,
        para que las dos superficies de texto largo lean igual.

        En px y no en ch a propósito: el tope tiene que vivir en este
        contenedor —también acota la tabla opcional de más abajo—, y el
        contenedor hereda los 16px del cuerpo mientras el texto se pinta a
        text-[1.05rem]. Cuando el texto iba a 1.15rem, el `max-w-[62ch]` que
        había daba 623px, o sea 54 caracteres reales y no los 62 que
        anunciaba. El número de una clase en
        ch solo dice la verdad si el elemento que la lleva tiene el tamaño de
        letra del texto que mide.
      */}
      <div className="flex max-w-[717px] flex-col gap-4">
        {bloque.descripcion.map((parrafo) => (
          <p
            key={parrafo}
            className={`font-body text-[1.05rem] ${
              sobreNavy ? "text-white/85" : "text-ink-soft"
            }`}
          >
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
                <dd className="font-body mt-1 text-ink-soft sm:mt-0">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

type Infografia =
  | { tipo: "svg"; svg: string }
  | { tipo: "imagen"; src: string; ancho: number; alto: number; alt: string };

/* Texto alternativo de las infografías en imagen, por slug. El SVG no lo
   necesita: lleva su propio <title>. Sin entrada, se usa un genérico con el
   título de la sección. */
const ALT_INFOGRAFIA: Record<string, string> = {
  "estrategia-de-comunicacion-en-sostenibilidad":
    "Infografía de las 7 estrategias para una comunicación efectiva sobre sostenibilidad",
};

const CAJA_INFOGRAFIA =
  "mx-auto w-full max-w-[520px] overflow-hidden rounded bg-off-white lg:max-w-none";

/**
 * Ancho y alto de un JPEG, leídos de su marcador SOF. next/image los necesita
 * para reservar el hueco, y así no hace falta declararlos a mano cada vez que
 * se cambie el archivo.
 */
function medidasJpeg(datos: Buffer): { ancho: number; alto: number } | null {
  let i = 2;
  while (i + 9 < datos.length) {
    if (datos[i] !== 0xff) return null;
    const marcador = datos[i + 1];
    // SOF0–SOF15, salvo DHT (C4), JPG (C8) y DAC (CC), que no son marcos.
    if (
      marcador >= 0xc0 &&
      marcador <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marcador)
    ) {
      return {
        alto: datos.readUInt16BE(i + 5),
        ancho: datos.readUInt16BE(i + 7),
      };
    }
    i += 2 + datos.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * Infografía de la sección Beneficios, si el servicio la tiene en
 * public/servicios/<slug>/ como infografia.svg, .jpg o .jpeg (por ese orden de
 * preferencia). Mismo patrón y misma ruta que Doble Materialidad: el archivo es
 * la fuente única. El SVG se inserta tal cual, salvo la declaración <?xml ?>,
 * que no es válida dentro de HTML.
 *
 * Basta con subir el archivo para que la sección pase a dos columnas; sin él
 * la sección conserva su layout. Las páginas son estáticas, así que en
 * producción el cambio entra con el siguiente build.
 */
function infografiaDe(
  slug: string,
  tituloSeccion: string,
): Infografia | undefined {
  const carpeta = path.join(process.cwd(), "public/servicios", slug);

  const svg = path.join(carpeta, "infografia.svg");
  if (existsSync(svg)) {
    return {
      tipo: "svg",
      svg: readFileSync(svg, "utf8").replace(/^<\?xml[^>]*\?>\s*/, ""),
    };
  }

  for (const extension of ["jpg", "jpeg"]) {
    const archivo = path.join(carpeta, `infografia.${extension}`);
    if (!existsSync(archivo)) continue;
    const medidas = medidasJpeg(readFileSync(archivo));
    if (!medidas) continue;
    return {
      tipo: "imagen",
      src: `/servicios/${slug}/infografia.${extension}`,
      alt: ALT_INFOGRAFIA[slug] ?? `Infografía: ${tituloSeccion}`,
      ...medidas,
    };
  }

  return undefined;
}

export default async function ServicioPage(
  props: PageProps<"/servicio/[slug]">,
) {
  const { slug } = await props.params;
  const contenido = getContenidoServicio(slug);
  if (!contenido) notFound();

  const { hero, paraQueSirve, beneficios, proceso, faq, cta } = contenido;
  const testimonios = testimoniosDe(contenido.slug);
  const anclas = [
    ...ANCLAS_ANTES,
    ...(testimonios.length > 0
      ? [{ label: "Testimonios", href: "#testimonios" }]
      : []),
    ANCLAS_FAQ,
  ];
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
  const heroAmplio = HERO_AMPLIO.has(contenido.slug);
  const ctaConMargen = CTA_CON_MARGEN.has(contenido.slug);

  const preguntas: FaqItem[] = faq.map((item) => ({
    question: item.pregunta,
    /* Respuestas que el documento escribe como opciones con etiqueta van en
       lista; el resto, como el texto corrido de siempre. */
    answer: item.lista
      ? {
          options: item.lista.map((opcion) => ({
            label: opcion.etiqueta,
            text: opcion.texto,
          })),
        }
      : item.respuesta,
  }));
  const introFaq = FAQ_INTROS[contenido.slug];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: contenido.servicio,
    name: hero.titulo,
    description: descripcion,
    url: canonical,
    provider: ORG_REF,
    /* México y Latinoamérica, como el resto del sitio y el Organization. */
    areaServed: AREA_SERVIDA,
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
          altoTarjeta="contenido"
        >
          {heroAmplio ? (
            <div aria-hidden="true" className="h-6 sm:h-10" />
          ) : null}
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
          <p className="font-body mt-4 max-w-2xl text-[1.1rem] text-white/90">
            {hero.subtitulo}
          </p>
          <p
            className={`font-body mt-4 text-white/80 ${
              ENTRADILLA_ANCHA.has(contenido.slug)
                ? "max-w-4xl"
                : "max-w-[58ch]"
            }`}
          >
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

          {/* Reserva dentro de la tarjeta navy la franja que ocupan las
              tarjetas de puntos al subir sobre su borde (ver CLAVES): sin ella
              taparían los botones. Mismo 4rem que el solape de abajo; con
              heroAmplio se suma el mismo aire extra que arriba. */}
          <div
            aria-hidden="true"
            className={heroAmplio ? "h-22 sm:h-26" : "h-16"}
          />
        </HeroFramed>

        {/* ------------------------------- CLAVES ------------------------------ */}
        {/*
          Los cuatro puntos descriptivos del documento, cada uno en su tarjeta,
          más el resto de la descripción general cuando la hay. Son cuatro en
          los diez servicios, así que la retícula de cuatro columnas siempre
          cierra.

          Las tarjetas van primero y suben sobre el hero: el -mt descuenta el
          margen inferior de la sección del hero (p-4 / sm:p-7) más 4rem de
          solape, que es lo que queda sobre el navy. z-30 porque el contenido
          del hero va en z-20 dentro de una tarjeta sin contexto de
          apilamiento propio. Mismo criterio que las tarjetas de beneficios de
          Doble Materialidad (rounded, p-6, sombra y elevación al hover), pero
          en blanco: navy sobre el navy del hero perdería la mitad superior.

          Sin padding vertical: arriba lo pone el solape, y abajo Para qué
          sirve, que tampoco lleva fondo, ya separa con su propio padding; un
          --section-y aquí dejaba el hueco doble.
        */}
        <section aria-labelledby="claves-title">
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <h2 id="claves-title" className="sr-only">
              En qué consiste el servicio
            </h2>

            <ul className="relative z-30 -mt-20 grid gap-6 sm:-mt-[5.75rem] sm:grid-cols-2 lg:grid-cols-4">
              {hero.puntos.map((punto) => (
                <li
                  key={punto}
                  className="rounded bg-white p-6 shadow transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="font-head text-[0.95rem] font-medium text-navy">
                    {punto}
                  </p>
                </li>
              ))}
            </ul>

            {/* 717px = 68 caracteres a los 16.8px de estos párrafos, el mismo
                tope que BloqueTexto más abajo. Ver §2 de globals.css. */}
            {restoDescripcion.length > 0 ? (
              <div className="mt-12 flex max-w-[717px] flex-col gap-4">
                {restoDescripcion.map((parrafo) => (
                  <p
                    key={parrafo}
                    className="font-body text-[1.05rem] text-ink-soft"
                  >
                    {parrafo}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* --------------------------- PARA QUÉ SIRVE -------------------------- */}
        <section
          id="para-que-sirve"
          aria-labelledby="para-que-sirve-title"
          /* scroll-mt-36 (9rem = 144px): el aterrizaje por hash desde otra
             página, y el salto nativo sin JS, no pasan por irAAncla y no miden
             nada, así que el margen tiene que estar en la sección. 144px cubre
             el header (80px desde lg), los 12px de separación y los 48px de la
             barra de anclajes. Mismo valor que las secciones de /servicio/, que
             resuelven el mismo solapamiento. */
          /* Fondos: Para qué sirve sin fondo, Beneficios en navy y Proceso en
             off-white con su tarjeta blanca. Es el orden de la sección previa
             a Proceso en navy que se repite en Doble Materialidad y en
             Universidad ResponSable. */
          className="scroll-mt-36 py-[var(--section-y)]"
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
          /* Ver la nota de scroll-mt en la primera sección con ancla. */
          className="scroll-mt-36 bg-navy py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            <BloqueTexto
              bloque={beneficios}
              colorEtiqueta="teal"
              id="beneficios"
              sobreNavy
              infografia={infografiaDe(contenido.slug, beneficios.titulo)}
            />
          </div>
        </section>

        {/* ------------------------------ PROCESO ------------------------------ */}
        <section
          id="proceso"
          aria-labelledby="proceso-title"
          /* Ver la nota de scroll-mt en la primera sección con ancla. */
          className="scroll-mt-36 bg-off-white py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
            {/* Título, entradilla y pasos en una sola tarjeta. Rejilla hasta
                cuatro pasos, pista deslizable a partir de cinco: la decisión y
                las dos disposiciones viven en el componente. */}
            <ProcesoPasos
              pasos={proceso.pasos}
              controlesAbajo
              encabezado={
                <>
                  <h2
                    id="proceso-title"
                    className="font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-magenta"
                  >
                    Nuestro Proceso
                  </h2>
                  <p className="font-body mt-6 max-w-[62%] min-w-[18rem] text-ink-soft">
                    {proceso.descripcion}
                  </p>
                </>
              }
            />
          </div>
        </section>

        {/* ---------------------------- TESTIMONIOS ---------------------------- */}
        <TestimoniosServicio testimonios={testimonios} />

        {/* -------------------------------- FAQ -------------------------------- */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          /* Ver la nota de scroll-mt en la primera sección con ancla. */
          /* Con testimonios delante —que van en blanco— la sección pasa a
             off-white con tarjetas blancas, para no repetir fondo; sin ellos
             la precede Proceso, en off-white, y se queda en blanco. */
          className={`scroll-mt-36 py-[var(--section-y)] ${
            testimonios.length > 0 ? "bg-off-white" : "bg-white"
          }`}
        >
          {/* Dos columnas desde lg, el mismo layout que Doble Materialidad:
              presentación a la izquierda, acordeón a la derecha. */}
          <div className="mx-auto grid max-w-[var(--container)] gap-[clamp(2rem,5vw,4rem)] px-[clamp(1rem,4vw,2rem)] lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <div>
              <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
                Dudas habituales
              </p>
              <h2
                id="faq-title"
                className="font-head mt-3 text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-navy"
              >
                Preguntas frecuentes
              </h2>
              {/* Redacción nuestra, no viene del documento. Pendiente de
                  validar: ver src/lib/faq-intros.ts. */}
              {introFaq ? (
                <p className="font-body mt-4 text-[1.05rem] text-ink-soft">
                  {introFaq.texto}
                </p>
              ) : null}
            </div>

            <div>
              <Faq
                items={preguntas}
                fondoTarjeta={
                  testimonios.length > 0 ? "bg-white" : "bg-off-white"
                }
              />
            </div>
          </div>
        </section>

        {/* ------------------------------ BANDA CTA ---------------------------- */}
        <section
          id="contacto"
          className={ctaConMargen ? "bg-white p-4 sm:p-7" : "px-4 sm:px-7"}
        >
          <div className="rounded-[22px] bg-magenta py-[var(--section-y)]">
            <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-8 px-[clamp(1rem,4vw,2rem)]">
              <div className="max-w-2xl">
                <h2 className="font-head text-[clamp(1.6rem,3.5vw,2.05rem)] font-semibold text-white">
                  {cta.subtitulo}
                </h2>
                <p className="font-body mt-3 text-white/90">
                  {cta.descripcion}
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
