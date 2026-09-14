import type { MetadataRoute } from "next";
import { ARTICULOS } from "@/lib/articulos";
import { CASOS_PUBLICOS } from "@/lib/casos";
import { CONTENIDO_SERVICIOS } from "@/lib/contenido-servicios";

const BASE = "https://responsable.net";

/*
  Se genera desde ARTICULOS, no desde una lista escrita a mano: al añadir un
  artículo entra solo y no hay una segunda fuente que se quede desfasada.

  Las diez páginas de servicio de la ruta dinámica se generan igual, desde
  CONTENIDO_SERVICIOS. Estudio de Doble Materialidad se declara aparte porque
  tiene ruta estática propia y no vive en ese array; ya no hay ninguna página
  de servicio excluida.

  Los casos de éxito salen de CASOS_PUBLICOS, la misma lista que genera sus
  rutas: un caso marcado `sinValidar` no tiene página y tampoco entra aquí.

  Quedan fuera a propósito las páginas que llevan robots noindex —un sitemap
  que declara una URL excluida de indexación se contradice a sí mismo—:
  - /legal/ y sus dos hijas.
  - /proveedores/ y /trabaja-con-nosotros/, formularios de solicitud que no
    aportan a búsqueda.
  Cada una entra en cuanto se le retire el noindex, y no antes.

  Las prioridades no se inflan: son relativas dentro del propio sitio y no
  aportan nada si todas valen 1. La Home encabeza, los servicios van justo
  debajo —son las páginas comerciales del sitio—, después el índice de casos
  y el de artículos, luego las fichas de caso y las dos páginas
  institucionales, y por último los artículos.
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
    {
      url: `${BASE}/servicio/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
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
      // Fuera del map porque tiene ruta estática propia y no está en
      // CONTENIDO_SERVICIOS, pero es una página de servicio más.
      url: `${BASE}/servicio/estudio-doble-materialidad/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/casos-de-exito/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...CASOS_PUBLICOS.map((caso) => ({
      url: `${BASE}/casos-de-exito/${caso.slug}/`,
      // Los casos no llevan fecha: la del build, como en los servicios.
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      // El índice cambia cada vez que se publica un artículo, de ahí que su
      // lastModified sea la fecha del más reciente.
      url: `${BASE}/recursos/articulos/`,
      lastModified: new Date(masReciente),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/nosotros/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      // Lista los mismos artículos que /recursos/articulos/, así que su
      // lastModified es igual: la fecha del artículo más reciente.
      url: `${BASE}/recursos/`,
      lastModified: new Date(masReciente),
      changeFrequency: "weekly",
      priority: 0.7,
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
