import type { MetadataRoute } from "next";
import { ARTICULOS } from "@/lib/articulos";

const BASE = "https://responsable.net";

/*
  Se genera desde ARTICULOS, no desde una lista escrita a mano: al añadir un
  artículo entra solo y no hay una segunda fuente que se quede desfasada.

  Quedan fuera a propósito:
  - /servicio/estudio-doble-materialidad/ mientras conserve robots noindex. Un
    sitemap que declara una URL excluida de indexación se contradice a sí mismo.
  - /contacto/, /nosotros/, /servicio/, /recursos/ y las tres de /legal/, que
    hoy son stubs con «Contenido próximamente». Entran en cuanto tengan
    contenido real.

  Las prioridades no se inflan: son relativas dentro del propio sitio y no
  aportan nada si todas valen 1. La Home encabeza, el índice queda por debajo y
  los artículos por debajo de ambos.
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
