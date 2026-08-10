"use client";

import { useState } from "react";
import { ChevronIcon } from "@/components/icons";

type Caso = {
  cliente: string;
  subtitulo: string;
  parrafo: string;
};

const CASOS: Caso[] = [
  {
    cliente: "Profuturo",
    subtitulo: "Sostenibilidad en la Cadena de Valor",
    parrafo:
      "Conjuntamente con Profuturo, se implementó un proyecto estratégico enfocado en el desarrollo de su cadena de valor sostenible, un componente clave que permitió complementar y cerrar al 100% las metas iniciales de su modelo de madurez en sostenibilidad. Nuestra intervención abordó el desconocimiento técnico inicial mediante una rigurosa planificación y programas de capacitación dirigidos tanto a colaboradores internos como a proveedores de diversas escalas, lo que facilitó el diseño de una guía formal de buenas prácticas que mitiga el riesgo de greenwashing y promueve un impacto real en toda la cadena. A través de una metodología caracterizada por la flexibilidad y un acompañamiento continuo altamente personalizado, brindamos el soporte necesario para superar cada reto operativo, permitiendo a la organización consolidar exitosamente este ciclo de gestión y transitar con solidez hacia su siguiente estrategia corporativa.",
  },
  {
    cliente: "La Esperanza",
    subtitulo: "Acompañamiento",
    parrafo:
      "En conjunto con Grupo Esperanza, implementamos un proceso de acompañamiento y asesoría para PyMes enfocado en integrar la sostenibilidad de manera transversal en sus procesos operativos y en construir una cultura organizacional sólida. Nuestra intervención resolvió el reto de estructurar, documentar y comunicar de forma efectiva las evidencias de impacto social que la empresa ya generaba de forma nativa pero no sabía plasmar. Más allá de orientar al equipo hacia la obtención de un distintivo corporativo, nuestro enfoque se centró en una guía integral basada en la transferencia de conocimiento y el aprendizaje continuo, lo que permitió a la organización apropiarse del proceso, descubrir nuevas oportunidades de innovación y consolidar un propósito social plenamente arraigado en su operación diaria.",
  },
  {
    cliente: "BMW",
    subtitulo: "SROI",
    parrafo:
      "En alianza estratégica con BMW San Luis Potosí, se implementó por primera vez en su planta la metodología SROI (Retorno Social de la Inversión) para obtener resultados numéricos y medibles. Colaborar juntos abrió paso a la transparencia en la medición y evitó la inflación de datos, destacando la importancia de recabar información de calidad para entender el impacto real en las comunidades, más allá de las donaciones económicas. El equipo ahora cuenta con una base sólida para priorizar, analizar, reorientar y redefinir sus objetivos, lo que les permite optimizar el efecto positivo de sus iniciativas y tomar decisiones estratégicas mucho más claras y ambiciosas.",
  },
  {
    cliente: "Vestolit (una empresa de grupo Orbia)",
    subtitulo: "Diagnóstico de Impacto Social",
    parrafo:
      "Junto con Vestolit, llevamos a cabo un diagnóstico de impacto social en nueve de sus plantas, un proyecto de gran alcance coordinado regionalmente durante más de un año. Nuestra intervención se centró en sustituir el enfoque asistencialista por una estrategia orientada al negocio y a la creación de valor compartido. Este diagnóstico no solo fortaleció sus iniciativas con la comunidad, sino que también sirvió de respaldo para movilizar la cultura organizacional desde la alta dirección, logrando integrar de manera definitiva el impacto social en el núcleo de su estrategia empresarial.",
  },
  {
    cliente: "HEINEKEN México",
    subtitulo: "Estudio de materialidad",
    parrafo:
      "Junto con HEINEKEN México, desarrollamos su estudio de materialidad enfocado en el ámbito comunitario, un proceso clave que demostró cómo la asesoría experta optimiza los tiempos de ejecución y maximiza la profundidad de la investigación. Nuestra intervención facilitó el acceso a un nivel superior de stakeholders, aportando el respaldo técnico y las credenciales institucionales necesarias para validar sólidamente los resultados ante su corporativo global y superar las limitaciones de alcance de la gestión interna. Gracias a este esfuerzo conjunto, los hallazgos se transformaron en una hoja de ruta estratégica que hoy guía con claridad el rumbo de sus iniciativas sociales, permitiendo al equipo consolidar proyectos exitosos con un impacto plenamente fundamentado.",
  },
];

const CLIENTES = [
  "Sanofi",
  "Heineken México",
  "Baker M",
  "Deacero",
  "Pacto Mundial Red Española",
  "MetLife",
  "BMW Group Planta San Luis Potosí",
];

export function CasosExito() {
  const [index, setIndex] = useState(0);
  const caso = CASOS[index];

  function goTo(delta: number) {
    setIndex((current) => (current + delta + CASOS.length) % CASOS.length);
  }

  return (
    <section className="bg-navy px-6 py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-teal uppercase">
              Casos de Éxito
            </p>
            <h2 className="font-head mt-2 max-w-xl text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-magenta">
              Impacto medible, valor sostenible.
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Caso anterior"
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white"
            >
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Caso siguiente"
              className="flex size-11 items-center justify-center rounded-full bg-magenta text-white"
            >
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[45%_1fr]">
          <div className="aspect-video rounded bg-[#1b2150]" />

          <div>
            <h3 className="font-head text-2xl font-semibold text-white">{caso.cliente}</h3>
            <p className="font-head mt-1 text-sm font-medium text-white/70">{caso.subtitulo}</p>
            <p className="font-body mt-4 text-white/85">{caso.parrafo}</p>
          </div>
        </div>

        <div className="mt-14">
          <span className="font-head inline-block rounded-full bg-magenta px-4 py-2 text-sm font-semibold text-white">
            Trabajamos Junto a los Mejores:
          </span>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-6 rounded bg-white px-8 py-6">
            {CLIENTES.map((cliente) => (
              <span key={cliente} className="font-head text-sm font-extrabold text-[#8a90ad]">
                {cliente}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
