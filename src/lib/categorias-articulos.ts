import { ARTICULOS } from "@/lib/articulos";

/*
  Categorías del Centro de Recursos.

  Viven aquí y no en articulos.ts porque aquel archivo se GENERA desde el
  export de WordPress y se sobrescribe al regenerarlo: una categoría escrita a
  mano allí se perdería sin avisar. Las categorías de WordPress (`categorias`
  en ArticuloMeta) no sirven para filtrar —«Blog» agrupaba 37 de 60— y no se
  usan en el sitio.

  El orden de CATEGORIAS es el de la fila de etiquetas. "Archivo" va al final:
  agrupa noticias y crónicas de 2012 a 2020 que no son contenido vigente.
*/
export const CATEGORIAS = [
  { id: "materialidad", nombre: "Materialidad y grupos de interés" },
  { id: "estrategia", nombre: "Estrategia de sostenibilidad" },
  { id: "informes", nombre: "Informes y estándares" },
  { id: "distintivo-esr", nombre: "Distintivo ESR" },
  { id: "medicion-de-impacto", nombre: "Medición de impacto" },
  { id: "pymes-y-cadena-de-valor", nombre: "PyMEs y cadena de valor" },
  { id: "fundamentos-rse", nombre: "Fundamentos y panorama de la RSE" },
  { id: "archivo", nombre: "Archivo" },
] as const;

export type CategoriaId = (typeof CATEGORIAS)[number]["id"];

/** Una categoría por artículo, por slug. */
const CATEGORIA_POR_SLUG: Record<string, CategoriaId> = {
  /* materialidad */
  "guia-sobre-la-doble-materialidad": "materialidad", // 2025 · Doble materialidad: Qué es y cómo soluciona tu estrategia ESG
  "guia-sobre-los-stakeholders": "materialidad", // 2025 · Tipos de stakeholders en una empresa y cómo gestionarlos correctamente
  "guia-analisis-de-materialidad": "materialidad", // 2025 · Análisis de materialidad: cómo definir prioridades ASG en tu empresa
  "claves-integrar-doble-materialidad": "materialidad", // 2025 · Doble materialidad: 5 claves para su estrategia
  "analisis-de-materialidad-mas-alla-de-un-requisito-para-reportar": "materialidad", // 2022 · Análisis de materialidad: Más allá de un requisito para reportar
  "heineken-mexico-pasos-estrategicos-para-un-estudio-de-materialidad-fuera-de-lo-comun": "materialidad", // 2022 · HEINEKEN México – Pasos Estratégicos para un Estudio de Materialidad F
  "estudio-de-materialidad-10-beneficios-estrategicos": "materialidad", // 2020 · Estudio de materialidad: 10 Beneficios Estratégicos
  /* estrategia */
  "guia-sobre-sostenibilidad-empresarial": "estrategia", // 2025 · Sostenibilidad empresarial: Qué es y cómo implementarla con éxito
  "como-desarrollar-tu-estrategia-de-rse-con-la-metodologia-resilio": "estrategia", // 2024 · Cómo desarrollar tu estrategia de RSE con la metodología RESILIO
  "desarrollando-nuevas-estrategias-en-responsabilidad-social-corporativa": "estrategia", // 2024 · Desarrollando nuevas estrategias en Responsabilidad Social Corporativa
  "como-superar-desafios-rse-sector-industrial": "estrategia", // 2023 · Cómo superar los desafíos de la RSE en el Sector Industrial
  "conoce-los-7-pasos-para-triunfar-en-tu-estrategia-de-rse": "estrategia", // 2023 · Conoce los 7 pasos para triunfar en tu estrategia de RSE
  "lo-que-no-te-dicen-al-iniciar-una-estrategia-de-sostenibilidad": "estrategia", // 2022 · Lo que no te dicen al iniciar una Estrategia de Sostenibilidad
  "los-desafios-de-desarrollar-una-estrategia-de-sustentabilidad-exitosa": "estrategia", // 2022 · Los desafíos de desarrollar una estrategia de Sustentabilidad Exitosa
  "como-empezar-un-plan-de-responsabilidad-social": "estrategia", // 2020 · ¿Cómo empezar un plan de Responsabilidad Social?
  "las-10-recomendaciones-en-rs-de-bimbo-coca-cola-mexico-cemex-y-bio-pappel": "estrategia", // 2015 · Las 10 recomendaciones en RS de BIMBO, Coca-Cola México, CEMEX y Bio-P
  /* informes */
  "guia-reporte-de-sustentabilidad": "informes", // 2024 · Reporte de sustentabilidad: Guía para estructurarlo bajo estándares GR
  "tips-para-reportar-con-los-nuevos-estandares-gri": "informes", // 2022 · Tips para reportar con los nuevos estándares GRI
  "el-a-b-c-de-la-actualizacion-de-los-estandares-de-gri": "informes", // 2021 · El A, B, C de la actualización de los Estándares de GRI
  "informes-de-sustentabilidad-por-donde-empezar": "informes", // 2021 · Informes de Sustentabilidad: ¿por dónde empezar?
  "10-errores-que-debes-evitar-en-tu-informe-de-sostenibilidad": "informes", // 2021 · 10 errores que debes evitar en tu Informe de Sostenibilidad
  "como-reportar-ods-en-informes-de-sustentabilidad": "informes", // 2019 · Cómo reportar ODS en tu informe de sustentabilidad en 2020
  /* distintivo-esr */
  "nuevas-estrategias-para-una-postulacion-exitosa-al-distintivo-esr-2024": "distintivo-esr", // 2024 · Nuevas estrategias para una postulación exitosa al distintivo ESR 2024
  "nuevo-modelo-distintivo-esr-2023-pymes": "distintivo-esr", // 2023 · El nuevo modelo del Distintivo ESR® 2023: Guía para PyMEs
  "quieres-obtener-el-distintivo-esr-en-2023-conoce-los-cambios-en-la-convocatoria-y-preparate": "distintivo-esr", // 2023 · ¿Quieres obtener el Distintivo ESR en 2023? Conoce los cambios en la c
  "distintivo-esr-importancia-cadena-de-valor": "distintivo-esr", // 2020 · La importancia del Distintivo ESR en la cadena de valor
  "6-tips-para-postular-al-distintivo-esr-del-cemefi": "distintivo-esr", // 2019 · 6 Tips para postular al Distintivo ESR del Cemefi
  /* medicion-de-impacto */
  "guia-calcular-retorno-social": "medicion-de-impacto", // 2025 · Webinar “Del donativo al impacto: Cómo calcular el retorno social de t
  "como-realizar-un-diagnostico-de-impacto-social-efectivo": "medicion-de-impacto", // 2023 · ¿Cómo realizar un diagnóstico de impacto social efectivo?
  "5-razones-para-evaluar-la-madurez-de-la-rs-en-tu-empresa-usando-la-iso-26000": "medicion-de-impacto", // 2020 · 5 razones para evaluar la madurez de la RS en tu empresa usando la ISO
  "unicef-lanza-herramienta-auto-diagnostico-empresas": "medicion-de-impacto", // 2018 · UNICEF lanza una herramienta de auto-diagnóstico para empresas
  /* pymes-y-cadena-de-valor */
  "guia-responsabilidad-social-empresarial-pymes": "pymes-y-cadena-de-valor", // 2025 · 9 consejos para incorporar la Responsabilidad Social Empresarial en Py
  "como-construir-una-cadena-de-valor-y-guiar-a-las-pymes-hacia-los-ods": "pymes-y-cadena-de-valor", // 2023 · ¿Cómo construir una cadena de valor responsable y guiar a las PyMEs ha
  "5-consejos-de-responsabilidad-social-empresarial-rse-que-no-cuestan-casi-nada": "pymes-y-cadena-de-valor", // 2022 · 5 consejos de Responsabilidad Social Empresarial (RSE) que no cuestan 
  "cuales-son-los-beneficios-de-aplicar-practicas-de-rs-en-las-pymes": "pymes-y-cadena-de-valor", // 2022 · ¿Cuáles son los beneficios de aplicar prácticas de RSE en las PyMEs?
  "todo-lo-que-debes-saber-sobre-compras-sostenibles-en-5-minutos": "pymes-y-cadena-de-valor", // 2020 · Todo lo que debes saber sobre Compras Sostenibles en 5 minutos
  "beneficios-de-rs-en-las-pymes": "pymes-y-cadena-de-valor", // 2019 · Beneficios de aplicar prácticas de RSE en las PyMEs
  /* fundamentos-rse */
  "el-abc-de-la-responsabilidad-social-empresarial": "fundamentos-rse", // 2023 · El ABC de la Responsabilidad Social Empresarial
  "responshable-2-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa": "fundamentos-rse", // 2021 · ResponsHABLE 2 – Resolvemos las dudas de Responsabilidad Social en tu 
  "responshable-1-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa": "fundamentos-rse", // 2021 · ResponsHABLE 1 – Resolvemos las dudas de Responsabilidad Social en tu 
  "los-desastres-no-son-naturales": "fundamentos-rse", // 2021 · ¡Los desastres no son naturales!
  "responsabilidad-social-la-base-de-una-organizacion-resiliente": "fundamentos-rse", // 2021 · Responsabilidad Social: la base de una organización resiliente
  "datos-que-revelan-el-estado-de-la-rs-en-mexico": "fundamentos-rse", // 2019 · Responsabilidad Social: Cinco datos que revelan su estado en México
  "equidad-de-genero-y-responsabilidad-social": "fundamentos-rse", // 2019 · Equidad de género y responsabilidad social
  "ranking-negocios-inclusivos-donde-desarrollo-social-encuentra-rentabilidad": "fundamentos-rse", // 2018 · Ranking Negocios Inclusivos: Donde el desarrollo social se encuentra c
  "la-responsabilidad-social-en-el-sector-alimentario-en-mexico": "fundamentos-rse", // 2018 · La Responsabilidad Social en el sector Alimentación y Bebidas mexicano
  "sostenibilidad-sustentabilidad-responsabilidad-social-misma-cosa": "fundamentos-rse", // 2018 · Sostenibilidad, Sustentabilidad, Responsabilidad Social, ¿son la misma
  /* archivo */
  "acciones-empresariales-ante-covid-19": "archivo", // 2020 · Acciones de RSE ante COVID-19
  "asesoria-gratuita-covid19": "archivo", // 2020 · ¡Brindamos asesoría gratuita para enfrentar la nueva realidad en las o
  "impartimos-talleres-de-rs-y-gestion-de-riesgos-durante-la-emergencia-de-covid-19": "archivo", // 2020 · Impartimos talleres de RS y Gestión de riesgos durante la emergencia d
  "a-nuestros-grupos-de-interes": "archivo", // 2020 · Call to action ResponSable ante el COVID-19
  "impartimos-cursos-y-talleres-de-responsabilidad-social-este-2019": "archivo", // 2019 · ¡Impartimos cursos y talleres de responsabilidad social este 2019!
  "responsable-dos-anos-del-sismo": "archivo", // 2019 · ResponSable a dos años del sismo
  "panorama-la-responsabilidad-social-mexico-2019": "archivo", // 2019 · Panorama de la Responsabilidad Social en México 2019, ¡Hemos presentad
  "panorama-de-la-responsabilidad-social-en-mexico-2019": "archivo", // 2019 · Panorama de la Responsabilidad Social en México 2019, el estudio que n
  "19s-responsable-agencia-responsabilidad-social-continua-operaciones": "archivo", // 2018 · A seis meses de ser afectados por el sismo del 19S, ResponSable, agenc
  "el-foro-mexico-responsable-2016-un-exito-en-la-promocion-del-how-to": "archivo", // 2016 · El Foro México Responsable 2016, un éxito en la promoción del «How To…
  "articulo-ganador-concurso-estudiantil-imagina-tu-campus-responsable": "archivo", // 2012 · Artículo Ganador:  Concurso estudiantil "Imagina tu Campus Responsable
  "taller-materialidad-y-dialogo-con-grupos-de-interes": "archivo", // 2019 · ResponSable en Pacto Mundial México: Materialidad y diálogo con grupos
  "responsable-pacto-mundial-mexico-materialidad-dialogo-con-grupos-interes": "archivo", // 2018 · ResponSable en Pacto Mundial México: Materialidad y diálogo con grupos
};

/*
  Comprobación al cargar el módulo, que en el build hace fallar la generación
  de /recursos/ y de cada ficha: un artículo nuevo sin categoría no aparecería
  en ningún filtro, y un slug que ya no existe es una asignación muerta. Mejor
  un build roto con el slug culpable que un artículo invisible.
*/
const sinCategoria = ARTICULOS.filter((a) => !(a.slug in CATEGORIA_POR_SLUG));
const huerfanos = Object.keys(CATEGORIA_POR_SLUG).filter(
  (slug) => !ARTICULOS.some((a) => a.slug === slug),
);
if (sinCategoria.length > 0 || huerfanos.length > 0) {
  throw new Error(
    [
      sinCategoria.length > 0 &&
        `categorias-articulos.ts: artículos sin categoría → ${sinCategoria.map((a) => a.slug).join(", ")}`,
      huerfanos.length > 0 &&
        `categorias-articulos.ts: slugs asignados que no existen en ARTICULOS → ${huerfanos.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

export function categoriaDe(slug: string): (typeof CATEGORIAS)[number] {
  const id = CATEGORIA_POR_SLUG[slug];
  return CATEGORIAS.find((c) => c.id === id)!;
}
