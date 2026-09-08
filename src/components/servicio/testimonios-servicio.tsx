import type { Testimonio } from "@/lib/testimonios";

/** Tope de presentación. Una lista más larga no descuadra la maqueta en
 *  silencio: se corta aquí y se ve en el dato, no en la pantalla. */
const MAXIMO = 6;

/**
 * Sección de testimonios de una página de servicio.
 *
 * Sin estrellas, sin puntuación y sin nota agregada: en una consultoría la
 * autoridad la da quién habla —su cargo y su empresa—, no un promedio. Por eso
 * el pie de cada tarjeta lleva inicial, nombre, cargo y empresa, y nada más.
 *
 * Devuelve null con lista vacía, así que la sección desaparece entera en vez de
 * dejar un titular sobre un hueco. Quien la monta deriva de la misma lista si
 * añade o no el anclaje en la barra.
 */
export function TestimoniosServicio({
  testimonios,
}: {
  testimonios: readonly Testimonio[];
}) {
  if (testimonios.length === 0) return null;

  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-title"
      /* Ver la nota de scroll-mt en la primera sección con ancla. */
      className="scroll-mt-36 bg-off-white py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
        <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
          Testimonios
        </p>
        <h2
          id="testimonios-title"
          className="font-head mt-2 max-w-[20ch] text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-navy"
        >
          Lo que dicen quienes ya lo hicieron
        </h2>

        {/*
          Masonry con multicolumna y no con rejilla: las citas van de nueve a
          casi setenta palabras, y una rejilla obligaría a igualar alturas —o a
          recortar el texto, que aquí no es una opción—. El navegador equilibra
          las columnas solo, así que no quedan huecos, y no hace falta medir
          nada en JavaScript ni recalcular al redimensionar.

          El coste conocido es que el flujo va por columnas y no por filas:
          quien recorra la fila superior de izquierda a derecha lee el primero,
          el tercero y el quinto. Se acepta porque los testimonios son piezas
          independientes y no hay una secuencia que romper; el orden del DOM se
          conserva intacto, así que lectores de pantalla y teclado los recorren
          en el orden escrito.

          break-inside-avoid impide que una tarjeta se parta entre dos columnas,
          que es el único fallo visual real de esta técnica. El mb-6 de cada
          tarjeta hace de separación vertical: gap-6 solo resuelve el eje
          horizontal en multicolumna.
        */}
        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {testimonios.slice(0, MAXIMO).map((testimonio) => (
            <figure
              key={`${testimonio.nombre}-${testimonio.empresa}`}
              className="mb-6 break-inside-avoid rounded border border-border bg-white p-6 shadow-sm"
            >
              <blockquote className="font-body text-[1.05rem] text-ink">
                «{testimonio.cita}»
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3">
                {/* Inicial y no retrato: no hay fotos de los citados, y un
                    avatar genérico diría menos que la letra. aria-hidden porque
                    el nombre completo va justo al lado.

                    Se descarta un marcador entre corchetes al principio del
                    nombre: mientras el contenido sea de muestra, la inicial
                    saldría "[" en las seis tarjetas y no habría maqueta que
                    evaluar. El marcador sigue viéndose entero en la línea del
                    nombre, que es donde tiene que verse. Con contenido real la
                    expresión no encuentra nada y no hace nada. */}
                <span
                  aria-hidden="true"
                  className="font-head flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
                >
                  {testimonio.nombre.replace(/^\[[^\]]*\]\s*/, "").trim().slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="font-head block text-sm font-semibold text-navy">
                    {testimonio.nombre}
                  </span>
                  <span className="font-body block text-sm text-ink-soft">
                    {testimonio.cargo}, {testimonio.empresa}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
