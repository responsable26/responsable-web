/**
 * Fuente única de los enlaces que comparten header y los dos footers.
 *
 * Existía una lista paralela en cada uno, y esa duplicación ya causó que la
 * corrección del enlace roto a /informe-de-sostenibilidad/ se aplicara solo en
 * el footer principal y no en el de servicio.
 */
export type EnlaceNav = { label: string; href: string };

export const ENLACES_NAVEGACION: EnlaceNav[] = [
  { label: "Home", href: "/" },
  { label: "Casos de Éxito", href: "/casos-de-exito" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Centro de Recursos", href: "/recursos" },
  // PROVISIONAL: es un servicio, no una página. /informe-de-sostenibilidad/ da
  // 404, así que apunta al ancla de servicios de la Home. Redirigir a su página
  // propia cuando exista.
  { label: "Informe de Sostenibilidad", href: "/#servicios" },
];

/**
 * Enlaces de pie de página. No entran en la navegación del header: son
 * información legal, no destinos del sitio.
 *
 * "Mapa del Sitio" no está en la lista a propósito: apuntaba a la Home y la
 * etiqueta prometía una página que no existe. El redirect de /mapa-del-sitio/
 * se conserva en next.config.ts para enlaces externos.
 */
export const ENLACES_LEGALES: EnlaceNav[] = [
  { label: "Términos y Condiciones", href: "/legal/terminos-y-condiciones" },
  { label: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
];

export const LINKEDIN_URL =
  "https://www.linkedin.com/company/responsable-asesoria-sostenibilidad-rse-esg";
