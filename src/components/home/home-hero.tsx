import { HojasDecorativas } from "@/components/home/hojas-decorativas";
import { POSTER_HERO, VIDEO_HERO } from "@/lib/video-hero";
import { RotatingWord } from "@/components/home/rotating-word";

/*
  One full wave per tile, built so the tiles join seamlessly: each cubic ends
  with its control point at the same y as its endpoint, which makes the tangent
  horizontal at x=0, x=720 and x=1440. Matching y alone is not enough — an
  earlier version matched height at the edges but not slope, so every cycle a
  visible corner swept across and the stretch after it read as flat.

  Keep the horizontal tangents at both edges if this path is ever retuned;
  amplitude and midpoint can change freely.
*/
const WAVE_PATH =
  "M0,30 C 240,30 480,70 720,70 C 960,70 1200,30 1440,30 L1440,100 L0,100 Z";

/**
 * Home-only hero: edge-to-edge (no margin/border-radius, unlike HeroFramed),
 * video background with navy overlay, wave divider blending into Intro below.
 * The header floats over it transparently (see SiteHeader's `transparent`
 * prop) so this can be exactly 100vh instead of min-height.
 */
export function HomeHero() {
  return (
    <section className="relative h-screen overflow-hidden bg-navy">
      {/* autoPlay, muted, loop y playsInline: es un fondo decorativo, no un
          reproductor. */}
      <video
        className="absolute inset-0 z-0 size-full object-cover"
        src={VIDEO_HERO}
        poster={POSTER_HERO}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 z-10 bg-navy-90" />

      {/*
        Percentage inline padding rather than the --container max-width: the
        reference starts its hero copy ~8% in from the viewport edge at every
        width, and the narrower shared container was squeezing the H1 into
        extra line breaks.
      */}
      <div className="pointer-events-none relative z-20 flex h-full w-full flex-col justify-center px-6 sm:px-[8%]">
        <p className="font-body text-sm text-white/80 sm:text-base">
          {/* Salto forzado solo desde sm: por debajo el eyebrow ya cae en dos
              líneas por su cuenta, y ahí el <br> sobra. El {" "} mantiene el
              espacio cuando el <br> está oculto, que JSX se comería. */}
          Consultoría en Sostenibilidad{" "}
          <br className="hidden sm:inline" />y Responsabilidad Social Empresarial
        </p>
        {/*
          Breaks are explicit so the three lines stay put no matter which
          rotating word is showing — the longest ("Ventaja Competitiva") would
          otherwise reflow the whole block.
        */}
        <h1 className="font-head mt-5 text-[clamp(1.55rem,6.2vw,4.6rem)] leading-[1.06] font-semibold text-white">
          Transformamos
          <br />
          la Sostenibilidad en
          <br />
          <span className="text-magenta">
            <RotatingWord />
          </span>
        </h1>
      </div>

      {/*
        Sized/positioned to match responsable.net: the illustration is far larger
        than the hero and deliberately overflows right and bottom, so the visible
        slice is the arc's large well-spaced leaves sweeping up to the right,
        with its fine tail exiting along the bottom edge. The hero's
        overflow-hidden does the cropping. aspect-ratio must stay locked to the
        viewBox or the arc squashes.
      */}
      <HojasDecorativas className="pointer-events-none absolute right-[-64%] bottom-[-3%] z-20 hidden aspect-[1795.4/954.6] w-[114%] sm:block" />

      <div className="absolute inset-x-0 bottom-0 z-30 h-20 overflow-hidden">
        <style>{`
          .wave-track {
            animation: wave-scroll 9s linear infinite;
          }
          @keyframes wave-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .wave-track {
              animation: none;
            }
          }
        `}</style>
        <div className="wave-track flex h-full w-[200%]">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="h-full w-1/2 shrink-0 fill-white"
            aria-hidden="true"
          >
            <path d={WAVE_PATH} />
          </svg>
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="h-full w-1/2 shrink-0 fill-white"
            aria-hidden="true"
          >
            <path d={WAVE_PATH} />
          </svg>
        </div>
      </div>
    </section>
  );
}
