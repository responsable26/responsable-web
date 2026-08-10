# Revisión de las notas importadas de WordPress

Migración del export `asesoraenresponsabilidadsocialempresarial-responsable.WordPress.2026-08-10.xml`.
**60 notas publicadas**, todas en `/recursos/notas/[slug]/` conservando el slug exacto de WordPress.

Este archivo lista lo que quedó pendiente de revisión humana. Todo lo demás se migró sin intervención.

---

## 1. Notas con markup de page builder

Qué se eliminó y qué se conservó en cada una.

| Nota | Intervención |
|---|---|
| `como-construir-una-cadena-de-valor-y-guiar-a-las-pymes-hacia-los-ods` | wp:post-featured-image eliminado (la pinta el layout) |
| `como-desarrollar-tu-estrategia-de-rse-con-la-metodologia-resilio` | wp:post-featured-image eliminado (la pinta el layout) |
| `como-realizar-un-diagnostico-de-impacto-social-efectivo` | wp:post-featured-image eliminado (la pinta el layout) |
| `desarrollando-nuevas-estrategias-en-responsabilidad-social-corporativa` | wp:post-featured-image eliminado (la pinta el layout) |
| `el-a-b-c-de-la-actualizacion-de-los-estandares-de-gri` | 1× bloque wp:html vacío eliminado (plugin ausente) |
| `informes-de-sustentabilidad-por-donde-empezar` | 2× bloque wp:shortcode vacío eliminado (plugin ausente) |
| `las-10-recomendaciones-en-rs-de-bimbo-coca-cola-mexico-cemex-y-bio-pappel` | 6× wrapper WPBakery [vc_*] descartado, contenido interno conservado |
| `nuevas-estrategias-para-una-postulacion-exitosa-al-distintivo-esr-2024` | wp:post-featured-image eliminado (la pinta el layout) |
| `nuevo-modelo-distintivo-esr-2023-pymes` | wp:post-featured-image eliminado (la pinta el layout) |

En todos los casos **se conservó el texto íntegro**; lo que se descartó son los contenedores del
page builder, que no aportaban contenido. El contenido final no tiene ningún shortcode: verificado
con un barrido de `[...]` sobre las 60 notas, resultado cero.

## 2. Videos convertidos a embed

| Nota | Origen | Video |
|---|---|---|
| `el-foro-mexico-responsable-2016-un-exito-en-la-promocion-del-how-to` | shortcode `[sc_youtube]` del tema Scalia | https://www.youtube.com/watch?v=1-DuYgbsges |
| `impartimos-talleres-de-rs-y-gestion-de-riesgos-durante-la-emergencia-de-covid-19` | bloque `core-embed/youtube` (legacy) | https://www.youtube.com/watch?v=kUEZtnWwLD8 |

Ambos se sirven desde `youtube-nocookie.com` con proporción 16:9 y `loading="lazy"`.
**Conviene verificar que los dos videos siguen publicados**, porque son de 2016 y 2020.

## 3. Galerías convertidas a grid

| Nota | Galerías | Imágenes |
|---|---|---|
| `claves-integrar-doble-materialidad` | 2 | 1, 1 |
| `guia-responsabilidad-social-empresarial-pymes` | 1 | 1 |

Las galerías del export resultaron ser **envoltorios de una sola imagen**, no galerías reales.
Se renderizan con `next/image` a una columna: un grid de dos columnas dejaría la imagen a media
anchura sin motivo. Si la intención original era una galería múltiple, aquí faltan imágenes que
habría que recuperar del CMS.

Además, estas notas traían un bloque de galería **completamente vacío**, que se eliminó:

- `guia-responsabilidad-social-empresarial-pymes`

## 4. Imágenes eliminadas

**`responsable-pacto-mundial-mexico-materialidad-dialogo-con-grupos-interes`** — ResponSable en Pacto Mundial México: Materialidad y diálogo con grupos de interés

- `https://preview.3.basecamp.com/3127142/blobs/2bfc2b2e-892e-11e8-86f2-a0369f740db1/previews/full/DSC_0419-1.jpg`

Es un recurso privado de Basecamp, no accesible públicamente: la imagen nunca se habría visto.
Si esa foto debe aparecer, hay que subirla como archivo propio.

## 5. Enlaces a PDF eliminados

El estudio en PDF vivía en `/estudios/` del dominio viejo y no forma parte de la migración: el
enlace habría dado 404. Se eliminó el `<a>` conservando el texto cuando este se sostiene por sí solo.

| Nota | Texto del enlace | Qué se hizo |
|---|---|---|
| `distintivo-esr-importancia-cadena-de-valor`<br>*La importancia del Distintivo ESR en la cadena de valor* | “Panorama de la Responsabilidad Social en México” | enlace eliminado, texto conservado |

En el único caso encontrado el texto era el título del estudio, que se lee con normalidad dentro de
la frase (*«Según datos de nuestro estudio 2019 “Panorama de la Responsabilidad Social en México”
solo el 17.7% de las empresas…»*), así que se conservó y solo desapareció el enlace.

**El PDF sigue sin estar disponible en el sitio nuevo.** Si se quiere volver a ofrecer, hay que subir
el archivo a `public/` y reponer el enlace.

## 6. Notas sin imagen destacada (usan degradado de respaldo)

- `nuevo-modelo-distintivo-esr-2023-pymes` — El nuevo modelo del Distintivo ESR® 2023: Guía para PyMEs
- `tips-para-reportar-con-los-nuevos-estandares-gri` — Tips para reportar con los nuevos estándares GRI

El export no traía `_thumbnail_id` para ninguna de las dos: no es un fallo de descarga, la imagen
nunca existió. `NotaCard` cae al degradado de marca. Asignarles una imagen elimina la excepción.

## 7. Imágenes que fallaron al descargar

**Ninguna.** Las 58 destacadas y las 81 inline se descargaron correctamente.

Cuatro destacadas fallaron en el primer intento por llevar acentos sin *percent-encoding* en la
URL; se recuperaron al codificarlas. Los archivos afectados conservan nombres con caracteres no
ASCII en el origen, así que el problema reaparecerá si se rehace la descarga con otra herramienta:
`guia-calcular-retorno-social`, `heineken-mexico-...-fuera-de-lo-comun`, `los-desastres-no-son-naturales`,
`impartimos-talleres-de-rs-...-covid-19`.

## 8. Enlaces internos a páginas que todavía no existen

Se reescribieron a ruta relativa como se indicó, sin inventar destino. **Hoy dan 404.**

| Ruta destino | Notas que enlazan | Ejemplos |
|---|---|---|
| `/estudio-de-materialidad-2/` | 9 | `analisis-de-materialidad-mas-alla-de-un-requisito-para-reportar`, `como-reportar-ods-en-informes-de-sustentabilidad`, `estudio-de-materialidad-10-beneficios-estrategicos` (+6) |
| `/estrategia-de-ds-y-rse/` | 8 | `5-consejos-de-responsabilidad-social-empresarial-rse-que-no-cuestan-casi-nada`, `beneficios-de-rs-en-las-pymes`, `como-desarrollar-tu-estrategia-de-rse-con-la-metodologia-resilio` (+5) |
| `/postular-al-distintivo-esr-del-cemefi/` | 7 | `6-tips-para-postular-al-distintivo-esr-del-cemefi`, `distintivo-esr-importancia-cadena-de-valor`, `impartimos-cursos-y-talleres-de-responsabilidad-social-este-2019` (+4) |
| `/informe-de-sustentabilidad/` | 5 | `10-errores-que-debes-evitar-en-tu-informe-de-sostenibilidad`, `como-reportar-ods-en-informes-de-sustentabilidad`, `el-a-b-c-de-la-actualizacion-de-los-estandares-de-gri` (+2) |
| `/cursos-y-talleres-de-rse-en-mexico/` | 3 | `como-construir-una-cadena-de-valor-y-guiar-a-las-pymes-hacia-los-ods`, `impartimos-cursos-y-talleres-de-responsabilidad-social-este-2019`, `los-desafios-de-desarrollar-una-estrategia-de-sustentabilidad-exitosa` |
| `/comunicacion-en-rse/` | 2 | `guia-responsabilidad-social-empresarial-pymes`, `los-desastres-no-son-naturales` |
| `/reputacion-corporativa-2/` | 2 | `datos-que-revelan-el-estado-de-la-rs-en-mexico`, `desarrollando-nuevas-estrategias-en-responsabilidad-social-corporativa` |
| `/acompanamiento-rse/` | 2 | `guia-sobre-los-stakeholders`, `todo-lo-que-debes-saber-sobre-compras-sostenibles-en-5-minutos` |
| `/heineken/` | 2 | `guia-analisis-de-materialidad`, `heineken-mexico-pasos-estrategicos-para-un-estudio-de-materialidad-fuera-de-lo-comun` |
| `/responshable-1/` | 2 | `responshable-1-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa`, `responshable-2-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa` |
| `/responshable-2/` | 1 | `responshable-2-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa` |
| `/confian-en-nosotros/` | 1 | `5-consejos-de-responsabilidad-social-empresarial-rse-que-no-cuestan-casi-nada` |
| `/diagnostico-responsabilidad-social/` | 1 | `como-realizar-un-diagnostico-de-impacto-social-efectivo` |
| `/traje-a-la-medida/` | 1 | `guia-responsabilidad-social-empresarial-pymes` |
| `/norma-iso-26000/` | 1 | `5-razones-para-evaluar-la-madurez-de-la-rs-en-tu-empresa-usando-la-iso-26000` |

Son **15 rutas distintas** en **38 notas**. La mayoría son páginas de servicio
del sitio antiguo. Cuando se creen esas rutas los enlaces empiezan a funcionar solos; si alguna no se
va a recrear, hay que decidir destino o quitar el enlace.

### Enlaces a rutas retiradas del sitio

`/contacto/` dejó de existir: el modal de contacto es el único canal. Los enlaces del cuerpo
apuntaban a `/sigamos-en-contacto/`, el slug original de WordPress, y se reescriben en el pipeline
a `/?contacto=1`, que abre el modal en la Home. Hay redirect permanente para ambas rutas, pero
reescribirlos evita el salto.

| Artículo | Antes | Ahora |
|---|---|---|
| `claves-integrar-doble-materialidad` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `como-construir-una-cadena-de-valor-y-guiar-a-las-pymes-hacia-los-ods` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `como-desarrollar-tu-estrategia-de-rse-con-la-metodologia-resilio` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `como-realizar-un-diagnostico-de-impacto-social-efectivo` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `desarrollando-nuevas-estrategias-en-responsabilidad-social-corporativa` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `guia-reporte-de-sustentabilidad` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `guia-sobre-la-doble-materialidad` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `guia-sobre-sostenibilidad-empresarial` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `nuevas-estrategias-para-una-postulacion-exitosa-al-distintivo-esr-2024` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `nuevo-modelo-distintivo-esr-2023-pymes` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `quieres-obtener-el-distintivo-esr-en-2023-conoce-los-cambios-en-la-convocatoria-y-preparate` | `/sigamos-en-contacto/` | `/?contacto=1` |
| `sostenibilidad-sustentabilidad-responsabilidad-social-misma-cosa` | `/sigamos-en-contacto/` | `/?contacto=1` |

**12 artículos afectados.** La tabla vive en `RUTA_REMAP`, en el pipeline, no en los
JSON generados, así que sobrevive a una regeneración.

### Enlaces a artículos que no se migraron

Enlaces del contenido que apuntaban a slugs no publicados y se reasignaron a mano. Los que siguen
sin destino aparecen en la sección 9.

Vienen de
permalinks de WordPress a artículos que el export no incluye.

| Artículo que enlaza | Slug inexistente | Destino |
|---|---|---|
| `guia-sobre-sostenibilidad-empresarial` | `doble-materialidad-la-guia-completa-para-entenderla-aplicarla-y-generar-valor` | reasignado a `/servicio/estudio-doble-materialidad/` |

La reasignación está en la tabla `SLUG_REMAP` del pipeline, no en los JSON generados, para que
sobreviva a una regeneración.

Un caso merece atención aparte:

- `/portfolios/panorama-de-la-responsabilidad-social-en-mexico-2019/` y demás rutas bajo `/portfolios/`,
  `/blog/`, `/category/`, `/tag/` y `/news/` **sí resuelven**, vía los redirects que ya existen en
  `next.config.ts`. Aparecen en 20 notas y no están en la tabla de arriba, pero pagan un salto de redirect.

## 9. Validación de slugs de artículo

El pipeline comprueba en **cada regeneración** que todo enlace interno a `/recursos/articulos/<slug>/`
apunte a un artículo publicado. No detiene la generación: lo que encuentra se lista aquí.

| Artículo de origen | Slug destino inexistente | Texto del ancla |
|---|---|---|
| `responsabilidad-social-la-base-de-una-organizacion-resiliente` | `6-tips-para-postular-al-esr` | ESR |

Cada uno da 404. Para resolverlo: apuntar el enlace al destino correcto añadiendo una entrada a
`SLUG_REMAP` en el pipeline, o publicar el artículo que falta.

## 10. Los 56 extractos generados

El export solo traía extracto propio en 4 notas. Estos 56 se escribieron a partir del contenido real
de cada nota, en tercera persona institucional y tratamiento de usted. **Están para revisarse y corregirse.**

| Nota | Extracto |
|---|---|
| `guia-sobre-sostenibilidad-empresarial`<br>*Sostenibilidad empresarial: Qué es y cómo implementarla con éxito* | Qué es la sostenibilidad empresarial y cómo implementarla: gestión de riesgos, uso eficiente de recursos y rentabilidad a largo plazo para su organización. |
| `guia-calcular-retorno-social`<br>*Webinar “Del donativo al impacto: Cómo calcular el retorno social de tus proyectos con participación especial de BMW Group Planta SLP” * | Webinar sobre SROI con BMW Group Planta San Luis Potosí: cómo medir el retorno social de sus proyectos y pasar del donativo al impacto demostrable. |
| `guia-analisis-de-materialidad`<br>*Análisis de materialidad: cómo definir prioridades ASG en tu empresa * | Cómo definir prioridades ASG a partir de sus grupos de interés: qué son los stakeholders, cómo identificarlos y cómo traducir sus expectativas en decisiones. |
| `claves-integrar-doble-materialidad`<br>*Doble materialidad: 5 claves para su estrategia* | Cinco claves para integrar la doble materialidad en su estrategia y convertir la sostenibilidad en una herramienta de gestión de riesgos y de decisión. |
| `guia-responsabilidad-social-empresarial-pymes`<br>*9 consejos para incorporar la Responsabilidad Social Empresarial en PyMEs* | Nueve consejos prácticos para incorporar la responsabilidad social empresarial en una PyME, con los retos habituales y cómo resolverlos paso a paso. |
| `guia-reporte-de-sustentabilidad`<br>*Reporte de sustentabilidad: Guía para estructurarlo bajo estándares GRI* | Cómo estructurar un reporte de sustentabilidad bajo los estándares GRI, para comunicar sus avances con transparencia y reducir riesgos reputacionales. |
| `nuevas-estrategias-para-una-postulacion-exitosa-al-distintivo-esr-2024`<br>*Nuevas estrategias para una postulación exitosa al distintivo ESR 2024* | Estrategias para preparar una postulación exitosa al Distintivo ESR 2024 y demostrar un compromiso social auténtico que diferencie a su empresa. |
| `como-realizar-un-diagnostico-de-impacto-social-efectivo`<br>*¿Cómo realizar un diagnóstico de impacto social efectivo?* | Cómo realizar un diagnóstico de impacto social efectivo: entender las necesidades reales de la comunidad y sustituir el asistencialismo por estrategia. |
| `como-construir-una-cadena-de-valor-y-guiar-a-las-pymes-hacia-los-ods`<br>*¿Cómo construir una cadena de valor responsable y guiar a las PyMEs hacia los ODS, con un programa estratégico?* | El programa Campeonas por los ODS de CEMEX como modelo para construir una cadena de valor responsable y guiar a las PyMEs proveedoras hacia los ODS. |
| `como-superar-desafios-rse-sector-industrial`<br>*Cómo superar los desafíos de la RSE en el Sector Industrial* | Los desafíos propios de la RSE en el sector industrial y cómo superarlos, en un entorno donde las prácticas sostenibles dejaron de ser opcionales. |
| `nuevo-modelo-distintivo-esr-2023-pymes`<br>*El nuevo modelo del Distintivo ESR® 2023: Guía para PyMEs* | Guía del nuevo modelo del Distintivo ESR 2023 para PyMEs: qué cambia en la evaluación, qué se exige y cómo puede prepararse una empresa pequeña. |
| `el-abc-de-la-responsabilidad-social-empresarial`<br>*El ABC de la Responsabilidad Social Empresarial* | Introducción a la responsabilidad social empresarial para quien se acerca por primera vez: qué es, desde qué ángulos se aborda y por dónde empezar. |
| `conoce-los-7-pasos-para-triunfar-en-tu-estrategia-de-rse`<br>*Conoce los 7 pasos para triunfar en tu estrategia de RSE* | Los siete pasos de RESILIO, la metodología que ResponSable construyó en quince años, para diseñar, implementar y comunicar una estrategia de RSE. |
| `quieres-obtener-el-distintivo-esr-en-2023-conoce-los-cambios-en-la-convocatoria-y-preparate`<br>*¿Quieres obtener el Distintivo ESR en 2023? Conoce los cambios en la convocatoria y prepárate* | Los cambios de la convocatoria del Distintivo ESR 2023 y cómo prepararse: qué evalúa el reconocimiento del Cemefi y qué debe reunir su empresa. |
| `tips-para-reportar-con-los-nuevos-estandares-gri`<br>*Tips para reportar con los nuevos estándares GRI* | Webinar sobre los estándares GRI vigentes desde enero de 2023: qué cambia frente a GRI Standards 2016 y cómo adaptar su reporte de sostenibilidad. |
| `5-consejos-de-responsabilidad-social-empresarial-rse-que-no-cuestan-casi-nada`<br>*5 consejos de Responsabilidad Social Empresarial (RSE) que no cuestan casi nada* | Cinco acciones de responsabilidad social de costo mínimo, centradas en condiciones laborales y gestión cotidiana, para empezar sin presupuesto. |
| `lo-que-no-te-dicen-al-iniciar-una-estrategia-de-sostenibilidad`<br>*Lo que no te dicen al iniciar una Estrategia de Sostenibilidad* | Lo que rara vez se advierte al iniciar una estrategia de sostenibilidad, con la experiencia de Profuturo y Grupo BAL tras su diagnóstico ISO 26000. |
| `analisis-de-materialidad-mas-alla-de-un-requisito-para-reportar`<br>*Análisis de materialidad: Más allá de un requisito para reportar* | El análisis de materialidad como ejercicio estratégico y no solo como requisito GRI: cómo priorizar los temas que sus grupos de interés consideran críticos. |
| `los-desafios-de-desarrollar-una-estrategia-de-sustentabilidad-exitosa`<br>*Los desafíos de desarrollar una estrategia de Sustentabilidad Exitosa* | Los desafíos de construir una estrategia de sustentabilidad que resista la exigencia de inversionistas, clientes y consumidores por rendir cuentas. |
| `cuales-son-los-beneficios-de-aplicar-practicas-de-rs-en-las-pymes`<br>*¿Cuáles son los beneficios de aplicar prácticas de RSE en las PyMEs?* | Los beneficios concretos de aplicar prácticas de RSE en una PyME, donde la cercanía con el entorno y con el cliente convierte la gestión en ventaja. |
| `heineken-mexico-pasos-estrategicos-para-un-estudio-de-materialidad-fuera-de-lo-comun`<br>*HEINEKEN México – Pasos Estratégicos para un Estudio de Materialidad Fuera de lo Común* | Conversación con HEINEKEN México sobre su estudio de materialidad: cómo se definen los temas materiales, a quién consultar y cuánto tiempo exige. |
| `responshable-2-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa`<br>*ResponsHABLE 2 – Resolvemos las dudas de Responsabilidad Social en tu Empresa* | Segunda sesión de ResponsHABLE: respuestas sobre identificación de ODS, relacionamiento con grupos de interés y RSE después de la pandemia. |
| `responshable-1-resolvemos-las-dudas-de-responsabilidad-social-en-tu-empresa`<br>*ResponsHABLE 1 – Resolvemos las dudas de Responsabilidad Social en tu Empresa* | Primera sesión de ResponsHABLE: por qué la responsabilidad social va más allá del cumplimiento legal y qué beneficios genera un enfoque estratégico. |
| `los-desastres-no-son-naturales`<br>*¡Los desastres no son naturales!* | Relato en primera persona del sismo de 2017 y la pérdida de las oficinas: lo que la crisis enseñó sobre resiliencia organizacional y gestión de riesgos. |
| `el-a-b-c-de-la-actualizacion-de-los-estandares-de-gri`<br>*El A, B, C de la actualización de los Estándares de GRI* | La actualización más ambiciosa de los Estándares GRI desde 2016: por qué se hizo, cuáles son los cambios principales y a partir de cuándo aplican. |
| `informes-de-sustentabilidad-por-donde-empezar`<br>*Informes de Sustentabilidad: ¿por dónde empezar?* | Buenas prácticas para empezar un informe de sustentabilidad: cómo organizar la recopilación de información y evitar que el proceso se vuelva inmanejable. |
| `10-errores-que-debes-evitar-en-tu-informe-de-sostenibilidad`<br>*10 errores que debes evitar en tu Informe de Sostenibilidad* | Diez errores frecuentes al elaborar un informe de sostenibilidad, identificados en la experiencia de ResponSable acompañando a áreas de RSE. |
| `responsabilidad-social-la-base-de-una-organizacion-resiliente`<br>*Responsabilidad Social: la base de una organización resiliente* | Por qué la responsabilidad social sostiene la resiliencia organizacional: el concepto llevado del plano individual al de la empresa y su operación. |
| `acciones-empresariales-ante-covid-19`<br>*Acciones de RSE ante COVID-19* | Balance de las acciones de RSE desplegadas por los distintos sectores durante el primer año de la pandemia y de sus efectos económicos y laborales. |
| `estudio-de-materialidad-10-beneficios-estrategicos`<br>*Estudio de materialidad: 10 Beneficios Estratégicos* | Diez beneficios estratégicos del estudio de materialidad y por qué su valor para el negocio excede el uso habitual como simple insumo para reportar. |
| `5-razones-para-evaluar-la-madurez-de-la-rs-en-tu-empresa-usando-la-iso-26000`<br>*5 razones para evaluar la madurez de la RS en tu empresa usando la ISO 26000* | Cinco razones para evaluar la madurez de su gestión con la ISO 26000, la norma internacional de responsabilidad social construida por 99 países. |
| `todo-lo-que-debes-saber-sobre-compras-sostenibles-en-5-minutos`<br>*Todo lo que debes saber sobre Compras Sostenibles en 5 minutos* | Introducción a las compras sostenibles a partir del caso Nike: por qué la cadena de suministro concentra buena parte del riesgo social de una empresa. |
| `asesoria-gratuita-covid19`<br>*¡Brindamos asesoría gratuita para enfrentar la nueva realidad en las organizaciones!* | ResponSable abrió asesoría gratuita durante la pandemia, a partir de una encuesta de detección de necesidades entre clientes, aliados y empresas. |
| `impartimos-talleres-de-rs-y-gestion-de-riesgos-durante-la-emergencia-de-covid-19`<br>*Impartimos talleres de RS y Gestión de riesgos durante la emergencia de COVID-19* | Talleres de responsabilidad social y gestión de riesgos impartidos durante la emergencia sanitaria, con el video completo de la sesión con CAINTRA. |
| `a-nuestros-grupos-de-interes`<br>*Call to action ResponSable ante el COVID-19* | Comunicado de ResponSable a sus grupos de interés ante el COVID-19: la resiliencia como respuesta a una crisis sanitaria con efectos económicos. |
| `como-empezar-un-plan-de-responsabilidad-social`<br>*¿Cómo empezar un plan de Responsabilidad Social?* | Cómo empezar un plan de responsabilidad social cuando las normas, indicadores y metodologías disponibles dificultan saber por dónde comenzar. |
| `distintivo-esr-importancia-cadena-de-valor`<br>*La importancia del Distintivo ESR en la cadena de valor* | Por qué el Distintivo ESR importa en la cadena de valor: extender las buenas prácticas a todo el proceso comercial reduce el riesgo legal y reputacional. |
| `impartimos-cursos-y-talleres-de-responsabilidad-social-este-2019`<br>*¡Impartimos cursos y talleres de responsabilidad social este 2019!* | Balance de los cursos y talleres de responsabilidad social impartidos en 2019 con empresas y organismos promotores de la RSE en México. |
| `datos-que-revelan-el-estado-de-la-rs-en-mexico`<br>*Responsabilidad Social: Cinco datos que revelan su estado en México* | Cinco datos sobre el estado de la responsabilidad social en México: percepción de rentabilidad, presupuesto asignado y situación en las MiPyMEs. |
| `equidad-de-genero-y-responsabilidad-social`<br>*Equidad de género y responsabilidad social* | El Ranking PAR México 2019 leído desde la responsabilidad social: qué revela sobre las brechas de género en las organizaciones latinoamericanas. |
| `responsable-dos-anos-del-sismo`<br>*ResponSable a dos años del sismo* | Dos años después del sismo que costó a ResponSable sus instalaciones y tres compañeros, el recuento de la reconstrucción con sus grupos de interés. |
| `beneficios-de-rs-en-las-pymes`<br>*Beneficios de aplicar prácticas de RSE en las PyMEs* | Los beneficios de aplicar prácticas de RSE en PyMEs, que suelen ejercerlas sin nombrarlas gracias a su cercanía con el entorno y con el cliente. |
| `6-tips-para-postular-al-distintivo-esr-del-cemefi`<br>*6 Tips para postular al Distintivo ESR del Cemefi* | Seis recomendaciones para postular al Distintivo ESR del Cemefi, el reconocimiento que desde el año 2000 mide el compromiso social de las empresas. |
| `como-reportar-ods-en-informes-de-sustentabilidad`<br>*Cómo reportar ODS en tu informe de sustentabilidad en 2020* | Cómo reportar los ODS en un informe de sustentabilidad, la herramienta más efectiva para comunicar la RSE a los distintos grupos de interés. |
| `panorama-la-responsabilidad-social-mexico-2019`<br>*Panorama de la Responsabilidad Social en México 2019, ¡Hemos presentado nuestro Estudio!* | Presentación de la segunda edición del estudio Panorama de la Responsabilidad Social en México 2019 en la Secretaría de Relaciones Exteriores. |
| `taller-materialidad-y-dialogo-con-grupos-de-interes`<br>*ResponSable en Pacto Mundial México: Materialidad y diálogo con grupos de interés* | Taller impartido con Pacto Mundial México sobre materialidad y diálogo con grupos de interés como pieza central de una estrategia de RSE. |
| `panorama-de-la-responsabilidad-social-en-mexico-2019`<br>*Panorama de la Responsabilidad Social en México 2019, el estudio que no se construye en un día* | Antesala del estudio Panorama de la Responsabilidad Social en México 2019: cómo se construyó el proyecto y qué se propuso medir. Ya está disponible. |
| `unicef-lanza-herramienta-auto-diagnostico-empresas`<br>*UNICEF lanza una herramienta de auto-diagnóstico para empresas* | UNICEF publica una herramienta confidencial de autodiagnóstico para que cualquier empresa mida su impacto en la niñez y en la adolescencia. |
| `ranking-negocios-inclusivos-donde-desarrollo-social-encuentra-rentabilidad`<br>*Ranking Negocios Inclusivos: Donde el desarrollo social se encuentra con la rentabilidad* | La segunda edición del Índice de Negocios Inclusivos y las empresas que integran a proveedores en situación de vulnerabilidad en su cadena. |
| `responsable-pacto-mundial-mexico-materialidad-dialogo-con-grupos-interes`<br>*ResponSable en Pacto Mundial México: Materialidad y diálogo con grupos de interés* | Crónica del taller de materialidad y diálogo con grupos de interés impartido en la sede de Pacto Mundial México, con la evaluación de los asistentes. |
| `la-responsabilidad-social-en-el-sector-alimentario-en-mexico`<br>*La Responsabilidad Social en el sector Alimentación y Bebidas mexicano* | Datos y mejores prácticas de responsabilidad social en el sector mexicano de alimentación y bebidas, a partir del estudio Panorama de la RS. |
| `sostenibilidad-sustentabilidad-responsabilidad-social-misma-cosa`<br>*Sostenibilidad, Sustentabilidad, Responsabilidad Social, ¿son la misma cosa?* | Sostenibilidad, sustentabilidad y responsabilidad social: qué distingue a cada término y por qué la confusión afecta la estrategia de una empresa. |
| `19s-responsable-agencia-responsabilidad-social-continua-operaciones`<br>*A seis meses de ser afectados por el sismo del 19S, ResponSable, agencia de Responsabilidad Social, continúa con sus operaciones* | Seis meses después del sismo del 19S, ResponSable reanuda operaciones en sus nuevas oficinas de Polanco y agradece a quienes lo hicieron posible. |
| `el-foro-mexico-responsable-2016-un-exito-en-la-promocion-del-how-to`<br>*El Foro México Responsable 2016, un éxito en la promoción del «How To…»* | Crónica de los cinco años del Foro México Responsable, con más de 160 asistentes en la Secretaría de Relaciones Exteriores y acceso gratuito. |
| `las-10-recomendaciones-en-rs-de-bimbo-coca-cola-mexico-cemex-y-bio-pappel`<br>*Las 10 recomendaciones en RS de BIMBO, Coca-Cola México, CEMEX y Bio-Pappel* | Diez recomendaciones en responsabilidad social de BIMBO, Coca-Cola México, CEMEX y Bio-Pappel, recogidas en el 2° Foro Nacional sobre RSC. |
| `articulo-ganador-concurso-estudiantil-imagina-tu-campus-responsable`<br>*Artículo Ganador:  Concurso estudiantil "Imagina tu Campus Responsable"* | Artículo ganador del concurso Imagina tu Campus Responsable: la educación como eje rector para integrar la responsabilidad social en las universidades. |

### Los 4 extractos que venían de WordPress

No se tocaron, pero dos exceden con mucho lo que Google muestra en resultados (~155-160 caracteres)
y aparecen recortados:

- `guia-sobre-la-doble-materialidad` — 259 caracteres ← **demasiado largo**
- `guia-sobre-los-stakeholders` — 120 caracteres
- `como-desarrollar-tu-estrategia-de-rse-con-la-metodologia-resilio` — 311 caracteres ← **demasiado largo**
- `desarrollando-nuevas-estrategias-en-responsabilidad-social-corporativa` — 130 caracteres

## 11. Artículos del editor clásico

16 notas se guardaron con el editor clásico, que no escribe `<p>`: WordPress las
maquetaba al vuelo. Se les aplicó un port de `wpautop`, así que su estructura de párrafos es
**reconstruida, no original**. Son las más expuestas a un salto de línea mal puesto:

- `19s-responsable-agencia-responsabilidad-social-continua-operaciones`
- `articulo-ganador-concurso-estudiantil-imagina-tu-campus-responsable`
- `beneficios-de-rs-en-las-pymes`
- `como-empezar-un-plan-de-responsabilidad-social`
- `como-reportar-ods-en-informes-de-sustentabilidad`
- `el-foro-mexico-responsable-2016-un-exito-en-la-promocion-del-how-to`
- `equidad-de-genero-y-responsabilidad-social`
- `la-responsabilidad-social-en-el-sector-alimentario-en-mexico`
- `las-10-recomendaciones-en-rs-de-bimbo-coca-cola-mexico-cemex-y-bio-pappel`
- `panorama-de-la-responsabilidad-social-en-mexico-2019`
- `ranking-negocios-inclusivos-donde-desarrollo-social-encuentra-rentabilidad`
- `responsable-dos-anos-del-sismo`
- `responsable-pacto-mundial-mexico-materialidad-dialogo-con-grupos-interes`
- `sostenibilidad-sustentabilidad-responsabilidad-social-misma-cosa`
- `taller-materialidad-y-dialogo-con-grupos-de-interes`
- `unicef-lanza-herramienta-auto-diagnostico-empresas`

## 12. URLs sueltas convertidas en enlace

Aparecían como texto plano en línea propia (autoembed de WordPress, que aquí no se ejecuta) y se
habrían visto como texto no clicable:

- `panorama-la-responsabilidad-social-mexico-2019` → https://www.youtube.com/watch?v=5_vsXMrgiS8&amp;feature=youtu.be
- `responsable-pacto-mundial-mexico-materialidad-dialogo-con-grupos-interes` → http://www.pactomundial.org.mx/site/pacto-mundial-en-alianza-con-responsable-llevaron-a-cabo-el-curso-de-materialidad-y-dialogo-con-grupos-de-interes/
