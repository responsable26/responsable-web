import type { ReactNode } from "react";

type HeroFramedProps = {
  children: ReactNode;
  /** Background video source. Omit for the plain navy + gradients treatment. */
  videoSrc?: string;
  videoPoster?: string;
  /**
   * Colocación VERTICAL del contenido dentro de la tarjeta. No toca el eje
   * horizontal: el bloque se alinea a la izquierda en las dos variantes.
   *
   * `bottom` —el valor por defecto— es la composición original: el bloque se
   * apoya en el borde inferior y la tarjeta ocupa casi el alto de la ventana.
   * La conserva Estudio de Doble Materialidad, que se diseñó así.
   *
   * `center` lo centra en el alto y baja el techo de la tarjeta. Las dos cosas
   * van juntas: centrar el bloque dentro de un alto de casi toda la ventana
   * repartiría a los lados el vacío que antes quedaba arriba, así que el tope
   * de 34rem es lo que hace que el centrado se note. Sigue siendo un mínimo, de
   * modo que la tarjeta crece cuando el contenido no cabe.
   *
   * Es una prop y no un cambio del valor por defecto para que la página que ya
   * existía no se vea afectada: sin pasarla, el componente se comporta igual que
   * antes hasta el último píxel.
   */
  align?: "bottom" | "center";
};

/**
 * The ".hero" framed-card pattern from design-tokens.md: navy card with
 * rounded corners and an equal margin on all four sides, optionally holding a
 * background video under a semi-transparent navy overlay.
 *
 * The card itself is near-full-bleed (only the margin is subtracted) — it is
 * the copy inside that sits in the shared --container. Constraining the card to
 * --container instead made the hero read as inset compared to the live site.
 */
export function HeroFramed({
  children,
  videoSrc,
  videoPoster,
  align = "bottom",
}: HeroFramedProps) {
  const centrado = align === "center";

  return (
    <section className="px-4 py-4 sm:px-7">
      {/* Viewport height minus the in-flow header (4.5rem) and the margins
          above and below (1.75rem each). */}
      <div
        className={`relative flex flex-col overflow-hidden rounded-[22px] bg-navy ${
          centrado
            ? "min-h-[min(calc(100svh-8rem),34rem)] justify-center"
            : "min-h-[calc(100svh-8rem)] justify-end"
        }`}
        style={
          videoSrc
            ? undefined
            : {
                backgroundImage:
                  "radial-gradient(circle at 85% 15%, var(--color-teal-12), transparent 55%), radial-gradient(circle at 15% 85%, var(--color-magenta-10), transparent 55%)",
              }
        }
      >
        {videoSrc ? (
          <>
            <video
              className="absolute inset-0 z-0 size-full object-cover"
              src={videoSrc}
              poster={videoPoster}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="absolute inset-0 z-10 bg-navy-90" />
          </>
        ) : null}

        {/* El padding se conserva en la variante centrada: cuando el contenido
            supera el alto mínimo deja de haber holgura que centrar, y es lo
            único que impide entonces que el texto toque el borde de la tarjeta.

            Sin text-center: la variante `center` es solo vertical. El mx-auto de
            aquí centra el contenedor de ancho --container dentro de la tarjeta,
            que es lo que ya hacía antes; el contenido se alinea a su izquierda. */}
        <div className="relative z-20 mx-auto w-full max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)] py-10 sm:py-16">
          {children}
        </div>
      </div>
    </section>
  );
}
