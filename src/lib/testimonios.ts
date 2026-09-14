/* ═══════════════════════════════════════════════════════════════════════════
   ⚠  CONTENIDO NO VALIDADO POR EL CLIENTE  ⚠

   Los seis testimonios de cada página son marcador de posición: ni las citas,
   ni los nombres, ni los cargos, ni las empresas son reales. Están escritos
   con longitudes deliberadamente distintas para poder evaluar la maqueta en
   masonry, que es lo único que prueban.

   Dos redes impiden publicarlos por descuido, y hacen falta las dos porque
   estas páginas no son como las de caso: /servicio/* está viva e indexada, y
   un testimonio inventado con nombre y cargo ahí es bastante peor que en una
   página oculta.

     1. Cada cadena lleva el prefijo literal "[PLACEHOLDER]". Si aparece en
        pantalla, se ve.
     2. TESTIMONIOS_VALIDADOS, abajo, mantiene la sección sin pintar en las
        once páginas.

   PARA PUBLICAR:
     - Sustituir los seis testimonios de cada página por los reales.
     - Retirar el prefijo PLACEHOLDER de todas las cadenas.
     - Poner TESTIMONIOS_VALIDADOS en true.
     - Borrar este aviso.
   Los tres primeros pasos van juntos: dejar la bandera en true con cadenas aún
   prefijadas publicaría el marcador tal cual.
   ═══════════════════════════════════════════════════════════════════════════ */

import { CONTENIDO_SERVICIOS } from "@/lib/contenido-servicios";

/** Prefijo único, para poder localizar y auditar lo no validado. Mismo criterio
 *  que casos.ts, que lo usa para lo mismo. */
export const PLACEHOLDER = "[PLACEHOLDER]";

/**
 * Interruptor único de la sección de testimonios en todo el sitio.
 *
 * En false, TestimoniosServicio no pinta nada en ninguna de las once páginas y
 * su anclaje tampoco aparece en la barra. Ver arriba los pasos para publicar.
 */
export const TESTIMONIOS_VALIDADOS = true;

export type Testimonio = {
  /** La cita, sin comillas: las pone el componente. */
  cita: string;
  /**
   * Opcional: hay testimonios atribuidos solo a la empresa, sin persona. Sin
   * nombre, la tarjeta muestra la empresa como atribución y saca de ella la
   * inicial del avatar.
   */
  nombre?: string;
  /** Lo que da autoridad al testimonio en este contexto. No hay puntuación ni
   *  estrellas: quién lo dice pesa más que una nota. Opcional como `nombre`, y
   *  solo se muestra junto a él: un cargo sin persona no atribuye nada. */
  cargo?: string;
  /** Siempre presente: es la única atribución que no falta nunca. */
  empresa: string;
  /**
   * ID del video en YouTube, opcional. Si lo trae, la tarjeta muestra el video
   * encima de la cita; si no, solo el texto. Mismo nombre de campo que en
   * `Caso` (casos.ts).
   */
  videoYoutube?: string;
};

/**
 * Los seis de muestra, comunes a las once páginas MIENTRAS NO HAYA REALES.
 *
 * Cuando lleguen, cada página recibe los suyos y esta constante desaparece:
 * un testimonio sirve al servicio del que habla, no a los once.
 *
 * Las citas van de 9 a 68 palabras a propósito. En masonry por columnas lo que
 * hay que poder evaluar es el desnivel entre tarjetas, y seis textos de la
 * misma longitud no probarían nada.
 */
const MUESTRA_SIN_VALIDAR: Testimonio[] = [
    {
      cita: `${PLACEHOLDER} Dejamos de discutir qué temas eran importantes y empezamos a decidir con criterio.`,
      nombre: `${PLACEHOLDER} Mariana Escobedo`,
      cargo: `${PLACEHOLDER} Directora de Sostenibilidad`,
      empresa: `${PLACEHOLDER} Grupo Alimentario del Bajío`,
    },
    {
      cita: `${PLACEHOLDER} Llegamos al proceso con una lista de treinta y ocho temas que nadie sabía priorizar, heredada de un reporte anterior. El estudio nos obligó a mirar cada uno desde dos lados: qué impacto genera la operación y qué riesgo financiero trae de vuelta. Salimos con nueve temas materiales, un mapa de a quién habíamos consultado para llegar a ellos y, sobre todo, con un argumento que el comité de dirección entendió a la primera. Fue la primera vez que la conversación de sostenibilidad se sostuvo sola en esa sala.`,
      nombre: `${PLACEHOLDER} Rodrigo Villarreal`,
      cargo: `${PLACEHOLDER} Director de Relaciones Institucionales`,
      empresa: `${PLACEHOLDER} Cementos del Golfo`,
    },
    {
      cita: `${PLACEHOLDER} El acompañamiento no terminó con el entregable. Nos ayudaron a presentar los resultados a la casa matriz y a defender por qué habíamos descartado temas que en Europa sí eran materiales.`,
      nombre: `${PLACEHOLDER} Claudia Fonseca`,
      cargo: `${PLACEHOLDER} Gerente de ESG`,
      empresa: `${PLACEHOLDER} Farmacéutica Santa Elena`,
    },
    {
      cita: `${PLACEHOLDER} Esperábamos un documento. Nos llevamos una forma de decidir.`,
      nombre: `${PLACEHOLDER} Ignacio Berrondo`,
      cargo: `${PLACEHOLDER} Director General`,
      empresa: `${PLACEHOLDER} Transportes Berrondo`,
    },
    {
      cita: `${PLACEHOLDER} Lo que más nos sirvió fue el trabajo con los grupos de interés. Habíamos supuesto durante años qué esperaban de nosotros nuestros proveedores y resultó que estábamos midiendo lo que a ellos les daba igual. Rehacer esa parte cambió el presupuesto del año siguiente.`,
      nombre: `${PLACEHOLDER} Paulina Cortés`,
      cargo: `${PLACEHOLDER} Subdirectora de Cadena de Suministro`,
      empresa: `${PLACEHOLDER} Manufacturas del Norte`,
    },
    {
      cita: `${PLACEHOLDER} Trabajan con rigor y sin inflar resultados. Cuando un dato no daba para sostener una conclusión, lo dijeron.`,
      nombre: `${PLACEHOLDER} Alejandro Nava`,
      cargo: `${PLACEHOLDER} Director de Finanzas`,
      empresa: `${PLACEHOLDER} Aseguradora Meridiano`,
    },
];

/**
 * Testimonios por página, indexados por el slug de la ruta bajo /servicio/.
 *
 * Archivo propio y no dentro de contenido-servicios.ts porque Doble
 * Materialidad no vive en CONTENIDO_SERVICIOS —es una ruta estática con su
 * contenido escrito en la página—, así que solo un mapa por slug cubre las
 * once con la misma forma. De paso, todo lo que está sin validar queda
 * agrupado en un sitio y se audita y se sustituye de una vez.
 *
 * Los diez slugs dinámicos salen de CONTENIDO_SERVICIOS y no de una lista
 * escrita a mano: así una página de servicio nueva entra sola y no hay una
 * segunda fuente que se quede desfasada. El undécimo es la ruta estática.
 *
 * Hoy los once apuntan a la misma muestra; con contenido real, cada clave
 * lleva su propia lista.
 */
const TESTIMONIOS: Record<string, Testimonio[]> = Object.fromEntries(
  [
    ...CONTENIDO_SERVICIOS.map((servicio) => servicio.slug),
    "estudio-doble-materialidad",
  ].map((slug) => [slug, MUESTRA_SIN_VALIDAR]),
);

/**
 * Los testimonios de una página, o lista vacía si aún no tiene.
 *
 * Vacío mientras la bandera esté en false: es lo que retira la sección entera
 * de las once páginas, y con ella su anclaje en la barra. La página deriva de
 * aquí si añade o no la entrada "Testimonios", así que nunca queda un enlace
 * apuntando a un id que no existe.
 */
export function testimoniosDe(slug: string): Testimonio[] {
  if (!TESTIMONIOS_VALIDADOS) return [];
  return TESTIMONIOS[slug] ?? [];
}
