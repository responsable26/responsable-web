/**
 * Contenido de la página de E-learning en sostenibilidad: Universidad
 * ResponSable, transcrito literal de
 * contenido/servicios/Texto_pagina_web_Universidad_ResponSable.docx.
 *
 * A diferencia de contenido-servicios.ts, este módulo se escribe a mano: el
 * documento no sigue la plantilla editorial de los otros diez —trae sus
 * propias secciones— y por eso la página tiene ruta estática propia en
 * src/app/servicio/universidad-responsable/ en lugar de pasar por el extractor.
 * Un cambio de texto se hace aquí.
 *
 * Fuera a propósito: la nota editorial no publicable de la sección de
 * testimonios y la tabla de SEO, que va a los metadatos de la página.
 *
 * Módulo de datos puro: sin JSX ni "use client".
 */

import type { PasoProceso } from "@/lib/contenido-servicios";

/** Un elemento de lista. `etiqueta` va en negrita delante del texto. */
export type ElementoLista = { etiqueta?: string; texto: string };

/** Ícono de línea de cada tarjeta de «¿Para qué sirve…?». Los dibuja
 *  iconos-universidad.tsx. */
export type IconoUso =
  "base" | "grupos" | "induccion" | "negocio" | "continuidad" | "seguimiento";

/** Tarjeta con título, párrafos y, opcionalmente, una lista introducida. */
export type TarjetaUniversidad = {
  /** Rótulo corto sobre el título, como «Nivel 1». */
  rotulo?: string;
  titulo: string;
  parrafos: string[];
  lista?: { intro: string; elementos: ElementoLista[] };
};

export const UNIVERSIDAD = {
  slug: "universidad-responsable",
  /** Nombre exacto en servicios.ts. */
  servicio: "E-learning en sostenibilidad: Universidad ResponSable",

  seo: {
    titulo:
      "Universidad ResponSable | Capacitación en sostenibilidad para empresas",
    descripcion:
      "Capacite a su equipo o cadena de valor con cursos y rutas de aprendizaje en sostenibilidad. Contenido especializado, adaptado a su empresa y disponible en línea.",
  },

  hero: {
    titulo:
      "Universidad ResponSable: capacitación en sostenibilidad para empresas",
    subtitulo:
      "Desarrolle capacidades en sostenibilidad dentro de su equipo o cadena de valor mediante cursos y rutas de aprendizaje en línea.",
    entradilla:
      "Partimos de contenidos creados desde nuestra experiencia como consultores. Podemos utilizarlos tal como están, adaptarlos al sector y a la realidad de su empresa, incorporar materiales propios o desarrollar nuevos contenidos.",
    boton: "Cuéntenos qué necesita capacitar",
  },

  apertura: {
    titulo: "Formación en sostenibilidad adaptada a su empresa",
    parrafos: [
      "La Universidad ResponSable es nuestra plataforma de capacitación en línea para empresas, equipos y proveedores.",
      "Permite formar a distintas audiencias de manera flexible y escalable, sin depender exclusivamente de sesiones en vivo. Cada participante puede avanzar durante el periodo definido para el programa y seguir una ruta diseñada según su función, su nivel de conocimiento y lo que la empresa necesita lograr.",
      "El acceso se gestiona directamente con ResponSable. Antes de habilitarlo, necesitamos entender a quién quiere capacitar, qué capacidades busca desarrollar y cuánto debe adaptarse el contenido.",
    ],
  },

  contenidoBase: {
    titulo: "Contenido base y formación a la medida",
    intro:
      "No todas las empresas necesitan desarrollar un curso desde cero. Por eso, la Universidad ResponSable puede configurarse en distintos niveles.",
    tarjetas: [
      {
        rotulo: "Nivel 1",
        titulo: "Contenidos desarrollados por ResponSable",
        parrafos: [
          "Su equipo puede acceder a cursos y rutas de aprendizaje creados desde nuestra experiencia asesorando empresas.",
          "Uno de ellos es RESILIO, una ruta que explica los siete pasos necesarios para construir y fortalecer una estrategia de sostenibilidad.",
          "También desarrollamos contenidos sobre temas como compras sostenibles, cadena de valor, comunicación responsable y conceptos fundamentales de sostenibilidad.",
        ],
      },
      {
        rotulo: "Nivel 2",
        titulo: "Rutas adaptadas a cada audiencia",
        parrafos: [
          "Podemos seleccionar los cursos o módulos más relevantes y organizarlos en una ruta específica.",
        ],
        lista: {
          intro: "También podemos:",
          elementos: [
            { texto: "adaptar el nivel de profundidad;" },
            { texto: "incorporar casos y ejemplos del sector;" },
            {
              texto:
                "incluir referencias a las políticas o prioridades de la empresa;",
            },
            {
              texto:
                "agregar documentos, videos y otros materiales corporativos;",
            },
            { texto: "combinar aprendizaje autónomo con sesiones en vivo." },
          ],
        },
      },
      {
        rotulo: "Nivel 3",
        titulo: "Contenidos desarrollados para la empresa",
        parrafos: [
          "Cuando los contenidos existentes no cubren la necesidad, podemos producir cursos o materiales específicos.",
          "La empresa también puede grabar a sus especialistas, compartir contenidos propios o explicar una política, metodología o proceso interno. Nosotros ayudamos a integrarlos con los contenidos de ResponSable dentro de una misma experiencia de aprendizaje.",
        ],
      },
    ] satisfies TarjetaUniversidad[],
  },

  /*
    Infografía de RESILIO, dentro de la tarjeta «Contenidos desarrollados por
    ResponSable». No viene del documento de la página sino del brochure del
    curso, con las frases pasadas de tú a usted. Las siete letras son los siete
    pasos del método; los ocho módulos son las unidades del curso, un dato
    distinto que da el brochure.
  */
  resilio: {
    titulo: "Sostenibilidad estratégica: el método RESILIO",
    pasos: [
      {
        letra: "R",
        palabra: "Reflexionar",
        frase: "Reflexión estratégica, defina objetivos claros",
      },
      {
        letra: "E",
        palabra: "Estudiar",
        frase: "Diagnóstico y benchmark, descubra dónde está",
      },
      {
        letra: "S",
        palabra: "Solicitar",
        frase: "Involucre a sus grupos de interés",
      },
      {
        letra: "I",
        palabra: "Institucionalizar",
        frase: "Construya su estrategia de sostenibilidad",
      },
      {
        letra: "L",
        palabra: "Lograr",
        frase: "Lleve su estrategia a la práctica",
      },
      {
        letra: "I",
        palabra: "Informar",
        frase: "Aprenda a comunicar en sostenibilidad",
      },
      {
        letra: "O",
        palabra: "Optimizar",
        frase: "Optimice con medición y mejora continua",
      },
    ],
    dato: "8 módulos · 5.5 horas de aprendizaje guiado",
  },

  audiencias: {
    titulo: "¿A quién puede capacitar?",
    tarjetas: [
      {
        titulo: "Al área de sostenibilidad",
        parrafos: [
          "Para fortalecer capacidades técnicas, actualizar conocimientos, facilitar la inducción de nuevos integrantes y mejorar la gestión de proyectos de sostenibilidad.",
          "La formación también puede ayudar al equipo a evaluar y supervisar con mayor criterio el trabajo realizado por consultores externos.",
        ],
      },
      {
        titulo: "A otras áreas del negocio",
        parrafos: [
          "La sostenibilidad no depende únicamente de un área. Podemos diseñar rutas para que cada función entienda qué debe conocer y aplicar desde su propia responsabilidad.",
        ],
        lista: {
          intro: "Por ejemplo:",
          elementos: [
            {
              etiqueta: "Compras:",
              texto:
                "criterios de sostenibilidad para proveedores, riesgos de la cadena de suministro y Alcance 3.",
            },
            {
              etiqueta: "Ventas:",
              texto:
                "conceptos que los clientes están solicitando y argumentos para comunicar los atributos de sostenibilidad de la empresa o sus productos.",
            },
            {
              etiqueta: "Marketing y Comunicación:",
              texto:
                "comunicación responsable, evidencia, greenwashing y riesgos reputacionales.",
            },
            {
              etiqueta: "Otras áreas:",
              texto:
                "conceptos básicos, riesgos, oportunidades y responsabilidades relacionadas con su función.",
            },
          ],
        },
      },
      {
        titulo: "A proveedores y otros integrantes de la cadena de valor",
        parrafos: [
          "La Universidad ResponSable también puede utilizarse para formar a múltiples empresas proveedoras bajo una base común.",
          "Podemos diseñar rutas según el tamaño, nivel de avance o tipo de proveedor, incorporar contenidos relacionados con los requerimientos de la empresa tractora y dar seguimiento al avance de las personas participantes.",
        ],
      },
    ] satisfies TarjetaUniversidad[],
  },

  paraQueSirve: {
    titulo: "¿Para qué sirve la Universidad ResponSable?",
    usos: [
      {
        icono: "base",
        titulo: "Construir una base común",
        texto:
          "Ayuda a que distintas personas, áreas o empresas proveedoras compartan los mismos conceptos y criterios.",
      },
      {
        icono: "grupos",
        titulo: "Capacitar a grupos amplios",
        texto:
          "Permite llevar contenidos a equipos ubicados en diferentes ciudades o países y a cadenas de valor con muchas empresas participantes.",
      },
      {
        icono: "induccion",
        titulo: "Facilitar la inducción",
        texto:
          "Acelera la formación de quienes se incorporan al área de sostenibilidad o necesitan comprender cómo se relaciona el tema con su función.",
      },
      {
        icono: "negocio",
        titulo: "Llevar la sostenibilidad al negocio",
        texto:
          "Ayuda a que Compras, Ventas, Marketing, Comunicación y otras áreas comprendan qué decisiones les corresponden.",
      },
      {
        icono: "continuidad",
        titulo: "Dar continuidad al aprendizaje",
        texto:
          "Los contenidos pueden acompañar un proceso de consultoría, preparar a las personas antes de un taller o reforzar lo aprendido después de una sesión en vivo.",
      },
      {
        icono: "seguimiento",
        titulo: "Dar seguimiento al avance",
        texto:
          "Dependiendo del programa, es posible conocer participación, progreso y resultados de evaluaciones de aprendizaje.",
      },
    ] satisfies { icono: IconoUso; titulo: string; texto: string }[],
  },

  programa: {
    titulo: "¿Qué puede incluir un programa?",
    intro:
      "Según el objetivo y el alcance acordado, una solución puede incorporar:",
    /*
      Los doce elementos del documento, en su texto literal, repartidos en
      tres grupos. PROPUESTA: los nombres de grupo y el reparto son una
      clasificación nuestra, no vienen en el documento, y están pendientes de
      revisión por Gwenaelle. El documento los trae como una sola lista
      corrida, en este orden: los cuatro de Contenido, evaluaciones,
      seguimiento, reconocimientos, webinars, mentorías, comunicación,
      reportes e identidad.
    */
    grupos: [
      {
        titulo: "Contenido",
        elementos: [
          "cursos y rutas de aprendizaje;",
          "selección o liberación progresiva de contenidos;",
          "ejemplos y casos sectoriales;",
          "videos, políticas y materiales de la empresa;",
        ],
      },
      {
        titulo: "Evaluación y seguimiento",
        elementos: [
          "evaluaciones de aprendizaje;",
          "seguimiento de participación y avance;",
          "reconocimientos digitales;",
          "reportes;",
        ],
      },
      {
        titulo: "Acompañamiento",
        elementos: [
          "webinars y sesiones de preguntas y respuestas;",
          "mentorías;",
          "comunicación para impulsar la participación;",
          "elementos de identidad de la empresa.",
        ],
      },
    ],
    cierre:
      "Estas funcionalidades no se incluyen automáticamente en todos los programas. Se seleccionan de acuerdo con la audiencia, los objetivos y el nivel de acompañamiento requerido.",
  },

  practica: {
    titulo: "Contenido creado desde la práctica",
    parrafos: [
      "Los cursos de la Universidad ResponSable no se construyen únicamente a partir de teoría o estándares.",
      "Nacen de las preguntas, errores, decisiones y necesidades que encontramos al acompañar empresas en sus proyectos de sostenibilidad. Esto nos permite explicar conceptos complejos con un lenguaje claro y relacionarlos con situaciones reales del negocio.",
      "También entendemos que cada audiencia necesita algo diferente. Una persona responsable de sostenibilidad no requiere la misma formación que alguien de Compras, Ventas o una empresa proveedora que apenas comienza.",
    ],
  },

  proceso: {
    titulo: "¿Cómo funciona?",
    /* Títulos cortos, de dos o tres palabras como en las demás páginas, para
       que no ocupen tres líneas a cuatro columnas. El título del documento
       abre el cuerpo del paso, entero; su numeración («1. …») se omite porque
       ProcesoPasos numera. */
    pasos: [
      {
        titulo: "Entender la necesidad",
        descripcion:
          "Entendemos qué necesita lograr su empresa. Definimos la audiencia, el nivel de conocimiento actual, la cantidad aproximada de participantes y qué espera que comprendan o puedan hacer mejor al terminar.",
      },
      {
        titulo: "Diseñar la ruta",
        descripcion:
          "Diseñamos la ruta de aprendizaje. Identificamos qué contenidos existentes podemos aprovechar y cuáles requieren adaptación o desarrollo. Definimos los cursos, la secuencia, el nivel de profundidad y los materiales complementarios.",
      },
      {
        titulo: "Habilitar el acceso",
        descripcion:
          "Configuramos y habilitamos el acceso. Preparamos la experiencia dentro de la Universidad ResponSable, damos de alta a las personas participantes y compartimos las instrucciones para comenzar.",
      },
      {
        titulo: "Acompañar el avance",
        descripcion:
          "Acompañamos el avance. Según el alcance contratado, podemos dar seguimiento a la participación, aplicar evaluaciones, apoyar la comunicación y entregar reportes.",
      },
    ] satisfies PasoProceso[],
    cierre:
      "El programa también puede complementarse con webinars, mentorías, talleres o sesiones de preguntas y respuestas.",
  },

  /** Titular de la sección de testimonios, para cuando lleguen. La sección no
   *  se pinta mientras testimonios.ts no tenga entrada para este slug. */
  testimoniosTitulo: "Experiencias de aprendizaje aplicadas a retos reales",

  faq: [
    {
      pregunta: "¿Cuántas personas pueden acceder?",
      respuesta: [
        "La Universidad puede utilizarse tanto para equipos pequeños como para programas con un gran número de participantes o proveedores. La cantidad de accesos se define con cada empresa según la audiencia y el alcance del programa.",
      ],
    },
    {
      pregunta: "¿Cuánto tiempo dura el acceso?",
      respuesta: [
        "Depende del curso, la ruta y el programa contratado. Definimos el periodo de acceso según la cantidad de contenidos, el nivel de profundidad y el objetivo de aprendizaje.",
      ],
    },
    {
      pregunta: "¿Los participantes reciben constancia o certificado?",
      respuesta: [
        "Podemos emitir un reconocimiento digital al completar los contenidos definidos para el programa. En proyectos corporativos, este reconocimiento puede personalizarse de acuerdo con el alcance acordado.",
        "La finalización de un curso acredita que la persona completó la ruta establecida. No equivale necesariamente a una certificación de competencias profesionales.",
      ],
    },
    {
      pregunta: "¿Cuánto tarda desarrollar un curso a la medida?",
      respuesta: [
        "Depende del nivel de personalización. Adaptar una ruta existente, incorporar ejemplos sectoriales o añadir materiales de la empresa requiere un proceso diferente a producir un curso completamente nuevo.",
        "Una vez definidos el objetivo, los contenidos y los materiales disponibles, establecemos el calendario del proyecto.",
      ],
    },
    {
      pregunta: "¿La Universidad funciona para proveedores?",
      respuesta: [
        "Sí. Podemos diseñar rutas para cadenas de valor, desde contenidos básicos hasta formación relacionada con los requerimientos de la empresa tractora.",
        "Según el alcance, el programa puede incluir evaluaciones, comunicación con participantes, seguimiento de avance, sesiones complementarias y reportes.",
      ],
    },
    {
      pregunta: "¿Podemos utilizar contenido propio de nuestra empresa?",
      respuesta: [
        "Sí. Podemos incorporar videos, políticas, documentos, ejemplos, mensajes institucionales y otros materiales proporcionados por la organización.",
        "También podemos combinar esos recursos con los contenidos desarrollados por ResponSable.",
      ],
    },
    {
      pregunta: "¿Todos los cursos deben tomarse en un orden determinado?",
      respuesta: [
        "No necesariamente. Diseñamos la ruta de acuerdo con el nivel de conocimiento y las necesidades de cada audiencia.",
        "Algunos programas sí pueden tener una secuencia recomendada o liberar contenidos progresivamente.",
      ],
    },
    {
      pregunta: "¿La capacitación es completamente autónoma?",
      respuesta: [
        "Puede serlo, pero también puede complementarse con webinars, mentorías, talleres o sesiones de preguntas y respuestas.",
      ],
    },
    {
      pregunta: "¿Podemos conocer el avance de las personas participantes?",
      respuesta: [
        "En los programas corporativos podemos dar seguimiento a indicadores de participación y avance. Dependiendo del diseño, también pueden incorporarse evaluaciones de aprendizaje y reportes.",
      ],
    },
  ],

  /** Cifras de refuerzo, las mismas de Nosotros: salen del documento de
   *  credenciales 2026 del cliente, no del brochure del curso, que traía
   *  cifras anteriores (150 empresas, 500 proyectos). Si cambian, se cambian
   *  en las dos páginas. */
  cifras: [
    { valor: "+200", etiqueta: "empresas acompañadas" },
    { valor: "+600", etiqueta: "proyectos de consultoría y capacitación" },
  ],

  cta: {
    titulo: "Diseñemos la ruta de aprendizaje que su empresa necesita",
    parrafos: [
      "Cuéntenos a quién necesita capacitar, qué quiere lograr y cuántas personas participarían.",
      "Revisaremos qué contenidos podemos aprovechar, qué necesita adaptarse y qué nivel de acompañamiento conviene incorporar.",
    ],
    boton: "Solicitar una propuesta",
  },
};
