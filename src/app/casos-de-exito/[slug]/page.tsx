import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaContacto } from "@/components/cta-contacto";
import { CasoCard } from "@/components/casos/caso-card";
import { VideoYoutube } from "@/components/video-youtube";
import { CASOS, getCaso, rutaDeServicio } from "@/lib/casos";

export function generateStaticParams() {
  return CASOS.map((caso) => ({ slug: caso.slug }));
}

export async function generateMetadata(
  props: PageProps<"/casos-de-exito/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const caso = getCaso(slug);
  if (!caso) return {};

  const canonical = `/casos-de-exito/${caso.slug}/`;
  const descripcion = `Caso de éxito de ${caso.cliente}: el reto, el trabajo realizado y los resultados obtenidos con el acompañamiento de ResponSable.`;

  return {
    // Sin sufijo de marca: lo añade el template del layout raíz.
    title: `Caso de éxito: ${caso.cliente}`,
    description: descripcion,
    alternates: { canonical },
    /*
      NOINDEX PROVISIONAL: el contenido de este caso es marcador de posición sin
      validar por el cliente. Retirar cuando se sustituya por el definitivo, y
      añadir entonces la ruta al sitemap.
    */
    robots: { index: false, follow: false },
    openGraph: {
      type: "article",
      siteName: "ResponSable",
      // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
      title: `Caso de éxito: ${caso.cliente} | ResponSable`,
      description: descripcion,
      url: canonical,
      locale: "es_ES",
      images: caso.imagen
        ? [
            {
              url: caso.imagen.src,
              width: caso.imagen.w,
              height: caso.imagen.h,
            },
          ]
        : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CasoPage(
  props: PageProps<"/casos-de-exito/[slug]">,
) {
  const { slug } = await props.params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  const otros = CASOS.filter((c) => c.slug !== caso.slug).slice(0, 3);

  const CASE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Caso de éxito: ${caso.cliente}`,
    about: { "@type": "Organization", name: caso.cliente },
    author: {
      "@type": "Organization",
      name: "ResponSable",
      url: "https://responsable.net/",
    },
    publisher: {
      "@type": "Organization",
      name: "ResponSable",
      url: "https://responsable.net/",
    },
    mainEntityOfPage: `https://responsable.net/casos-de-exito/${caso.slug}/`,
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
        name: "Casos de Éxito",
        item: "https://responsable.net/casos-de-exito/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: caso.cliente,
        item: `https://responsable.net/casos-de-exito/${caso.slug}/`,
      },
    ],
  };

  const SECCIONES = [
    { id: "reto", titulo: "El reto", texto: caso.reto },
    { id: "solucion", titulo: "La solución", texto: caso.solucion },
    { id: "resultados", titulo: "Los resultados", texto: caso.resultados },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CASE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />

      <SiteHeader />

      <main id="main" className="flex-1">
        {/*
          Hero navy con la imagen destacada de fondo cuando exista. Hoy ninguno
          de los cinco casos la tiene, así que se sirve el navy sólido: es el
          mismo degradado de respaldo que usan las tarjetas, sin capa extra.
        */}
        <div className="relative overflow-hidden border-b-4 border-magenta bg-navy px-6 py-[var(--section-y)]">
          {caso.imagen ? (
            <>
              <Image
                src={caso.imagen.src}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-navy-90" />
            </>
          ) : null}

          <div className="relative mx-auto max-w-[var(--container)]">
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              {caso.sector}
            </p>
            <h1 className="font-head mt-3 text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-white">
              {caso.cliente}
            </h1>
            <p className="font-body mt-5 max-w-[62ch] text-[1.15rem] text-white/80">
              {caso.resumen}
            </p>
          </div>
        </div>

        <div className="border-b border-border bg-off-white">
          <nav
            aria-label="Ruta de navegación"
            className="mx-auto max-w-[var(--container)] px-6 py-3"
          >
            <ol className="font-body flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-navy">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/casos-de-exito/" className="hover:text-navy">
                  Casos de Éxito
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-navy">
                  {caso.cliente}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Métricas: las cifras van a la escala de un titular porque son el
            argumento del caso, no un dato al pie. */}
        <section
          aria-label="Resultados en cifras"
          className="px-6 pt-[var(--section-y)]"
        >
          <div className="mx-auto grid max-w-[var(--container)] gap-6 sm:grid-cols-3">
            {caso.metricas.map((metrica) => (
              <div
                key={metrica.etiqueta}
                className="rounded border border-border bg-white p-6 shadow-sm"
              >
                <p className="font-head text-[clamp(2.4rem,6vw,3.4rem)] leading-none font-semibold text-magenta">
                  {metrica.valor}
                </p>
                <p className="font-body mt-3 text-sm text-ink-soft">
                  {metrica.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="px-6 py-[var(--section-y)]">
          <div className="mx-auto flex max-w-[var(--container)] flex-col gap-12 lg:flex-row lg:gap-16">
            <div className="max-w-[68ch] lg:flex-1">
              {/* Descripción completa, sin truncar: el recorte del carrusel es
                  solo de presentación. */}
              <p className="font-body text-[1.15rem] text-ink-soft">
                {caso.descripcion}
              </p>

              {/*
                El testimonio abre el cuerpo, entre la descripción y el relato
                de Reto/Solución/Resultados. Va aquí y no en una banda a ancho
                de contenedor porque a 1120px un 16:9 mide 630px de alto y se
                comería la página; dentro de la columna de texto mide 383px,
                que es una escala de protagonista sin ser una portada.

                Y va antes del relato, no después: es lo único visual de la
                página —ninguno de los cinco casos tiene imagen— y el cuerpo
                arrancaba con tres bloques seguidos de texto corrido. Además la
                voz del cliente respalda el caso antes de contarlo, no al final.

                El encabezado va a la escala de los otros tres y con su misma
                fórmula («El reto», «La solución»…), para que los cuatro se
                lean como el mismo nivel de la jerarquía.
              */}
              <section className="mt-10">
                <h2 className="font-head text-[clamp(1.5rem,3.5vw,2.1rem)] font-semibold text-navy">
                  El testimonio
                </h2>
                <VideoYoutube
                  id={caso.videoYoutube}
                  titulo={`Testimonio de ${caso.cliente}`}
                  sizes="(min-width: 1024px) 680px, 100vw"
                  className="mt-4"
                />
              </section>

              {SECCIONES.map((seccion) => (
                <section key={seccion.id} className="mt-10">
                  <h2 className="font-head text-[clamp(1.5rem,3.5vw,2.1rem)] font-semibold text-navy">
                    {seccion.titulo}
                  </h2>
                  <p className="font-body mt-4 text-[1.05rem] text-ink-soft">
                    {seccion.texto}
                  </p>
                </section>
              ))}
            </div>

            <aside className="lg:w-72 lg:shrink-0">
              <h2 className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                Servicios aplicados
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {caso.serviciosAplicados.map((nombre) => {
                  const ruta = rutaDeServicio(nombre);
                  return (
                    <li
                      key={nombre}
                      className="rounded-sm border border-border bg-white px-4 py-3"
                    >
                      {/* Solo se enlaza cuando el servicio tiene página propia;
                          hoy la tiene uno de los veinticinco. */}
                      {ruta ? (
                        <Link
                          href={ruta}
                          className="font-body text-sm font-medium text-magenta"
                        >
                          {nombre} →
                        </Link>
                      ) : (
                        <span className="font-body text-sm text-ink">
                          {nombre}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </div>

        <CtaContacto />

        <section className="bg-off-white px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <h2 className="font-head text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-navy">
              Otros casos
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otros.map((c, i) => (
                <CasoCard key={c.slug} caso={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
