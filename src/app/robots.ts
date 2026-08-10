import type { MetadataRoute } from "next";

/*
  Sin reglas de bloqueo: la exclusión de la página de doble materialidad la
  gobierna su propio `robots: { index: false }`, que es más preciso que un
  Disallow —permite rastrearla y leer la directiva— y vive junto a la página.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://responsable.net/sitemap.xml",
  };
}
