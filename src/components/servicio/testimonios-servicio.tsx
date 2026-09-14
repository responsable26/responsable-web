import { RejillaTestimonios } from "@/components/servicio/rejilla-testimonios";
import type { Testimonio } from "@/lib/testimonios";

/** Tope de presentación. Una lista más larga no descuadra la maqueta en
 *  silencio: se corta aquí y se ve en el dato, no en la pantalla. */
const MAXIMO = 6;

/**
 * Sección de testimonios de una página de servicio.
 *
 * Sin estrellas, sin puntuación y sin nota agregada: en una consultoría la
 * autoridad la da quién habla —su cargo y su empresa—, no un promedio. Por eso
 * el pie de cada tarjeta lleva inicial, nombre, cargo y empresa, y nada más; o
 * solo la empresa, cuando el testimonio no va atribuido a una persona.
 *
 * Las tarjetas y el video opcional de cada una viven en RejillaTestimonios, que
 * es cliente. Esta sección se queda en servidor.
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

        <RejillaTestimonios testimonios={testimonios.slice(0, MAXIMO)} />
      </div>
    </section>
  );
}
