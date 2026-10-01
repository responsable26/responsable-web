/*
  Meta descriptions y datos de las páginas que también se publican fuera de su
  página: en /llms.txt (app/llms.txt/route.ts). Viven aquí, y no como
  constantes dentro de cada page.tsx, para que la página y llms.txt lean el
  mismo texto y no puedan separarse.

  Módulo de datos puro, sin JSX.
*/

import type { Caso } from "@/lib/casos";
import { PLACEHOLDER } from "@/lib/casos";
import type { ContenidoServicio } from "@/lib/contenido-servicios";

export const DESCRIPCION_SERVICIOS =
  "Diagnóstico, estrategia, implementación y comunicación en sostenibilidad. Los servicios con los que acompañamos a su empresa en cada etapa.";

export const DESCRIPCION_CASOS =
  "Casos de éxito de ResponSable: cómo acompañamos a empresas de distintos sectores a convertir su estrategia de sostenibilidad en resultados de negocio.";

export const DESCRIPCION_NOSOTROS =
  "Consultoría en sostenibilidad y RSE desde 2011. Acompañamos a más de 200 empresas en México y Latinoamérica a convertir la sostenibilidad en decisiones de negocio.";

export const DESCRIPCION_RECURSOS =
  "Estudios, perspectivas y artículos de ResponSable: las herramientas que necesita para convertir su estrategia de sostenibilidad en resultados tangibles.";

export const DESCRIPCION_DOBLE_MATERIALIDAD =
  "Realizamos su estudio de doble materialidad: identificamos impactos, riesgos y oportunidades ASG y los convertimos en decisiones de negocio. Alineado a CSRD y ESRS.";

/** Cifras de la banda de Nosotros. El valor va suelto del texto para poder
 *  darle su escala. Cifras y rótulos salen del documento de credenciales del
 *  cliente, que es la fuente: si cambian, se cambian allí primero. */
export const CIFRAS_NOSOTROS = [
  { valor: "+600", etiqueta: "Proyectos de consultoría y capacitación" },
  { valor: "+200", etiqueta: "Empresas acompañadas en México y Latinoamérica" },
  {
    valor: "+15",
    etiqueta: "Años diseñando soluciones estratégicas en sostenibilidad",
  },
];

/**
 * Descripción para metadatos de una página de servicio, derivada del primer
 * párrafo real del documento.
 *
 * Se recorta a 160 caracteres en límite de palabra: es donde Google deja de
 * mostrarla.
 */
export function metaDescripcionServicio(contenido: ContenidoServicio): string {
  const texto = contenido.hero.descripcion[0] ?? contenido.cta.descripcion;
  if (texto.length <= 160) return texto;
  const corte = texto.slice(0, 160);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

/**
 * Descripción de un caso de éxito: su resumen, que es texto escrito para
 * leerse. La plantilla queda de respaldo para un caso cuyo resumen aún no esté
 * validado: describe el contenido sin prometer nada y, sobre todo, evita
 * publicar un marcador de posición en los metadatos.
 */
export function descripcionCaso(caso: Caso): string {
  return caso.resumen.includes(PLACEHOLDER)
    ? `Caso de éxito de ${caso.cliente}: el reto, el trabajo realizado y los resultados obtenidos con el acompañamiento de ResponSable.`
    : caso.resumen;
}
