import { CONTENIDO_SERVICIOS } from "@/lib/contenido-servicios";

/**
 * Interruptor único de la sección de testimonios en todo el sitio.
 *
 * En false, TestimoniosServicio no pinta nada en ninguna de las páginas de
 * servicio y su anclaje tampoco aparece en la barra.
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

/*
  Testimonios reales, verbatim del documento de credenciales del cliente.

  Los que se repiten en dos páginas —ALMER en Estrategia y en Acompañamiento—
  se declaran una vez y se referencian desde las dos, para que no puedan
  desviarse entre sí.
*/

const ALMER: Testimonio = {
  cita: "ResponSable nos permitió darle estructura, método y visión a las iniciativas que ya teníamos planteadas. Evitamos mucho la prueba y error, y pudimos focalizar los esfuerzos en acciones que aportan valor a la organización y se materializan en la operación diaria.",
  nombre: "Luz Elena Alvarado",
  cargo: "Directora de Inteligencia Organizacional",
  empresa: "ALMER",
  videoYoutube: "ZxX0_4li8fE",
};

/**
 * Testimonios por página, indexados por el slug de la ruta bajo /servicio/.
 *
 * Archivo propio y no dentro de contenido-servicios.ts porque Doble
 * Materialidad no vive en CONTENIDO_SERVICIOS —es una ruta estática con su
 * contenido escrito en la página—, así que solo un mapa por slug cubre todas
 * con la misma forma.
 *
 * Una página sin clave aquí no tiene testimonios y su sección desaparece
 * entera: hoy es el caso de Diagnóstico de Sostenibilidad, ROI y Distintivo
 * ESR. El orden de cada lista es el orden en pantalla.
 */
const TESTIMONIOS: Record<string, readonly Testimonio[]> = {
  "estudio-doble-materialidad": [
    {
      cita: "Tener un estudio de materialidad nos permite acercarnos a los líderes y mostrar con datos lo que estamos haciendo y lo que deberíamos estar haciendo. Presentar un diagnóstico formal a los líderes agilizó la definición de una estrategia clara y la obtención de presupuesto para distintas acciones.",
      nombre: "José Luis García",
      cargo: "Jefe de comunicación interna y externa",
      empresa: "Sanofi México",
      videoYoutube: "EcMa_eMCO6c",
    },
    {
      cita: "Trabajar con ResponSable nos permitió acceder al nivel adecuado de stakeholders y obtener resultados avalados por expertos. Nos ofrecieron justamente lo que necesitábamos: un estudio que nos diera claridad sobre hacia dónde encaminar nuestra estrategia.",
      nombre: "Silvia Rosales Ortiz",
      cargo: "Jefe de Programas Sociales",
      empresa: "HEINEKEN México",
      videoYoutube: "YF6bb6ZNSi8",
    },
  ],
  "estrategia-sostenibilidad": [
    {
      cita: "El acompañamiento permitió que la estrategia de sostenibilidad pasara de esfuerzos aislados a un enfoque corporativo reconocido y valorado por todos. Los directores comenzaron a involucrarse y se convirtieron en difusores de esta información en toda la compañía.",
      nombre: "María del Mar González",
      cargo: "Líder de DO y Sostenibilidad",
      empresa: "Profuturo",
      videoYoutube: "1q_oC4Rl1aA",
    },
    ALMER,
  ],
  "acompanamiento-sostenibilidad": [
    {
      cita: "ResponSable nos ayudó a integrar la responsabilidad social dentro de nuestros procesos. No se trató solamente de decirnos qué hacer, sino de guiarnos para que nosotros mismos nos diéramos cuenta de que realmente estábamos logrando el resultado que buscábamos.",
      nombre: "Karla Calderón",
      cargo: "Encargada de Responsabilidad Social",
      empresa: "Grupo Esperanza",
      videoYoutube: "dJ4a6GcpYV4",
    },
    ALMER,
  ],
  "informe-de-sostenibilidad": [
    {
      cita: "Más que ayudarnos a elaborar un informe, nos enseñaron a ordenar el proceso, fortalecer lo que ya hacíamos y entender cómo contribuíamos dentro y fuera de la organización. Su conocimiento, experiencia y capacidad para adaptarse a nuestra operación hicieron la diferencia.",
      nombre: "Karla Calderón",
      cargo: "Encargada de Responsabilidad Social",
      empresa: "Grupo Esperanza",
      videoYoutube: "otFY9JXbKjk",
    },
    {
      cita: "Ir de la mano con un experto te da estructura, ayuda a identificar lo que falta y asegura que se entienda externamente lo que quieres comunicar. La flexibilidad de trabajar de la mano con ResponSable nos permitió optimizar tiempo y presupuesto al mismo tiempo.",
      nombre: "Daniela Quintanilla",
      cargo: "Líder de DO y Sostenibilidad",
      empresa: "Baker McKenzie",
      videoYoutube: "JtBKw3wvLfI",
    },
  ],
  "estrategia-de-comunicacion-en-sostenibilidad": [
    {
      cita: "Con el apoyo de ResponSable logramos comunicar nuestro desempeño en sustentabilidad de manera sencilla, didáctica y accesible. También desarrollamos narrativas más frescas, alineadas con la juventud del equipo, el futuro de la empresa y las necesidades de nuestros grupos de interés.",
      nombre: "Exequiel Rolón",
      cargo: "Jefe de comunicación interna y externa",
      empresa: "Fresnillo",
      videoYoutube: "pdBVvyic82k",
    },
  ],
  "sroi-social-return-on-investment": [
    {
      cita: "Fue crucial contar con la orientación y guía de ResponSable, expertos en la metodología SROI. Su mirada externa nos permitió tener mayor transparencia en los datos. Ahora podemos priorizar, analizar y redefinir nuestros proyectos con resultados precisos y medibles.",
      empresa: "BMW Group Planta San Luis Potosí",
      videoYoutube: "U757UHhJlm4",
    },
    {
      cita: "Traducir resultados cualitativos en datos tangibles marcó un cambio significativo en la forma en que gestionamos nuestras iniciativas de RSE. Hoy podemos identificar, de manera más estratégica y objetiva, qué proyectos apoyar y cuáles no, generando un impacto alineado a los objetivos institucionales y de desarrollo sostenible.",
      nombre: "Fabiola Mejía",
      cargo: "Analista Sr. de RSE",
      empresa: "Hermandad de Honduras",
      videoYoutube: "PXRT6ASbNsM",
    },
  ],
  "iso-26000": [
    {
      cita: "Gracias al acompañamiento experto, pudimos construir una estrategia de sostenibilidad focalizada en los temas materiales para el negocio, canalizando inversiones e innovación con mayor impacto.",
      empresa: "Grupo BAL",
      videoYoutube: "QWp0d6iDi0Q",
    },
  ],
  "cursos-talleres-para-empresas": [
    {
      cita: "El curso nos proporcionó herramientas claras y aplicables para fortalecer nuestros procesos en sostenibilidad. También nos inspiró a poner en marcha estas prácticas de manera inmediata, con una visión colaborativa y realista.",
      empresa: "ACM Consulting",
    },
    {
      cita: "El curso nos ayudó a integrar conocimientos nuevos a partir de ejemplos basados en la experiencia de ResponSable, y a entender cómo materializar las ideas en acciones concretas. Aprendimos que, desde nuestros propios alcances, sí es posible contribuir a una relación comercial más sostenible.",
      empresa: "Pack Tech Services",
    },
    {
      cita: "El curso nos dio herramientas para implementar la sostenibilidad en nuestros procesos y nos abrió nuevas ideas para avanzar con buenas prácticas, eficiencia en el uso de recursos y mayor cuidado del entorno.",
      empresa: "Maxcess Internacional",
    },
    {
      cita: "ResponSable nos ayudó a comprender y dominar la plataforma EcoVadis, guiándonos en la elaboración de documentos y en el fortalecimiento de buenas prácticas de responsabilidad social y sostenibilidad.",
      empresa: "Grupo Espinosa",
    },
    {
      cita: "ResponSable nos ayudó a fortalecer a nuestros proveedores de impresión y a prepararlos mejor para responder a los criterios de EcoVadis. Su acompañamiento, adaptado al nivel de madurez de cada proveedor, permitió lograr mejoras importantes con profesionalismo, calidez y claridad.",
      empresa: "Larousse",
    },
  ],
};

/* Una clave mal escrita dejaría la sección vacía en silencio. Se comprueba al
   cargar el módulo contra las rutas que existen, y el build falla con el slug
   culpable en vez de publicar una página sin sus testimonios. */
const RUTAS_SERVICIO = new Set([
  ...CONTENIDO_SERVICIOS.map((servicio) => servicio.slug),
  "estudio-doble-materialidad",
]);
for (const slug of Object.keys(TESTIMONIOS)) {
  if (!RUTAS_SERVICIO.has(slug)) {
    throw new Error(
      `testimonios.ts: la clave "${slug}" no corresponde a ninguna página de servicio.`,
    );
  }
}

/**
 * Los testimonios de una página, o lista vacía si no tiene.
 *
 * Vacío también mientras la bandera esté en false: es lo que retira la sección
 * entera, y con ella su anclaje en la barra. La página deriva de aquí si añade
 * o no la entrada "Testimonios", así que nunca queda un enlace apuntando a un
 * id que no existe.
 */
export function testimoniosDe(slug: string): readonly Testimonio[] {
  if (!TESTIMONIOS_VALIDADOS) return [];
  return TESTIMONIOS[slug] ?? [];
}
