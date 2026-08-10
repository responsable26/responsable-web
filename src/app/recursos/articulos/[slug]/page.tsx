import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticuloBody } from "@/components/articulos/articulo-body";
import { ArticuloCard } from "@/components/articulos/articulo-card";
import { ARTICULOS, formatFecha, getArticuloMeta } from "@/lib/articulos";
import { getArticuloBlocks } from "@/lib/articulos-content";

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
    // Sin sufijo de marca: lo añade el template del layout raíz.
    title: articulo.titulo,
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
      locale: "es_ES",
      publishedTime: articulo.fecha,
      images: articulo.imagen ? [{ url: articulo.imagen.src, width: articulo.imagen.w, height: articulo.imagen.h }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticuloPage(props: PageProps<"/recursos/articulos/[slug]">) {
  const { slug } = await props.params;
  const articulo = getArticuloMeta(slug);
  if (!articulo) notFound();

  const blocks = await getArticuloBlocks(articulo.slug);
  const relacionadas = ARTICULOS.filter((n) => n.slug !== articulo.slug).slice(0, 3);

  const ARTICLE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.excerpt,
    datePublished: articulo.fecha,
    image: articulo.imagen ? `https://responsable.net${articulo.imagen.src}` : undefined,
    author: { "@type": "Organization", name: "ResponSable", url: "https://responsable.net/" },
    publisher: { "@type": "Organization", name: "ResponSable", url: "https://responsable.net/" },
    mainEntityOfPage: `https://responsable.net/recursos/articulos/${articulo.slug}/`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />

      <SiteHeader />

      <main id="main" className="flex-1">
        <article className="mx-auto max-w-[calc(var(--container)+3rem)] px-6 py-[var(--section-y)]">
          <nav aria-label="Ruta de navegación" className="font-body text-[0.9rem]">
            <ol className="flex flex-wrap items-center gap-2 text-ink-soft">
              <li>
                <Link href="/" className="hover:text-navy">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/recursos/articulos/" className="hover:text-navy">
                  Artículos
                </Link>
              </li>
            </ol>
          </nav>

          {/* max-w-[68ch] mantiene la medida de lectura; el header y la imagen
              destacada van al ancho completo del contenedor. */}
          <header className="mt-6 max-w-[68ch]">
            <time dateTime={articulo.fecha} className="font-body text-sm text-ink-soft">
              {formatFecha(articulo.fecha)}
            </time>
            <h1 className="font-head mt-3 text-[clamp(1.9rem,4.2vw,2.9rem)] font-semibold text-balance text-navy">
              {articulo.titulo}
            </h1>
            <p className="font-body mt-4 text-[1.15rem] text-ink-soft">{articulo.excerpt}</p>
          </header>

          {articulo.imagen ? (
            <Image
              src={articulo.imagen.src}
              alt=""
              width={articulo.imagen.w}
              height={articulo.imagen.h}
              priority
              sizes="(min-width: 1120px) 1072px, 100vw"
              className="mt-10 h-auto w-full rounded object-cover"
            />
          ) : null}

          <div className="mt-10 max-w-[68ch]">
            <ArticuloBody blocks={blocks} />
          </div>
        </article>

        <section className="bg-off-white px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            <h2 className="font-head text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-navy">
              Otros artículos
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((n, i) => (
                <ArticuloCard key={n.slug} articulo={n} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
