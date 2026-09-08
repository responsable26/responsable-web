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
   * `abajo` —el valor por defecto— apoya el bloque en el borde inferior.
   * `centrado` lo reparte en el alto disponible.
   *
   * Es independiente de `altoTarjeta`: antes las dos cosas venían juntas en una
   * sola prop y eso obligaba a aceptar el tope de altura para poder centrar,
   * que es justo lo que no le servía a Doble Materialidad.
   */
  contenido?: "abajo" | "centrado";
  /**
   * Alto mínimo de la tarjeta.
   *
   * `ventana` —el valor por defecto— la deja en el alto visible menos el header
   * y los márgenes: un hero que llena la pantalla.
   *
   * `contenido` aplica además un tope de 34rem, así que la tarjeta se ajusta a
   * lo que lleva dentro en vez de estirarse hasta la ventana.
   *
   * CUÁNDO USAR CADA UNO. El tope existe para que el centrado se note: con un
   * bloque corto dentro de una tarjeta de casi toda la ventana, centrarlo deja
   * franjas enormes arriba y abajo y el hero se lee como texto flotando en un
   * campo vacío; recortando el alto, el bloque vuelve a tener peso. Ese es el
   * caso de las diez páginas de servicio, cuya entradilla ocupa dos o tres
   * líneas.
   *
   * Pero el tope se vuelve contraproducente cuando el bloque es largo. En
   * Doble Materialidad la descripción son siete líneas y el contenido mide unos
   * 536px con su relleno, contra los 544px del tope: el centrado se quedaría
   * en 4px por lado —invisible— y a cambio la tarjeta encogería de 944 a 544px
   * a 1080p. Ahí lo que hace falta es el alto de ventana, que deja unos 200px
   * de aire a cada lado y centra de verdad.
   *
   * La regla práctica: mida el bloque. Si ronda o supera los 544px, el tope no
   * centra nada y solo acorta el hero; use `ventana`.
   *
   * En los dos casos es un mínimo, así que la tarjeta crece si el contenido no
   * cabe.
   */
  altoTarjeta?: "ventana" | "contenido";
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
  contenido = "abajo",
  altoTarjeta = "ventana",
}: HeroFramedProps) {
  const centrado = contenido === "centrado";
  const conTope = altoTarjeta === "contenido";

  return (
    /* Los cuatro lados con el mismo valor, el que ya tenían los laterales: la
       tarjeta queda centrada en su marco en vez de empujada contra el header.
       Antes el eje vertical iba en 1rem y el horizontal en 1.75rem desde sm, y
       ese desajuste se leía como que el hero colgaba de la barra. */
    <section id="hero" className="p-4 sm:p-7">
      {/*
        Alto de la ventana menos el header, que está en el flujo, y menos los
        márgenes de esta sección. El descuento es distinto en cada tramo porque
        los dos sumandos cambian:

          < 640px   header 5.25rem (py-5 + los 44px del botón hamburguesa, la
                    pieza más alta de la fila) + p-4, 1rem por lado → 7.25rem
          640-1023  mismo header + p-7, 1.75rem por lado            → 8.75rem
          ≥ 1024px  header 5rem: desde lg la hamburguesa se oculta y la pieza
                    más alta pasa a ser el botón de contacto, 2.5rem
                    (py-2.5 + text-sm) + p-7                        → 8.5rem

        Los 5rem de lg son consecuencia del cambio de navegación: antes las
        páginas de servicio forzaban la hamburguesa visible en todos los anchos
        y el header medía 5.25rem también en escritorio.
      */}
      <div
        className={`relative flex flex-col overflow-hidden rounded-[22px] bg-navy ${
          centrado ? "justify-center" : "justify-end"
        } ${
          conTope
            ? "min-h-[min(calc(100svh-7.25rem),34rem)] sm:min-h-[min(calc(100svh-8.75rem),34rem)] lg:min-h-[min(calc(100svh-8.5rem),34rem)]"
            : "min-h-[calc(100svh-7.25rem)] sm:min-h-[calc(100svh-8.75rem)] lg:min-h-[calc(100svh-8.5rem)]"
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

        {/* El padding se conserva al centrar: cuando el contenido
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
