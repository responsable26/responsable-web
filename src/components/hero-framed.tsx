import type { ReactNode } from "react";

type HeroFramedProps = {
  children: ReactNode;
  /** Background video source. Omit for the plain navy + gradients treatment. */
  videoSrc?: string;
  videoPoster?: string;
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
export function HeroFramed({ children, videoSrc, videoPoster }: HeroFramedProps) {
  return (
    <section className="px-4 py-4 sm:px-7">
      {/* Viewport height minus the in-flow header (4.5rem) and the margins
          above and below (1.75rem each). */}
      <div
        className="relative flex min-h-[calc(100svh-8rem)] flex-col justify-end overflow-hidden rounded-[22px] bg-navy"
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

        <div className="relative z-20 mx-auto w-full max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)] py-10 sm:py-16">
          {children}
        </div>
      </div>
    </section>
  );
}
