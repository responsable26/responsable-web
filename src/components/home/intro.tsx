export function Intro() {
  return (
    <section className="px-6 py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        <p className="font-body max-w-[60ch] text-[1.15rem] text-ink-soft">
          Transformamos la sostenibilidad en inteligencia estratégica para el
          negocio. Desde 2011 acompañamos a empresas en Latinoamérica a
          comprender mejor su entorno, anticipar riesgos y fortalecer las
          condiciones que protegen su operación. Diseñamos soluciones que
          traducen cada decisión ESG en resultados medibles: menor
          vulnerabilidad, relaciones más sólidas con grupos de interés y una
          gestión que el consejo puede leer en su propio lenguaje.
        </p>
        <a
          href="#servicios"
          className="font-head mt-6 inline-flex items-center gap-2 font-semibold text-magenta underline decoration-2 underline-offset-4"
        >
          Conoce Más →
        </a>
      </div>
    </section>
  );
}
