type PasoResilio = { letra: string; palabra: string; frase: string };

/** La letra de cada paso: círculo navy con anillo lavanda. Tamaño fijo, así
 *  que el SVG no escala y la letra se queda siempre a 18px. */
function Letra({ letra }: { letra: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="font-head relative size-12 shrink-0"
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        strokeWidth="4"
        className="fill-navy stroke-lavanda"
      />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white text-[18px] font-bold"
      >
        {letra}
      </text>
    </svg>
  );
}

/**
 * Infografía del método RESILIO, a todo el ancho del contenedor, debajo de
 * las tarjetas de «Contenido base y formación a la medida».
 *
 * Las letras van en SVG; palabras y frases, en HTML. El texto dentro de un
 * SVG no ajusta a varias líneas y escala con el dibujo, así que no puede
 * garantizar el mínimo de 14px de las frases en todos los anchos; en HTML
 * ajusta solo y conserva su tamaño.
 *
 * Desde xl, las siete letras en fila unidas por un filete horizontal. Por
 * debajo, en columna con el filete en vertical: a 1024px cada columna de la
 * fila se quedaría en unos 110px y «Institucionalizar», a 15px, no cabe. Desde
 * xl cada columna mide unos 150px.
 */
export function InfografiaResilio({
  titulo,
  pasos,
  dato,
}: {
  titulo: string;
  pasos: PasoResilio[];
  dato: string;
}) {
  return (
    <figure className="mt-6 rounded border-t-2 border-lavanda bg-white p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <figcaption className="font-head text-[1.15rem] font-semibold text-navy">
          {titulo}
        </figcaption>
        <p className="font-head rounded-full bg-lavanda/15 px-4 py-1.5 text-sm font-semibold text-navy">
          {dato}
        </p>
      </div>

      <ol className="relative mt-8 grid gap-6 xl:grid-cols-7 xl:gap-3">
        {/* Filete que une las letras: vertical por la columna de los
            círculos en móvil y tablet, horizontal por su centro desde xl. Va
            de centro a centro del primer y el último círculo (24px = medio
            círculo; en la fila, media columna). */}
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-6 w-0.5 bg-lavanda xl:top-6 xl:right-[calc(100%/14)] xl:bottom-auto xl:left-[calc(100%/14)] xl:h-0.5 xl:w-auto"
        />
        {pasos.map((paso) => (
          <li
            key={`${paso.letra}-${paso.palabra}`}
            className="flex gap-4 xl:flex-col xl:items-center xl:text-center"
          >
            <Letra letra={paso.letra} />
            <div>
              <p className="font-head text-[15px] font-semibold text-navy xl:mt-1">
                {paso.palabra}
              </p>
              <p className="font-body mt-1 text-sm text-ink-soft">
                {paso.frase}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
