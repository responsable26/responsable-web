/**
 * Hojas de fondo para la banda de logos de clientes.
 *
 * Comparte vocabulario con src/assets/hojas.svg —la misma hoja de lente
 * apuntada en los dos extremos y la misma paleta ilustrativa— pero no su
 * composición: aquel es un arco en cascada, de cola densa a cabeza grande, que
 * pide ocupar todo el encuadre. Aquí hacen de fondo bajo una tarjeta, así que
 * se reparten sueltas y se concentran en la mitad inferior, dejando limpia la
 * franja donde se apoya la etiqueta.
 *
 * Una sola definición de hoja instanciada con <use>: el asset original repite
 * 124 paths para dibujar cada hoja por separado, y aquí no hace falta.
 */

/** Paleta de hojas de la ilustración de marca. Es más amplia que los tokens de
 *  UI —incluye verde y azul, que no existen como token— y por eso va literal. */
const COLORES = [
  "#89c000",
  "#00b29e",
  "#7288c9",
  "#ffb800",
  "#ed0f79",
  "#006da6",
];

/**
 * Cada hoja: posición, rotación en grados, escala e índice de color.
 * Los valores son fijos y no aleatorios: un Math.random daría un dibujo distinto
 * en servidor y cliente y React marcaría discrepancia de hidratación.
 */
const HOJAS: [x: number, y: number, rot: number, escala: number, color: number][] =
  [
    // Cúmulo inferior izquierdo
    [60, 210, 18, 1.5, 0],
    [104, 246, -34, 1.1, 2],
    [150, 198, 62, 0.9, 3],
    [196, 258, -8, 1.3, 1],
    [242, 214, 40, 0.75, 4],
    // Reguero central, más espaciado
    [330, 262, -22, 1.15, 2],
    [408, 226, 74, 0.85, 0],
    [498, 268, 12, 1.4, 3],
    [592, 232, -56, 0.8, 5],
    [684, 272, 30, 1.05, 1],
    // Cúmulo inferior derecho
    [812, 238, -14, 1.35, 0],
    [872, 274, 48, 0.95, 4],
    [934, 216, -40, 1.2, 2],
    [996, 264, 22, 0.8, 3],
    [1052, 224, 66, 1.45, 1],
    // Tres sueltas más arriba, para que el borde superior no quede recto
    [268, 150, -30, 0.7, 3],
    [726, 138, 52, 0.65, 0],
    [1108, 168, -18, 0.9, 2],
  ];

export function HojasBanda({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 320"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* Hoja de lente: dos cúbicas simétricas, apuntada arriba y abajo. */}
        <path id="hoja-banda" d="M0 0 C 13 11, 13 31, 0 42 C -13 31, -13 11, 0 0 Z" />
      </defs>

      {/* La opacidad va en el grupo y no por hoja: así el conjunto se lee como
          una veladura de fondo y nunca compite con los logos. */}
      <g opacity="0.28">
        {HOJAS.map(([x, y, rot, escala, color], i) => (
          <use
            key={i}
            href="#hoja-banda"
            fill={COLORES[color]}
            transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`}
          />
        ))}
      </g>
    </svg>
  );
}
