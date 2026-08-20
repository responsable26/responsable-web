"use client";

import { useEffect, useState } from "react";

/**
 * Hojas decorativas en suspensión, montadas una sola vez en el layout raíz.
 *
 * No hay medición del DOM ni evitación de colisiones: la capa es
 * `position:fixed` sobre el viewport, así que las hojas flotan por encima
 * del contenido en vez de buscar un hueco vacío entre él.
 *
 * Cada hoja vive anclada a una posición base fija (left/top, en % de
 * pantalla) y solo se mueve alrededor de ella con un vaivén corto —nunca
 * cruza la pantalla ni sale de ella—, así que las 12 (o las 4 de móvil) están
 * siempre a la vista, no solo de paso.
 */

/**
 * Los tres trazos del isotipo de marca (src/components/brand/logo.tsx), sin
 * el `fill` fijo del original: aquí se recolorean por instancia con la
 * paleta oficial vía `currentColor` + `color` en línea.
 *
 * viewBox de cada uno: no es el bbox exacto del path (calcularlo con
 * precisión exigiría medirlo en el navegador), sino una caja generosa
 * alrededor de los puntos de las curvas, con margen de sobra para que un
 * error de estimación recorte aire vacío y nunca la silueta. Con
 * preserveAspectRatio por defecto (xMidYMid meet) cada hoja queda centrada y
 * sin deformar dentro de su caja cuadrada, aunque su proporción real no sea
 * 1:1.
 */
const FORMAS = [
  {
    viewBox: "1490 90 310 400",
    d: "M1782.07,111c-21.55,4.92-82.41,21.79-139.53,65.14-87.26,66.22-128.01,162.08-121.42,285.22,38.98-73.08,88.13-142.11,148.64-197.06,11.63-10.33,23.81-19.97,36.35-29.01-45.71,41.14-81.47,92.13-110.88,145.74-16.64,30.44-31.29,61.88-44.18,94.02,28.66-9.02,70.31-25.94,110.24-56.1,91.79-69.34,132.39-172.9,120.77-307.94Z",
  },
  {
    viewBox: "1410 75 120 270",
    d: "M1466.65,87.9c-8.08,9.49-29.92,37.65-41.13,76.51-17.13,59.38-3.23,116.47,41.28,169.93-7.02-46.2-8.07-93.99.77-139.25,1.78-8.59,4.03-17.06,6.66-25.38-6.8,34.02-5.78,69.14-1,103.3,2.74,19.38,6.72,38.54,11.73,57.42,9.92-13.74,23.05-35.44,30.93-62.55,18.13-62.31,1.57-122.84-49.23-179.99Z",
  },
  {
    viewBox: "1550 -10 90 196",
    d: "M1630.53,0c-8.44,4.33-31.96,17.78-51.12,41.85-29.27,36.77-36.07,80.94-20.29,131.44,8.47-34.51,21.6-68.41,40.94-97.67,3.74-5.53,7.79-10.83,12.04-15.91-14.65,21.94-24.12,46.93-30.68,72.33-3.7,14.42-6.46,29.04-8.42,43.76,10.96-6.78,26.49-18.23,39.89-34.99,30.82-38.55,36.74-85.9,17.62-140.81Z",
  },
];

/**
 * Paleta oficial (globals.css, @theme): navy y off-white/white/ink quedan
 * fuera a propósito porque son los tonos de fondo/texto del sitio, no
 * acentos — una hoja de ese color sería invisible o se leería como texto.
 */
const COLORES = [
  "var(--color-magenta)",
  "var(--color-teal)",
  "var(--color-amarillo)",
  "var(--color-lavanda)",
];

/** Cuatro tamaños (lado de la caja cuadrada, en px). Pequeñas a propósito:
 *  son polvo de fondo, no una ilustración. */
const TAMANOS = [12, 16, 21, 27];

/**
 * Posiciones base, en % de pantalla (x=left, y=top), fijas y no al azar: con
 * 12 puntos sorteados podría salir cualquier reparto —incluido uno agrupado
 * en una esquina—, y ya no hay ninguna lógica de colisión que lo corrija.
 * Elegidas a mano cubren cuadrantes, bordes y centro sin amontonarse, y con
 * margen de sobra hasta el borde de la pantalla para que ni el jitter ni el
 * propio vaivén (ver AMPLITUD_* más abajo) puedan sacar una hoja de la vista.
 *
 * Las primeras CANTIDAD_MOVIL —una por cuadrante— son las que se ven en
 * móvil (ver CANTIDAD_MOVIL): por eso van primero y no intercaladas, para
 * poder tomar exactamente ese prefijo del array.
 */
const POSICIONES: Array<[x: number, y: number]> = [
  [18, 22], // arriba-izquierda
  [82, 24], // arriba-derecha
  [20, 76], // abajo-izquierda
  [80, 74], // abajo-derecha
  [50, 16], // arriba-centro
  [50, 84], // abajo-centro
  [14, 50], // izquierda-centro
  [86, 50], // derecha-centro
  [36, 46],
  [64, 44],
  [32, 64],
  [68, 62],
];

/**
 * Las primeras 4 (una por cuadrante, ver POSICIONES) se muestran siempre; el
 * resto —hasta las 12 de POSICIONES— se revela desde `sm` (mismo corte que
 * HojasDecorativas en el Hero) — así móvil se queda en pocas sin necesitar
 * detectar el viewport por JS, solo una clase Tailwind por hoja.
 */
const CANTIDAD_MOVIL = 4;

/** Jitter sobre la posición base, para que 12 hojas no se lean como una
 *  cuadrícula perfecta. */
const JITTER_MAX = 3;
/** Amplitud del vaivén: cuánto se aparta cada hoja de su posición de reposo
 *  mientras flota. Junto al jitter y al margen de POSICIONES, la suma nunca
 *  alcanza el borde de la pantalla (ver comentario de POSICIONES). */
const AMPLITUD_X = [3, 5] as const;
const AMPLITUD_Y = [3, 5] as const;

const aleatorioEntre = (min: number, max: number) => min + Math.random() * (max - min);
const elegirDe = <T,>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)];

type Particula = {
  id: number;
  forma: (typeof FORMAS)[number];
  color: string;
  tamano: number;
  opacidad: number;
  rotacionBase: number;
  duracion: number;
  desfase: number;
  xBase: number;
  yBase: number;
  amplitudX: number;
  amplitudY: number;
  rotacionVaiven: number;
};

function crearParticula(id: number, posicion: [number, number]): Particula {
  const [x, y] = posicion;
  return {
    id,
    forma: elegirDe(FORMAS),
    color: elegirDe(COLORES),
    tamano: elegirDe(TAMANOS),
    // Baja a propósito: es aire de fondo que puede atravesar texto, nunca
    // debe competir con su lectura.
    opacidad: aleatorioEntre(0.08, 0.18),
    // Giro fijo de la propia silueta, para variar el aspecto entre hojas del
    // mismo path — independiente del giro que añade el vaivén.
    rotacionBase: aleatorioEntre(0, 360),
    // Vaivén muy lento: cada vuelta completa (ida y vuelta a su posición de
    // reposo) tarda decenas de segundos, para que se lea como polvo ambiental
    // suspendido y no como algo que reclama atención.
    duracion: aleatorioEntre(26, 46),
    /*
      Delay al azar (también negativo): arranca la animación ya a mitad de
      camino en vez de esperar toda su duración para la primera pasada, así
      las doce quedan en fases distintas desde el primer fotograma —y no solo
      después, gracias a que además cada una tiene su propia duración.
    */
    desfase: aleatorioEntre(-40, 0),
    xBase: x + aleatorioEntre(-JITTER_MAX, JITTER_MAX),
    yBase: y + aleatorioEntre(-JITTER_MAX, JITTER_MAX),
    amplitudX: aleatorioEntre(...AMPLITUD_X),
    amplitudY: aleatorioEntre(...AMPLITUD_Y),
    // Rotación leve durante el vaivén, con signo propio para que no todas
    // "giren hacia el mismo lado" en el mismo instante.
    rotacionVaiven: aleatorioEntre(-12, 12),
  };
}

export function HojasFlotantes() {
  const [particulas, setParticulas] = useState<Particula[]>([]);

  /*
    Se generan solo en el cliente, tras montar: Math.random() en el primer
    render chocaría entre el HTML del servidor y el del cliente (hidratación).
    Al arrancar en un array vacío en los dos lados no hay nada que reconciliar
    de más.

    El setState va dentro de requestAnimationFrame y no suelto en el cuerpo
    del efecto: llamarlo ahí directamente dispara el lint de React
    (react-hooks/set-state-in-effect) por el cascading render que un setState
    síncrono provoca. Encolarlo en el siguiente fotograma lo sortea sin
    cambiar nada perceptible, porque de todos modos el usuario no ve nada
    hasta el primer pintado posterior al montaje.
  */
  useEffect(() => {
    const cuadro = requestAnimationFrame(() => {
      setParticulas(POSICIONES.map((posicion, indice) => crearParticula(indice, posicion)));
    });
    return () => cancelAnimationFrame(cuadro);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hojas-particulas-capa pointer-events-none fixed inset-0 z-10"
    >
      {particulas.map((p, indice) => (
        <div
          key={p.id}
          className={`hoja-particula pointer-events-none absolute ${
            indice >= CANTIDAD_MOVIL ? "hidden sm:block" : ""
          }`}
          style={{
            left: `${p.xBase}vw`,
            top: `${p.yBase}vh`,
            width: p.tamano,
            height: p.tamano,
            opacity: p.opacidad,
            animationDuration: `${p.duracion}s`,
            animationDelay: `${p.desfase}s`,
            ["--hoja-ax" as string]: `${p.amplitudX}vw`,
            ["--hoja-ay" as string]: `${p.amplitudY}vh`,
            ["--hoja-rot" as string]: `${p.rotacionVaiven}deg`,
          }}
        >
          <svg
            viewBox={p.forma.viewBox}
            className="size-full"
            style={{ transform: `rotate(${p.rotacionBase}deg)`, color: p.color }}
          >
            <path d={p.forma.d} fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}
