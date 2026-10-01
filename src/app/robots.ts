import type { MetadataRoute } from "next";

/*
  Sin reglas de bloqueo. Las pocas páginas que no deben indexarse (/legal/ y
  sus dos hijas, /proveedores/ y /trabaja-con-nosotros/) lo declaran con su
  propio `robots: { index: false }`, que es más preciso que un Disallow
  —permite rastrearlas y leer la directiva— y vive junto a cada página.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://responsable.net/sitemap.xml",
  };
}
