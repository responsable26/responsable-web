import { CUADRANTES } from "@/lib/servicios";

/* ═══════════════════════════════════════════════════════════════════════════
   ⚠  CONTENIDO NO VALIDADO POR EL CLIENTE  ⚠

   Todo el texto narrativo —resumen, reto, solución, resultados— y TODAS las
   métricas de este archivo son marcador de posición. No están revisados ni
   aprobados por ResponSable ni por los clientes citados.

   Cada cadena sin validar lleva el prefijo literal "[PLACEHOLDER]" para que sea
   imposible publicarla por descuido: si aparece en pantalla, se ve.

   Las páginas de caso se sirven con `robots: noindex` mientras esto siga así.
   Al sustituir el contenido por el definitivo hay que: quitar los prefijos,
   retirar el noindex de las dos rutas y añadirlas al sitemap.

   Lo único real de este archivo son los NOMBRES DE CLIENTE y los SERVICIOS
   APLICADOS: ambos salen del carrusel de casos de éxito de la Home, que ya
   estaba en el proyecto.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Prefijo único, para poder localizar y auditar lo no validado. */
export const PLACEHOLDER = "[PLACEHOLDER]";

export type Metrica = {
  /** Cifra protagonista. Sin valor real: un guion largo evita que se confunda. */
  valor: string;
  etiqueta: string;
};

export type Caso = {
  slug: string;
  /** Real: sale del carrusel de la Home. */
  cliente: string;
  /**
   * Rótulo del titular del carrusel, cuando difiere del nombre oficial del
   * servicio.
   *
   * Opcional: sin él, subtituloDeCaso() resuelve el nombre verbatim desde el
   * catálogo (CUADRANTES) a partir de serviciosAplicados[0], que es la fuente
   * de los nombres oficiales. Solo se escribe aquí mientras el cliente no haya
   * confirmado que el titular debe ser el nombre completo del servicio; en
   * cuanto lo confirma, se borra la línea y el nombre pasa a venir del
   * catálogo, sin copiarlo.
   */
  subtitulo?: string;
  sector: string;
  resumen: string;
  /**
   * Descripción larga del caso, la que muestra el carrusel de la Home. Real y
   * validada en los cinco casos.
   * El carrusel la trunca por presentación; el dato no se recorta en origen.
   */
  descripcion: string;
  /**
   * ID del video testimonial en YouTube. Real y validado.
   *
   * Es el bloque visual del caso en el carrusel de la Home y en el cuerpo de su
   * página. No sustituye a `imagen`, que sigue alimentando el fondo del hero y
   * la tarjeta de Open Graph: ahí no cabe un reproductor.
   */
  videoYoutube: string;
  /** null mientras no haya una imagen del caso; la página resuelve con degradado. */
  imagen: { src: string; w: number; h: number } | null;
  /** Reales. Se referencian por su nombre exacto en servicios.ts. */
  serviciosAplicados: string[];
  reto: string;
  solucion: string;
  resultados: string;
  metricas: Metrica[];
};

export const CASOS: Caso[] = [
  {
    slug: "profuturo",
    subtitulo: "Sostenibilidad en la Cadena de Valor",
    cliente: "Profuturo",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "Conjuntamente con Profuturo, se implementó un proyecto estratégico enfocado en el desarrollo de su cadena de valor sostenible, un componente clave que permitió complementar y cerrar al 100% las metas iniciales de su modelo de madurez en sostenibilidad. Nuestra intervención abordó el desconocimiento técnico inicial mediante una rigurosa planificación y programas de capacitación dirigidos tanto a colaboradores internos como a proveedores de diversas escalas, lo que facilitó el diseño de una guía formal de buenas prácticas que mitiga el riesgo de greenwashing y promueve un impacto real en toda la cadena. A través de una metodología caracterizada por la flexibilidad y un acompañamiento continuo altamente personalizado, brindamos el soporte necesario para superar cada reto operativo, permitiendo a la organización consolidar exitosamente este ciclo de gestión y transitar con solidez hacia su siguiente estrategia corporativa.",
    videoYoutube: "VJQMRzXtwmQ",
    imagen: null,
    serviciosAplicados: ["Sostenibilidad en Cadena de Valor"],
    reto: `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    solucion: `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    resultados: `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    metricas: [
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de alcance` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de impacto` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de negocio` },
    ],
  },
  {
    slug: "la-esperanza",
    cliente: "La Esperanza",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "En conjunto con Grupo Esperanza, implementamos un proceso de acompañamiento y asesoría para PyMes enfocado en integrar la sostenibilidad de manera transversal en sus procesos operativos y en construir una cultura organizacional sólida. Nuestra intervención resolvió el reto de estructurar, documentar y comunicar de forma efectiva las evidencias de impacto social que la empresa ya generaba de forma nativa pero no sabía plasmar. Más allá de orientar al equipo hacia la obtención de un distintivo corporativo, nuestro enfoque se centró en una guía integral basada en la transferencia de conocimiento y el aprendizaje continuo, lo que permitió a la organización apropiarse del proceso, descubrir nuevas oportunidades de innovación y consolidar un propósito social plenamente arraigado en su operación diaria.",
    videoYoutube: "dJ4a6GcpYV4",
    imagen: null,
    serviciosAplicados: ["Acompañamiento en sostenibilidad"],
    reto: `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    solucion: `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    resultados: `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    metricas: [
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de alcance` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de impacto` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de negocio` },
    ],
  },
  {
    slug: "bmw",
    cliente: "BMW",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "En alianza estratégica con BMW San Luis Potosí, se implementó por primera vez en su planta la metodología SROI (Retorno Social de la Inversión) para obtener resultados numéricos y medibles. Colaborar juntos abrió paso a la transparencia en la medición y evitó la inflación de datos, destacando la importancia de recabar información de calidad para entender el impacto real en las comunidades, más allá de las donaciones económicas. El equipo ahora cuenta con una base sólida para priorizar, analizar, reorientar y redefinir sus objetivos, lo que les permite optimizar el efecto positivo de sus iniciativas y tomar decisiones estratégicas mucho más claras y ambiciosas.",
    videoYoutube: "U757UHhJlm4",
    imagen: null,
    serviciosAplicados: ["SROI: Retorno Social Sobre la Inversión"],
    reto: `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    solucion: `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    resultados: `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    metricas: [
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de alcance` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de impacto` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de negocio` },
    ],
  },
  {
    slug: "vestolit",
    subtitulo: "Diagnóstico de Impacto Social",
    cliente: "Vestolit",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "Junto con Vestolit, llevamos a cabo un diagnóstico de impacto social en nueve de sus plantas, un proyecto de gran alcance coordinado regionalmente durante más de un año. Nuestra intervención se centró en sustituir el enfoque asistencialista por una estrategia orientada al negocio y a la creación de valor compartido. Este diagnóstico no solo fortaleció sus iniciativas con la comunidad, sino que también sirvió de respaldo para movilizar la cultura organizacional desde la alta dirección, logrando integrar de manera definitiva el impacto social en el núcleo de su estrategia empresarial.",
    videoYoutube: "l1hqXtv95c8",
    imagen: null,
    serviciosAplicados: ["Diagnóstico Social y Línea base comunitaria"],
    reto: `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    solucion: `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    resultados: `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    metricas: [
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de alcance` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de impacto` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de negocio` },
    ],
  },
  {
    slug: "heineken-mexico",
    subtitulo: "Estudio de materialidad",
    cliente: "HEINEKEN México",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "Junto con HEINEKEN México, desarrollamos su estudio de materialidad enfocado en el ámbito comunitario, un proceso clave que demostró cómo la asesoría experta optimiza los tiempos de ejecución y maximiza la profundidad de la investigación. Nuestra intervención facilitó el acceso a un nivel superior de stakeholders, aportando el respaldo técnico y las credenciales institucionales necesarias para validar sólidamente los resultados ante su corporativo global y superar las limitaciones de alcance de la gestión interna. Gracias a este esfuerzo conjunto, los hallazgos se transformaron en una hoja de ruta estratégica que hoy guía con claridad el rumbo de sus iniciativas sociales, permitiendo al equipo consolidar proyectos exitosos con un impacto plenamente fundamentado.",
    videoYoutube: "YF6bb6ZNSi8",
    imagen: null,
    serviciosAplicados: ["Estudio de Doble Materialidad"],
    reto: `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    solucion: `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    resultados: `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    metricas: [
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de alcance` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de impacto` },
      { valor: "—", etiqueta: `${PLACEHOLDER} Métrica de negocio` },
    ],
  },
];

export function getCaso(slug: string): Caso | undefined {
  return CASOS.find((c) => c.slug === slug);
}

/**
 * Titular del caso en el carrusel: el nombre oficial del servicio aplicado.
 *
 * El nombre no se copia, se resuelve contra CUADRANTES y se devuelve la cadena
 * del propio catálogo. Así, renombrar un servicio en servicios.ts o cambia
 * también este titular o rompe el build —la función lanza si el nombre dejó de
 * existir—, en vez de dejar dos nombres distintos para el mismo servicio en
 * dos pantallas del sitio.
 *
 * `subtitulo` sigue ganando cuando está: es el rótulo provisional de los casos
 * cuyo titular el cliente todavía no ha confirmado.
 */
export function subtituloDeCaso(caso: Caso): string {
  if (caso.subtitulo) return caso.subtitulo;
  const nombre = caso.serviciosAplicados[0];
  for (const cuadrante of CUADRANTES) {
    const servicio = cuadrante.servicios.find((s) => s.nombre === nombre);
    if (servicio) return servicio.nombre;
  }
  throw new Error(
    `subtituloDeCaso: el caso "${caso.slug}" declara el servicio "${nombre}", que no existe en CUADRANTES.`,
  );
}

/**
 * Ruta de un servicio a partir de su nombre exacto en servicios.ts.
 *
 * Devuelve undefined cuando ese servicio todavía no tiene página propia, que
 * hoy es el caso de 24 de los 25: la página se limita entonces a mostrar el
 * nombre sin enlazarlo. `noEnlazable` manda sobre `href`.
 */
export function rutaDeServicio(nombre: string): string | undefined {
  for (const cuadrante of CUADRANTES) {
    const servicio = cuadrante.servicios.find((s) => s.nombre === nombre);
    if (servicio) {
      return servicio.noEnlazable ? undefined : servicio.href;
    }
  }
  return undefined;
}
