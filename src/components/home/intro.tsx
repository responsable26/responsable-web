export function Intro() {
  return (
    <section className="px-6 py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        {/*
          Escala menor que los encabezados de bloque (Servicios/Artículos usan
          clamp(2.2rem,6vw,3.6rem)) porque esto introduce el bloque, no lo abre.
          text-balance evita el corte desbalanceado en mobile, donde el título
          pasa a dos o tres líneas.
        */}
        {/*
          El salto es explícito con <br>, no dependiente del ancho disponible.
          text-balance se retira: repartiría las líneas por su cuenta y pelearía
          con el corte fijo. En móvil el salto se mantiene y solo la segunda
          línea puede plegarse, por palabras; la primera son dos palabras y no
          se parte a ningún ancho razonable.
        */}
        <h2 className="font-head max-w-[60ch] text-[clamp(1.6rem,4vw,2.05rem)] font-semibold text-navy">
          La sostenibilidad
          <br />
          como decisión de negocio
        </h2>
        {/*
          96ch: el sitio publicado extiende bastante más este párrafo que la
          medida de lectura habitual. Sigue sin llegar al contenedor —ocupa unos
          880 de los 1120px—, y el bloque se sostiene porque las negritas dan
          puntos de anclaje que un texto corrido no tendría. El h2 conserva su
          60ch: es un título, y ahí el corte temprano juega a favor.

          El realce va en [&_strong] y no clase por clase: los <strong> quedan
          como marcado semántico limpio y el tratamiento se declara una vez.
          font-semibold (600) y text-ink son exactamente los que el sistema ya
          aplica al texto destacado en cuerpo, en .articulo-prose strong; el
          negrita por defecto del navegador sería 700, un peso que aquí no toca.
        */}
        <p className="font-body mt-6 max-w-[96ch] text-[1.15rem] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
          Transformamos la <strong>sostenibilidad</strong> en inteligencia
          estratégica para el <strong>negocio</strong>.{" "}
          <strong>Desde 2011</strong> acompañamos a empresas en Latinoamérica a comprender mejor su entorno, anticipar
          riesgos y fortalecer las condiciones que protegen su operación.{" "}
          <strong>Diseñamos soluciones</strong> que traducen cada decisión ESG
          en <strong>resultados medibles</strong>: menor vulnerabilidad,
          relaciones más sólidas con grupos de interés y una gestión que el
          consejo puede leer en su propio lenguaje.
        </p>
        <a
          href="#servicios"
          className="font-head mt-6 inline-flex items-center gap-2 font-semibold text-magenta underline decoration-2 underline-offset-4"
        >
          Conozca más →
        </a>
      </div>
    </section>
  );
}
