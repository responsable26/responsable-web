"use client";

import { useContactModal } from "@/context/contact-modal-context";

export function CtaImagen() {
  const { open } = useContactModal();

  return (
    <section className="relative bg-off-white px-6 py-[var(--section-y)]">
      <div className="absolute inset-0 bg-navy-04" />
      <div className="relative mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="font-head text-3xl font-semibold text-magenta sm:text-4xl">
            Convierte la sostenibilidad en una decisión estratégica de
            negocio
          </h2>
          <p className="font-body mt-4 text-ink-soft">
            Anticipa riesgos, fortalece tu relación con grupos de interés y
            enfoca tus recursos en lo que realmente protege la operación y
            genera valor.
          </p>
        </div>

        <button
          type="button"
          onClick={open}
          className="font-head shrink-0 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a2043]"
        >
          Contáctanos
        </button>
      </div>
    </section>
  );
}
