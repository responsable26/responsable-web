import type { MetadataRoute } from "next";
import { ARTICULOS } from "@/lib/articulos";
import { CONTENIDO_SERVICIOS } from "@/lib/contenido-servicios";

const BASE = "https://responsable.net";

/*
  Se genera desde ARTICULOS, no desde una lista escrita a mano: al añadir un
  artículo entra solo y no hay una segunda fuente que se quede desfasada.

  Las diez páginas de servicio se generan igual, desde CONTENIDO_SERVICIOS.

  Quedan fuera a propósito:
  - /servicio/estudio-doble-materialidad/ mientras conserve robots noindex. Un
    sitemap que declara una URL excluida de indexación se contradice a sí mismo.
    Es la única página de servicio excluida: las otras diez sí se indexan.
  - /contacto/, /nosotros/, /servicio/, /recursos/ y las tres de /legal/, que
    hoy son stubs con «Contenido próximamente». Entran en cuanto tengan
    contenido real.

  Las prioridades no se inflan: son relativas dentro del propio sitio y no
  aportan nada si todas valen 1. La Home encabeza, los servicios van justo
  debajo —son las páginas comerciales del sitio—, después el índice de artículos
  y por último los artículos.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const masReciente = ARTICULOS.reduce(
    (max, a) => (a.fecha > max ? a.fecha : max),
    ARTICULOS[0].fecha,
  );

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(masReciente),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...CONTENIDO_SERVICIOS.map((servicio) => ({
      url: `${BASE}/servicio/${servicio.slug}/`,
      // No hay fecha en los documentos: la del build es lo más honesto que se
      // puede declarar sin inventarla.
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      // El índice cambia cada vez que se publica un artículo, de ahí que su
      // lastModified sea la fecha del más reciente.
      url: `${BASE}/recursos/articulos/`,
      lastModified: new Date(masReciente),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...ARTICULOS.map((articulo) => ({
      url: `${BASE}/recursos/articulos/${articulo.slug}/`,
      // Fecha real del artículo, no la del build.
      lastModified: new Date(articulo.fecha),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
