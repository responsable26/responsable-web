/**
 * Video de fondo de los heroes del sitio. Un único origen para las tres
 * ubicaciones que lo montan —el hero de la Home y los dos heroes enmarcados de
 * las páginas de servicio—, para que no puedan divergir de ruta.
 *
 * Un solo formato, MP4/H.264: llegó a haber también un WebM/VP9, y se retiró
 * porque en este metraje VP9 no le gana a H.264. Medido con VMAF contra el
 * máster, a calidad equivalente el WebM pesaba un 8% más (3.17 MB / VMAF 75.8
 * frente a 2.93 MB / VMAF 76.4), así que ofrecerlo primero solo conseguía que
 * Chrome y Firefox se descargaran el archivo más pesado mientras Safari se
 * llevaba el ligero. H.264 lo reproduce todo, de modo que el respaldo tampoco
 * hacía falta. Si algún día se sustituye el metraje conviene volver a medirlo:
 * el resultado depende del contenido, no del códec en abstracto.
 *
 * 1280×720, 30 fps, 50 s y sin pista de audio: el video es decorativo, va
 * silenciado y en bucle, así que una pista de audio solo sumaría peso.
 *
 * Módulo de datos puro: sin JSX ni "use client", así que lo puede importar
 * tanto un componente de servidor como uno de cliente.
 */
export const VIDEO_HERO = "/hero-fondo.mp4";

/** Primer fotograma del mismo metraje: lo que se ve mientras el video carga.
 *  Se usa también como imagen Open Graph de la Home. */
export const POSTER_HERO = "/hero-fondo-poster.jpg";
