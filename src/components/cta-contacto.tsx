import { ContactButton } from "@/components/contact-button";

/**
 * Sección CTA sobre fondo claro. Vivía en components/home, pero no depende de
 * nada de la Home: se puede insertar tal cual en cualquier ruta que quiera
 * cerrar con una llamada a contacto, por eso está fuera de esa carpeta.
 *
 * No lleva "use client": el modal lo abre ContactButton, que ya es el límite de
 * cliente. Así la sección se puede montar dentro de páginas de servidor sin
 * arrastrarlas.
 */
export function CtaContacto() {
  return (
    /*
      Fondo propio en off-white más una capa navy al 4%: el matiz frío que
      separa esta sección del blanco del contenido que la precede y del navy
      del footer que la sigue.
    */
    <section className="relative bg-off-white px-6 py-[var(--section-y)]">
      <div className="absolute inset-0 bg-navy-04" />
      <div className="relative mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="font-head text-3xl font-semibold text-magenta sm:text-4xl">
            Convierta la sostenibilidad en una decisión estratégica de negocio
          </h2>
          <p className="font-body mt-4 text-ink-soft">
            Anticipe riesgos, fortalezca su relación con los grupos de interés y
            enfoque sus recursos en lo que realmente protege la operación y
            genera valor.
          </p>
        </div>

        {/*
          variant="dark" reproduce el píldora navy que tenía la sección antes de
          moverse al footer; size="lg" mantiene la escala grande que se
          introdujo entonces, para que lea como acción principal.
        */}
        <ContactButton variant="dark" size="lg">
          Contáctanos
        </ContactButton>
      </div>
    </section>
  );
}
