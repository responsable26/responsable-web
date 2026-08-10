/**
 * Catálogo de servicios de los cuatro cuadrantes. Vivía dentro del componente
 * de pestañas; se extrae aquí para que el contenido se pueda editar sin tocar
 * la interfaz, y para que otras rutas (una futura página de servicios) puedan
 * consumir los mismos datos sin duplicarlos.
 *
 * Módulo de datos puro: sin JSX ni "use client", así que lo puede importar
 * tanto un componente de servidor como uno de cliente.
 */

export type Servicio = {
  nombre: string;
  /**
   * Resumen de 2-3 líneas para la ficha del servicio. Se deriva estrictamente
   * de `puntos`: no introduce capacidades, metodologías, plazos, cifras,
   * estándares ni entregables que no estén en esas viñetas.
   */
  descripcion: string;
  /** Viñetas de detalle. Se muestran al desplegar la fila. */
  puntos: string[];
  /** Ruta de la página del servicio, cuando existe. */
  href?: string;
  /**
   * Marca explícita de que este servicio no debe enlazar nunca, aunque en el
   * futuro se cree una página con ese nombre. Sin esto, un barrido posterior que
   * asigne rutas por nombre le pondría un enlace por descuido.
   */
  noEnlazable?: boolean;
};

export type Cuadrante = {
  numero: number;
  pregunta: string;
  colorToken: "amarillo" | "magenta" | "lavanda" | "teal";
  intro: string;
  servicios: Servicio[];
};

export const CUADRANTES: Cuadrante[] = [
  {
    numero: 1,
    pregunta: "¿Dónde Estoy?",
    colorToken: "amarillo",
    intro:
      "Ya sea que tu empresa apenas comience en sostenibilidad o lleve años trabajando en ella, siempre vale la pena detenerse y mirar con rigor dónde está hoy. Evaluamos lo que se está haciendo, qué tan bien está funcionando y qué impacto está generando.",
    servicios: [
      {
        nombre: "Benchmark en Sostenibilidad",
        descripcion:
          "Situamos a su empresa frente a competidores y líderes de mercado para ver con precisión qué la separa del liderazgo. El resultado no es un comparativo más, sino perspectiva para decidir dónde conviene diferenciarse.",
        puntos: [
          "Comparamos tu desempeño frente a competidores y líderes de mercado.",
          "Identificamos qué te separa del liderazgo en sostenibilidad.",
          "Revelamos fortalezas, rezagos y oportunidades de diferenciación.",
          "Detectamos prácticas que hoy ya son estándar en el mercado.",
          "Traducimos el benchmark en perspectiva estratégica para decidir mejor.",
        ],
      },
      {
        nombre: "SROI: Retorno Social Sobre la Inversión",
        descripcion:
          "Medimos el retorno social de sus programas y convertimos los resultados en evidencia que resiste el escrutinio. Con ella podrá decidir en qué iniciativas invertir, cuáles ajustar y cuáles sostener en el tiempo.",
        puntos: [
          "Mide el retorno social de programas e iniciativas",
          "Traduce resultados sociales en evidencia defendible",
          "Identifica qué programas generan mayor valor social",
          "Fortalece decisiones sobre inversión, mejora y continuidad",
        ],
      },
      {
        nombre: "ROI de la inversión social",
        descripcion:
          "Este análisis conecta su inversión social con los drivers del negocio y ordena la asignación de recursos sobre supuestos trazables, hasta sostener un caso de negocio que Dirección y Finanzas puedan revisar.",
        puntos: [
          "Mide el retorno sobre la inversión social",
          "Conecta programas sociales con drivers de negocio",
          "Prioriza recursos con evidencia y supuestos trazables",
          "Construye un caso de negocio para Dirección y Finanzas",
        ],
      },
      {
        nombre: "Diagnóstico Social y Línea base comunitaria",
        descripcion:
          "Analizamos el entorno social donde opera su empresa y fijamos una línea base contra la cual medir después. Con ese punto de partida, las decisiones de inversión y relacionamiento dejan de apoyarse en percepciones sueltas.",
        puntos: [
          "Analizamos el contexto social en el que opera tu empresa.",
          "Identificamos percepciones, expectativas y tensiones relevantes.",
          "Detectamos factores que pueden fortalecer o debilitar la relación con la comunidad.",
          "Establecemos una línea base para medir evolución, impacto y riesgos sociales.",
          "Damos una base sólida para fortalecer decisiones de inversión social y relacionamiento.",
        ],
      },
      {
        nombre: "Diagnóstico de Sostenibilidad",
        descripcion:
          "¿Qué tan madura es realmente su gestión de sostenibilidad? Contrastamos lo que está definido con lo que ocurre en la operación y con los referentes del sector, y cerramos con prioridades en términos de negocio.",
        puntos: [
          "Evalúa el nivel real de madurez en sostenibilidad",
          "Contrasta la gestión interna con referentes del sector",
          "Detecta brechas entre lo definido y lo que ocurre en la operación",
          "Convierte resultados en prioridades y recomendaciones de negocio.",
        ],
      },
      {
        nombre: "Mapeo de la Sostenibilidad en la Cadena de Valor",
        descripcion:
          "Recorremos su cadena de valor eslabón por eslabón para ubicar dónde se concentran la exposición y la dependencia, y dónde hay margen de colaboración. El mapa muestra qué actores pesan de verdad en su operación.",
        puntos: [
          "Medimos el nivel de madurez en sostenibilidad a lo largo de la cadena de valor.",
          "Identificamos actores, eslabones y puntos críticos con mayor relevancia estratégica.",
          "Analizamos dónde se concentra mayor exposición, riesgo, oportunidad o dependencia.",
          "Detectamos oportunidades de colaboración y fortalecimiento en compras sostenibles.",
        ],
      },
      {
        nombre: "Evaluación de la Inversión Social",
        descripcion:
          "Revisamos su portafolio social completo: qué tan conocido es, qué tan alineado está con los objetivos del negocio y qué tan consistente resulta en conjunto. La salida le indica qué escalar, qué ajustar y qué cerrar.",
        puntos: [
          "Hacemos visible qué tan conocida, útil y relevante es tu inversión social.",
          "Verificamos la alineación de tus iniciativas con los objetivos del negocio.",
          "Analizamos la lógica, pertinencia y consistencia de tu portafolio social.",
          "Identificamos qué iniciativas conviene ajustar, escalar o cerrar.",
          "Recomendamos dónde concentrar recursos para maximizar valor estratégico.",
          "Damos argumentos sólidos para defender presupuestos y fortalecer decisiones futuras.",
        ],
      },
      {
        nombre: "Diagnóstico ISO 26000",
        descripcion:
          "Evaluamos su gestión contra las siete materias fundamentales de la ISO 26000, distinguiendo lo que está documentado de lo que de verdad se aplica, se mide y se comunica. Las brechas salen ordenadas por prioridad.",
        puntos: [
          "Evalúa las siete materias fundamentales de ISO 26000",
          "Analiza qué está definido, documentado, aplicado, medido y comunicado",
          "Detecta políticas o prácticas que las áreas todavía no conocen",
          "Convierte fortalezas y brechas en prioridades de mejora",
        ],
      },
    ],
  },
  {
    numero: 2,
    pregunta: "¿Adónde Voy?",
    colorToken: "magenta",
    intro:
      "Cuando el punto de partida es claro, el siguiente paso es definir el rumbo. Te ayudamos a visualizar hacia dónde debe avanzar tu empresa, qué ambición tiene sentido plantear y qué prioridades estratégicas pueden generar mayor valor para el negocio y su entorno.",
    servicios: [
      {
        nombre: "Estudio de Doble Materialidad",
        descripcion:
          "Determinamos qué temas son materiales para su empresa y para sus grupos de interés, integrando la mirada de impacto con la financiera. El resultado orienta estrategia, gestión de riesgos e informe de sostenibilidad.",
        href: "/servicio/estudio-doble-materialidad/",
        puntos: [
          "Identifica temas materiales para el negocio y sus grupos de interés",
          "Integra materialidad de impacto y materialidad financiera",
          "Orienta estrategia, riesgos e informe de sostenibilidad",
          "Adapta el alcance según presupuesto, madurez y nivel de consulta.",
        ],
      },
      {
        nombre: "Taller de Reflexión Estratégica",
        descripcion:
          "Una sesión con sus tomadores de decisión para poner en duda el rumbo actual y alinearlos sobre ambición y prioridades. Hacemos las preguntas incómodas antes de que se conviertan en retrabajo, y cerramos con decisiones.",
        puntos: [
          "Abrimos un espacio ejecutivo para cuestionar con rigor el rumbo actual.",
          "Aterrizamos por qué la sostenibilidad importa en términos de negocio.",
          "Alineamos a los tomadores de decisión sobre ambición, prioridades y criterios estratégicos.",
          "Hacemos las preguntas difíciles para evitar esfuerzos sin sentido o retrabajos.",
          "Damos claridad para que la estrategia se construya desde las prioridades del negocio.",
          "Traducimos la reflexión en decisiones de alto nivel que orientan el siguiente paso.",
        ],
      },
      {
        nombre: "Desarrollo de Indicadores de Impacto",
        descripcion:
          "Fijamos junto con su equipo los indicadores que permiten saber si la estrategia avanza de verdad. Seleccionamos métricas factibles y ligadas a sus objetivos, de modo que la sostenibilidad se vuelva una agenda medible.",
        puntos: [
          "Definimos indicadores que permiten medir si la estrategia realmente avanza.",
          "Alineamos los KPIs con objetivos, prioridades y líneas de acción.",
          "Seleccionamos métricas factibles, útiles y relevantes para la toma de decisiones.",
          "Hacemos visible dónde la estrategia genera valor y dónde necesita ajustes.",
          "Convertimos la sostenibilidad en una agenda medible, gestionable y defendible.",
        ],
      },
      {
        nombre: "Estrategia de Compras Sostenibles",
        descripcion:
          "Llevamos la sostenibilidad al momento en que su empresa decide a quién le compra. Definimos criterios y prioridades a partir de sus vulnerabilidades y dependencias reales, con la continuidad operativa como referencia.",
        puntos: [
          "Integramos la sostenibilidad en decisiones clave de compra y abastecimiento.",
          "Identificamos dónde existen mayores vulnerabilidades, dependencias y oportunidades de mejora.",
          "Definimos criterios y prioridades para fortalecer compras más responsables.",
          "Alineamos las decisiones de abastecimiento con los riesgos sociales, ambientales y operativos del negocio.",
          "Damos una base para fortalecer la cadena de suministro y proteger la continuidad operativa.",
        ],
      },
      {
        nombre: "Estrategia de Inversión Social",
        descripcion:
          "Cuando la inversión social se acumula en iniciativas sueltas, deja de rendir. Le damos una lógica: focos temáticos, territorios, poblaciones y criterios de selección, con la gobernanza necesaria para sostener el portafolio.",
        puntos: [
          "Pasamos de iniciativas aisladas a una inversión social con lógica estratégica.",
          "Definimos focos temáticos, territorios, poblaciones prioritarias y criterios de selección.",
          "Alineamos la inversión social con riesgos, oportunidades y objetivos del negocio.",
          "Estructuramos un portafolio con gobernanza y criterios de priorización.",
          "Damos claridad para concentrar recursos donde generan mayor valor compartido.",
        ],
      },
      {
        nombre: "Estrategia de Comunicación en Sostenibilidad",
        descripcion:
          "Definimos qué comunicar, a quién y con qué evidencia detrás. Ordenamos mensajes, públicos y canales, y fijamos los límites que separan un avance bien contado de una afirmación que su empresa no puede sostener.",
        puntos: [
          "Define qué comunicar, a quién y con qué evidencia",
          "Compara tu comunicación con el sector y líderes",
          "Ordena mensajes, públicos, canales, riesgos y límites",
          "Evita exagerar avances o esconder información relevante",
        ],
      },
    ],
  },
  {
    numero: 3,
    pregunta: "¿Cómo lo Hago?",
    colorToken: "lavanda",
    intro:
      "Tener claridad no basta. Hay que traducirla en acción. Diseñamos la ruta, las capacidades y las herramientas necesarias para que la sostenibilidad se implemente de forma ordenada, creíble y alineada con la realidad de tu empresa.",
    servicios: [
      {
        nombre: "Distintivo ESR",
        descripcion:
          "Acompañamos su postulación al Distintivo ESR en la medida en que usted decida delegar. Coordinamos áreas, responsables y fechas, y documentamos las prácticas que ya existen para que el área no cargue sola con el proceso.",
        puntos: [
          "Elija cuánto acompañamiento y trabajo delegar",
          "Coordina áreas, responsables y fechas",
          "Documenta mejor prácticas que ya existen",
          "Reduce retrabajos y carga para sostenibilidad",
        ],
      },
      {
        nombre: "Comité de Sostenibilidad",
        descripcion:
          "Ayudamos a constituir el comité que da seguimiento a la estrategia y a que funcione: roles definidos, dinámicas de trabajo y materiales listos. Es la gobernanza que sostiene los compromisos entre una sesión y la siguiente.",
        puntos: [
          "Ayudamos a constituir un comité que dé seguimiento real a la estrategia.",
          "Definimos roles, dinámicas y materiales para activar la participación de áreas clave.",
          "Fortalecemos la gobernanza necesaria para que la sostenibilidad avance con orden.",
          "Damos continuidad a decisiones, compromisos y prioridades.",
          "Convertimos la estrategia en una agenda viva dentro de la empresa.",
        ],
      },
      {
        nombre: "Reconocimientos y Certificaciones",
        descripcion:
          "No todos los reconocimientos valen lo que cuestan. Analizamos cuáles convienen a su empresa por metodología, reputación e inversión, y ordenamos la evidencia y la participación interna para llegar con solidez.",
        puntos: [
          "Te acompañamos en la obtención de reconocimientos y certificaciones relevantes.",
          "Analizamos cuáles realmente convienen por metodología, reputación e inversión.",
          "Ordenamos evidencia, procesos y participación interna para avanzar con solidez.",
          "Ayudamos a involucrar a distintas áreas en un objetivo común.",
          "Damos una ruta más estratégica para fortalecer gestión, credibilidad y posicionamiento.",
        ],
      },
      {
        nombre: "Plan de relacionamiento comunitario",
        descripcion:
          "Mapeamos a los actores que influyen en su licencia social para operar y estructuramos el vínculo con ellos: objetivos, responsables, indicadores y ritmos. Así la relación deja de depender de quién ocupe el puesto.",
        puntos: [
          "Mapeamos a los actores clave que influyen en la licencia social para operar.",
          "Diseñamos una estrategia de relacionamiento con objetivos, mensajes y canales claros.",
          "Estructuramos responsables, indicadores y ritmos de interacción sostenibles en el tiempo.",
          "Alineamos el plan con la gestión de riesgos sociales y la estrategia de negocio.",
          "Damos continuidad institucional al vínculo con el territorio, más allá de relaciones personales.",
        ],
      },
      {
        nombre: "Sostenibilidad en Cadena de Valor",
        descripcion:
          "Trabajamos con sus equipos y con sus proveedores para que la sostenibilidad llegue a la operación diaria de la cadena. Acompañamos la adopción de la ISO 20400 y de prácticas de compra más consistentes.",
        puntos: [
          "Fortalecemos capacidades en la cadena de suministro para integrar la sostenibilidad en la operación diaria.",
          "Acompañamos la adopción de la ISO 20400 y de mejores prácticas de compras sostenibles.",
          "Sensibilizamos a equipos internos y proveedores sobre criterios clave de sostenibilidad.",
          "Ayudamos a traducir la sostenibilidad en decisiones de compra más consistentes y responsables.",
        ],
      },
      {
        nombre: "Cursos y talleres de sostenibilidad para empresas",
        descripcion:
          "Formación con contenido ajustado a cada nivel jerárquico y ejemplos tomados de las áreas de su empresa. La imparten consultores en ejercicio, en formatos que van de la sensibilización al programa aplicado.",
        puntos: [
          "Contenido adaptado a cada nivel jerárquico",
          "Casos de negocio y ejemplos de sus áreas",
          "Facilitadores con experiencia real en consultoría",
          "Formatos desde sensibilización hasta programas aplicados",
        ],
      },
      {
        nombre: "Capacitación a la Medida",
        descripcion:
          "Diseñamos la formación según el rol de cada audiencia, dentro y fuera de su empresa: alta dirección, equipos, clientes y proveedores. El objetivo es que la estrategia deje de depender de unas cuantas personas.",
        puntos: [
          "Diseñamos formación alineada al rol de cada audiencia dentro y fuera de la empresa.",
          "Aterrizamos la sostenibilidad para alta dirección, equipos, clientes y proveedores.",
          "Fortalecemos capacidades para que la estrategia no dependa de unas cuantas personas.",
          "Ayudamos a convertir la sostenibilidad en criterio compartido y acción cotidiana.",
          "Damos herramientas para implementar con mayor claridad y consistencia.",
        ],
      },
      {
        nombre: "Acompañamiento en sostenibilidad",
        descripcion:
          "Apoyo continuo para ordenar prioridades y hacer avanzar pendientes sin contratar cada proyecto por separado. Se ajusta por horas, por periodo o como iguala mensual, según lo que su operación requiera en cada momento.",
        puntos: [
          "Ordena prioridades y proyectos de sostenibilidad",
          "Avanza tareas puntuales sin contratar cada proyecto por separado",
          "Reciba guía experta, seguimiento y retroalimentación",
          "Adapta el acompañamiento por horas, periodo o iguala mensual",
        ],
      },
    ],
  },
  {
    numero: 4,
    pregunta: "¿Cómo Comunico?",
    colorToken: "teal",
    intro:
      "Lo que no se comunica con claridad pierde fuerza. Te ayudamos a traducir avances, compromisos y resultados en mensajes sólidos, relevantes y creíbles, que fortalezcan la confianza, la reputación y el valor de tu empresa ante sus grupos de interés.",
    servicios: [
      {
        nombre: "Estrategia de Sostenibilidad",
        descripcion:
          "Convertimos lo que su empresa ya sabe —materialidad, benchmark, tendencias— en pilares, objetivos y líneas de acción alineados con la visión del negocio, priorizados con criterios de factibilidad y no por orden de llegada.",
        puntos: [
          "Define pilares, objetivos y líneas de acción",
          "Alinea sostenibilidad con visión de negocio",
          "Convierte estudios de materialidad, benchmark y tendencias en estrategia accionable",
          "Prioriza acciones con criterios de factibilidad",
        ],
      },
      {
        nombre: "Informe de Sostenibilidad",
        descripcion:
          "Estructuramos la información, los indicadores y los avances de su empresa en un informe alineado con su estrategia, sus grupos de interés y los estándares. Puede tomarse completo, como brief o en modalidad coach.",
        puntos: [
          "Estructura información, indicadores y avances de sostenibilidad.",
          "Alinea el informe a estrategia, grupos de interés y estándares.",
          "Fortalece narrativa, redacción, diseño y comunicación.",
          "Puede realizarse como informe completo, brief o modalidad coach.",
        ],
      },
      {
        nombre: "Adicionales",
        descripcion:
          "Materiales complementarios que extienden el alcance de su informe y de su estrategia de comunicación. Adaptamos cada pieza al mensaje, la audiencia y el canal, sin que ganar alcance se pague con una pérdida de rigor.",
        noEnlazable: true,
        puntos: [
          "Transformamos tus avances en piezas que hacen la sostenibilidad más visible, clara y atractiva.",
          "Desarrollamos materiales complementarios que amplifican el valor del informe y de tu estrategia de comunicación.",
          "Adaptamos cada soporte al mensaje, la audiencia y el canal más adecuado.",
          "Ayudamos a comunicar con mayor fuerza sin perder rigor ni consistencia.",
          "Damos herramientas para que tu sostenibilidad llegue más lejos y conecte mejor.",
        ],
      },
    ],
  },
];
