/*
  Datos estructurados de la organización, en un solo sitio.

  El Organization completo se publica una vez por página desde el layout raíz,
  con un @id estable. El resto de schemas (Service, Article de artículos y de
  casos, WebSite, AboutPage) la referencian por ese @id en vez de repetir
  nombre, URL y logo: así no hay dos versiones de la organización que puedan
  quedarse desfasadas.

  Módulo de datos puro, sin JSX: lo importan tanto el layout como las páginas.
*/

export const BASE = "https://responsable.net";

export const ORG_ID = `${BASE}/#organizacion`;

/** Referencia a la organización para provider, publisher, author, etc. */
export const ORG_REF = { "@id": ORG_ID } as const;

/**
 * La meta description de la Home, que es también la descripción de la
 * organización en su schema. Vive aquí para que las dos no se separen.
 */
export const DESCRIPCION_ORGANIZACION =
  "Consultoría en sostenibilidad y RSE. Desde 2011 acompañamos a su empresa a anticipar riesgos y convertir la estrategia ESG en resultados medibles.";

/** Dónde trabaja ResponSable, según el propio sitio: México y Latinoamérica. */
export const AREA_SERVIDA = [
  { "@type": "Country", name: "México" },
  { "@type": "Place", name: "Latinoamérica" },
];

export const ORGANIZACION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "ResponSable",
  legalName: "ProActive Strategies, S.C.",
  url: `${BASE}/`,
  /* El isotipo en PNG, el mismo que usan el favicon y el correo de contacto:
     Google pide un logo rasterizado, no SVG. */
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/brand/isotipo.png`,
    width: 500,
    height: 500,
  },
  description: DESCRIPCION_ORGANIZACION,
  foundingDate: "2011",
  areaServed: AREA_SERVIDA,
  sameAs: [
    "https://www.linkedin.com/company/responsable-asesoria-sostenibilidad-rse-esg/",
  ],
  /* Solo español: el sitio no menciona atención en inglés. */
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hola@responsable.net",
    availableLanguage: ["es"],
  },
};
