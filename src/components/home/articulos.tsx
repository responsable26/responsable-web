"use client";

import { useRef } from "react";
import { ChevronIcon } from "@/components/icons";
import { ArticleCardHome } from "@/components/home/article-card-home";

type Articulo = {
  titulo: string;
  excerpt?: string;
};

const ARTICULOS: Articulo[] = [
  { titulo: "Doble materialidad: 5 claves para su estrategia" },
  {
    titulo: "Doble materialidad: Qué es y cómo soluciona tu estrategia ESG",
    excerpt:
      "Explora cómo la doble materialidad se ha convertido en una herramienta estratégica clave para las empresas que desean ir más…",
  },
  { titulo: "Sostenibilidad empresarial: Qué es y cómo implementarla con éxito" },
  {
    titulo: "Tipos de stakeholders en una empresa y cómo gestionarlos correctamente",
    excerpt:
      "Descubre cómo clasificar, priorizar y relacionarte con tus grupos de interés para impulsar una RSE sólida y estratégica…",
  },
];

const THUMB_GRADIENTS = [
  "linear-gradient(135deg, var(--color-navy), #2b3266)",
  "linear-gradient(135deg, var(--color-teal), #0e7c72)",
  "linear-gradient(135deg, var(--color-magenta), #b3105e)",
];

export function Articulos() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section className="px-6 py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h2 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
              Últimos Artículos
            </h2>
            <p className="font-body mt-3 max-w-[60ch] text-ink-soft">
              Ideas que transforman el impacto en acción. Explora nuestros
              artículos sobre Sostenibilidad y Responsabilidad Social
              Empresarial.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Artículo anterior"
              className="flex size-11 items-center justify-center rounded-full border border-navy text-navy"
            >
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Artículo siguiente"
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white"
            >
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-10 flex gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {ARTICULOS.map((articulo, index) => (
            <ArticleCardHome
              key={articulo.titulo}
              href="/recursos/notas/"
              titulo={articulo.titulo}
              excerpt={articulo.excerpt}
              gradient={THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
