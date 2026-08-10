"use client";

import { useRef } from "react";
import { ChevronIcon } from "@/components/icons";

export type Beneficio = { num: string; from: string; to: string };

/**
 * The ".bcar" benefits carousel: circular navy-bordered controls that go
 * magenta on hover, and slides reusing the ".shift-card" navy variant
 * (number and arrow in magenta).
 */
export function BeneficiosCarousel({
  title,
  items,
}: {
  title: string;
  items: Beneficio[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-head max-w-2xl text-[clamp(1.15rem,2vw,1.4rem)] font-semibold text-navy">
          {title}
        </h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Ver beneficios anteriores"
            className="flex size-11 items-center justify-center rounded-full border border-navy text-navy transition-colors hover:border-magenta hover:text-magenta"
          >
            <ChevronIcon direction="left" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Ver más beneficios"
            className="flex size-11 items-center justify-center rounded-full border border-navy text-navy transition-colors hover:border-magenta hover:text-magenta"
          >
            <ChevronIcon direction="right" className="size-5" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="mt-8 flex gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {items.map((item) => (
          <li
            key={item.num}
            /* --visible: 3 → 2 → 1, per the documented .bcar track. */
            className="w-full shrink-0 rounded bg-navy p-6 shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <span className="font-head text-2xl font-bold text-magenta">
              {item.num}
            </span>
            <p className="font-body mt-4 text-white/85">{item.from}</p>
            <p className="font-head my-1 text-xl text-magenta" aria-hidden="true">
              →
            </p>
            <p className="font-head font-semibold text-white">{item.to}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
