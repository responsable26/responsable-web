/*
  Párrafo introductorio de la sección «Preguntas frecuentes» de cada página de
  servicio, en la columna izquierda del layout de dos columnas que estrenó
  Doble Materialidad.

  Vive aquí y no en contenido-servicios.ts porque ese archivo es generado
  desde los .docx (scripts/extraer-servicios.py) y estos textos no vienen de
  ningún documento: son redacción nuestra.

  BORRADORES PENDIENTES DE VALIDAR. Todos llevan `porValidar: true`. Al
  aprobarse uno, se quita la marca; si cambia el texto, se sustituye aquí.
  El de Doble Materialidad ya está aprobado y sigue en su propia página.
*/

export type IntroFaq = {
  texto: string;
  porValidar?: true;
};

export const FAQ_INTROS: Record<string, IntroFaq> = {
  "sroi-social-return-on-investment": {
    texto:
      "Reunimos las dudas más habituales sobre el SROI: qué mide, cuándo conviene hacerlo y cómo se evita sobreestimar el impacto. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "roi-rentabilidad-de-la-sostenibilidad": {
    texto:
      "Reunimos las dudas más habituales sobre el ROI de la inversión social: en qué se diferencia del SROI, qué datos necesita y qué recibe su empresa al final. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "diagnostico-de-sostenibilidad": {
    texto:
      "Reunimos las dudas más habituales sobre el diagnóstico de sostenibilidad: qué temas evalúa, en qué se diferencia de un estudio de materialidad y qué recibe su empresa al final. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "iso-26000": {
    texto:
      "Reunimos las dudas más habituales sobre el diagnóstico ISO 26000: qué es la norma, qué evalúan sus siete materias fundamentales y qué recibe su empresa al final. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "estrategia-de-comunicacion-en-sostenibilidad": {
    texto:
      "Reunimos las dudas más habituales sobre la estrategia de comunicación en sostenibilidad: qué incluye, cómo previene el greenwashing y el greenhushing, y qué recibe su empresa al final. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "distintivo-esr": {
    texto:
      "Reunimos las dudas más habituales sobre el Distintivo ESR: qué evalúa, qué evidencias pide y cómo le acompañamos en la postulación. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "cursos-talleres-para-empresas": {
    texto:
      "Reunimos las dudas más habituales sobre nuestros cursos y talleres: qué temas cubren, a quién se dirigen y cómo se adaptan a cada empresa. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "acompanamiento-sostenibilidad": {
    texto:
      "Reunimos las dudas más habituales sobre el acompañamiento en sostenibilidad: qué temas cubre, cómo se definen las prioridades y cómo se da seguimiento a las horas. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "estrategia-sostenibilidad": {
    texto:
      "Reunimos las dudas más habituales sobre la estrategia de sostenibilidad: cuándo conviene hacerla, quién debe participar y qué recibe su empresa al final. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "informe-de-sostenibilidad": {
    texto:
      "Reunimos las dudas más habituales sobre el informe de sostenibilidad: qué tipo de informe conviene, a qué referentes se alinea y cómo se cuida la calidad de los datos. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
  "universidad-responsable": {
    texto:
      "Reunimos las dudas más habituales sobre la Universidad ResponSable: cuántas personas pueden acceder, cómo se sigue su avance y qué reciben al terminar. Si la suya no está aquí, contáctenos.",
    porValidar: true,
  },
};
