"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { ServicioModal } from "@/components/home/servicio-modal";
import { CUADRANTES, type Cuadrante, type Servicio } from "@/lib/servicios";

/* ───────────────────────── geometría de la rueda ─────────────────────────
   Ángulos medidos desde las 3 en punto y creciendo en sentido horario, que es
   el sentido natural con el eje Y hacia abajo del SVG:
     θ=270 arriba · θ=0 derecha · θ=90 abajo · θ=180 izquierda

   Los cuatro cuadrantes se reparten en orden 1→4 empezando arriba y girando en
   sentido horario, así que 1 y 2 caen a la derecha y 3 y 4 a la izquierda. De
   ahí sale hacia qué lado se desplaza la rueda al abrir cada uno.
*/
const CX = 200;
const CY = 200;
const R_OUT = 180;
const R_IN = 112;
/** Radio del arco de las etiquetas: centro de la banda. */
const R_TEXT = 146;
/** Separación angular entre cuadrantes, en grados por lado. */
const GAP = 2;

/** Duración del fundido del panel. Debe coincidir con la clase duration-300. */
const FUNDIDO_MS = 300;

type Sector = {
  /** Ángulo inicial en grados, sentido horario desde las 3 en punto. */
  desde: number;
  hasta: number;
  /** Mitad de la rueda en la que cae. Decide hacia dónde se desplaza. */
  lado: "derecha" | "izquierda";
  /**
   * Los cuadrantes inferiores necesitan el arco recorrido en sentido inverso.
   * <textPath> orienta cada glifo según la dirección de avance del trazado: en
   * la mitad de abajo, recorrer en horario deja el texto boca abajo. Invertir
   * el recorrido lo endereza sin rotar nada ni convertirlo en trazados.
   */
  invertido: boolean;
};

/**
 * Posición de la tarjeta de cada cuadrante en la rejilla de tres columnas de
 * lg. La columna 2 queda vacía: es el hueco reservado para la rueda. El orden
 * del DOM es 1→4, que es el que se ve en móvil al apilarse en una columna.
 */
const CELDA_TARJETA = [
  "lg:col-start-3 lg:row-start-1", // 1 · ¿Dónde Estoy?    arriba-dcha
  "lg:col-start-3 lg:row-start-2", // 2 · ¿Adónde Voy?     abajo-dcha
  "lg:col-start-1 lg:row-start-2", // 3 · ¿Cómo lo Hago?   abajo-izq
  "lg:col-start-1 lg:row-start-1", // 4 · ¿Cómo Comunico?  arriba-izq
];

const SECTORES: Sector[] = [
  { desde: 270, hasta: 360, lado: "derecha", invertido: false }, // 1 · arriba-dcha
  { desde: 0, hasta: 90, lado: "derecha", invertido: true }, //     2 · abajo-dcha
  { desde: 90, hasta: 180, lado: "izquierda", invertido: true }, // 3 · abajo-izq
  { desde: 180, hasta: 270, lado: "izquierda", invertido: false }, // 4 · arriba-izq
];

function punto(r: number, grados: number) {
  const a = (grados * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
}

/** Sector de dona: arco exterior, radio hacia dentro, arco interior de vuelta. */
function trazadoSector({ desde, hasta }: Sector) {
  const s = desde + GAP;
  const e = hasta - GAP;
  const [x1, y1] = punto(R_OUT, s);
  const [x2, y2] = punto(R_OUT, e);
  const [x3, y3] = punto(R_IN, e);
  const [x4, y4] = punto(R_IN, s);
  return `M ${x1} ${y1} A ${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${R_IN} ${R_IN} 0 0 0 ${x4} ${y4} Z`;
}

/** Arco invisible que sirve de riel a la etiqueta. */
function trazadoEtiqueta({ desde, hasta, invertido }: Sector) {
  const s = desde + GAP;
  const e = hasta - GAP;
  const [xa, ya] = punto(R_TEXT, invertido ? e : s);
  const [xb, yb] = punto(R_TEXT, invertido ? s : e);
  // sweep 1 = horario, 0 = antihorario.
  return `M ${xa} ${ya} A ${R_TEXT} ${R_TEXT} 0 0 ${invertido ? 0 : 1} ${xb} ${yb}`;
}

/* ───────────────────────────── color y contraste ─────────────────────────
   Mismos pares fondo/texto que la sección de pestañas, elegidos por contraste
   medido y no por estética (AA pide 4.5:1 en texto normal):

     amarillo #feb80a  navy 7.96   -> navy
     magenta  #ea157a  blanco 4.30 -> blanco  (no llega a 4.5; decisión de marca
                                               consciente, ver servicios.tsx)
     lavanda  #738ac8  ink 4.96    -> ink, navy se queda en 4.09
     teal     #1ab39f  navy 5.27   -> navy

   Se repite aquí porque la sección de pestañas no se puede tocar. Si las dos
   conviven de forma definitiva, este mapa debería vivir en un único sitio.
*/
const COLORES: Record<
  Cuadrante["colorToken"],
  { relleno: string; texto: string; trazo: string; acento: string }
> = {
  amarillo: {
    relleno: "fill-amarillo",
    texto: "fill-navy",
    trazo: "stroke-navy",
    acento: "border-amarillo",
  },
  magenta: {
    relleno: "fill-magenta",
    texto: "fill-white",
    trazo: "stroke-white",
    acento: "border-magenta",
  },
  lavanda: {
    relleno: "fill-lavanda",
    texto: "fill-ink",
    trazo: "stroke-ink",
    acento: "border-lavanda",
  },
  teal: {
    relleno: "fill-teal",
    texto: "fill-navy",
    trazo: "stroke-navy",
    acento: "border-teal",
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

  const cuadranteActivo = contenido === null ? null : CUADRANTES[contenido];
  /** Lado de la rueda: sigue a la selección, se mueve de inmediato. */
  const lado = activo === null ? null : SECTORES[activo].lado;
  /*
    Lado del panel: sigue al contenido pintado, no a la selección. Si siguiera a
    la selección, al cerrar saltaría de un borde al otro a mitad del fundido de
    salida, y en el cruce cambiaría de sitio antes de haberse apagado.
  */
  const ladoPanel = contenido === null ? null : SECTORES[contenido].lado;

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

    window.scrollTo({
      top: Math.max(0, window.scrollY + delta),
      behavior: sinMovimiento() ? "auto" : "smooth",
    });
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
    <section className="bg-off-white px-6 py-[var(--section-y)] lg:px-10">
      {/*
        Esta sección usa el contenedor ancho y no el estándar de 1120px: la
        rueda ocupa 540px fijos en el centro, así que con el contenedor normal
        las columnas de tarjetas se quedaban en 266px. Todo el ancho extra va a
        esas dos columnas; la rueda y el hueco central no cambian.
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
          <div className="relative lg:sticky lg:top-[calc(50vh-260px)] lg:self-center lg:[grid-area:1/1] lg:pointer-events-none">
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
                className="pointer-events-auto block w-full max-w-[340px] sm:max-w-[520px]"
              >
                {SECTORES.map((sector, index) => {
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
                      <path
                        d={trazadoSector(sector)}
                        className={color.relleno}
                      />

                      {/* Sigue el contorno real del sector, no su caja envolvente.
                        El color es el mismo que ya se eligió por contraste
                        contra ese relleno, así que se ve en los cuatro. */}
                      {focoTeclado === index ? (
                        <path
                          d={trazadoSector(sector)}
                          fill="none"
                          strokeWidth={2.5}
                          className={`pointer-events-none ${color.trazo}`}
                        />
                      ) : null}

                      {/* Riel de la etiqueta: no se pinta, solo guía al textPath. */}
                      <path
                        id={arcoId}
                        d={trazadoEtiqueta(sector)}
                        fill="none"
                      />

                      {/*
                      Texto real: seleccionable e indexable. La fuente va algo
                      mayor en móvil porque el SVG se escala a 300px y el tamaño
                      efectivo cae con él.
                    */}
                      <text
                        className={`font-head [font-size:19px] font-semibold sm:[font-size:16px] ${color.texto}`}
                        dominantBaseline="middle"
                        textAnchor="middle"
                      >
                        <textPath href={`#${arcoId}`} startOffset="50%">
                          {cuadrante.pregunta}
                        </textPath>
                      </text>
                    </g>
                  );
                })}

                {/*
                  Pista de interacción, dentro del hueco del donut.

                  <text> aparte y no un tercer <tspan> del encabezado: así no
                  entra en el h2 ni lo leen los lectores de pantalla, que es lo
                  que aria-hidden termina de asegurar.

                  Ahora es lo único que hay en el hueco, así que va centrado en
                  el eje del donut. Con el radio interior en 112, a esa altura el
                  hueco mide 224 de ancho; la cadena, a fuente 15, ocupa ~173, y
                  quedan ~25 de holgura por lado. Como el SVG escala en bloque,
                  la proporción se mantiene en todos los breakpoints.

                  Fuente algo mayor en móvil, donde el SVG baja a 340px, para que
                  el tamaño efectivo no caiga. Se reduce el tamaño antes que
                  partir el texto en dos líneas.
                */}
                <text
                  x={CX}
                  y={CY}
                  aria-hidden="true"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`font-body [font-size:15px] fill-ink-soft transition-opacity duration-300 sm:[font-size:13px] ${
                    activo === null ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Dé clic en cada etapa
                </text>
              </svg>
            </div>
          </div>

          {/*
            Tarjetas fijas del estado inicial, en la misma celda de grid que la
            rueda y el panel. En lg forman una rejilla de tres columnas cuya
            columna central queda vacía: es el hueco reservado para la rueda, y
            cada tarjeta se coloca del lado que ocupa su cuadrante.

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
                className={`mt-10 grid gap-4 transition-opacity duration-300 lg:mt-0 lg:grid-cols-[1fr_540px_1fr] lg:gap-6 ${
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
                      className={`flex flex-col rounded-sm border border-l-4 border-border bg-white px-3 py-4 text-left transition-[box-shadow,translate] duration-200 motion-reduce:translate-y-0 ${
                        color.acento
                      } ${CELDA_TARJETA[index]} ${
                        resaltadoAqui
                          ? "-translate-y-0.5 shadow"
                          : "translate-y-0 shadow-sm"
                      }`}
                    >
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

                <p className="font-body mt-3 text-sm text-ink-soft">
                  {cuadranteActivo.intro}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
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
