"use client";

import { useId, useState } from "react";
import { ChevronIcon } from "@/components/icons";

type Cuadrante = {
  numero: number;
  pregunta: string;
  colorToken: "amarillo" | "navy" | "teal";
  intro: string;
  servicios: string[];
};

const CUADRANTES: Cuadrante[] = [
  {
    numero: 1,
    pregunta: "¿Dónde Estoy?",
    colorToken: "amarillo",
    intro:
      "Ya sea que tu empresa apenas comience en sostenibilidad o lleve años trabajando en ella, siempre vale la pena detenerse y mirar con rigor dónde está hoy. Evaluamos lo que se está haciendo, qué tan bien está funcionando y qué impacto está generando.",
    servicios: [
      "Benchmark en Sostenibilidad",
      "SROI: Retorno Social Sobre la Inversión",
      "ROI de la inversión social",
      "Diagnóstico Social y Línea base comunitaria",
      "Diagnóstico de Sostenibilidad",
      "Mapeo de la Sostenibilidad en la Cadena de Valor",
      "Evaluación de la Inversión Social",
      "Diagnóstico ISO 26000",
    ],
  },
  {
    numero: 2,
    pregunta: "¿Adónde Voy?",
    colorToken: "navy",
    intro:
      "Cuando el punto de partida es claro, el siguiente paso es definir el rumbo. Te ayudamos a visualizar hacia dónde debe avanzar tu empresa, qué ambición tiene sentido plantear y qué prioridades estratégicas pueden generar mayor valor para el negocio y su entorno.",
    servicios: [
      "Estudio de Doble Materialidad",
      "Taller de Reflexión Estratégica",
      "Desarrollo de Indicadores de Impacto",
      "Estrategia de Compras Sostenibles",
      "Estrategia de Inversión Social",
      "Estrategia de Comunicación en Sostenibilidad",
    ],
  },
  {
    numero: 3,
    pregunta: "¿Cómo lo Hago?",
    colorToken: "navy",
    intro:
      "Tener claridad no basta. Hay que traducirla en acción. Diseñamos la ruta, las capacidades y las herramientas necesarias para que la sostenibilidad se implemente de forma ordenada, creíble y alineada con la realidad de tu empresa.",
    servicios: [
      "Distintivo ESR",
      "Comité de Sostenibilidad",
      "Reconocimientos y Certificaciones",
      "Plan de relacionamiento comunitario",
      "Sostenibilidad en Cadena de Valor",
      "Cursos y talleres de sostenibilidad para empresas",
      "Capacitación a la Medida",
      "Acompañamiento en sostenibilidad",
    ],
  },
  {
    numero: 4,
    pregunta: "¿Cómo Comunico?",
    colorToken: "teal",
    intro:
      "Lo que no se comunica con claridad pierde fuerza. Te ayudamos a traducir avances, compromisos y resultados en mensajes sólidos, relevantes y creíbles, que fortalezcan la confianza, la reputación y el valor de tu empresa ante sus grupos de interés.",
    servicios: ["Estrategia de Sostenibilidad", "Informe de Sostenibilidad", "Adicionales"],
  },
];

const CARD_STYLES: Record<Cuadrante["colorToken"], string> = {
  amarillo: "bg-amarillo text-navy",
  navy: "bg-navy text-white",
  teal: "bg-teal text-white",
};

export function Servicios() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tablistId = useId();
  const activeCuadrante = CUADRANTES[activeIndex];

  return (
    <section id="servicios" className="bg-off-white px-6 py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        <h2 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
          Nuestros Servicios
        </h2>

        <div
          role="tablist"
          aria-label="Cuadrantes de servicios"
          className="mt-8 flex flex-wrap gap-3"
        >
          {CUADRANTES.map((cuadrante, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={cuadrante.numero}
                role="tab"
                type="button"
                id={`${tablistId}-tab-${cuadrante.numero}`}
                aria-selected={isActive}
                aria-controls={`${tablistId}-panel-${cuadrante.numero}`}
                onClick={() => setActiveIndex(index)}
                className={`font-head rounded-[12px] px-5 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "bg-magenta text-white" : "bg-navy text-white/85 hover:text-white"
                }`}
              >
                {cuadrante.numero}. {cuadrante.pregunta}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel-${activeCuadrante.numero}`}
          aria-labelledby={`${tablistId}-tab-${activeCuadrante.numero}`}
          className="mt-6 grid gap-6 md:grid-cols-[30%_1fr]"
        >
          <div className={`rounded p-6 ${CARD_STYLES[activeCuadrante.colorToken]}`}>
            <h3 className="font-head text-xl font-semibold">{activeCuadrante.pregunta}</h3>
            <p className="font-body mt-3 text-sm">{activeCuadrante.intro}</p>
          </div>

          <ul className="flex flex-col gap-3">
            {activeCuadrante.servicios.map((servicio) => (
              <li
                key={servicio}
                className="font-body flex items-center justify-between gap-4 rounded-sm border border-border bg-white px-5 py-4 text-ink"
              >
                {servicio}
                <ChevronIcon direction="right" className="size-4 shrink-0 text-navy" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
