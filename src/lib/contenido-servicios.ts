/**
 * Contenido editorial de las páginas de servicio, validado por el cliente.
 *
 * Origen: los diez .docx de contenido/servicios/. Este módulo es la traducción
 * fiel de esos documentos, no una reescritura: el texto se extrajo literal y las
 * únicas intervenciones fueron las acordadas con André —descartar la cabecera de
 * control de cada documento, la fila de instrucciones de las tablas, la nota de
 * redacción de Acompañamiento y las imágenes sueltas del final, elegir la
 * VERSION CORTA donde el documento ofrecía alternativas, corregir dos erratas
 * puntuales y convertir el copy a tratamiento de usted—.
 *
 * NO EDITE ESTE ARCHIVO A MANO. Es generado: cualquier corrección se pierde en
 * cuanto alguien vuelva a extraer los .docx. Los documentos originales están en
 * tú y la conversión a usted vive en el extractor, junto con las erratas y la
 * elección de versión. Un cambio de fondo se hace en el .docx; un cambio de
 * tratamiento o de redacción, en las tablas del extractor.
 *
 * Módulo de datos puro, como servicios.ts y casos.ts: sin JSX ni "use client".
 *
 * Lo consume la ruta dinámica /servicio/[slug]/. El `slug` sale del campo LINK
 * de cada documento, para conservar las URL que ya indexa el sitio actual. Los
 * dos documentos cuyo LINK no servía —Estrategia de comunicación apuntaba a la
 * URL de otro servicio y Distintivo ESR no traía URL— llevan un slug propuesto
 * por nosotros y aprobado por André, con su redirect desde la URL vieja de
 * WordPress en next.config.ts.
 *
 * Estudio de Doble Materialidad no está aquí: no tiene documento y su página
 * existente se mantiene como está.
 */

/** Un paso de la sección Proceso. Los documentos traen entre cuatro y cinco. */
export type PasoProceso = {
  /** Dos o tres palabras, según la plantilla de los documentos. */
  titulo: string;
  descripcion: string;
};

export type Pregunta = {
  pregunta: string;
  respuesta: string;
};

/**
 * Tabla de dos columnas dentro de un bloque.
 *
 * Hoy solo la usa Acompañamiento en sostenibilidad («Tipo de apoyo / Cómo se
 * traduce en valor»). Se modela en el tipo aunque sea de un solo servicio
 * porque es contenido validado, no una peculiaridad de formato del documento.
 */
export type TablaBloque = {
  encabezados: [string, string];
  filas: [string, string][];
};

/**
 * Los bloques «¿Para qué sirve?» y «Beneficios del servicio», que comparten
 * forma: un titular, un subtítulo y varios párrafos.
 */
export type BloqueServicio = {
  titulo: string;
  subtitulo: string;
  descripcion: string[];
  tabla?: TablaBloque;
};

export type ContenidoServicio = {
  /** Ruta prevista bajo /servicio/. Ver `slugPorValidar`. */
  slug: string;
  /**
   * Nombre del servicio, exactamente como aparece en `nombre` dentro de
   * servicios.ts. Es la única llave entre los dos módulos: la rueda de la Home
   * podrá enlazar a estas páginas resolviendo por este campo cuando existan.
   * Si se renombra un servicio en el catálogo, hay que renombrarlo también aquí.
   */
  servicio: string;
  /**
   * El slug no viene del campo LINK del documento sino de una propuesta nuestra,
   * y sigue pendiente de validación. Hoy no lo lleva ninguno: los dos que lo
   * llevaban quedaron aprobados. Se conserva para el próximo documento cuyo
   * LINK no sirva, para que no se publique una ruta que nadie ha revisado.
   */
  slugPorValidar?: true;
  hero: {
    titulo: string;
    subtitulo: string;
    descripcion: string[];
    /** Cuatro en todos los servicios. */
    puntos: string[];
  };
  paraQueSirve: BloqueServicio;
  beneficios: BloqueServicio;
  proceso: {
    descripcion: string;
    pasos: PasoProceso[];
  };
  /** Ocho en todos los servicios. */
  faq: Pregunta[];
  cta: {
    subtitulo: string;
    descripcion: string;
  };
};

export const CONTENIDO_SERVICIOS: ContenidoServicio[] = [
  {
    slug: "sroi-social-return-on-investment",
    servicio: "SROI: Retorno Social Sobre la Inversión",
    hero: {
      titulo: "SROI: retorno social sobre la inversión",
      subtitulo: "Demuestre impacto con evidencia defendible",
      descripcion: [
        "Contar beneficiarios no demuestra impacto. El retorno social sobre la inversión (SROI) permite estimar qué cambió, para quién y qué valor social puede atribuirse razonablemente a una inversión.",
        "En ResponSable transformamos datos, resultados y aprendizajes de programas comunitarios, voluntariado o proyectos de fundación en evidencia útil para decidir, mediante Teoría del Cambio, indicadores, proxies documentados y supuestos conservadores. El resultado no es solo un ratio, sino claridad para mejorar, priorizar y comunicar con rigor.",
      ],
      puntos: [
        "Mide el retorno social de programas e iniciativas",
        "Traduce resultados sociales en evidencia defendible",
        "Identifica qué programas generan mayor valor social",
        "Fortalece decisiones sobre inversión, mejora y continuidad",
      ],
    },
    paraQueSirve: {
      titulo: "Medición de impacto social",
      subtitulo: "Para dejar de medir solo actividades",
      descripcion: [
        "El SROI sirve para pasar de reportar actividades a comprender resultados. Hace visible si un programa produjo cambios relevantes, para quién, con qué evidencia y qué parte puede atribuirse razonablemente a la intervención.",
        "Durante el proceso, la empresa revisa su lógica de intervención, identifica brechas de información y cuestiona prioridades. Así, la medición se convierte en una herramienta para decidir qué programas sostener, escalar, rediseñar o dejar de hacer.",
      ],
    },
    beneficios: {
      titulo: "Decisiones sociales mejor sustentadas",
      subtitulo: "Qué sostener, ajustar, escalar o replantear",
      descripcion: [
        "La inversión social deja de sostenerse en intuición y empieza a sostenerse en evidencia. La empresa entiende qué valor social muestra cada programa, con qué solidez puede afirmarlo y dónde conviene mejorar datos, diseño o asignación de recursos.",
        "El SROI también cambia la conversación con Dirección y grupos de interés. Permite explicar resultados, supuestos y límites con transparencia, fundamentar presupuesto y comunicar impacto sin inflar cifras ni prometer más de lo que la evidencia sostiene.",
      ],
    },
    proceso: {
      descripcion:
        "Obtenga evidencia clara para decidir qué programas sociales sostener, ajustar, escalar o replantear.",
      pasos: [
        {
          titulo: "Alcance estratégico",
          descripcion:
            "Definimos programas, públicos, periodo, objetivos de medición y decisiones que el análisis SROI debe ayudar a tomar.",
        },
        {
          titulo: "Teoría de Cambio",
          descripcion:
            "Ordenamos la relación entre recursos, actividades, resultados inmediatos, cambios esperados e impacto social del programa.",
        },
        {
          titulo: "Evidencia y brechas",
          descripcion:
            "Revisamos métricas, reportes, beneficiarios y datos disponibles para identificar evidencia útil, vacíos críticos y límites de medición.",
        },
        {
          titulo: "Proxies y supuestos",
          descripcion:
            "Seleccionamos indicadores, proxies documentados y ajustes conservadores para estimar valor social sin inflar ni sobreatribuir resultados.",
        },
        {
          titulo: "Lectura estratégica",
          descripcion:
            "Integramos resultados, rangos, límites y recomendaciones para decidir qué programas sostener, ajustar, escalar o replantear.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué mide el SROI?",
        respuesta:
          "El retorno social sobre la inversión (SROI) mide el valor social generado por un programa, identificando qué cambió, para quién cambió y qué parte puede atribuirse razonablemente a la intervención.",
      },
      {
        pregunta: "¿Cuándo conviene hacerlo?",
        respuesta:
          "Conviene cuando la empresa necesita justificar inversión social, priorizar programas, rediseñar iniciativas, fortalecer reportes o demostrar resultados más allá de beneficiarios y actividades.",
      },
      {
        pregunta: "¿Qué programas aplica?",
        respuesta:
          "Puede aplicarse a programas comunitarios, voluntariado, educación, empleabilidad, salud, desarrollo local, fundaciones corporativas o iniciativas de inversión social.",
      },
      {
        pregunta: "¿Necesitamos muchos datos?",
        respuesta:
          "No necesariamente. Podemos partir de información existente, pero el proceso identifica brechas y define qué datos faltan para fortalecer futuras mediciones.",
      },
      {
        pregunta: "¿Qué son los proxies?",
        respuesta:
          "Son referencias económicas documentadas que permiten estimar el valor de resultados sociales que no tienen un precio directo, usando fuentes, supuestos, rangos y límites claros.",
      },
      {
        pregunta: "¿Evita sobreestimar impacto?",
        respuesta:
          "Sí. La metodología incorpora criterios conservadores para revisar atribución, resultados que habrían ocurrido de todos modos, límites de evidencia y sensibilidad de los supuestos.",
      },
      {
        pregunta: "¿Sirve para portafolios grandes?",
        respuesta:
          "Sí. Cuando hay muchos proyectos, podemos trabajar por tipologías y zonas para comparar resultados sin evaluar cada proyecto de forma aislada.",
      },
      {
        pregunta: "¿Mide retorno financiero empresarial?",
        respuesta:
          "No como objetivo principal. Este servicio mide valor social. Si la empresa necesita modelar retorno empresarial o financiero, se puede analizar en un alcance complementario.",
      },
    ],
    cta: {
      subtitulo: "Convierta impacto en decisiones",
      descripcion:
        "Le ayudamos a demostrar qué cambió, con qué evidencia y qué programas conviene sostener, ajustar, escalar o replantear.",
    },
  },
  {
    slug: "roi-rentabilidad-de-la-sostenibilidad",
    servicio: "ROI de la inversión social",
    hero: {
      titulo: "ROI de la inversión social",
      subtitulo: "Convierta inversión social en decisiones de negocio",
      descripcion: [
        "La inversión social puede generar valor para la empresa, pero demostrarlo exige más que contar beneficiarios o actividades. En ResponSable estimamos su retorno empresarial conectando los programas con resultados relevantes para el negocio y con la evidencia disponible. Así, la empresa puede decidir con mayor rigor qué programas sostener, ajustar o escalar.",
      ],
      puntos: [
        "Mide el retorno sobre la inversión social",
        "Conecta programas sociales con drivers de negocio",
        "Prioriza recursos con evidencia y supuestos trazables",
        "Construye un caso de negocio para Dirección y Finanzas",
      ],
    },
    paraQueSirve: {
      titulo: "Retorno empresarial medible",
      subtitulo: "Para demostrar valor ante Dirección",
      descripcion: [
        "El ROI de la inversión social permite identificar qué programas muestran una conexión más sólida con el negocio, mediante qué mecanismos y con qué nivel de evidencia. También ayuda a ordenar el portafolio con criterios comparables y a reconocer dónde faltan datos para sostener una conclusión.",
        "Con esta lectura, Dirección y Finanzas pueden revisar presupuesto, continuidad y escalamiento con mayor rigor. Al mismo tiempo, el área de sostenibilidad sabe qué información debe fortalecer y qué decisiones preparar para el siguiente ciclo.",
      ],
    },
    beneficios: {
      titulo: "Recursos mejor priorizados",
      subtitulo: "Evidencia para decidir con rigor",
      descripcion: [
        "La conversación con Dirección cambia. El área ya no presenta solo montos, beneficiarios e historias, sino un caso de negocio claro, prudente y trazable que complementa la narrativa social con evidencia empresarial. Esto permite discutir presupuesto, continuidad y escalamiento con mejores argumentos, sin inflar beneficios ni atribuir al programa resultados que no puede sostener.",
        "El proceso también fortalece la gestión de la inversión social: alinea a las áreas dueñas de los datos, hace explícitos los supuestos, evita duplicar beneficios e identifica qué información debe mejorar. Así, la empresa no solo evalúa mejor su portafolio actual, sino que construye una base más sólida para diseñar, medir y priorizar futuras inversiones sociales.",
      ],
    },
    proceso: {
      descripcion:
        "Obtenga un caso de negocio defendible para priorizar inversión social con drivers, KPIs internos, riesgos y escenarios conservadores.",
      pasos: [
        {
          titulo: "Ordenar portafolio",
          descripcion:
            "Clasificamos programas por tipologías y zonas, revisando inversión, objetivos, beneficiarios, madurez, métricas disponibles y calidad de datos.",
        },
        {
          titulo: "Mapear valor",
          descripcion:
            "Cruzamos portafolio con materialidad, riesgos y prioridades de negocio para identificar drivers como talento, continuidad, licencia social o reputación.",
        },
        {
          titulo: "Alinear datos",
          descripcion:
            "Definimos KPIs internos, fuentes, responsables y límites de evidencia para traducir cada driver a información medible y trazable.",
        },
        {
          titulo: "Modelar escenarios",
          descripcion:
            "Construimos caso base, sensibilidad y escenarios, cuidando supuestos conservadores, trazabilidad metodológica y reglas anti doble conteo.",
        },
        {
          titulo: "Caso de negocio",
          descripcion:
            "Integramos ROI, escenarios, supuestos y recomendaciones para decidir qué inversión social sostener, ajustar, escalar o replantear.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué mide este servicio?",
        respuesta:
          "El ROI de la inversión social estima el retorno sobre la inversión social desde la perspectiva empresarial, conectando programas con drivers de negocio, KPIs internos y supuestos defendibles.",
      },
      {
        pregunta: "¿En qué se diferencia del SROI?",
        respuesta:
          "SROI mide valor social generado para beneficiarios o comunidades. Este servicio mide retorno empresarial. Ambos análisis pueden complementarse, pero responden preguntas distintas.",
      },
      {
        pregunta: "¿Cuándo conviene contratarlo?",
        respuesta:
          "Conviene cuando Dirección o Finanzas piden justificar presupuesto, comparar programas, ordenar un portafolio amplio o decidir qué iniciativas sostener, ajustar o escalar.",
      },
      {
        pregunta: "¿Qué datos necesitamos?",
        respuesta:
          "Idealmente se requieren datos internos de inversión, talento, operación, riesgos, seguridad, continuidad o relación comunitaria. Si no existen, identificamos brechas críticas.",
      },
      {
        pregunta: "¿Sirve para portafolios grandes?",
        respuesta:
          "Sí. Trabajamos por tipologías y zonas comparables para evitar una evaluación proyecto por proyecto que aumente costos sin mejorar la decisión.",
      },
      {
        pregunta: "¿Cómo evitan inflar resultados?",
        respuesta:
          "Usamos caso base conservador, escenarios, sensibilidad, trazabilidad de supuestos y reglas anti doble conteo para diferenciar beneficios demostrables, probables e hipotéticos.",
      },
      {
        pregunta: "¿Qué áreas deben participar?",
        respuesta:
          "Normalmente participan sostenibilidad, fundación, finanzas, riesgos, recursos humanos, operaciones, seguridad, relaciones comunitarias y otras áreas dueñas de datos relevantes.",
      },
      {
        pregunta: "¿Qué recibimos al final?",
        respuesta:
          "Recibe drivers y KPIs definidos, supuestos documentados, modelo de retorno, escenarios y un caso de negocio para priorizar la inversión social.",
      },
    ],
    cta: {
      subtitulo: "Construya su caso de negocio",
      descripcion:
        "Le ayudamos a traducir su inversión social en retorno sobre la inversión social, con datos, escenarios y decisiones claras.",
    },
  },
  {
    slug: "diagnostico-de-sostenibilidad",
    servicio: "Diagnóstico de Sostenibilidad",
    hero: {
      titulo: "Diagnóstico de sostenibilidad",
      subtitulo: "Mida su madurez antes de decidir dónde invertir",
      descripcion: [
        "Tener políticas, iniciativas o reconocimientos no garantiza una gestión sólida de sostenibilidad. En ResponSable evaluamos qué tan integrada está en la operación y en las decisiones, y contrastamos el desempeño con referentes del sector. Así, su empresa obtiene una lectura objetiva para saber qué fortalecer antes de invertir, reportar o construir su estrategia de sostenibilidad.",
      ],
      puntos: [
        "Evalúa el nivel real de madurez en sostenibilidad",
        "Contrasta la gestión interna con referentes del sector",
        "Detecta brechas entre lo definido y lo que ocurre en la operación",
        "Convierte resultados en prioridades y recomendaciones de negocio",
      ],
    },
    paraQueSirve: {
      titulo: "Claridad para priorizar",
      subtitulo: "Para invertir donde más se necesita",
      descripcion: [
        "Para invertir donde más se necesita",
        "Sin un diagnóstico, la empresa corre el riesgo de diseñar estrategias sobre percepciones, duplicar esfuerzos, perseguir reconocimientos sin bases internas o invertir en iniciativas que no atienden sus principales brechas.",
        "El diagnóstico de sostenibilidad permite conocer qué prácticas ya están consolidadas, dónde falta gobernanza, implementación, medición o coordinación, y qué temas necesitan atención prioritaria. Con esa evidencia, Dirección puede asignar recursos con mayor criterio y el equipo de sostenibilidad puede definir la siguiente etapa de su gestión con mayor seguridad.",
      ],
    },
    beneficios: {
      titulo: "Lo que funciona. Lo que falta. Lo que sigue.",
      subtitulo: "Fortalezas, brechas y siguientes pasos",
      descripcion: [
        "Fortalezas, brechas y siguientes pasos",
        "El diagnóstico no entrega solo una calificación y una línea de madurez. Explica por qué la empresa se encuentra en determinado nivel de madurez y qué necesita cambiar para avanzar. Analiza políticas, procesos, responsables, indicadores, seguimiento, implementación y comunicación, además de la visión de las áreas y de Dirección.",
        "ResponSable adapta la evaluación al sector, la operación y el nivel de madurez de cada empresa. El resultado combina evidencia interna, benchmark y criterio experto para definir qué mantener, qué corregir y qué fortalecer antes de construir una estrategia, preparar un informe o buscar un reconocimiento.",
      ],
    },
    proceso: {
      descripcion:
        "Combinamos evidencia interna, visión directiva y referentes externos para convertir la evaluación en recomendaciones claras y accionables.",
      pasos: [
        {
          titulo: "Definir alcance",
          descripcion:
            "Acordamos unidades, áreas, temas, metodología y referentes según los objetivos, el sector y el nivel de madurez de la organización.",
        },
        {
          titulo: "Analizar gestión",
          descripcion:
            "Revisamos políticas, procesos, iniciativas, indicadores, responsables, certificaciones y estudios previos para entender cómo se gestiona actualmente la sostenibilidad.",
        },
        {
          titulo: "Contrastar contexto",
          descripcion:
            "Realizamos un benchmark con empresas del sector, referentes o marcos relevantes para identificar tendencias, buenas prácticas y brechas competitivas.",
        },
        {
          titulo: "Evaluar madurez",
          descripcion:
            "Aplicamos una herramienta adaptada al negocio y realizamos sesiones o entrevistas para contrastar lo definido con lo que realmente se implementa y gestiona.",
        },
        {
          titulo: "Orientar decisiones",
          descripcion:
            "Integramos resultados internos y externos para identificar fortalezas, riesgos, brechas y recomendaciones priorizadas por tema, área o unidad.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué es un diagnóstico de sostenibilidad?",
        respuesta:
          "Es una evaluación estructurada de la forma en que la empresa gobierna, implementa, mide y comunica su gestión de sostenibilidad, con el fin de conocer su nivel de madurez y sus principales brechas.",
      },
      {
        pregunta: "¿Qué temas puede evaluar?",
        respuesta:
          "El diagnóstico puede abarcar cualquier tema de sostenibilidad relevante para la empresa. Podemos construir una herramienta personalizada según el negocio, el sector, los riesgos y las prioridades internas, o adoptar y adaptar un referente nacional o internacional que resulte pertinente. El objetivo no es evaluar todo por igual, sino analizar con profundidad aquello que la empresa necesita gestionar mejor.",
      },
      {
        pregunta: "¿Siempre se basa en ISO 26000?",
        respuesta:
          "No. ISO 26000 puede utilizarse como base o combinarse con referentes sectoriales, requisitos de clientes, prioridades internas y otros marcos nacionales o internacionales.",
      },
      {
        pregunta: "¿ISO 26000 es certificable?",
        respuesta:
          "No. ISO 26000 es una guía internacional, no una norma certificable. El diagnóstico evalúa el nivel de alineación y madurez frente a sus recomendaciones.",
      },
      {
        pregunta: "¿En qué se diferencia de un estudio de materialidad?",
        respuesta:
          "El diagnóstico analiza cómo está gestionando actualmente la empresa la sostenibilidad. La materialidad identifica qué temas deben priorizarse por sus impactos, riesgos y oportunidades.",
      },
      {
        pregunta: "¿Por qué no hacer solo un autodiagnóstico?",
        respuesta:
          "Una herramienta interna puede aportar una primera lectura, pero suele depender de percepciones. ResponSable contrasta respuestas con documentos, prácticas, entrevistas y benchmark para ofrecer una evaluación más objetiva y recomendaciones aplicables.",
      },
      {
        pregunta: "¿Puede aplicarse a varias plantas o empresas de un grupo?",
        respuesta:
          "Sí. Utilizamos una metodología común para comparar niveles de madurez, detectar brechas particulares e identificar oportunidades de colaboración entre unidades.",
      },
      {
        pregunta: "¿Qué recibimos al final?",
        respuesta:
          "Recibe una lectura del nivel de madurez, fortalezas, brechas, resultados del benchmark y recomendaciones priorizadas para orientar las siguientes decisiones de sostenibilidad.",
      },
    ],
    cta: {
      subtitulo: "Conozca su nivel de madurez y defina qué sigue",
      descripcion:
        "Evaluamos su gestión de sostenibilidad, la comparamos con empresas de su sector y convertimos fortalezas y brechas en recomendaciones claras para avanzar.",
    },
  },
  {
    slug: "iso-26000",
    servicio: "Diagnóstico ISO 26000",
    hero: {
      titulo: "Diagnóstico ISO 26000",
      subtitulo: "Una visión integral para saber qué fortalecer",
      descripcion: [
        "La norma ISO 26000 permite evaluar la responsabilidad social de forma integral. En ResponSable adaptamos sus siete materias fundamentales a su negocio y analizamos qué está definido, documentado, aplicado, medido y comunicado. Así, su empresa identifica fortalezas, brechas y prioridades claras para mejorar su gestión.",
      ],
      puntos: [
        "Evalúa las siete materias fundamentales de ISO 26000",
        "Analiza qué está definido, documentado, aplicado, medido y comunicado",
        "Detecta políticas o prácticas que las áreas todavía no conocen",
        "Convierte fortalezas y brechas en prioridades de mejora",
      ],
    },
    paraQueSirve: {
      titulo: "De políticas a prácticas consistentes",
      subtitulo: "Para saber qué tan integrada está la responsabilidad social",
      descripcion: [
        "Para saber qué tan integrada está la responsabilidad social",
        "Una empresa puede contar con políticas, procesos e iniciativas y, aun así, gestionar cada tema de forma aislada. Una política puede existir, pero no ser conocida por quienes deben aplicarla. Una práctica puede funcionar en un área, pero no estar documentada, medida o compartida con el resto de la organización.",
        "El diagnóstico ISO 26000 permite entender dónde la gestión pierde consistencia y qué necesita cada área para avanzar. Con esa lectura, Dirección y el equipo de sostenibilidad pueden alinear responsabilidades, cerrar vacíos entre lo definido, lo aplicado y lo comunicado, reducir riesgos, potenciar fortalezas y tomar decisiones con mayor solidez.",
      ],
    },
    beneficios: {
      titulo: "Lo que funciona. Lo que falta. Lo que sigue.",
      subtitulo: "Una lectura integral para fortalecer la gestión",
      descripcion: [
        "Una lectura integral para fortalecer la gestión",
        "La empresa obtiene mucho más que una calificación. Comprende por qué se encuentra en determinado nivel de madurez y distingue qué prácticas están formalizadas, cuáles se aplican de forma consistente y cuáles todavía no son conocidas por las personas que deben implementarlas.",
        "No aplicamos ISO 26000 como un cuestionario genérico. Adaptamos la evaluación al negocio, validamos la información con las áreas y analizamos tanto la gestión como su nivel de conocimiento y comunicación. Los hallazgos muestran qué buenas prácticas conviene potenciar, dónde existen riesgos o vacíos y qué acciones pueden fortalecer la coordinación interna y la toma de decisiones.ResponSable, a través de nuestra Dirección General, participó en las negociaciones internacionales de ISO 26000. Esta experiencia aporta conocimiento directo sobre la lógica de la guía y permite aplicarla con rigor, sin reducirla a una lista de requisitos.",
      ],
    },
    proceso: {
      descripcion:
        "Adaptamos ISO 26000 al negocio y evaluamos qué se define, documenta, aplica, conoce, mide y comunica para convertir los hallazgos en prioridades claras de mejora.",
      pasos: [
        {
          titulo: "Adaptar alcance",
          descripcion:
            "Ajustamos la herramienta al sector, la operación, las unidades participantes y los objetivos del diagnóstico, conservando la visión integral de ISO 26000.",
        },
        {
          titulo: "Analizar evidencia",
          descripcion:
            "Revisamos políticas, procesos, iniciativas, indicadores, responsables y materiales de comunicación para conocer qué existe y cómo se gestiona.",
        },
        {
          titulo: "Evaluar gestión",
          descripcion:
            "Realizamos sesiones e entrevistas para validar qué se aplica, quién lo conoce, cómo se mide y qué tan consistente es su implementación entre áreas.",
        },
        {
          titulo: "Comparar sector",
          descripcion:
            "Analizamos empresas del sector y otros marcos pertinentes para identificar tendencias, buenas prácticas y oportunidades de mejora.",
        },
        {
          titulo: "Definir mejoras",
          descripcion:
            "Integramos evidencia, entrevistas y benchmark para establecer el nivel de madurez, las fortalezas, las brechas y las recomendaciones por materia, área o unidad.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué es la norma ISO 26000?",
        respuesta:
          "Es una guía internacional que ayuda a integrar la responsabilidad social en las decisiones, los procesos y las relaciones de una organización mediante siete materias fundamentales. Aplica para todo tipo de organizaciones: empresas, entidad de gobierno, gremio, universidad, organización de la sociedad civil etc.",
      },
      {
        pregunta: "¿Por qué elegir ISO 26000 para realizar el diagnóstico?",
        respuesta:
          "Porque la norma ISO26000 ofrece una visión integral y reconocida internacionalmente. Permite analizar de forma conectada la gobernanza, los impactos, la operación y las relaciones con grupos de interés, sin limitar la evaluación a un distintivo o tema específico.",
      },
      {
        pregunta: "¿ISO 26000 sigue vigente y puede certificarse?",
        respuesta:
          "ISO 26000:2010 continúa vigente. No es certificable porque es una guía: contiene orientación y recomendaciones, no requisitos de un sistema de gestión.",
      },
      {
        pregunta:
          "¿Cuáles son las siete materias fundamentales de la norma ISO26000?",
        respuesta:
          "Gobernanza organizacional, derechos humanos, prácticas laborales, medio ambiente, prácticas justas de operación, asuntos de consumidores, y participación activa y desarrollo de la comunidad.",
      },
      {
        pregunta:
          "¿Qué significa evaluar la comunicación en un contexto de diagnóstico ISO26000?",
        respuesta:
          "Significa revisar si las políticas, los procesos y las prácticas son conocidos y comprendidos por las personas que deben aplicarlos, y si la empresa comunica sus avances con claridad a los públicos correspondientes. No se limita a la comunicación externa.",
      },
      {
        pregunta:
          "¿La misma herramienta de diagnóstico se aplica a todas las empresas o unidades de negocios?",
        respuesta:
          "No. Adaptamos la herramienta de diagnóstico ISO26000 al negocio, el sector, la operación, los riesgos y el nivel de madurez. Cuando participan varias unidades de negocio, mantenemos criterios comunes que permiten comparar resultados sin ignorar sus diferencias.",
      },
      {
        pregunta:
          "¿En qué se diferencia de un diagnóstico de sostenibilidad personalizado?",
        respuesta:
          "Un diagnóstico de sostenibilidad personalizado puede construirse a partir de temas seleccionados o distintos referentes. Este servicio utiliza ISO 26000 como marco central y revisa integralmente sus siete materias fundamentales.",
      },
      {
        pregunta: "¿Qué recibimos al final del diagnóstico ISO26000?",
        respuesta:
          "Como parte del cierre del diagnóstico ISO26000, recibe una evaluación del nivel de madurez, fortalezas y brechas por materia fundamental, resultados del benchmark y recomendaciones para orientar los siguientes pasos.",
      },
    ],
    cta: {
      subtitulo: "Evalúe su madurez con ISO 26000",
      descripcion:
        "Analizamos qué está definido, aplicado, medido y comunicado para identificar dónde reducir riesgos, qué fortalezas potenciar y cómo tomar decisiones con mayor solidez.",
    },
  },
  {
    slug: "estrategia-de-comunicacion-en-sostenibilidad",
    servicio: "Estrategia de Comunicación en Sostenibilidad",
    hero: {
      titulo: "Estrategia de comunicación en sostenibilidad",
      subtitulo: "Comunique sostenibilidad con evidencia, contexto y criterio",
      descripcion: [
        "Comunicar sostenibilidad sin criterio expone a la empresa: exagerar genera desconfianza y callar invisibiliza avances reales. En ResponSable analizamos lo que la empresa hace, dice y puede demostrar, lo contrastamos con el sector y líderes en la materia, y lo convertimos en una estrategia clara de públicos, mensajes, canales, evidencias y límites. Así, cada comunicación fortalece la reputación en lugar de ponerla en riesgo.",
      ],
      puntos: [
        "Define qué comunicar, a quién y con qué evidencia",
        "Compara su comunicación con el sector y líderes",
        "Ordena mensajes, públicos, canales, riesgos y límites",
        "Evita exagerar avances o esconder información relevante",
      ],
    },
    paraQueSirve: {
      titulo: "Comunicación ESG con criterio",
      subtitulo: "Para tomar mejores decisiones de comunicación",
      descripcion: [
        "Una empresa puede avanzar mucho en sostenibilidad y aun así no lograr que se entienda. La estrategia de comunicación ordena la narrativa completa: define qué temas priorizar, qué mensajes necesita cada público, qué canales utilizar y con qué evidencia sostener cada afirmación.",
        "El resultado es una comunicación menos reactiva y más estratégica. Sostenibilidad, Comunicación, Jurídico y Dirección trabajan con criterios compartidos para dar visibilidad a los avances correctos, explicar retos con transparencia y construir confianza de forma consistente en el tiempo.",
      ],
    },
    beneficios: {
      titulo: "Confianza con sustento",
      subtitulo: "Reputación protegida ante públicos clave",
      descripcion: [
        "La comunicación deja de improvisarse mensaje por mensaje y empieza a gestionarse con criterios compartidos. La empresa sabe qué avances puede comunicar, qué evidencia necesita, qué temas requieren mayor contexto y dónde existen oportunidades para diferenciarse frente al sector.",
        "Esto reduce riesgos de greenwashing y greenhushing, agiliza validaciones internas y convierte avances reales en confianza verificable. El resultado es una comunicación más creíble, consistente y útil para fortalecer relaciones con los públicos que importan al negocio.",
      ],
    },
    proceso: {
      descripcion:
        "Reciba una matriz práctica para decidir qué comunicar, a quién, por qué canal y con qué sustento, según riesgos y prioridades ESG.",
      pasos: [
        {
          titulo: "Diagnóstico narrativo",
          descripcion:
            "Revisamos estrategia, materiales, mensajes, evidencias y temas sensibles para detectar brechas entre lo que la empresa hace, dice y necesita explicar.",
        },
        {
          titulo: "Benchmark comunicacional",
          descripcion:
            "Comparamos empresas del sector y líderes en sostenibilidad para identificar estándares, buenas prácticas, riesgos reputacionales y oportunidades de diferenciación.",
        },
        {
          titulo: "Públicos prioritarios",
          descripcion:
            "Priorizamos stakeholders, intereses, expectativas, dudas y canales para evitar mensajes genéricos o decisiones de comunicación desconectadas del negocio.",
        },
        {
          titulo: "Validación de mensajes",
          descripcion:
            "Clasificamos resultados, avances, compromisos, aspiraciones y metas futuras para definir evidencia, contexto, límites y nivel de afirmación permitido.",
        },
        {
          titulo: "Matriz estratégica",
          descripcion:
            "Integramos públicos, canales, mensajes, evidencia, riesgos, límites y tono en una matriz práctica para tomar decisiones de comunicación.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué incluye este servicio?",
        respuesta:
          "La Estrategia de comunicación en sostenibilidad incluye diagnóstico narrativo, benchmark comunicacional, mapa de públicos, mensajes clave, criterios de evidencia y matriz estratégica.",
      },
      {
        pregunta: "¿Cuándo conviene contratarlo?",
        respuesta:
          "Conviene antes de publicar informes, comunicar reconocimientos, responder exigencias ESG, lanzar campañas o alinear mensajes entre Sustentabilidad, Comunicación y Jurídico.",
      },
      {
        pregunta: "¿Qué problema resuelve?",
        respuesta:
          "Resuelve la falta de criterios para decidir qué decir, qué no decir todavía, cómo sostenerlo y cómo adaptarlo a cada público.",
      },
      {
        pregunta: "¿Qué aporta el benchmark?",
        respuesta:
          "El benchmark muestra cómo comunican sostenibilidad empresas del sector o líderes en la materia, para detectar estándares, riesgos y oportunidades de diferenciación.",
      },
      {
        pregunta: "¿Evita riesgos de greenwashing?",
        respuesta:
          "Sí. La Estrategia de comunicación en sostenibilidad define evidencia, contexto, límites y nivel de afirmación permitido para cada mensaje.",
      },
      {
        pregunta: "¿También previene greenhushing?",
        respuesta:
          "Sí. Identifica avances relevantes que conviene comunicar para evitar silencios que parezcan falta de acción, poca transparencia o ausencia de resultados.",
      },
      {
        pregunta: "¿Es una campaña?",
        respuesta:
          "No. Una campaña ejecuta mensajes. Este servicio define primero públicos, mensajes, evidencias, riesgos y criterios para comunicar con rigor.",
      },
      {
        pregunta: "¿Qué recibimos al final?",
        respuesta:
          "Una matriz estratégica con públicos prioritarios, canales, mensajes clave, evidencia, límites y criterios de tono para tomar mejores decisiones de comunicación.",
      },
    ],
    cta: {
      subtitulo: "Convierta avances en confianza verificable",
      descripcion:
        "Le ayudamos a ordenar públicos, mensajes, evidencias y límites para comunicar sostenibilidad con rigor, reducir riesgos y fortalecer relaciones clave.",
    },
  },
  {
    slug: "distintivo-esr",
    servicio: "Distintivo ESR",
    hero: {
      titulo: "Postular al Distintivo ESR",
      subtitulo: "Postule con claridad, evidencia y control",
      descripcion: [
        "ResponSable le ayuda a postular al Distintivo ESR sin convertir el proceso en una persecución de documentos. Definimos responsabilidades, ordenamos evidencias y ajustamos el apoyo a la capacidad de su equipo, desde capacitación hasta gestión integral. Así reduce retrabajos, fortalece la documentación de prácticas reales y aprovecha la postulación para profesionalizar su gestión.",
      ],
      puntos: [
        "Elige cuánto acompañamiento y trabajo delegar",
        "Coordina áreas, responsables y fechas",
        "Documenta mejor prácticas que ya existen",
        "Reduce retrabajos y carga para sostenibilidad",
      ],
    },
    paraQueSirve: {
      titulo: "Ordena la postulación al Distintivo ESR",
      subtitulo: "Involucra a las áreas y fortalece la gestión",
      descripcion: [
        "El Distintivo ESR permite revisar de forma integral cómo la empresa define, implementa, documenta y da seguimiento a sus prácticas ambientales, sociales y de gobernanza. La postulación al reconocimiento del CEMEFI ayuda a reconocer fortalezas, identificar oportunidades de mejora y demostrar que la responsabilidad social se construye desde distintas áreas y procesos de la organización.",
        "ResponSable inicia el proyecto con un kickoff que capacita y alinea a las áreas alrededor de un objetivo común. Aclaramos qué solicita cada indicador, qué debe aportar cada responsable y cómo organizar tiempos y evidencias. Así, el área encargada de sostenibilidad deja de perseguir documentos, gana control sobre el proceso y promueve una colaboración más efectiva.",
      ],
    },
    beneficios: {
      titulo: "Fortalece la gestión de la RSE mientras postula",
      subtitulo:
        "Reduce retrabajos y convierte cada evidencia en una ruta de mejora",
      descripcion: [
        "La empresa no solo integra un expediente más sólido. También obtiene una visión clara de qué prácticas ya están consolidadas, cuáles necesitan documentarse mejor y dónde existen brechas que requieren atención. Esto permite enfocar esfuerzos, reducir retrabajos y dar continuidad a la gestión durante el año.",
        "Para ResponSable, el Distintivo ESR no es el punto final. Al cerrar la postulación, entregamos un diagnóstico con fortalezas, áreas de mejora y recomendaciones para fortalecer la gestión de sostenibilidad y llegar mejor preparados al siguiente ciclo. Así, el reconocimiento se convierte en una herramienta para decidir qué mejorar, no en un ejercicio aislado.",
      ],
    },
    proceso: {
      descripcion:
        "Logre una postulación ordenada, bien sustentada y adaptada al nivel de apoyo que su empresa necesita.",
      pasos: [
        {
          titulo: "Elegir modalidad",
          descripcion:
            "Revisamos experiencia, capacidad interna, calendario y documentación para definir cuánto acompañamiento necesita su empresa y qué trabajo conservará el equipo.",
        },
        {
          titulo: "Capacitar y alinear",
          descripcion:
            "Realizamos un kickoff para explicar el Distintivo ESR, aclarar responsabilidades y alinear a las áreas en criterios, tareas y fechas.",
        },
        {
          titulo: "Ordenar evidencias",
          descripcion:
            "Relacionamos cada reactivo con la documentación disponible para identificar qué está bien sustentado, qué necesita documentarse mejor y qué requiere fortalecerse.",
        },
        {
          titulo: "Documentar la gestión",
          descripcion:
            "Según la modalidad, orientamos o coordinamos la documentación de prácticas para que las evidencias reflejen con claridad cómo opera la empresa.",
        },
        {
          titulo: "Cerrar e impulsar la mejora",
          descripcion:
            "Completamos la postulación según la modalidad elegida. Analizamos resultados y los convertimos en una ruta clara para fortalecer la gestión de la RSE y preparar el siguiente ciclo.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué es el Distintivo ESR de Cemefi?",
        respuesta:
          "El Distintivo Empresa Socialmente Responsable, conocido como Distintivo ESR, es un reconocimiento otorgado por Cemefi a empresas que demuestran cómo gestionan su responsabilidad social empresarial mediante indicadores y evidencias. No es una certificación ni significa que la empresa haya alcanzado un desempeño perfecto en sostenibilidad.",
      },
      {
        pregunta: "¿Qué evalúa el Distintivo ESR?",
        respuesta:
          "El modelo revisa prácticas ambientales, sociales y de gobernanza, además de aspectos vinculados con el contexto global. No evalúa únicamente si la empresa realiza determinadas acciones. También analiza si cuenta con políticas, responsables, procesos, registros, seguimiento y mecanismos de mejora en responsabilidad social empresarial. Los indicadores aplicables dependen de la categoría y de la convocatoria vigente.",
      },
      {
        pregunta: "¿Cómo postular al Distintivo ESR?",
        respuesta:
          "Para postular al Distintivo ESR, la empresa debe inscribirse en la convocatoria de Cemefi, responder los indicadores, identificar las evidencias correspondientes, integrar el expediente y cargar la información dentro del calendario establecido. Conviene iniciar con anticipación y nombrar a una persona líder que coordine la participación de áreas como Recursos Humanos, Legal, Compras, Operaciones, Medio Ambiente, Comunicación y Dirección. ResponSable puede capacitar al equipo, revisar avances o gestionar integralmente la postulación.",
      },
      {
        pregunta: "¿Qué evidencias pide el Distintivo ESR?",
        respuesta:
          "Pueden solicitarse políticas, códigos, procedimientos, planes, registros, indicadores, reportes y otros documentos que demuestren cómo funciona la gestión de la responsabilidad social empresarial. No se trata de producir archivos únicamente para postular. Ayudamos a documentar mejor las prácticas reales para que la evaluación refleje con mayor precisión lo que la empresa define, implementa, supervisa y mejora en sostenibilidad.",
      },
      {
        pregunta:
          "¿Qué pasa si faltan evidencias para la postulación al Distintivo ESR?",
        respuesta:
          "Primero identificamos qué situación existe. La práctica puede realizarse, pero estar poco documentada. El documento puede existir, pero no demostrar suficientemente la gestión. O puede haber una brecha real que requiera definir o implementar una nueva práctica. Cada caso necesita una respuesta distinta. ResponSable ayuda a fortalecer la documentación de la gestión real de la RSE y señala con claridad cuándo el reto va más allá de preparar un archivo.",
      },
      {
        pregunta: "¿Qué acompañamiento para el Distintivo ESR necesito?",
        respuesta:
          "Capacitación: le compartimos nuestro conocimiento y experiencia. Así su equipo coordina, clasifica y carga la postulación con la metodología aprendida. Coach: su equipo opera el proceso y ResponSable aporta metodología, revisa avances, resuelve dudas y orienta decisiones clave. Modalidad integral: ResponSable se hace cargo de la postulación al Distintivo ESR de A hasta Z. Capacita, alinea y da seguimiento a las áreas, coordina la recopilación, clasifica las evidencias, integra el expediente y realiza la carga, mientras la empresa proporciona y valida la información.",
      },
      {
        pregunta: "¿Por qué elegir a ResponSable para el ESR?",
        respuesta:
          "Convertimos una convocatoria compleja en un proyecto ordenado. No nos limitamos a reunir documentos de RSE o cargar evidencias en una plataforma. Iniciamos con un kickoff de capacitación y alineación de las áreas, definimos responsabilidades, revisamos si las evidencias demuestran prácticas reales y ayudamos a documentar mejor la gestión de la RSE. Al cerrar el proceso, entregamos un diagnóstico para orientar mejoras y preparar el siguiente ciclo. Gwenaelle Gerard, directora de ResponSable, es consultora acreditada por Cemefi.",
      },
      {
        pregunta: "¿Garantizan obtener el Distintivo ESR?",
        respuesta:
          "No. La evaluación y la decisión final corresponden exclusivamente a Cemefi. Nuestro trabajo es fortalecer las condiciones que sí dependen de la empresa: una gestión real, evidencias consistentes, participación de las áreas y un expediente bien sustentado. Cuando el diagnóstico revela brechas estructurales, también podemos acompañar, mediante un proyecto complementario, el desarrollo e implementación de una estrategia de sostenibilidad alineada con los objetivos del negocio. Una gestión más sólida robustece la postulación y, además, mejora decisiones, coordinación y continuidad.",
      },
    ],
    cta: {
      subtitulo: "Elija el acompañamiento adecuado para su postulación",
      descripcion:
        "Revisamos juntos la capacidad del equipo, el estado de las evidencias y el calendario para definir la modalidad más adecuada para su postulación.",
    },
  },
  {
    slug: "cursos-talleres-para-empresas",
    servicio: "Cursos y talleres de sostenibilidad para empresas",
    hero: {
      titulo: "Cursos y talleres de sostenibilidad para empresas",
      subtitulo:
        "Capacitación práctica para aplicar la sostenibilidad en el negocio",
      descripcion: [
        "Diseñamos experiencias de aprendizaje que preparan a cada audiencia para cumplir mejor su función, desde supervisar riesgos y oportunidades hasta integrar la estrategia en la operación. Con casos reales, lenguaje cercano y facilitadores que también asesoran empresas, transformamos temas complejos en comprensión útil y capacidad interna.",
      ],
      puntos: [
        "Contenido adaptado a cada nivel jerárquico",
        "Casos de negocio y ejemplos de sus áreas",
        "Facilitadores con experiencia real en consultoría",
        "Formatos desde sensibilización hasta programas aplicados",
      ],
    },
    paraQueSirve: {
      titulo: "Capacitación corporativa en sostenibilidad",
      subtitulo: "Desarrolla capacidades según cada área y nivel jerárquico",
      descripcion: [
        "La sostenibilidad avanza con mayor claridad y coordinación cuando el Consejo sabe qué preguntas hacer para supervisar riesgos y oportunidades, el Comité alinea áreas y da seguimiento a las prioridades, el área de sostenibilidad gestiona con mayor método y criterio, y cada función integra la sostenibilidad en las decisiones que le corresponden.",
        "Para lograrlo, cada audiencia necesita una capacitación diferente. Adaptamos el vocabulario, la profundidad y los ejemplos a las responsabilidades de los participantes, e incorporamos casos de negocio del sector y situaciones de sus propias áreas. Así, los conceptos se vuelven relevantes, comprensibles y aplicables a la realidad de la empresa, fortaleciendo su capacidad para decidir, coordinarse y avanzar.",
      ],
    },
    beneficios: {
      titulo: "Más capacidad para gestionar la sostenibilidad",
      subtitulo:
        "Alinea funciones, mejora conversaciones y reduce fricciones internas",
      descripcion: [
        "Una capacitación bien diseñada ayuda a construir un lenguaje común, aclarar responsabilidades y formular mejores preguntas sobre sostenibilidad. Esto reduce interpretaciones distintas, facilita conversaciones más productivas y mejora la coordinación entre quienes deben supervisar, decidir, gestionar o implementar.",
        "Según el objetivo y la audiencia, incorporamos casos de negocio, referentes sectoriales, ejemplos de las propias áreas y ejercicios adaptados. Estos recursos permiten conectar los conceptos con la realidad de la empresa, comparar enfoques y comprender mejor cómo aplicar la sostenibilidad desde cada función.",
      ],
    },
    proceso: {
      descripcion:
        "Transformamos experiencia de consultoría en aprendizaje práctico, adaptado a la audiencia y vinculado con las decisiones y responsabilidades que enfrenta en la empresa.",
      pasos: [
        {
          titulo: "Definir el objetivo",
          descripcion:
            "Aclaramos qué necesita comprender, decidir o hacer mejor la audiencia y qué objetivo empresarial debe apoyar la capacitación en sostenibilidad.",
        },
        {
          titulo: "Conocer la audiencia",
          descripcion:
            "Revisamos responsabilidades, conocimiento previo, vocabulario y contexto para ajustar el enfoque y evitar contenidos genéricos.",
        },
        {
          titulo: "Diseñar la experiencia",
          descripcion:
            "Seleccionamos contenidos, casos de negocio, ejemplos de las áreas, ejercicios y materiales adecuados para los participantes y el tiempo disponible.",
        },
        {
          titulo: "Impartir desde la experiencia",
          descripcion:
            "Compartimos casos, errores frecuentes y aprendizajes de proyectos reales durante la mayor parte de la sesión para conectar la teoría con situaciones empresariales concretas.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué cursos de sostenibilidad para empresas ofrecen?",
        respuesta:
          "Ofrecemos pláticas, sesiones ejecutivas, talleres prácticos y programas de varias sesiones. Cada capacitación corporativa en sostenibilidad se diseña según la audiencia, el sector, el conocimiento previo y el resultado que busca la organización. Podemos adaptar contenidos existentes o construir un programa completamente a la medida.",
      },
      {
        pregunta: "¿Qué temas incluyen los talleres de sostenibilidad?",
        respuesta:
          "En lugar de presentar un catálogo rígido, seleccionamos los temas más relevantes para las decisiones y responsabilidades de cada audiencia. Podemos partir de una inducción en sostenibilidad, ESG o RSE, avanzar hacia herramientas de gestión o profundizar en temas técnicos como estrategia de sostenibilidad, doble materialidad, gobernanza, gestión de riesgos ESG, indicadores de impacto social, comunicación en sostenibilidad, compras sostenibles, etc.",
      },
      {
        pregunta: "¿A quiénes se dirige la capacitación en sostenibilidad?",
        respuesta:
          "Capacitamos a personas que recién asumen la responsabilidad de sostenibilidad, áreas de RSE, comités, colaboradores, alta dirección, y consejos de administración. También diseñamos programas para desarrollar la cadena de valor y mejorar su desempeño en sostenibilidad. El lenguaje, la profundidad y los casos empresariales de sostenibilidad presentados cambian según la función, el nivel jerárquico y la experiencia de los participantes así como el contexto de la empresa.",
      },
      {
        pregunta: "¿Qué formato de capacitación corporativa conviene?",
        respuesta:
          "Una plática o webinar permite sensibilizar y abrir conversación con audiencias amplias. También impartimos conferencias para convenciones anuales, encuentros empresariales y reuniones corporativas. Una sesión ejecutiva ayuda a líderes y consejos a comprender implicaciones estratégicas. Un taller incorpora ejercicios además de casos. Un programa de varias sesiones conviene cuando se busca desarrollar capacidades en sostenibilidad con mayor profundidad y continuidad.",
      },
      {
        pregunta: "¿Cómo personalizan los cursos y talleres?",
        respuesta:
          "Primero definimos qué necesita comprender, decidir o aplicar mejor la audiencia. Después revisamos la estrategia de la empresa, el sector, las responsabilidades, el conocimiento previo y el vocabulario de los participantes. También investigamos referentes y buenas prácticas mediante un benchmark sectorial. Con esa información adaptamos contenidos, casos de negocio, ejemplos, materiales y profundidad.",
      },
      {
        pregunta: "¿Cuánto duran y cómo se imparten?",
        respuesta:
          "La duración y modalidad de nuestros cursos y talleres de sostenibilidad se definen junto con la empresa, según el objetivo, la audiencia, el número de participantes y el nivel de aplicación esperado. Una sensibilización puede durar entre 60 y 90 minutos. Un taller suele requerir dos o más horas. Los programas especializados pueden distribuirse en varias sesiones. Pueden impartirse de forma presencial, virtual, e-learning o híbrida.",
      },
      {
        pregunta: "¿Cómo evalúan una capacitación en sostenibilidad?",
        respuesta:
          "Desde el diseño de la capacitación en sostenibilidad acordamos qué debe comprender, decidir o aplicar mejor la audiencia al terminar. Según el formato, podemos incorporar preguntas iniciales, ejercicios, evaluaciones de aprendizaje, encuestas o sesiones de seguimiento. La evaluación se adapta al alcance y permite conocer avances sin atribuir a una sola capacitación en sostenibilidad cambios que también dependen del liderazgo, los procesos y la continuidad.",
      },
      {
        pregunta: "¿Por qué elegir a ResponSable para capacitar?",
        respuesta:
          "Nuestros facilitadores también asesoran proyectos reales de sostenibilidad. Los contenidos parten de la experiencia acompañando a más de 150 empresas de distintos sectores y tamaños. Por eso conectamos los conceptos con casos de negocio, decisiones, riesgos y situaciones observadas en la práctica, utilizando un lenguaje adecuado para cada audiencia.",
      },
    ],
    cta: {
      subtitulo:
        "Active hoy las capacidades que su estrategia de sostenibilidad necesita",
      descripcion:
        "Revisamos qué necesitan comprender, decidir o aplicar los participantes para diseñar una capacitación práctica, relevante y conectada con las prioridades de sostenibilidad de su empresa.",
    },
  },
  {
    slug: "acompanamiento-sostenibilidad",
    servicio: "Acompañamiento en sostenibilidad",
    hero: {
      titulo: "Acompañamiento en sostenibilidad",
      subtitulo: "Su brazo derecho en sostenibilidad",
      descripcion: [
        "La agenda de sostenibilidad suele crecer más rápido que el equipo que debe gestionarla.",
        "Estrategia, indicadores, reportes, distintivos, comunicación, políticas, comités, capacitación, proveedores, inversión social, grupos de interés y solicitudes internas compiten por tiempo, presupuesto y atención.",
        "En ResponSable acompañamos a los equipos de sostenibilidad como un brazo derecho externo: ayudamos a ordenar prioridades, destrabar pendientes, revisar decisiones, fortalecer entregables, facilitar sesiones y avanzar proyectos que necesitan criterio experto.",
        "El acompañamiento puede tomar distintas formas: una iguala mensual, un periodo determinado de trabajo o horas puntuales de asesoría tipo coach. El alcance se adapta según la necesidad, la madurez del equipo y el nivel de involucramiento requerido.",
        "El objetivo es que el área gane capacidad sin aumentar estructura fija, sin contratar cada necesidad como un proyecto separado y sin avanzar sola en temas que pueden afectar la calidad de sus decisiones, su credibilidad interna o el cumplimiento de sus compromisos.",
      ],
      puntos: [
        "Ordena prioridades y proyectos de sostenibilidad",
        "Avanza tareas puntuales sin contratar cada proyecto por separado",
        "Recibe guía experta, seguimiento y retroalimentación",
        "Adapta el acompañamiento por horas, periodo o iguala mensual",
      ],
    },
    paraQueSirve: {
      titulo: "Sostenibilidad con apoyo experto",
      subtitulo: "Para avanzar sin perder foco",
      descripcion: [
        "Cuando se acumulan pendientes, cambian las prioridades o falta tiempo para profundizar, la gestión de sostenibilidad puede volverse reactiva y dejar riesgos o compromisos importantes sin suficiente atención. Nuestro acompañamiento pone orden: define qué debe avanzar primero, qué hará cada parte y cómo convertir las horas disponibles en decisiones y resultados concretos.",
        "La empresa reduce improvisación, aprovecha mejor su presupuesto y mantiene continuidad entre proyectos. Esto permite responder con mayor solidez ante Dirección, atender compromisos y enfocar la agenda de sostenibilidad en los riesgos y oportunidades que realmente importan.",
      ],
    },
    beneficios: {
      titulo: "Capacidad sin estructura fija",
      subtitulo: "Flexibilidad, criterio y avance continuo",
      descripcion: [
        "El principal beneficio es sumar capacidad sin aumentar estructura fija. ResponSable puede guiar, cuestionar y retroalimentar al equipo como coach, o asumir tareas específicas cuando se necesita ejecución. El apoyo se adapta a la madurez, la carga de trabajo y las prioridades reales de cada momento.",
        "Además de resolver pendientes, el acompañamiento fortalece el criterio y la autonomía del equipo. El resultado es una agenda de sostenibilidad mejor gestionada: prioridades claras, menor carga interna, proyectos que sí avanzan y mayor capacidad para responder a riesgos, oportunidades, compromisos y expectativas de grupos de interés.",
      ],
      tabla: {
        encabezados: ["Tipo de apoyo", "Cómo se traduce en valor"],
        filas: [
          [
            "Criterio estratégico",
            "Revisar prioridades, orientar decisiones y validar enfoques antes de presentarlos internamente.",
          ],
          [
            "Ejecución de pendientes",
            "Avanzar documentos, matrices, planes de trabajo, políticas, presentaciones o materiales específicos.",
          ],
          [
            "Revisión de entregables",
            "Retroalimentar reportes, indicadores, contenidos, diagnósticos o avances preparados por el equipo interno.",
          ],
          [
            "Facilitación de sesiones",
            "Acompañar reuniones, comités, talleres o espacios de alineación con áreas clave.",
          ],
          [
            "Seguimiento y orden",
            "Mantener claridad sobre horas utilizadas, pendientes, responsables y próximos pasos.",
          ],
        ],
      },
    },
    proceso: {
      descripcion:
        "Trabajamos con una dinámica flexible y ordenada para convertir horas de acompañamiento en avances concretos de sostenibilidad.",
      pasos: [
        {
          titulo: "Definir prioridades",
          descripcion:
            "Alineamos los temas a trabajar según las necesidades del equipo, la agenda de sostenibilidad, los riesgos del negocio y los compromisos existentes.",
        },
        {
          titulo: "Acordar alcance",
          descripcion:
            "Definimos horas, responsabilidades, entregables, ritmo de trabajo y nivel de participación de ResponSable: guía, revisión, ejecución o acompañamiento mixto.",
        },
        {
          titulo: "Avanzar proyectos",
          descripcion:
            "Apoyamos al equipo en tareas estratégicas u operativas: diagnósticos, indicadores, políticas, comités, reportes, comunicación, capacitación, distintivos o proyectos específicos.",
        },
        {
          titulo: "Dar seguimiento",
          descripcion:
            "Revisamos avances, horas utilizadas, pendientes y decisiones clave para ajustar prioridades y mantener el acompañamiento enfocado en resultados.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué es el acompañamiento en sostenibilidad?",
        respuesta:
          "Es un esquema flexible de asesoría para apoyar al equipo de sostenibilidad en prioridades, proyectos, dudas técnicas, revisión de entregables y toma de decisiones.",
      },
      {
        pregunta: "¿En qué se diferencia de contratar un proyecto específico?",
        respuesta:
          "Un proyecto específico tiene alcance cerrado. El acompañamiento permite trabajar varias necesidades bajo una misma bolsa de horas, ajustando prioridades según avance y urgencia.",
      },
      {
        pregunta: "¿Puede ser una iguala mensual?",
        respuesta:
          "Sí. Puede estructurarse como iguala mensual, acompañamiento por un periodo determinado o asesoría puntual por horas, según la necesidad y presupuesto de la empresa.",
      },
      {
        pregunta: "¿Qué tipo de temas puede cubrir?",
        respuesta:
          "Puede incluir estrategia de sostenibilidad, indicadores, reportes, políticas, comités, capacitación, comunicación, distintivos, diagnósticos, proveedores o revisión de proyectos específicos.",
      },
      {
        pregunta: "¿ResponSable ejecuta o solo asesora?",
        respuesta:
          "Depende del alcance. Podemos ejecutar tareas concretas, acompañar como brazo derecho del equipo o trabajar en modalidad coach, guiando y retroalimentando al equipo interno.",
      },
      {
        pregunta: "¿Cómo se definen las prioridades?",
        respuesta:
          "Se definen al inicio del acompañamiento y pueden revisarse periódicamente. Acordamos qué se trabajará, qué hará la empresa, qué hará ResponSable y qué avances se esperan.",
      },
      {
        pregunta: "¿Cómo se da seguimiento al uso de horas?",
        respuesta:
          "Se puede establecer una dinámica de seguimiento semanal, quincenal o mensual, incluyendo horas utilizadas, avances concretos, pendientes y siguientes decisiones.",
      },
      {
        pregunta:
          "¿Cómo evitamos que las horas se dispersen en demasiados temas?",
        respuesta:
          "Definimos prioridades, responsables y objetivos de trabajo desde el inicio. Esto permite usar las horas en temas que realmente aportan valor y evitar que el acompañamiento se vuelva reactivo.",
      },
    ],
    cta: {
      subtitulo: "Avance su agenda de sostenibilidad con apoyo experto",
      descripcion:
        "Le ayudamos a ordenar prioridades, resolver pendientes y avanzar proyectos de sostenibilidad con un esquema flexible, claro y adaptado a su equipo.",
    },
  },
  {
    slug: "estrategia-sostenibilidad",
    servicio: "Estrategia de Sostenibilidad",
    hero: {
      titulo: "Estrategia de sostenibilidad",
      subtitulo: "Ponga rumbo a su sostenibilidad",
      descripcion: [
        "Tener iniciativas de sostenibilidad no equivale a tener una estrategia. En ResponSable convertimos diagnósticos, estudios de doble materialidad, riesgos e iniciativas aisladas en una ruta alineada al negocio, con prioridades, responsables e indicadores. Así, la empresa sabe dónde enfocar recursos y cómo avanzar con mayor coordinación.",
      ],
      puntos: [
        "Define pilares, objetivos y líneas de acción",
        "Alinea sostenibilidad con visión de negocio",
        "Convierte estudios de materialidad, benchmark y tendencias en estrategia accionable",
        "Prioriza acciones con criterios de factibilidad",
      ],
    },
    paraQueSirve: {
      titulo: "Sostenibilidad con rumbo",
      subtitulo: "Para pasar de iniciativas a estrategia",
      descripcion: [
        "Una estrategia de sostenibilidad transforma información dispersa en criterios para decidir qué temas gestionar, con qué objetivos y qué acciones deben avanzar primero. Aprovecha estudios de materialidad, benchmarks, tendencias y la experiencia acumulada para convertir información que ya existe en criterios claros de actuación.",
        "Cuando distintas áreas avanzan con prioridades propias o una estrategia global debe aterrizarse al contexto local, establece una agenda compartida para anticipar riesgos, aprovechar oportunidades y tomar decisiones de sostenibilidad con mayor consistencia.",
      ],
    },
    beneficios: {
      titulo: "Prioridades accionables",
      subtitulo: "Recursos, riesgos y responsables claros",
      descripcion: [
        "La sostenibilidad deja de depender de proyectos aislados y empieza a gestionarse con una misma lógica en toda la organización. Dirección y las áreas clave pueden distinguir qué iniciativas conviene mantener, fortalecer, replantear o dejar de priorizar, y entender cómo contribuyen a los objetivos del negocio.",
        "La estrategia se aterriza en un plan de acción viable, con responsables, tiempos, indicadores y prioridades. Esto mejora la coordinación interna, evita dispersar recursos y permite concentrar capacidad en las acciones que aportan mayor valor al negocio y a sus grupos de interés.",
      ],
    },
    proceso: {
      descripcion:
        "Construimos una estrategia y plan de acción desde el análisis del contexto hasta una hoja de ruta con responsables, indicadores y prioridades.",
      pasos: [
        {
          titulo: "Analizar contexto",
          descripcion:
            "Revisamos documentos, iniciativas vigentes, estudios de materialidad o doble materialidad, benchmark sectorial, tendencias y compromisos de competidores para entender la posición actual.",
        },
        {
          titulo: "Definir modelo",
          descripcion:
            "Trabajamos con Dirección para consensuar prioridades, misión, visión, pilares, objetivos, líneas de acción y alineación con la estrategia del negocio.",
        },
        {
          titulo: "Priorizar acciones",
          descripcion:
            "Mapeamos acciones internas, identificamos oportunidades y usamos una matriz de priorización y factibilidad para enfocar esfuerzos.",
        },
        {
          titulo: "Integrar plan",
          descripcion:
            "Aterrizamos quick wins, acciones de corto y mediano plazo, responsables, indicadores, metas, aliados y criterios de seguimiento.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Cuándo conviene hacer una estrategia?",
        respuesta:
          "Conviene cuando existen iniciativas aisladas, cuando se busca pasar de filantropía a gestión estratégica o cuando una estrategia global debe aterrizarse al contexto local.",
      },
      {
        pregunta: "¿Qué incluye este servicio?",
        respuesta:
          "Incluye análisis interno y externo, revisión de insumos estratégicos, benchmark sectorial, definición del modelo, priorización de acciones y construcción del plan de acción.",
      },
      {
        pregunta: "¿Necesitamos un estudio de materialidad?",
        respuesta:
          "Es ideal contar con un estudio de materialidad o doble materialidad, porque permite construir sobre temas ya priorizados. Si no existe, revisamos otros insumos y brechas.",
      },
      {
        pregunta: "¿Qué diferencia hay con un plan?",
        respuesta:
          "La estrategia define rumbo, pilares, objetivos y criterios de decisión. El plan de acción aterriza iniciativas, responsables, plazos, indicadores y recursos necesarios.",
      },
      {
        pregunta: "¿Cómo se priorizan las acciones?",
        respuesta:
          "Se usa una matriz de priorización y factibilidad adaptada a la empresa, considerando impacto esperado, recursos, riesgos, capacidades internas y alineación estratégica.",
      },
      {
        pregunta: "¿Quién debe participar?",
        respuesta:
          "Normalmente participan Dirección, sostenibilidad, operaciones, comunicación, recursos humanos, finanzas, compras y otras áreas clave según el alcance y el sector.",
      },
      {
        pregunta: "¿Sirve para tropicalizar estrategias globales?",
        respuesta:
          "Sí. Podemos adaptar una estrategia global al contexto local, considerando regulación, cultura, grupos de interés, prioridades sociales, riesgos y capacidades operativas.",
      },
      {
        pregunta: "¿Qué recibimos al final?",
        respuesta:
          "Recibe un modelo de sostenibilidad con pilares, objetivos y líneas de acción, más un plan de acción con prioridades, responsables, tiempos e indicadores.",
      },
    ],
    cta: {
      subtitulo: "Ordene sus prioridades de sostenibilidad",
      descripcion:
        "Le ayudamos a convertir diagnósticos, riesgos e iniciativas dispersas en una estrategia clara, con foco, responsables, tiempos e indicadores.",
    },
  },
  {
    slug: "informe-de-sostenibilidad",
    servicio: "Informe de Sostenibilidad",
    hero: {
      titulo: "Informe de sostenibilidad",
      subtitulo:
        "Convierta su gestión de sostenibilidad en una narrativa clara",
      descripcion: [
        "Un informe de sostenibilidad no sólo comunica lo que la empresa ha hecho. Pone a prueba la calidad de su gestión. Al ordenar datos, contrastar avances con la doble materialidad y revisar referentes nacionales e internacionales, la empresa identifica brechas, cuestiona prioridades, ajusta objetivos y convierte lo aprendido en una narrativa transparente, creíble y útil para el negocio.",
        "ResponSable puede liderar todo el proceso o acompañar al equipo en modalidad coach.",
      ],
      puntos: [
        "Estructura información, indicadores y avances de sostenibilidad",
        "Alinea el informe a estrategia, grupos de interés y estándares",
        "Fortalece narrativa, redacción, diseño y comunicación",
        "Puede realizarse como informe completo, brief o modalidad coach",
      ],
    },
    paraQueSirve: {
      titulo: "Sostenibilidad bien comunicada",
      subtitulo: "Para reportar avances con claridad y credibilidad",
      descripcion: [
        "Un informe de sostenibilidad sirve para rendir cuentas con transparencia sobre resultados, retos, objetivos y compromisos. Permite responder con mayor claridad a clientes, inversionistas, casa matriz, colaboradores y otros grupos de interés, sin limitar la comunicación a una recopilación de logros.",
        "Su mayor valor está en lo que la empresa descubre durante el proceso. Qué está midiendo bien, qué información le falta, qué prioridades debe revisar y qué decisiones conviene fortalecer. El informe se convierte así en una oportunidad para aprender de la propia gestión y ajustar la estrategia de sostenibilidad con mayor criterio.",
      ],
    },
    beneficios: {
      titulo: "Información con estructura",
      subtitulo: "Datos, narrativa y diseño alineados",
      descripcion: [
        "El mayor beneficio no es recibir un informe terminado. Es salir del proceso con una gestión de sostenibilidad más clara, mejor documentada y con prioridades más sólidas. La empresa entiende mejor sus avances, identifica brechas y fortalece la responsabilidad de las áreas que generan la información.",
        "El resultado es un informe creíble y útil para tomar decisiones, respaldado por datos y alineado, cuando corresponde, a referentes nacionales o internacionales como GRI, SASB, IFRS S1/S2, ODS, Pacto Mundial u otros marcos pertinentes.",
      ],
    },
    proceso: {
      descripcion:
        "Elaboramos o acompañamos el informe de sostenibilidad con una metodología que ordena información, fortalece la trazabilidad de datos y traduce resultados en comunicación clara.",
      pasos: [
        {
          titulo: "Diagnosticar información",
          descripcion:
            "Revisamos documentos internos, estrategia, iniciativas, indicadores, informes previos, materialidad o doble materialidad, referentes aplicables y expectativas de grupos de interés para definir el enfoque del informe de sostenibilidad.",
        },
        {
          titulo: "Definir narrativa",
          descripcion:
            "Construimos el outline, tono, concepto, estructura de capítulos, temas a destacar y criterios para comunicar la información con claridad, coherencia, transparencia y foco estratégico.",
        },
        {
          titulo: "Recopilar insumos",
          descripcion:
            "Diseñamos o ajustamos fichas de recopilación, coordinamos solicitudes de información, revisamos datos, identificamos brechas y damos seguimiento a áreas proveedoras de información.",
        },
        {
          titulo: "Desarrollar contenido",
          descripcion:
            "Redactamos, revisamos o retroalimentamos los capítulos del informe, cuidando consistencia, claridad, indicadores, mensajes clave, corrección de estilo y alineación a referentes nacionales o internacionales.",
        },
        {
          titulo: "Diseñar y activar",
          descripcion:
            "Coordinamos diseño, resumen ejecutivo, traducción o materiales complementarios, según el alcance, para facilitar la lectura y ampliar el uso del informe ante grupos de interés.",
        },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué tipo de informe podemos desarrollar?",
        respuesta:
          "Podemos apoyar en informes de sostenibilidad, reportes corporativos, briefs de sostenibilidad o documentos más acotados para comunicar avances a grupos de interés específicos.",
      },
      {
        pregunta:
          "¿Qué diferencia hay entre un brief y un informe de sostenibilidad?",
        respuesta:
          "El brief es más corto y ágil, útil para comunicar acciones y avances principales. El informe es más amplio, estructurado y puede alinearse a estándares, indicadores y compromisos de largo plazo.",
      },
      {
        pregunta: "¿Puede hacerse en modalidad coach?",
        respuesta:
          "Sí. En modalidad coach, el equipo interno desarrolla el informe y ResponSable guía, revisa y retroalimenta el índice, narrativa, redacción, mensajes clave, indicadores y recomendaciones de diseño.",
      },
      {
        pregunta: "¿El estudio de materialidad ayuda a construir el informe?",
        respuesta:
          "Sí. Un estudio de materialidad o doble materialidad ayuda a priorizar los temas del informe, conectar el contenido con impactos, riesgos y oportunidades, y evitar que el reporte sea solo una recopilación de actividades.",
      },
      {
        pregunta: "¿ResponSable puede hacerse cargo de todo el informe?",
        respuesta:
          "Sí. Podemos liderar diagnóstico, recopilación de información, entrevistas, redacción, corrección de estilo, alineación a referentes, diseño, traducción y materiales complementarios, según el alcance contratado.",
      },
      {
        pregunta: "¿A qué referentes puede alinearse el informe?",
        respuesta:
          "Depende de la necesidad de la empresa. Podemos trabajar con referentes como GRI, SASB, IFRS S1/S2, ODS, Pacto Mundial u otros marcos nacionales o internacionales relevantes para el sector y sus grupos de interés.",
      },
      {
        pregunta: "¿Cómo cuidamos la calidad de los datos?",
        respuesta:
          "Revisamos consistencia, contexto, fuentes, brechas e indicadores disponibles. No auditamos cifras, pero sí ayudamos a identificar datos incompletos, inconsistencias y oportunidades de mejora para futuros ciclos de reporte.",
      },
      {
        pregunta: "¿Cómo evitamos que el informe termine en un cajón?",
        respuesta:
          "Desde el inicio definimos públicos, mensajes clave, formato y posibles materiales de comunicación. Así el informe puede servir como herramienta de transparencia, posicionamiento y relación con grupos de interés.",
      },
    ],
    cta: {
      subtitulo: "Haga que su informe sí comunique valor",
      descripcion:
        "Le ayudamos a convertir información, indicadores y avances de sostenibilidad en un informe claro, creíble y útil para sus grupos de interés.",
    },
  },
];

export function getContenidoServicio(
  slug: string,
): ContenidoServicio | undefined {
  return CONTENIDO_SERVICIOS.find((s) => s.slug === slug);
}

/**
 * Contenido de un servicio a partir de su nombre exacto en servicios.ts.
 *
 * Devuelve undefined mientras ese servicio no tenga documento validado, que hoy
 * es el caso de la mayoría del catálogo. Es el camino inverso de
 * `rutaDeServicio` en casos.ts: aquel resuelve la ruta ya publicada, este dice
 * si existe contenido para publicarla.
 */
export function contenidoDeServicio(
  nombre: string,
): ContenidoServicio | undefined {
  return CONTENIDO_SERVICIOS.find((s) => s.servicio === nombre);
}
