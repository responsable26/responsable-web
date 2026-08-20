import { ContactButton } from "@/components/contact-button";
import { TexturaHojas } from "@/components/textura-hojas";

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
      <div className="relative mx-auto max-w-[var(--container)]">
        {/*
          Mismo tratamiento que la tarjeta de casos de éxito y la de la banda
          de logos (rounded bg-white shadow, misma escala de padding por
          breakpoint): antes esta era la única sección sin contenedor propio,
          con el contenido flotando suelto sobre el fondo de la sección.

          relative + overflow-hidden: marco de la textura de fondo, que se
          recorta a las esquinas redondeadas de la tarjeta igual que ella.

          isolate es lo que de verdad separa la textura del fondo blanco de
          la tarjeta, no el -z-10 de abajo por sí solo: relative sin z-index
          propio NO crea contexto de apilamiento, así que ese -z-10 no
          quedaba contenido dentro de esta tarjeta sino que escapaba hasta el
          contexto real más cercano por encima (el layout raíz). Ahí competía
          con TODO lo demás de la página, y el propio fondo blanco de esta
          tarjeta —al no tener tampoco él contexto propio— se pintaba en ese
          mismo nivel exterior DESPUÉS de esa capa negativa, tapándola por
          completo: la textura nunca se veía, no porque no se renderizara ni
          por la opacidad, sino porque un blanco opaco pintaba encima suyo.
          isolate hace de esta tarjeta su propio contexto, así que su fondo
          pinta primero (paso 1: fondo de la raíz del contexto) y el -z-10 de
          la textura pinta justo después (paso 2: descendientes negativos),
          por delante del blanco y detrás del texto.
        */}
        <div className="relative isolate overflow-hidden rounded bg-white px-6 py-8 shadow sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <TexturaHojas className="pointer-events-none absolute inset-0 -z-10" />

          {/*
            mx-auto + text-center: antes el bloque vivía pegado a la
            izquierda con el botón aparte a la derecha del titular; con el
            botón ya debajo del párrafo, dejar todo a la izquierda vaciaba
            visualmente el lado derecho de una tarjeta ahora a ancho completo.
            Centrado, titular/párrafo/botón leen como un único bloque
            equilibrado sea cual sea el ancho de la tarjeta.

            max-w-xl (576px) dejaba el titular en cuatro líneas; el primer
            intento de arreglo, max-w-[30ch], resultó ser MÁS estrecho en la
            práctica (~30 caracteres por línea reales de Poppins Semibold
            rinden bastante menos que 30 unidades "ch" —el ancho del "0" del
            tipo, no el ancho medio real de una letra— así que encogió la
            columna en vez de ensancharla) y lo empeoró a cinco líneas.
            max-w-3xl (768px) es un salto mucho mayor y en una unidad que no
            depende de esa métrica de fuente: 768px caben con margen dentro
            de los ~1040px libres de la tarjeta en escritorio, y da bastante
            más aire que antes tanto al titular como al párrafo.
          */}
          <div className="relative mx-auto max-w-3xl text-center">
            {/*
              El recuento de líneas del titular ya falló una vez confiando en
              métricas de fuente que no puedo medir sin renderizar (ver
              arriba). En vez de volver a apostar a un ancho exacto, se fija
              el corte con dos <br> reales que solo actúan en escritorio
              (lg:, la tarjeta ya tiene margen de sobra a esa anchura): así
              caen siempre tres líneas de tres palabras cada una,
              independientemente de cómo rinda la fuente. Por debajo de lg
              los <br> se ocultan (hidden) y el titular vuelve a fluir según
              el ancho real disponible.
            */}
            <h2 className="font-head text-3xl font-semibold text-magenta sm:text-4xl">
              Convierta la sostenibilidad
              <br aria-hidden="true" className="hidden lg:block" /> en una decisión
              <br aria-hidden="true" className="hidden lg:block" /> estratégica de negocio
            </h2>
            <p className="font-body mt-4 text-ink-soft">
              Anticipe riesgos, fortalezca su relación con los grupos de interés y
              enfoque sus recursos en lo que realmente protege la operación y
              genera valor.
            </p>

            {/*
              Debajo del párrafo y centrado con el resto del bloque —el
              text-center del contenedor ya centra este <button>, que es
              inline-block por defecto—: el orden de lectura queda titular →
              párrafo → botón. variant="primary" (magenta, el mismo
              tratamiento que el CTA del header) en vez de "dark": en navy
              sobre este fondo claro era el elemento de acción más apagado de
              la página, en desventaja frente al header y el bloque de
              newsletter, ambos en magenta. size="lg" se conserva para que
              siga leyendo como acción principal.
            */}
            <ContactButton variant="primary" size="lg" className="mt-8">
              Contáctenos
            </ContactButton>
          </div>
        </div>
      </div>
    </section>
  );
}
