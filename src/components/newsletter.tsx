/**
 * Bloque de suscripción del footer. Vivía en components/home como sección de la
 * Home; al pasar a SiteFooter deja de ser específico de una página y se
 * renderiza en todas las que usan ese footer.
 *
 * Sin estado ni handlers: es markup puro, así que no lleva "use client" y no
 * arrastra al footer a componente de cliente.
 *
 * Ya no trae wrapper de sección: el fondo navy y el contenedor los pone el
 * footer. Lo que sí se conserva es la tarjeta magenta redondeada, que es un
 * elemento de diseño y no un fondo de sección.
 */
export function Newsletter() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-magenta px-8 py-10 sm:px-12">
      <h2 className="font-head text-2xl font-semibold text-white sm:text-3xl">
        Suscríbase al Newsletter
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
          className="font-head rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-off-white"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
