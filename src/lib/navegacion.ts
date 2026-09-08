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
    AUSENCIA DELIBERADA: "Informe de Sostenibilidad" no va aquí, y no se debe
    reañadir.

    Esta lista es navegación institucional —las secciones del sitio— y alimenta
    dos footers a la vez: la columna "Compañía" de SiteFooter y la columna
    "Explore" de ServicioFooter. Un servicio individual no pertenece a ese
    nivel: metería una página de catálogo entre Casos de Éxito, Nosotros y
    Centro de Recursos, y lo haría por partida doble.

    El servicio sigue publicado en /servicio/informe-de-sostenibilidad/ y vive
    en CUADRANTES (servicios.ts), desde donde lo enlaza el bloque de "Servicios
    relacionados" de las demás páginas de servicio. Quitarlo de esta lista no
    lo deja huérfano.
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
  "ResponSable es una consultoría en sostenibilidad que acompaña a las empresas a llevar su estrategia de RSE, la doble materialidad y la gestión social al corazón del negocio, para generar valor real y fortalecer su resiliencia.";
