/**
 * Textura decorativa de hojas para el fondo de una tarjeta (hoy solo
 * CtaContacto). Server component puro —nada de "use client", ni azar, ni
 * animación—: motivos en posiciones fijas, para poder montarse en páginas de
 * servidor sin arrastrar cliente.
 *
 * La hoja es la misma "hoja de lente" que usaba HojasBanda (commit 6396013),
 * el patrón que decoraba el fondo de Casos de Éxito antes de sustituirse por
 * la capa de hojas flotantes: recuperada del historial de git y no el trío
 * del isotipo de marca, que agrupaba tres hojas como una sola unidad en vez
 * de sueltas e independientes.
 *
 * Deliberadamente distinta de esa capa de hojas flotantes
 * (hojas-flotantes.tsx), que ya cubre toda la página por encima del
 * contenido, para que ninguna de las dos se lea como la otra:
 *   - un solo tono (navy) y no la paleta de acento completa.
 *   - opacidad fija muy baja (0.05) y uniforme, no variable hoja a hoja como
 *     en la capa flotante (0.08–0.18).
 *   - estática: sin animación de ningún tipo, frente al vaivén continuo de
 *     la capa flotante.
 *   - concentrada en los bordes de la tarjeta y ausente de la franja central
 *     donde vive el texto, en vez de repartida por todo el viewport.
 */

/** Hoja de lente: dos cúbicas simétricas, apuntada arriba y abajo. Igual que
 *  en HojasBanda, una sola definición instanciada muchas veces. */
const HOJA_PATH = "M0 0 C 13 11, 13 31, 0 42 C -13 31, -13 11, 0 0 Z";
/** viewBox ajustado a esa silueta (x:[-13,13], y:[0,42]) con un margen de 1
 *  unidad por lado, para no recortar el trazo. */
const HOJA_VIEWBOX = "-14 -1 28 44";

/**
 * Posiciones fijas (no azar: este componente no es cliente), en dos columnas
 * pegadas a los bordes izquierdo y derecho de la tarjeta —nunca en la franja
 * central donde cae el titular—, más un par sueltas junto a los bordes
 * superior e inferior. Tamaños pequeños en todos los casos: "sin motivos
 * grandes" es tan responsable de que se lea como fondo y no como ilustración
 * como la propia opacidad.
 */
const HOJAS: Array<{ left: string; top: string; tam: number; rot: number }> = [
  // Columna izquierda
  { left: "5%", top: "6%", tam: 22, rot: 15 },
  { left: "8%", top: "18%", tam: 18, rot: -40 },
  { left: "4%", top: "31%", tam: 26, rot: 60 },
  { left: "9%", top: "44%", tam: 16, rot: -10 },
  { left: "5%", top: "57%", tam: 24, rot: 35 },
  { left: "7%", top: "70%", tam: 19, rot: -55 },
  { left: "4%", top: "83%", tam: 27, rot: 20 },
  { left: "9%", top: "94%", tam: 15, rot: -25 },
  // Columna derecha, escalonada respecto a la izquierda
  { left: "95%", top: "10%", tam: 20, rot: -18 },
  { left: "92%", top: "23%", tam: 25, rot: 45 },
  { left: "96%", top: "36%", tam: 16, rot: -60 },
  { left: "91%", top: "49%", tam: 22, rot: 12 },
  { left: "95%", top: "62%", tam: 18, rot: -30 },
  { left: "93%", top: "75%", tam: 27, rot: 50 },
  { left: "96%", top: "88%", tam: 17, rot: -15 },
  { left: "91%", top: "97%", tam: 21, rot: 33 },
  // Un par sueltas arriba/abajo del centro, muy pequeñas
  { left: "50%", top: "5%", tam: 14, rot: 8 },
  { left: "50%", top: "95%", tam: 14, rot: -8 },
];

export function TexturaHojas({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`opacity-[0.05] ${className}`}
      style={{ color: "var(--color-navy)" }}
    >
      {HOJAS.map((h, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: h.left, top: h.top, width: h.tam, height: h.tam }}
        >
          <svg
            viewBox={HOJA_VIEWBOX}
            className="size-full"
            style={{ transform: `rotate(${h.rot}deg)` }}
          >
            <path d={HOJA_PATH} fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}
