"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronIcon, PlusIcon } from "@/components/icons";
import { ServicioModal } from "@/components/home/servicio-modal";
import { desplazarA } from "@/lib/scroll-suave";
import { CUADRANTES, type Cuadrante, type Servicio } from "@/lib/servicios";

/* ───────────────────────── geometría de la rueda ─────────────────────────
   El anillo ya no se dibuja como dona: son los cuatro trazados de
   public/arrows.svg, una cadena de flechas que gira en sentido horario. Cada
   uno se usa tal cual —grosor variable y punta de flecha incluidos— y se
   reescala con un único transform para encajar en el viewBox de 400×400
   centrado en (CX, CY).

   arrows.svg no reparte sus cuatro trazados en cuadrantes de 90°: es un ciclo
   de flechas en diagonal, así que cada una cae en una esquina —arriba-izq,
   arriba-dcha, abajo-dcha, abajo-izq— y no en un lado puro. El mapeo
   pregunta↔trazado va por esa posición real, medida sobre el arte, y no por
   el orden en que aparecen los <path> en el archivo.

   Ángulos medidos desde las 3 en punto y creciendo en sentido horario, que es
   el sentido natural con el eje Y hacia abajo del SVG:
     θ=270 arriba · θ=0 derecha · θ=90 abajo · θ=180 izquierda
*/
const CX = 200;
const CY = 200;
/** Radio al que se reescala la punta más lejana del arte de arrows.svg. */
const R_OUT = 180;

/*
  arrows.svg mide 771.07×752.06 y su arte llena el viewBox de borde a borde,
  así que la mitad de su ancho es el radio de referencia para reescalarlo a
  R_OUT. El pivote es el centro de ese viewBox y no el centroide de cada
  trazado por separado: los cuatro comparten el mismo centro de giro.
*/
const ARROW_VIEWBOX_CX = 385.535;
const ARROW_VIEWBOX_CY = 376.03;
const ARROW_VIEWBOX_R = 385.535;
const ARROW_SCALE = R_OUT / ARROW_VIEWBOX_R;
/** Lleva los trazados de arrows.svg, sin tocar sus coordenadas, al viewBox de la rueda. */
/** Exportado: servicios-cuadrantes.tsx lo reutiliza para dibujar el segmento
 *  de flecha de un solo cuadrante fuera de la rueda, con las mismas
 *  coordenadas exactas. */
export const ARROW_TRANSFORM = `translate(${CX} ${CY}) scale(${ARROW_SCALE}) translate(${-ARROW_VIEWBOX_CX} ${-ARROW_VIEWBOX_CY})`;

/*
  Área de hover/clic de cada cuadrante: un sector angular completo, no la
  silueta de la flecha. R_HOVER_IN queda justo fuera del isotipo central
  (que alcanza ~76 de radio como mucho, ver ISOTIPO_ALTO_OBJETIVO) y también
  fuera del punto más hacia dentro al que llega cualquier flecha (~80, en la
  muesca donde entra la punta de la anterior), así que ningún sector empieza
  ni dentro del isotipo ni antes de donde el arte realmente arranca.
  R_HOVER_OUT supera la diagonal del viewBox (200√2 ≈ 282.8): el sector se
  recorta al propio <svg> con un <clipPath> (ver el <defs> del render), así
  que con un radio de sobra el recorte —no el arco— es quien decide dónde
  termina, y llega de verdad hasta las cuatro esquinas del contenedor.
*/
const R_HOVER_IN = 80;
const R_HOVER_OUT = 300;

/** Cuña invisible: el sector angular completo de un cuadrante, de R_HOVER_IN a R_HOVER_OUT. */
function trazadoAreaHover({ hoverDesde, hoverHasta }: Cuna) {
  const [x1, y1] = punto(R_HOVER_OUT, hoverDesde);
  const [x2, y2] = punto(R_HOVER_OUT, hoverHasta);
  const [x3, y3] = punto(R_HOVER_IN, hoverHasta);
  const [x4, y4] = punto(R_HOVER_IN, hoverDesde);
  return `M ${x1} ${y1} A ${R_HOVER_OUT} ${R_HOVER_OUT} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${R_HOVER_IN} ${R_HOVER_IN} 0 0 0 ${x4} ${y4} Z`;
}

/** Duración del fundido del panel. Debe coincidir con la clase duration-300. */
const FUNDIDO_MS = 300;

/** Debe coincidir con la duración de --animate-indicador-flecha en globals.css. */
const PASO_INDICADOR_MS = 900;
/** Vueltas completas del ciclo de 4 flechas antes de que el indicador se pare solo. */
const CICLOS_INDICADOR = 2;

type Cuna = {
  /** Trazado de public/arrows.svg, en sus coordenadas originales. */
  arco: string;
  /** Mitad de la rueda en la que cae. Decide hacia dónde se desplaza. */
  lado: "derecha" | "izquierda";
  /**
   * Cuerpo recto del segmento: el tramo donde el grosor del trazado se
   * mantiene constante, medido grado a grado sobre el arte original a la
   * altura exacta de rTextoOriginal. Cada flecha tiene, en sentido de giro,
   * dos zonas de grosor variable que quedan fuera de este rango: al final
   * (ángulo mayor) su propia punta, y al principio (ángulo menor) la punta de
   * la flecha ANTERIOR, que invade su arranque —así encajan las cuatro entre
   * sí—. El <path> del riel traza este rango completo: es más largo que
   * cualquier etiqueta a propósito, para que sobre recorrido de sitio y un
   * texto que no quepa entero no se corte por los extremos en vez de
   * desbordar. `etiquetaOffset` decide dónde, dentro de este riel, se centra
   * el texto.
   */
  textoDesde: number;
  textoHasta: number;
  /**
   * Los cuadrantes inferiores necesitan el arco recorrido en sentido inverso.
   * <textPath> orienta cada glifo según la dirección de avance del trazado: en
   * la mitad de abajo, recorrer en horario deja el texto boca abajo. Invertir
   * el recorrido lo endereza sin rotar nada ni convertirlo en trazados.
   */
  invertido: boolean;
  /**
   * startOffset del <textPath>, en % del riel completo (textoDesde→textoHasta
   * en sentido de giro, o su inverso si invertido). Centra el texto con más
   * margen hacia la punta propia que hacia el arranque —el mínimo pedido—,
   * calculado sobre la etiqueta más ancha de los dos breakpoints (móvil, con
   * fuente mayor). Como el riel siempre sobra respecto al texto, ese mismo
   * porcentaje deja margen de sitio en ambos breakpoints sin recalcularlo.
   */
  etiquetaOffset: number;
  /**
   * Radio del riel de la etiqueta, sobre el arte original: el punto medio
   * entre el radio interno y el externo del cuerpo de la flecha, medidos por
   * separado en la zona exacta donde vive cada etiqueta (textoDesde–
   * textoHasta) y no en un punto único —el grosor no es idéntico en las
   * cuatro—. Centra la línea de texto en el grosor del trazado.
   */
  rTextoOriginal: number;
  /**
   * Sector angular del área de hover/clic, en el mismo sentido y convención
   * que el resto de ángulos del archivo. No coincide con textoDesde/Hasta —el
   * cuerpo recto de la flecha— porque el objetivo aquí es distinto: reparto
   * exacto y sin huecos de los 360°, con el corte entre dos cuadrantes justo
   * a medio camino entre donde termina el cuerpo de uno (antes de que
   * empiece su propia punta) y donde empieza el cuerpo del siguiente
   * (después de que termine la punta que invade su arranque). Con eso cada
   * mitad de "zona de punta" —donde a simple vista no está claro a qué
   * cuadrante pertenece— cae del lado del cuadrante dueño de esa punta.
   */
  hoverDesde: number;
  hoverHasta: number;
};

/**
 * Posición de la tarjeta de cada cuadrante en la rejilla de tres columnas de
 * lg. La columna 2 queda vacía: es el hueco reservado para la rueda. El orden
 * del DOM es 1→4, que es el que se ve en móvil al apilarse en una columna.
 */
const CELDA_TARJETA = [
  "lg:col-start-1 lg:row-start-1", // 1 · ¿Dónde Estoy?    arriba-izq
  "lg:col-start-3 lg:row-start-1", // 2 · ¿Adónde Voy?     arriba-dcha
  "lg:col-start-3 lg:row-start-2", // 3 · ¿Cómo lo Hago?   abajo-dcha
  "lg:col-start-1 lg:row-start-2", // 4 · ¿Cómo Comunico?  abajo-izq
];

/** Exportado por el mismo motivo que ARROW_TRANSFORM: .arco es el trazado de
 *  cada segmento de flecha, en el mismo orden que CUADRANTES. */
export const CUNAS: Cuna[] = [
  {
    // 1 · ¿Dónde Estoy? · arriba-izquierda
    arco: "M436.97,100.46l-80.28-69.94-32.69-28.47c-5.34-4.65-13.68-.86-13.68,6.22v28.11c-3.34.65-6.67,1.35-9.97,2.11C146.2,73.45,31.12,211.3,31.12,376.03c0,1.55,0,3.09.03,4.64l61.8-70.94c3.46-3.98,8.47-6.25,13.74-6.25s10.28,2.28,13.75,6.25l40.02,45.93c7.81-84.28,63.66-154.62,139.91-183.4,3.29-1.24,6.61-2.4,9.97-3.48v36.31c0,7.08,8.34,10.88,13.68,6.22l60.71-52.88h0l52.26-45.53c3.78-3.29,3.78-9.16,0-12.45Z",
    lado: "izquierda",
    textoDesde: 195,
    textoHasta: 250,
    invertido: false,
    etiquetaOffset: 47.1,
    rTextoOriginal: 287.84,
    hoverDesde: 178,
    hoverHasta: 267,
  },
  {
    // 2 · ¿Adónde Voy? · arriba-derecha
    arco: "M762.8,309.13h-45.93c-.65-3.34-1.35-6.67-2.11-9.97C679.81,145.01,541.96,29.92,377.22,29.92c-2,0-3.99.02-5.98.05l72.28,62.97c3.98,3.46,6.25,8.47,6.25,13.74s-2.28,10.28-6.25,13.74l-44.7,38.94c83.73,8.24,153.53,63.92,182.17,139.8,1.24,3.29,2.4,6.61,3.48,9.97h-18.5c-7.08,0-10.88,8.34-6.22,13.68l34.79,39.94,63.62,73.03c3.29,3.78,9.16,3.78,12.45,0l52.72-60.52,45.69-52.45c4.65-5.34.86-13.68-6.22-13.68Z",
    lado: "derecha",
    textoDesde: 284,
    textoHasta: 341,
    invertido: false,
    etiquetaOffset: 46.7,
    rTextoOriginal: 276.53,
    hoverDesde: 267,
    hoverHasta: 358,
  },
  {
    // 3 · ¿Cómo lo Hago? · abajo-derecha
    arco: "M678.13,442.33c-3.46,3.98-8.47,6.25-13.74,6.25s-10.28-2.28-13.74-6.25l-55.71-63.95c-.97,92.17-59.22,170.61-140.84,201.42-3.29,1.24-6.61,2.4-9.97,3.48v-36.31c0-7.08-8.34-10.88-13.68-6.22l-60.71,52.88-52.27,45.53c-3.78,3.29-3.78,9.16,0,12.45l80.28,69.94,32.69,28.47c5.34,4.65,13.68.86,13.68-6.22v-28.11c3.34-.65,6.67-1.35,9.97-2.11,149.53-33.91,262.29-164.62,268.93-322.77l-44.89,51.53Z",
    lado: "derecha",
    textoDesde: 15,
    textoHasta: 74,
    invertido: true,
    etiquetaOffset: 47.4,
    rTextoOriginal: 276.12,
    // Envuelve el 0°: hoverHasta pasa de 360 a propósito (450 = 90+360), ver punto().
    hoverDesde: 358,
    hoverHasta: 450,
  },
  {
    // 4 · ¿Cómo Comunico? · abajo-izquierda
    arco: "M310.92,659.12c-3.98-3.46-6.25-8.47-6.25-13.74s2.28-10.28,6.25-13.74l44.7-38.94c-83.73-8.24-153.53-63.92-182.17-139.8-1.24-3.29-2.4-6.61-3.48-9.97h35.12c7.08,0,10.88-8.34,6.22-13.68l-51.73-59.38-46.68-53.59c-3.29-3.78-9.16-3.78-12.45,0l-68.81,79h0s-29.6,33.98-29.6,33.98c-4.65,5.34-.86,13.68,6.22,13.68h29.3c.65,3.34,1.35,6.67,2.11,9.97,34.96,154.16,172.81,269.24,337.54,269.24,2,0,3.99-.02,5.98-.05l-72.28-62.97Z",
    lado: "izquierda",
    textoDesde: 107,
    textoHasta: 162,
    invertido: true,
    etiquetaOffset: 48.9,
    rTextoOriginal: 287.44,
    hoverDesde: 90,
    hoverHasta: 178,
  },
];

/*
  Dirección del "nudge" del indicador de interactividad (ver ServiciosRueda):
  el vector unitario, escalado a NUDGE_INDICADOR, que aleja cada segmento del
  centro de la rueda a lo largo de su propio ángulo medio. Se deriva del
  cuerpo recto del segmento (textoDesde/textoHasta) y no del sector de hover,
  que es más ancho y no representa dónde "vive" visualmente la flecha. Mismo
  sistema de ángulos que punto(): cos/sin ya dan la dirección hacia fuera tal
  cual se ve en el viewBox 400×400.
*/
const NUDGE_INDICADOR = 4;
const DIRECCION_INDICADOR = CUNAS.map(({ textoDesde, textoHasta }) => {
  const rad = ((textoDesde + textoHasta) / 2) * (Math.PI / 180);
  return {
    dx: Math.cos(rad) * NUDGE_INDICADOR,
    dy: Math.sin(rad) * NUDGE_INDICADOR,
  };
});

function punto(r: number, grados: number) {
  const a = (grados * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
}

/** Arco invisible que sirve de riel a la etiqueta: todo el cuerpo recto del segmento.
 *  Exportado por lo mismo que CUNAS y ARROW_TRANSFORM: <RuedaCuadrantes /> pinta
 *  las mismas etiquetas curvas sobre el mismo riel, no sobre uno recalculado. */
export function trazadoEtiqueta({ textoDesde, textoHasta, invertido, rTextoOriginal }: Cuna) {
  const r = rTextoOriginal * ARROW_SCALE;
  const [xa, ya] = punto(r, invertido ? textoHasta : textoDesde);
  const [xb, yb] = punto(r, invertido ? textoDesde : textoHasta);
  // sweep 1 = horario, 0 = antihorario.
  return `M ${xa} ${ya} A ${r} ${r} 0 0 ${invertido ? 0 : 1} ${xb} ${yb}`;
}

/*
  Isotipo de marca para el centro de la rueda: las tres hojas de
  public/brand/logotipo.svg, sin el lettering. Mismo criterio que con
  arrows.svg: coordenadas originales intactas, reescaladas con un único
  transform hacia el hueco del donut. Los fills son los mismos hex del asset
  original (sus clases .cls-1/.cls-3/.cls-4) y no los tokens de color del
  sitio: son la identidad de marca tal cual, no coinciden pixel a pixel con
  el amarillo/magenta/teal de COLORES.
*/
const ISOTIPO_CX = 1600.76;
const ISOTIPO_CY = 237.36;
/** Altura original de las tres hojas juntas, en el viewBox del logotipo. */
const ISOTIPO_ALTO = 474.72;
/** Altura objetivo en el viewBox de la rueda: cabe en el hueco con aire alrededor. */
const ISOTIPO_ALTO_OBJETIVO = 120;
const ISOTIPO_SCALE = ISOTIPO_ALTO_OBJETIVO / ISOTIPO_ALTO;
/** Exportados por el mismo motivo que ARROW_TRANSFORM y CUNAS:
 *  servicios-cuadrantes.tsx pinta la misma rueda —cuatro segmentos más
 *  isotipo— como indicador de posición, y debe hacerlo con estos datos y no
 *  con una copia que pueda desincronizarse. */
export const ISOTIPO_TRANSFORM = `translate(${CX} ${CY}) scale(${ISOTIPO_SCALE}) translate(${-ISOTIPO_CX} ${-ISOTIPO_CY})`;

export const ISOTIPO_HOJAS = [
  {
    d: "M1782.07,111c-21.55,4.92-82.41,21.79-139.53,65.14-87.26,66.22-128.01,162.08-121.42,285.22,38.98-73.08,88.13-142.11,148.64-197.06,11.63-10.33,23.81-19.97,36.35-29.01-45.71,41.14-81.47,92.13-110.88,145.74-16.64,30.44-31.29,61.88-44.18,94.02,28.66-9.02,70.31-25.94,110.24-56.1,91.79-69.34,132.39-172.9,120.77-307.94Z",
    fill: "#15b09d", // .cls-4
  },
  {
    d: "M1466.65,87.9c-8.08,9.49-29.92,37.65-41.13,76.51-17.13,59.38-3.23,116.47,41.28,169.93-7.02-46.2-8.07-93.99.77-139.25,1.78-8.59,4.03-17.06,6.66-25.38-6.8,34.02-5.78,69.14-1,103.3,2.74,19.38,6.72,38.54,11.73,57.42,9.92-13.74,23.05-35.44,30.93-62.55,18.13-62.31,1.57-122.84-49.23-179.99Z",
    fill: "#fab712", // .cls-3
  },
  {
    d: "M1630.53,0c-8.44,4.33-31.96,17.78-51.12,41.85-29.27,36.77-36.07,80.94-20.29,131.44,8.47-34.51,21.6-68.41,40.94-97.67,3.74-5.53,7.79-10.83,12.04-15.91-14.65,21.94-24.12,46.93-30.68,72.33-3.7,14.42-6.46,29.04-8.42,43.76,10.96-6.78,26.49-18.23,39.89-34.99,30.82-38.55,36.74-85.9,17.62-140.81Z",
    fill: "#e71a78", // .cls-1
  },
];

/* ───────────────────────────── color y contraste ─────────────────────────
   Mismos pares fondo/texto que la sección de pestañas, elegidos por contraste
   medido y no por estética (AA pide 4.5:1 en texto normal):

     amarillo #feb80a  navy 7.96   -> navy
     magenta  #ea157a  blanco 4.30 -> blanco  (no llega a 4.5; decisión de marca
                                               consciente, ver servicios.tsx)
     lavanda  #738ac8  ink 4.96    -> ink, navy se queda en 4.09
     teal     #1ab39f  navy 5.27   -> navy

   Este mapa es ya el único del proyecto: la sección de pestañas que lo
   duplicaba se eliminó.

   El acento usa border-l-<color> y no border-<color>: la tarjeta lleva también
   border-border para su contorno, y Tailwind emite las utilidades de color de
   borde en orden alfabético. `border-amarillo` caía antes que `border-border` y
   perdía, mientras que las otras tres caían después y ganaban — de ahí que solo
   la tarjeta amarilla se quedara sin barra. border-left-color es una propiedad
   distinta y no compite con el contorno.
*/
/** Exportado: servicios-cuadrantes.tsx reutiliza .relleno (fill del segmento
 *  de flecha), .acento (borde de identificación de la sección) y .fondo
 *  (píldora de la pestaña activa de su barra de navegación) para que ambas vistas usen
 *  exactamente los mismos pares de color, sin un segundo mapa que pueda
 *  desincronizarse de este.
 *
 *  .fondo es el color pleno del cuadrante como fondo: lo usa la píldora que
 *  marca la pestaña activa en la barra de /servicio/, dentro de una pastilla
 *  de esquinas redondeadas donde un borde inferior no encajaría. El texto
 *  sobre esa píldora NO usa .texto: ese campo da el color de contraste de
 *  cada cuadrante por separado (para el SVG de la rueda), y aquí hace falta
 *  uno solo que valga para los cuatro, porque el color cambia bajo el mismo
 *  texto al pasar de sección. Ver la nota de contraste en
 *  servicios-cuadrantes.tsx. */
export const COLORES: Record<
  Cuadrante["colorToken"],
  {
    relleno: string;
    texto: string;
    trazo: string;
    acento: string;
    fondo: string;
  }
> = {
  amarillo: {
    relleno: "fill-amarillo",
    texto: "fill-navy",
    trazo: "stroke-navy",
    acento: "border-l-amarillo",
    fondo: "bg-amarillo",
  },
  magenta: {
    relleno: "fill-magenta",
    texto: "fill-white",
    trazo: "stroke-white",
    acento: "border-l-magenta",
    fondo: "bg-magenta",
  },
  lavanda: {
    relleno: "fill-lavanda",
    texto: "fill-ink",
    trazo: "stroke-ink",
    acento: "border-l-lavanda",
    fondo: "bg-lavanda",
  },
  teal: {
    relleno: "fill-teal",
    texto: "fill-navy",
    trazo: "stroke-navy",
    acento: "border-l-teal",
    fondo: "bg-teal",
  },
};

export function ServiciosRueda() {
  const [activo, setActivo] = useState<number | null>(null);
  const [servicioModal, setServicioModal] = useState<Servicio | null>(null);
  /* Botón que abrió el modal, para devolverle el foco al cerrar. */
  const disparador = useRef<HTMLButtonElement | null>(null);
  const ruedaRef = useRef<SVGSVGElement>(null);
  /*
    Indicador de foco propio en lugar de :focus-visible.

    La regla global de foco del sitio selecciona [role="button"], y estos
    cuadrantes son <g role="button" tabIndex={0}>. En elementos no nativos con
    tabindex la heurística de :focus-visible no es consistente entre motores, y
    varios la activan también al hacer clic — de ahí el rectángulo magenta. Como
    además el contorno de un outline es la caja envolvente, en un sector de dona
    dibuja un rectángulo que no tiene nada que ver con su forma.

    Se resuelve rastreando el origen del foco: si venía de un puntero no se
    marca, y si venía del teclado se pinta un trazo sobre el propio sector.
  */
  const [focoTeclado, setFocoTeclado] = useState<number | null>(null);
  /* Cuadrante resaltado por el cursor, venga de la tarjeta o del sector. */
  const [resaltado, setResaltado] = useState<number | null>(null);
  const punteroActivo = useRef(false);

  useEffect(() => {
    // El pointerup puede caer fuera del cuadrante, así que la bandera se limpia
    // a nivel de ventana; si no, un arrastre que empieza aquí y termina fuera
    // dejaría suprimido el siguiente foco por teclado.
    function limpiar() {
      punteroActivo.current = false;
    }
    window.addEventListener("pointerup", limpiar);
    window.addEventListener("pointercancel", limpiar);
    return () => {
      window.removeEventListener("pointerup", limpiar);
      window.removeEventListener("pointercancel", limpiar);
    };
  }, []);
  const baseId = useId();
  const panelId = `${baseId}-panel`;

  /*
    El panel ya no se desmonta ni usa hidden. Para que el fundido de salida
    tenga algo que mostrar, el contenido va un paso por detrás de la selección:
    `contenido` es el cuadrante que se está pintando y solo cambia cuando el
    panel está invisible.

    Los espejos en ref existen porque el efecto no puede depender de `visible`
    ni de `contenido`: si lo hiciera, al poner visible=false para iniciar la
    salida el efecto volvería a entrar y saltaría directo a la entrada,
    anulando el fundido.
  */
  const [contenido, setContenido] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const contenidoRef = useRef<number | null>(null);
  const relevo = useRef<ReturnType<typeof setTimeout> | null>(null);

  function mostrar(v: boolean) {
    visibleRef.current = v;
    setVisible(v);
  }
  function pintar(i: number | null) {
    contenidoRef.current = i;
    setContenido(i);
  }

  /** Lectura en el momento del clic: no hay efecto donde suscribirse. */
  function sinMovimiento() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  useEffect(
    () => () => {
      if (relevo.current) clearTimeout(relevo.current);
    },
    [],
  );

  /*
    Indicador de interactividad: la flecha que se está "empujando" hacia
    fuera en este instante, o null si no hay animación en curso. Recorre
    CUNAS en orden (el mismo orden horario del ciclo) dos vueltas completas y
    se detiene sola. indicadorDetenidoRef es la parada definitiva: una vez en
    true (primer hover sobre la rueda, o un cuadrante abierto) la secuencia no
    vuelve a arrancar, ni siquiera si la sección reentra en viewport.
  */
  const [indicadorIndex, setIndicadorIndex] = useState<number | null>(null);
  const indicadorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indicadorDetenidoRef = useRef(false);
  const activoRef = useRef<number | null>(null);

  const detenerIndicador = useCallback(() => {
    indicadorDetenidoRef.current = true;
    if (indicadorTimer.current) {
      clearTimeout(indicadorTimer.current);
      indicadorTimer.current = null;
    }
    setIndicadorIndex(null);
  }, []);

  const iniciarIndicador = useCallback(() => {
    let paso = 0;
    const totalPasos = CUNAS.length * CICLOS_INDICADOR;
    const avanzar = () => {
      if (indicadorDetenidoRef.current) return;
      if (paso >= totalPasos) {
        setIndicadorIndex(null);
        return;
      }
      setIndicadorIndex(paso % CUNAS.length);
      paso += 1;
      indicadorTimer.current = setTimeout(avanzar, PASO_INDICADOR_MS);
    };
    avanzar();
  }, []);

  useEffect(
    () => () => {
      if (indicadorTimer.current) clearTimeout(indicadorTimer.current);
    },
    [],
  );

  // Espejo en ref: la vía de lectura de `activo` desde dentro del callback
  // del IntersectionObserver de abajo, que no puede depender del estado sin
  // reconstruirse en cada apertura/cierre de cuadrante.
  useEffect(() => {
    activoRef.current = activo;
  }, [activo]);

  // Arranca sola al entrar la rueda en viewport, no al cargar la página.
  useEffect(() => {
    // Chequeo directo y no vía sinMovimiento(): esa función no es estable
    // entre renders, y aquí hace falta un array de dependencias fijo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rueda = ruedaRef.current;
    if (!rueda) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observer.disconnect();
        if (indicadorDetenidoRef.current || activoRef.current !== null) return;
        iniciarIndicador();
      },
      { threshold: 0.4 },
    );
    observer.observe(rueda);
    return () => observer.disconnect();
  }, [iniciarIndicador]);

  const cuadranteActivo = contenido === null ? null : CUADRANTES[contenido];
  /** Lado de la rueda: sigue a la selección, se mueve de inmediato. */
  const lado = activo === null ? null : CUNAS[activo].lado;
  /*
    Lado del panel: sigue al contenido pintado, no a la selección. Si siguiera a
    la selección, al cerrar saltaría de un borde al otro a mitad del fundido de
    salida, y en el cruce cambiaría de sitio antes de haberse apagado.
  */
  const ladoPanel = contenido === null ? null : CUNAS[contenido].lado;

  /**
   * Lleva la sección a una posición cómoda de lectura al abrir un cuadrante.
   *
   * La altura del header se mide en el momento, no se cablea: es fixed en la
   * Home y sticky en el resto, y además cambia de alto al convertirse en pill.
   *
   * Si la sección cabe bajo el header, se centra en el espacio libre. Si no
   * cabe —el caso habitual en móvil y con paneles largos— se alinea su inicio
   * bajo el header: así se leen la rueda y el arranque del panel, en lugar de
   * intentar encajar un bloque que no cabe. En desktop la rueda queda visible
   * de todos modos porque es sticky al centro del viewport.
   */
  function centrarRueda() {
    const rueda = ruedaRef.current;
    if (!rueda) return;

    const header = document.querySelector("header");
    const margen = (header?.getBoundingClientRect().height ?? 0) + 16;
    const caja = rueda.getBoundingClientRect();

    // Si ya se ve entera bajo el header, no se mueve nada: el usuario ya la
    // está mirando.
    if (caja.top >= margen && caja.bottom <= window.innerHeight) return;

    /*
      El destino se calcula sobre la rueda y no sobre la sección. Antes se
      alineaba el inicio de la sección bajo el header, pero ahora el encabezado
      —eyebrow, h2 y párrafo— ocupa espacio por encima: alinear la sección
      dejaría la rueda muy por debajo del centro, y el sticky no la sube porque
      solo actúa cuando su posición natural quedaría por encima del anclaje.

      Centrar la rueda en el espacio libre bajo el header la deja siempre a la
      vista, y con ella el panel, que en lg comparte su eje vertical.
    */
    const disponible = window.innerHeight - margen;
    const centroObjetivo = margen + disponible / 2;
    const delta = caja.top + caja.height / 2 - centroObjetivo;

    desplazarA(Math.max(0, window.scrollY + delta), !sinMovimiento());
  }

  function abrirServicio(servicio: Servicio, boton: HTMLButtonElement) {
    disparador.current = boton;
    setServicioModal(servicio);
  }

  /*
    El foco se devuelve en un efecto y no en el manejador de cierre: al cerrar,
    el panel del modal todavía está montado, así que enfocar ahí y desmontarlo
    después dejaría el foco en el body.
  */
  useEffect(() => {
    if (servicioModal === null && disparador.current) {
      disparador.current.focus();
      disparador.current = null;
    }
  }, [servicioModal]);

  function cerrar() {
    if (relevo.current) clearTimeout(relevo.current);
    setActivo(null);
    setServicioModal(null);
    // El contenido sigue pintado durante la salida: es lo que la hace visible.
    mostrar(false);
    /*
      Y se vacía al terminar. Ahora que el panel está en el flujo y es él quien
      da altura a la sección, dejar el contenido puesto mantendría el hueco
      abierto después de cerrar.
    */
    const vaciar = () => pintar(null);
    if (sinMovimiento()) vaciar();
    else relevo.current = setTimeout(vaciar, FUNDIDO_MS);
  }

  function alternarCuadrante(index: number) {
    // Solo al abrir desde cerrado: ni en el cruce entre cuadrantes ni al cerrar.
    const abriendoDesdeCerrado = activo === null;
    // El acordeón se cierra al cambiar de cuadrante: si no, el índice abierto
    // se traslada a un servicio distinto del cuadrante nuevo.
    setServicioModal(null);
    if (relevo.current) clearTimeout(relevo.current);

    if (activo === index) {
      cerrar();
      return;
    }

    setActivo(index);
    // Abrir un cuadrante corta el indicador de interactividad, si seguía en
    // marcha, y evita que vuelva a arrancar.
    detenerIndicador();
    // rAF: hay que esperar a que React monte el panel para medir la sección ya
    // con su altura final.
    if (abriendoDesdeCerrado) requestAnimationFrame(centrarRueda);

    // Con el panel apagado no hay nada que fundir: se pinta y entra.
    if (!visibleRef.current || contenidoRef.current === null) {
      pintar(index);
      mostrar(true);
      return;
    }

    // Cruce directo con el panel a la vista: se apaga, se cambia y vuelve a
    // entrar. La rueda no espera: cruza de forma continua mientras tanto.
    mostrar(false);
    const cambiar = () => {
      pintar(index);
      mostrar(true);
    };
    if (sinMovimiento()) cambiar();
    else relevo.current = setTimeout(cambiar, FUNDIDO_MS);
  }

  return (
    /* id="servicios" es el destino del enlace «Servicios» del header y del
       «Conozca más» de Intro. Vivía en la sección de pestañas, hoy eliminada. */
    <section
      id="servicios"
      /*
        Padding superior reducido respecto al resto de secciones, y a propósito:
        el fondo off-white arranca justo aquí, así que el borde ya marca el
        inicio y no hace falta que --section-y lo repita. La sección anterior
        aporta además su propio padding inferior, de modo que con el valor
        completo se acumulaban dos separaciones y el eyebrow quedaba muy lejos
        del borde de color. El inferior sí conserva el ritmo del sitio.

        scroll-mt-28 (7rem): mismo valor que .articulo-prose h2/h3 en
        globals.css para el mismo problema —que el header fijo/sticky no tape
        el ancla al navegar por hash—. Es el respaldo estático para cuando el
        salto es nativo (llegada desde otra página, o sin JS); el clic en
        "Servicios" desde la propia Home mide el alto real del header en el
        momento (irAAncla, en site-header.tsx) y no depende de este valor.
        7rem cubre de sobra el header en su estado alto (sin scroll, py-5):
        si aterriza ya en su estado "pill" (más bajo) sobra margen en vez de
        faltar, que es el error seguro.
      */
      className="scroll-mt-28 bg-off-white px-6 pt-[clamp(2.25rem,5vw,4rem)] pb-[var(--section-y)] lg:px-10"
    >
      {/*
        Esta sección usa el contenedor ancho y no el estándar de 1120px: aun
        con la columna central en 420px —el ancho real del <svg>, ver más
        abajo—, con el contenedor normal las columnas de tarjetas se quedarían
        en ~286px. Todo el ancho extra va a esas dos columnas; la rueda y el
        hueco central no cambian.
      */}
      <div className="mx-auto max-w-[var(--container-ancho)]">
        <div className="text-center">
          <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
            Servicios
          </p>
          <h2 className="font-head mt-2 text-[clamp(1.6rem,4.3vw,2.6rem)] font-semibold text-navy">
            Nuestros Servicios
          </h2>
          {/* Medida de lectura en ch y no en % del contenedor: este es el
              contenedor ancho, y a 1280px el párrafo se iría de borde a borde. */}
          <p className="font-body mx-auto mt-4 max-w-[62ch] text-[1.05rem] text-ink-soft">
            Cuatro preguntas ordenan cualquier estrategia de sostenibilidad.
            Cada una abre un grupo de servicios diseñados para responderla con
            evidencia.
          </p>
        </div>

        {/*
          En móvil todo va en flujo normal, rueda arriba y panel debajo. El
          desplazamiento lateral y el panel superpuesto solo existen desde lg.
        */}
        <div className="mt-14 grid">
          {/*
            El centrado es explícito por flex y no por mx-auto sobre el <svg>:
            así no depende de que el preflight deje el SVG en display:block ni
            de cómo resuelvan w-full y max-w juntos. En reposo el eje de la
            rueda coincide con el del contenedor.

            La traslación vive en este mismo contenedor a ancho completo, de
            modo que el 25% es un cuarto del ancho del contenedor y no del
            ancho de la rueda. Parte siempre de la posición centrada.
          */}
          {/*
            lg:pointer-events-none en la columna, y pointer-events-auto en el
            propio <svg>: esta columna ocupa el ancho completo de la celda pero
            solo dibuja la rueda en el centro, así que sin esto su caja
            transparente se traga los clics de todo lo que quede debajo.
          */}
          <div className="relative lg:sticky lg:top-[calc(50vh-210px)] lg:self-center lg:[grid-area:1/1] lg:pointer-events-none">
            <div
              className={`flex w-full justify-center transition-transform duration-500 ease-out ${
                lado === "derecha"
                  ? "lg:-translate-x-[25%]"
                  : lado === "izquierda"
                    ? "lg:translate-x-[25%]"
                    : "lg:translate-x-0"
              }`}
            >
              <svg
                ref={ruedaRef}
                viewBox="0 0 400 400"
                role="group"
                aria-label="Rueda de servicios por cuadrante"
                /* Primer hover sobre cualquier parte de la rueda: corta el
                   indicador de interactividad y evita que vuelva a arrancar.
                   En el <svg>, no en cada segmento, para que cuente cualquier
                   punto de la rueda y no solo los sectores de cuadrante. */
                onMouseEnter={detenerIndicador}
                className="pointer-events-auto block w-full max-w-[300px] sm:max-w-[420px]"
              >
                <defs>
                  {/*
                    Recorte del área de hover de cada cuadrante al propio
                    <svg>: R_HOVER_OUT se dibuja de sobra (ver su comentario),
                    así que sin esto invadiría fuera del contenedor en vez de
                    llegar exactamente a su borde.
                  */}
                  <clipPath id={`${baseId}-recorte-rueda`}>
                    <rect x="0" y="0" width="400" height="400" />
                  </clipPath>
                </defs>
                {CUNAS.map((cuna, index) => {
                  const cuadrante = CUADRANTES[index];
                  const color = COLORES[cuadrante.colorToken];
                  const abierto = activo === index;
                  const atenuado = activo !== null && !abierto;
                  const arcoId = `${baseId}-arco-${index}`;
                  /*
                    Control primario: las tarjetas cuando están a la vista, el
                    sector cuando no. Nunca los dos a la vez, para no anunciar
                    dos veces la misma acción. Con las tarjetas ocultas el
                    sector recupera rol, foco y etiqueta, de modo que se puede
                    cruzar de cuadrante con el teclado sin cerrar antes.
                  */
                  const expuesto = activo !== null;
                  const resaltadoAqui = resaltado === index;
                  const apagadoPorResalte =
                    activo === null && resaltado !== null && !resaltadoAqui;

                  return (
                    <g
                      key={cuadrante.numero}
                      role={expuesto ? "button" : undefined}
                      tabIndex={expuesto ? 0 : -1}
                      aria-hidden={expuesto ? undefined : true}
                      aria-expanded={expuesto ? abierto : undefined}
                      aria-controls={expuesto ? panelId : undefined}
                      aria-label={
                        expuesto
                          ? `${cuadrante.pregunta} — ver servicios`
                          : undefined
                      }
                      onClick={() => alternarCuadrante(index)}
                      onMouseEnter={() => setResaltado(index)}
                      onMouseLeave={() => setResaltado(null)}
                      onPointerDown={() => {
                        punteroActivo.current = true;
                      }}
                      onFocus={() => {
                        if (!punteroActivo.current) setFocoTeclado(index);
                      }}
                      onBlur={() => setFocoTeclado(null)}
                      onKeyDown={(event) => {
                        // role="button" no trae activación por teclado: hay que
                        // reproducir Enter y Espacio a mano.
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          alternarCuadrante(index);
                        }
                      }}
                      /* outline-none desactiva la regla global solo en estos
                       elementos; el resto del sitio la conserva intacta. */
                      /*
                        Respuesta al cursor: el sector crece un 2% desde el
                        centro de la rueda. transform-box/origin explícitos para
                        que la escala salga del eje del donut y el sector se
                        separe hacia fuera, no hacia su propio centro.
                        Bajo movimiento reducido se anula la escala, no solo la
                        transición: si no, daría un salto seco.
                      */
                      /*
                        El resalte lo gobierna el estado, no :hover, para que
                        funcione también cuando el cursor está sobre la tarjeta.
                        Va por dos vías: escala —que se anula con movimiento
                        reducido— y atenuación de los demás, que no es
                        movimiento y por tanto sobrevive a esa preferencia.
                      */
                      className={`cursor-pointer outline-none [transform-box:view-box] [transform-origin:50%_50%] transition-[opacity,scale] duration-300 motion-reduce:scale-100 ${
                        resaltadoAqui ? "scale-[1.02]" : "scale-100"
                      } ${
                        atenuado
                          ? "opacity-35"
                          : apagadoPorResalte
                            ? "opacity-60"
                            : "opacity-100"
                      }`}
                    >
                      {/*
                        Área real de hover/clic: el sector angular completo
                        del cuadrante, no la silueta de la flecha. Invisible
                        (fill transparent, no "none": así sigue capturando el
                        puntero) y recortada al propio <svg> para no invadir
                        las columnas de las tarjetas. Va primero en el DOM,
                        detrás del resto, aunque al ser invisible el orden no
                        se note visualmente.
                      */}
                      <path
                        d={trazadoAreaHover(cuna)}
                        clipPath={`url(#${baseId}-recorte-rueda)`}
                        fill="transparent"
                      />

                      {/*
                        Indicador de interactividad: solo envuelve lo visual
                        (flecha, contorno de foco, etiqueta), nunca el área de
                        hover/clic de arriba, que debe quedarse fija en su
                        sector. La animación vuelve sola a (0,0) en su 100%
                        (ver globals.css), así que quitar la clase al cruzar
                        de flecha o al terminar el ciclo no deja transform
                        residual.
                      */}
                      <g
                        className={
                          indicadorIndex === index
                            ? "animate-indicador-flecha motion-reduce:animate-none"
                            : undefined
                        }
                        style={
                          indicadorIndex === index
                            ? ({
                                "--indicador-dx": `${DIRECCION_INDICADOR[index].dx}px`,
                                "--indicador-dy": `${DIRECCION_INDICADOR[index].dy}px`,
                              } as CSSProperties)
                            : undefined
                        }
                      >
                        <path
                          d={cuna.arco}
                          transform={ARROW_TRANSFORM}
                          className={color.relleno}
                        />

                        {/* Sigue el contorno real de la flecha, no su caja
                          envolvente. El color es el mismo que ya se eligió por
                          contraste contra ese relleno, así que se ve en las
                          cuatro. */}
                        {focoTeclado === index ? (
                          <path
                            d={cuna.arco}
                            transform={ARROW_TRANSFORM}
                            fill="none"
                            strokeWidth={2.5}
                            className={`pointer-events-none ${color.trazo}`}
                          />
                        ) : null}

                        {/* Riel de la etiqueta: no se pinta, solo guía al textPath. */}
                        <path id={arcoId} d={trazadoEtiqueta(cuna)} fill="none" />

                        {/*
                          Texto real: seleccionable e indexable. 13px es el
                          mínimo legible en pantallas pequeñas; se fijó
                          validando "¿Cómo Comunico?" —la etiqueta más larga—
                          contra su riel, y las otras tres comparten el
                          resultado. Sigue algo mayor en móvil porque el SVG se
                          escala a 300px y el tamaño efectivo cae con él.
                        */}
                        <text
                          className={`font-head [font-size:14.5px] font-semibold sm:[font-size:13px] ${color.texto}`}
                          dominantBaseline="middle"
                          textAnchor="middle"
                        >
                          <textPath
                            href={`#${arcoId}`}
                            startOffset={`${cuna.etiquetaOffset}%`}
                          >
                            {cuadrante.pregunta}
                          </textPath>
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/*
                  Isotipo de marca, dentro del hueco del donut. Sustituye a la
                  pista de interacción en texto: es lo único que hay en el
                  hueco, así que va centrado en el eje del donut y no depende
                  de `activo` como sí lo hacía el texto —es marca, no una
                  instrucción que deje de aplicar al abrir un cuadrante—.
                  ISOTIPO_ALTO_OBJETIVO se eligió con margen de sobra respecto
                  al punto donde más cerca del centro llega la punta de una
                  flecha, así que no lo toca en ningún breakpoint.
                */}
                <g transform={ISOTIPO_TRANSFORM} aria-hidden="true">
                  {ISOTIPO_HOJAS.map((hoja, i) => (
                    <path key={i} d={hoja.d} fill={hoja.fill} />
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/*
            Tarjetas fijas del estado inicial, en la misma celda de grid que la
            rueda y el panel. En lg forman una rejilla de tres columnas cuya
            columna central queda vacía: es el hueco reservado para la rueda, y
            cada tarjeta se coloca del lado que ocupa su cuadrante.

            La columna central mide 420px, el mismo max-w del <svg> de la
            rueda (ver más abajo) y no más: el <svg> se centra en un
            contenedor de ancho completo, así que este valor no lo posiciona,
            pero si fuera mayor —540px, como antes— dejaría a cada lado del
            <svg> una franja dentro de esta columna que ninguna tarjeta ocupa,
            fuera del área de hover ampliada de la rueda (que se recorta al
            propio <svg>) y también fuera de las tarjetas: una franja muerta
            que no responde a nada. Igualando ambos anchos, el borde de la
            columna cae justo donde termina el <svg>.

            Su alto (dos tarjetas apiladas, ~440px) queda por debajo de los
            520px de la rueda, así que la celda la sigue marcando la rueda y el
            centrado vertical no cambia.

            Se ocultan cuando hay un cuadrante activo, porque ese espacio pasa a
            ser del panel. El colapso por grid-template-rows solo actúa por
            debajo de lg, donde están en flujo y dejarían un hueco.
          */}
          <div
            className={`max-lg:grid max-lg:transition-[grid-template-rows] max-lg:duration-300 lg:[grid-area:1/1] lg:self-center ${
              activo === null
                ? "max-lg:grid-rows-[1fr]"
                : "max-lg:grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden lg:overflow-visible">
              <div
                className={`mt-10 grid gap-4 transition-opacity duration-300 lg:mt-0 lg:grid-cols-[1fr_420px_1fr] lg:gap-6 ${
                  activo === null
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                {CUADRANTES.map((cuadrante, index) => {
                  const color = COLORES[cuadrante.colorToken];
                  const resaltadoAqui = resaltado === index;

                  return (
                    <button
                      key={cuadrante.numero}
                      type="button"
                      /* inert cuando están ocultas: ni foco ni lectura. */
                      inert={activo !== null}
                      onClick={() => alternarCuadrante(index)}
                      onMouseEnter={() => setResaltado(index)}
                      onMouseLeave={() => setResaltado(null)}
                      onFocus={() => setResaltado(index)}
                      onBlur={() => setResaltado(null)}
                      /*
                        El acento va como barra lateral y no en el título: los
                        cuatro colores de marca se quedan entre 1.63 y 4.30
                        contra blanco, por debajo del 4.5 que pide un texto. El
                        significado lo carga el título en navy; el color solo
                        refuerza.
                      */
                      className={`relative flex flex-col rounded-sm border border-l-4 border-border bg-white px-3 py-4 text-left transition-[box-shadow,translate] duration-200 motion-reduce:translate-y-0 ${
                        color.acento
                      } ${CELDA_TARJETA[index]} ${
                        resaltadoAqui
                          ? "-translate-y-0.5 shadow"
                          : "translate-y-0 shadow-sm"
                      }`}
                    >
                      {/*
                        Indicador decorativo: no es un control propio, es
                        parte de la tarjeta, cuya área de clic entera ya abre
                        el cuadrante. Sin manejador propio y aria-hidden, para
                        no duplicar ante lectores de pantalla la acción que ya
                        anuncia el <button>. Al ir dentro de él, hereda su
                        transform de hover (-translate-y-0.5) sin código
                        aparte. El margen de la esquina replica el padding del
                        propio botón (px-3 py-4), así que queda a la misma
                        distancia de los bordes que el resto del contenido.
                      */}
                      <span
                        aria-hidden="true"
                        className="absolute top-4 right-3 flex size-5 items-center justify-center rounded-full border border-magenta text-magenta"
                      >
                        <PlusIcon className="size-2.5" />
                      </span>

                      {/* span y no h3: el modelo de contenido de <button> no
                          admite encabezados. */}
                      <span className="font-head text-base font-semibold text-navy">
                        {cuadrante.pregunta}
                      </span>
                      <span className="font-body mt-2 text-sm text-ink-soft">
                        {cuadrante.intro}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/*
            El panel se desvanece al cambiar de cuadrante y reaparece con el
            contenido nuevo, en el lado contrario al cuadrante elegido.

            Ya no es absoluto ni tiene scroll propio: comparte celda de grid con
            la rueda en lg, así que la altura de la sección la marca el más alto
            de los dos y la lista crece entera. Quien hace scroll es la página.
            En móvil el grid los coloca en filas distintas, panel debajo.
          */}
          <div
            id={panelId}
            role="region"
            aria-label={
              cuadranteActivo
                ? `Servicios de ${cuadranteActivo.pregunta}`
                : "Servicios"
            }
            /* inert saca el subárbol del foco y del árbol de accesibilidad;
               aria-hidden lo refuerza en motores donde inert aún es parcial. */
            inert={!visible}
            aria-hidden={!visible}
            /*
              lg:relative + z-10: la columna de la rueda es sticky, o sea que
              está posicionada, y en CSS un elemento posicionado se pinta por
              encima de uno estático aunque vaya antes en el DOM. Con el panel
              estático, la columna quedaba encima y absorbía todos los clics del
              panel — Cerrar, acordeones y enlaces. Posicionarlo lo devuelve al
              orden correcto.
            */
            className={`mt-10 lg:relative lg:z-10 lg:mt-0 lg:w-[48%] lg:self-center lg:[grid-area:1/1] ${
              ladoPanel === "derecha" ? "lg:ml-auto" : "lg:mr-auto"
            } transition-opacity duration-300 ${
              visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {cuadranteActivo ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-head text-xl font-semibold text-navy">
                    {cuadranteActivo.pregunta}
                  </h3>
                  <button
                    type="button"
                    onClick={cerrar}
                    className="font-head inline-flex shrink-0 items-center gap-2 rounded border border-navy px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-magenta hover:text-magenta"
                  >
                    <ChevronIcon direction="left" className="size-4" />
                    Volver
                  </button>
                </div>

                {/*
                  Etiqueta de sección y no el párrafo de intro del cuadrante
                  (que sigue viviendo en los datos: la usa la tarjeta del
                  estado cerrado). text-xs uppercase + ink-soft la deja
                  claramente por debajo del h3 en jerarquía; mt-5 antes de la
                  lista es a propósito mayor que el mt-3 de aquí arriba, para
                  separarla de la primera fila y no leerse pegada a ella.
                */}
                <p className="font-head mt-3 text-xs font-semibold tracking-[0.08em] text-ink-soft uppercase">
                  Servicios disponibles
                </p>

                <ul className="mt-5 flex flex-col gap-3">
                  {cuadranteActivo.servicios.map((servicio) => (
                    <li key={servicio.nombre}>
                      {/* aria-haspopup="dialog" anuncia que abre un modal, no
                          que despliega contenido en sitio. */}
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={(event) =>
                          abrirServicio(servicio, event.currentTarget)
                        }
                        className="font-body flex w-full items-center justify-between gap-4 rounded-sm border border-border bg-white px-4 py-3 text-left text-sm text-ink transition-colors hover:border-magenta"
                      >
                        <span>{servicio.nombre}</span>
                        <ChevronIcon
                          direction="right"
                          className="size-4 shrink-0 text-magenta"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <ServicioModal
        servicio={servicioModal}
        onClose={() => setServicioModal(null)}
      />
    </section>
  );
}
