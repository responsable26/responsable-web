export function Newsletter() {
  return (
    <section className="bg-navy px-6 pb-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--container)]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-magenta px-8 py-10 sm:px-12">
          <h2 className="font-head text-2xl font-semibold text-white sm:text-3xl">
            Suscríbete al Newsletter
          </h2>

          <form className="flex flex-wrap gap-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="font-body rounded-full border-0 bg-white px-5 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo Electrónico"
              className="font-body rounded-full border-0 bg-white px-5 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <button
              type="submit"
              className="font-head rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-off-white"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
