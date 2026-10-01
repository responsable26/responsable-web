import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticuloBody } from "@/components/articulos/articulo-body";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import { TablaContenidos } from "@/components/articulos/tabla-contenidos";
import { CtaArticulo } from "@/components/articulos/cta-articulo";
import {
  ARTICULOS,
  formatFecha,
  getArticuloMeta,
  type ArticuloMeta,
} from "@/lib/articulos";
import { categoriaDe } from "@/lib/categorias-articulos";
import { getArticuloBlocks } from "@/lib/articulos-content";
import { prepararIndice } from "@/lib/indice-articulo";
import { ORG_REF } from "@/lib/schema-organizacion";

/**
 * Los tres artículos de "Otros artículos".
 *
 * Primero los de la misma categoría, del más reciente al más antiguo; si no
 * llegan a tres, se completa con los más recientes del blog. Los de "Archivo"
 * (noticias de 2012 a 2020) solo aparecen como relacionados de otro artículo
 * de "Archivo", nunca en los de las demás categorías. Se resuelve al generar
 * la página, así que los enlaces van en el HTML servido.
 */
function relacionadosDe(actual: ArticuloMeta): ArticuloMeta[] {
  const categoria = categoriaDe(actual.slug).id;
  const candidatos = [...ARTICULOS]
    .filter((a) => a.slug !== actual.slug)
    .filter(
      (a) => categoria === "archivo" || categoriaDe(a.slug).id !== "archivo",
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const mismaCategoria = candidatos.filter(
    (a) => categoriaDe(a.slug).id === categoria,
  );
  const resto = candidatos.filter((a) => categoriaDe(a.slug).id !== categoria);
  return [...mismaCategoria, ...resto].slice(0, 3);
}

export function generateStaticParams() {
  return ARTICULOS.map((articulo) => ({ slug: articulo.slug }));
}

export async function generateMetadata(
  props: PageProps<"/recursos/articulos/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const articulo = getArticuloMeta(slug);
  if (!articulo) return {};

  const canonical = `/recursos/articulos/${articulo.slug}/`;
  return {
    // Sin sufijo de marca: lo añade el template del layout raíz. El título
    // SEO, más corto, solo se usa aquí; og:title y el resto de la página
    // siguen con el título visible.
    title: articulo.tituloSeo ?? articulo.titulo,
    description: articulo.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      siteName: "ResponSable",
      // El openGraph sí lleva el sufijo completo: el template del layout raíz
      // solo alcanza a metadata.title, no a openGraph.title.
      title: `${articulo.titulo} | ResponSable`,
      description: articulo.excerpt,
      url: canonical,
      locale: "es_MX",
      publishedTime: articulo.fecha,
      images: articulo.imagen
        ? [
            {
              url: articulo.imagen.src,
              width: articulo.imagen.w,
              height: articulo.imagen.h,
            },
          ]
        : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticuloPage(
  props: PageProps<"/recursos/articulos/[slug]">,
) {
  const { slug } = await props.params;
  const articulo = getArticuloMeta(slug);
  if (!articulo) notFound();

  // Los anclajes se inyectan en el servidor: el HTML llega ya con los id.
  const { blocks, indice, total } = prepararIndice(
    await getArticuloBlocks(articulo.slug),
  );
  const conIndice = total >= 2;
  /* La categoría del Centro de Recursos, no la de WordPress. Solo se muestra
     como etiqueta sobre el título: la miga va a /recursos/ y no a
     /recursos/?categoria=…, que no es una página propia (el filtro vive en el
     cliente y la URL canonicaliza a /recursos/). Cuando las categorías tengan
     URL, la miga puede volver a pasar por ellas. */
  const categoria = categoriaDe(articulo.slug);
  const relacionados = relacionadosDe(articulo);

  const ARTICLE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.excerpt,
    datePublished: articulo.fecha,
    /* El export de WordPress no trae fecha de modificación: se declara la de
       publicación en vez de inventar una. */
    dateModified: articulo.fecha,
    image: articulo.imagen
      ? `https://responsable.net${articulo.imagen.src}`
      : undefined,
    /* La organización, con su logo, está en el Organization del layout. */
    author: ORG_REF,
    publisher: ORG_REF,
    mainEntityOfPage: `https://responsable.net/recursos/articulos/${articulo.slug}/`,
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
        name: "Recursos",
        item: "https://responsable.net/recursos/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articulo.titulo,
        item: `https://responsable.net/recursos/articulos/${articulo.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />

      <SiteHeader />

      <main id="main" className="flex-1">
        {/*
          Hero a ancho completo con el título encima de la imagen. La capa navy
          al 90% no es decorativa: sin ella el blanco del título depende de qué
          imagen destacada tenga cada artículo, y hay 58 distintas.
        */}
        <div className="relative flex min-h-[clamp(18rem,42vh,26rem)] items-end overflow-hidden bg-navy">
          {articulo.imagen ? (
            <Image
              src={articulo.imagen.src}
              alt=""
              fill
              /* LCP de la ficha. `priority` está obsoleto desde Next 16: la
                 documentación recomienda loading="eager" y fetchPriority="high". */
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-navy-90" />

          <div className="relative mx-auto w-full max-w-[calc(var(--container)+3rem)] px-6 py-12">
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              {categoria.nombre}
            </p>
            <h1 className="font-head mt-3 max-w-[24ch] text-[clamp(1.9rem,4.2vw,2.9rem)] font-semibold text-balance text-white">
              {articulo.titulo}
            </h1>
            <time
              dateTime={articulo.fecha}
              className="font-body mt-4 block text-sm text-white/75"
            >
              {formatFecha(articulo.fecha)}
            </time>
          </div>
        </div>

        <div className="border-b border-border bg-off-white">
          <nav
            aria-label="Ruta de navegación"
            className="mx-auto max-w-[calc(var(--container)+3rem)] px-6 py-3"
          >
            <ol className="font-body flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-navy">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/recursos/" className="hover:text-navy">
                  Recursos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-navy">
                  {articulo.titulo}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/*
          Dos columnas desde lg. En móvil el grid las apila, así que la columna
          lateral cae bajo el contenido sin necesidad de reordenar nada.
        */}
        <div className="mx-auto max-w-[calc(var(--container)+3rem)] px-6 py-[var(--section-y)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            {/* 717px = 68 caracteres a los 16.8px de .articulo-prose, que es
                el texto corrido de la página (ver §2 de globals.css). La
                entradilla que va justo debajo es de 1.15rem y con este ancho
                lee a 62, más corta a propósito por ser entradilla. En px y no
                en ch: el ch resolvería contra los 16px heredados del cuerpo. */}
            <article className="max-w-[717px]">
              <p className="font-body text-[1.15rem] text-ink-soft">
                {articulo.excerpt}
              </p>
              <div className="mt-8">
                <ArticuloBody blocks={blocks} />
              </div>
            </article>

            {/* El CTA se pinta siempre; el índice solo si hay al menos dos
                encabezados. En los artículos sin índice la columna queda con la
                sola tarjeta, alineada arriba por self-start, sin estirarse ni
                dejar hueco. */}
            <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
              {conIndice ? <TablaContenidos indice={indice} /> : null}
              <CtaArticulo
                titulo="¿Este tema le toca de cerca?"
                apoyo="Acompañamos a empresas a convertir la sostenibilidad en decisiones de negocio."
              />
            </aside>
          </div>
        </div>

        <section className="bg-off-white px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <h2 className="font-head text-[clamp(1.6rem,4vw,2.05rem)] font-semibold text-navy">
              Otros artículos
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,380px))] lg:justify-center">
              {relacionados.map((a, i) => (
                <ArticuloCard key={a.slug} articulo={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
