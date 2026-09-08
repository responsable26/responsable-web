import { CUADRANTES } from "@/lib/servicios";

/* ═══════════════════════════════════════════════════════════════════════════
   ⚠  DOS CASOS SIGUEN SIN VALIDAR  ⚠

   Profuturo, Vestolit y BMW tienen contenido real, redactado a partir de los
   webinars grabados con cada cliente y aprobado por él. No llevan marcadores.

   HEINEKEN México y La Esperanza siguen pendientes: su texto narrativo
   —resumen, reto, solución, resultados— es marcador de posición, sin revisar
   ni aprobar. Van marcados con `sinValidar: true`, que los retira de todo el
   sitio, y cada cadena lleva además el prefijo literal "[PLACEHOLDER]" para
   que sea imposible publicarla por descuido: si aparece en pantalla, se ve.

   El `robots: noindex` de las rutas de casos se mantiene hasta que esos dos
   tengan contenido: se levanta para las seis rutas a la vez, no caso a caso.
   Cuando llegue, por cada uno hay que sustituir el texto, quitar los prefijos
   y borrar su `sinValidar`; y cuando estén los dos, retirar el noindex y
   añadir las rutas al sitemap.

   En los dos pendientes, lo único real son el NOMBRE DE CLIENTE y los
   SERVICIOS APLICADOS: ambos salen del carrusel de la Home, que ya estaba en
   el proyecto.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Prefijo único, para poder localizar y auditar lo no validado. */
export const PLACEHOLDER = "[PLACEHOLDER]";

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
  /**
   * Retira el caso de todo el sitio: índice, carrusel de la Home, "Otros
   * casos" y generación de su ruta, que pasa a devolver 404.
   *
   * Opcional y en negativo a propósito: lo normal es que un caso se vea, así
   * que un caso nuevo aparece sin tener que acordarse de nada. Marcarlo es la
   * excepción, y se hace explícitamente. Volver a publicarlo es borrar esta
   * línea.
   */
  sinValidar?: boolean;
  /*
    Un elemento por párrafo, como hero.descripcion en contenido-servicios.ts:
    la página pinta un <p> por entrada. En una sola cadena, un salto de línea
    no produce párrafo —HTML lo colapsa a un espacio— y estos textos llegan a
    cuatro párrafos.
  */
  reto: string[];
  solucion: string[];
  resultados: string[];
};

export const CASOS: Caso[] = [
  {
    slug: "profuturo",
    cliente: "Profuturo",
    sector: "Servicios financieros",
    resumen:
      "Un conjunto de iniciativas dispersas convertido en un modelo de sostenibilidad alineado a la misión del negocio y adoptado por toda la organización.",
    descripcion:
      "Conjuntamente con Profuturo, se implementó un proyecto estratégico enfocado en el desarrollo de su cadena de valor sostenible, un componente clave que permitió complementar y cerrar al 100% las metas iniciales de su modelo de madurez en sostenibilidad. Nuestra intervención abordó el desconocimiento técnico inicial mediante una rigurosa planificación y programas de capacitación dirigidos tanto a colaboradores internos como a proveedores de diversas escalas, lo que facilitó el diseño de una guía formal de buenas prácticas que mitiga el riesgo de greenwashing y promueve un impacto real en toda la cadena. A través de una metodología caracterizada por la flexibilidad y un acompañamiento continuo altamente personalizado, brindamos el soporte necesario para superar cada reto operativo, permitiendo a la organización consolidar exitosamente este ciclo de gestión y transitar con solidez hacia su siguiente estrategia corporativa.",
    videoYoutube: "VJQMRzXtwmQ",
    imagen: null,
    serviciosAplicados: ["Estrategia de Sostenibilidad"],
    reto: [
      "Profuturo ya hacía muchas cosas bien. Tenía código de ética, iniciativas de bienestar, acciones filantrópicas, políticas de gobierno corporativo y proyectos sociales. El problema era que ninguna de esas iniciativas estaba conectada con las demás, ni con la estrategia del negocio.",
      "El tema vivía en un área de cuatro personas dentro de Capital Humano, se entendía como responsabilidad social y no como sostenibilidad, y nunca se había consultado a los grupos de interés sobre estos temas. Ni siquiera a los clientes, con quienes la empresa se comunicaba a diario para asuntos de servicio y operación.",
    ],
    solucion: [
      "El acompañamiento se dividió en dos etapas.",
      "Primero un estudio de materialidad, que arrancó con un benchmark que no se limitó al sector de las Afores: se amplió a todo el sector financiero nacional y a referentes internacionales, porque Profuturo invierte los recursos de los mexicanos y compite contra estándares globales. Se analizó la documentación interna de la empresa y se consultó a colaboradores, directivos, clientes, proveedores y aliados mediante encuestas, entrevistas y focus groups.",
      "Después, el diseño del modelo de sostenibilidad: estructura de pilares, ejes y líneas de acción construida sobre los temas materiales y los objetivos estratégicos ya definidos por la empresa; robustecimiento con el Comité de Sostenibilidad integrado por directivos de distintas áreas; alineación a los Objetivos de Desarrollo Sostenible; y definición de métricas trabajadas directamente con las áreas que iban a reportarlas.",
    ],
    resultados: [
      "De más de 180 temas de interés identificados se llegó a diez temas materiales, en un proceso de filtrado que el director general supervisó personalmente.",
      "La sostenibilidad dejó de ser el proyecto de un área pequeña y se convirtió en pilar estratégico de la compañía. Los directores pasaron de preguntar por qué el medio ambiente formaba parte del tema a proponer que sus objetivos anuales se alinearan con la estrategia de sostenibilidad. Ese cambio importa en una organización de 5.500 colaboradores distribuidos en 60 edificios del país.",
      "El modelo quedó anclado a la misión del negocio: contribuir a que los mexicanos salven su futuro, fortaleciendo la educación y la inclusión financiera, invirtiendo responsablemente y operando de forma sostenible.",
    ],
  },
  {
    slug: "la-esperanza",
    sinValidar: true,
    cliente: "La Esperanza",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "En conjunto con Grupo Esperanza, implementamos un proceso de acompañamiento y asesoría para PyMes enfocado en integrar la sostenibilidad de manera transversal en sus procesos operativos y en construir una cultura organizacional sólida. Nuestra intervención resolvió el reto de estructurar, documentar y comunicar de forma efectiva las evidencias de impacto social que la empresa ya generaba de forma nativa pero no sabía plasmar. Más allá de orientar al equipo hacia la obtención de un distintivo corporativo, nuestro enfoque se centró en una guía integral basada en la transferencia de conocimiento y el aprendizaje continuo, lo que permitió a la organización apropiarse del proceso, descubrir nuevas oportunidades de innovación y consolidar un propósito social plenamente arraigado en su operación diaria.",
    videoYoutube: "dJ4a6GcpYV4",
    imagen: null,
    serviciosAplicados: ["Acompañamiento en sostenibilidad"],
    reto: [
      `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    ],
    solucion: [
      `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    ],
    resultados: [
      `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    ],
  },
  {
    slug: "bmw",
    cliente: "BMW",
    sector: "Automotriz",
    resumen:
      "El paso de reportar actividades a medir el valor social generado, con una metodología que descuenta lo que no corresponde atribuirse.",
    descripcion:
      "En alianza estratégica con BMW San Luis Potosí, se implementó por primera vez en su planta la metodología SROI (Retorno Social de la Inversión) para obtener resultados numéricos y medibles. Colaborar juntos abrió paso a la transparencia en la medición y evitó la inflación de datos, destacando la importancia de recabar información de calidad para entender el impacto real en las comunidades, más allá de las donaciones económicas. El equipo ahora cuenta con una base sólida para priorizar, analizar, reorientar y redefinir sus objetivos, lo que les permite optimizar el efecto positivo de sus iniciativas y tomar decisiones estratégicas mucho más claras y ambiciosas.",
    videoYoutube: "U757UHhJlm4",
    imagen: null,
    serviciosAplicados: ["SROI: Retorno Social Sobre la Inversión"],
    reto: [
      "BMW ya medía y monitoreaba sus iniciativas de responsabilidad social corporativa. El problema era qué medía: talleres impartidos, becas otorgadas, jornadas médicas realizadas. Actividades, no resultados.",
      "Con ese lenguaje no se puede responder la pregunta que hacen el consejo, la casa matriz y los grupos de interés: ya sé cuánto donaste, pero qué pasó con ese dinero.",
    ],
    solucion: [
      "Antes de calcular nada se construyó una teoría del cambio, para mapear qué genera cada proyecto y qué habría que medir. Sobre esa base se aplicó la metodología SROI.",
      "Los proxys económicos no se tomaron de promedios nacionales: se buscaron para San Luis Potosí y para las comunidades específicas donde se interviene, apoyados en fuentes oficiales como INEGI y Coneval, y en algunos casos preguntando directamente a las instituciones involucradas.",
      "El cálculo no se detuvo en el valor social generado. Se ajustó descontando tres factores: el contrafactual, es decir qué habría pasado sin el proyecto; la atribución, qué parte del cambio corresponde realmente a BMW y no a otros actores; y el desplazamiento, si el beneficio reemplaza a otro que ya existía. Ese ajuste es lo que separa una medición honesta de una cifra inflada.",
    ],
    resultados: [
      "BMW pasó de mapear actividades a identificar qué vidas está impactando y con qué efecto.",
      "Los resultados permitieron priorizar los programas con mayor retorno social, entre ellos las iniciativas de educación, alineadas con la estrategia del grupo, y reajustar aquellos que quedaban rezagados, en lugar de eliminarlos sin entender por qué.",
      "La empresa también amplió su forma de evaluar: ahora incorpora la percepción de profesores, familias y comunidad, no solo la del beneficiario directo. Y comenzó a involucrar a las comunidades en la planificación de los proyectos.",
      "La medición de impacto se institucionalizó como ejercicio anual.",
    ],
  },
  {
    slug: "vestolit",
    subtitulo: "Diagnóstico de Impacto Social",
    cliente: "Vestolit",
    sector: "Petroquímica",
    resumen:
      "Quince meses de trabajo de campo en nueve plantas para construir con datos, y no con supuestos, la línea base del relacionamiento comunitario.",
    descripcion:
      "Junto con Vestolit, llevamos a cabo un diagnóstico de impacto social en nueve de sus plantas, un proyecto de gran alcance coordinado regionalmente durante más de un año. Nuestra intervención se centró en sustituir el enfoque asistencialista por una estrategia orientada al negocio y a la creación de valor compartido. Este diagnóstico no solo fortaleció sus iniciativas con la comunidad, sino que también sirvió de respaldo para movilizar la cultura organizacional desde la alta dirección, logrando integrar de manera definitiva el impacto social en el núcleo de su estrategia empresarial.",
    videoYoutube: "l1hqXtv95c8",
    imagen: null,
    serviciosAplicados: ["Diagnóstico Social y Línea base comunitaria"],
    reto: [
      "Vestolit opera nueve plantas en México, en contextos que no se parecen entre sí: zonas rurales y urbanas, comunidades densamente pobladas, regiones con altos índices delictivos y presencia de delincuencia organizada.",
      "Cada planta había desarrollado sus propias costumbres de relacionamiento comunitario. Unas visitaban un asilo cada año, otras regalaban juguetes, otras aportaban a las fiestas patronales. Eran acciones aisladas, con enfoque asistencialista, sin información sobre las comunidades vecinas y sin conexión con la estrategia del negocio.",
      "La empresa necesitaba saber quiénes eran esas comunidades, qué necesitaban y cómo percibían a la compañía, antes de diseñar cualquier estrategia.",
    ],
    solucion: [
      "Un diagnóstico de quince meses estructurado en tres etapas.",
      "En la etapa de identificación se delimitaron las zonas de influencia de las nueve plantas, que fue el primer punto difícil: no bastaba con trazar un perímetro, porque la operación afecta a través de infraestructura y tráfico. Se analizaron las características sociodemográficas de cada región y se hizo un benchmark de otras empresas presentes en la zona.",
      "La etapa de consulta fue trabajo de campo. Se aplicaron 2.422 encuestas en comunidad, 432 encuestas a colaboradores y 40 entrevistas a líderes de opinión, además de 14 focus groups internos.",
      "En la etapa de definición se procesó la información, se presentaron los resultados a los liderazgos y se realizaron 6 talleres de liderazgo y co-creación, en los que personal directivo y operativo propuso iniciativas a partir de las necesidades detectadas.",
    ],
    resultados: [
      "Vestolit obtuvo una línea base con datos duros por planta: necesidades reales de cada comunidad, percepción de la empresa en cada sitio y riesgos ambientales y sociales identificados desde el territorio, no desde el escritorio.",
      "El efecto interno fue tan relevante como el externo. Al bajar la información a las plantas, muchos colaboradores descubrieron iniciativas que la propia empresa realizaba y desconocían. Lo que no se comunica no se reporta, y lo que no se reporta no se mide ni se gestiona.",
      "El diagnóstico convirtió el impacto social en un tema del negocio con evidencia detrás, en lugar de una opción que cada planta ejercía a su criterio.",
    ],
  },
  {
    slug: "heineken-mexico",
    sinValidar: true,
    subtitulo: "Estudio de materialidad",
    cliente: "HEINEKEN México",
    sector: `${PLACEHOLDER} Sector por confirmar`,
    resumen: `${PLACEHOLDER} Frase de resumen del caso, pendiente de redacción y validación con el cliente.`,
    descripcion:
      "Junto con HEINEKEN México, desarrollamos su estudio de materialidad enfocado en el ámbito comunitario, un proceso clave que demostró cómo la asesoría experta optimiza los tiempos de ejecución y maximiza la profundidad de la investigación. Nuestra intervención facilitó el acceso a un nivel superior de stakeholders, aportando el respaldo técnico y las credenciales institucionales necesarias para validar sólidamente los resultados ante su corporativo global y superar las limitaciones de alcance de la gestión interna. Gracias a este esfuerzo conjunto, los hallazgos se transformaron en una hoja de ruta estratégica que hoy guía con claridad el rumbo de sus iniciativas sociales, permitiendo al equipo consolidar proyectos exitosos con un impacto plenamente fundamentado.",
    videoYoutube: "YF6bb6ZNSi8",
    imagen: null,
    serviciosAplicados: ["Estudio de Doble Materialidad"],
    reto: [
      `${PLACEHOLDER} Descripción del reto que enfrentaba la organización antes de la intervención.`,
    ],
    solucion: [
      `${PLACEHOLDER} Descripción del trabajo realizado y del enfoque metodológico aplicado.`,
    ],
    resultados: [
      `${PLACEHOLDER} Descripción de los resultados obtenidos y de su efecto en el negocio.`,
    ],
  },
];

/**
 * Los casos que se publican. Es la lista que consume todo el sitio; CASOS
 * queda como el archivo completo, para que los pendientes sigan versionados y
 * vuelvan borrando una línea.
 */
export const CASOS_PUBLICOS: Caso[] = CASOS.filter((c) => !c.sinValidar);

/** Solo resuelve casos publicados: un slug marcado devuelve undefined y su
 *  página responde 404, aunque alguien escriba la URL a mano. */
export function getCaso(slug: string): Caso | undefined {
  return CASOS_PUBLICOS.find((c) => c.slug === slug);
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
