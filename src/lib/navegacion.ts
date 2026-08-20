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
  /*
    "Informe de Sostenibilidad" ya no vive aquí: apuntaba a /#servicios (nunca
    a una página propia) y ese es también el nombre de un servicio real, con
    página propia en /servicio/informe-de-sostenibilidad/. Ese servicio sigue
    enlazado desde el bloque de relacionados de las demás páginas de servicio
    (no entra en SERVICIOS_FOOTER, la selección editorial de la columna de
    Servicios del footer, en servicios.ts), así que retirar esta entrada no lo
    deja huérfano.
  */
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

/**
 * Descripción de marca del bloque de logo, compartida por los dos footers.
 *
 * Vivía copiada a mano en cada uno y había divergido: el de servicio se quedó
 * con una variante corta y desactualizada. Una sola fuente evita que vuelva a
 * pasar.
 */
export const DESCRIPCION_RESPONSABLE =
  "ResponSable es una agencia de sostenibilidad que acompaña a las empresas a llevar su estrategia de RSE, la doble materialidad y la gestión social al corazón del negocio, para generar valor real y fortalecer su resiliencia.";
