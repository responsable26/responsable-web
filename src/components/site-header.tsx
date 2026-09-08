"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CloseIcon } from "@/components/icons";
import { useContactModal } from "@/context/contact-modal-context";
import { pausarScroll, reanudarScroll } from "@/lib/scroll-suave";

/** Selector de lo que puede recibir foco dentro del panel, para el atrapado.
 *  Mismo criterio que ServicioModal y ContactModal (el patrón ya establecido
 *  en el sitio para esto), reproducido aquí y no importado: cada uno de los
 *  tres vive en un módulo distinto sin un punto común que valga la pena
 *  crear solo para tres líneas de selector. */
const ENFOCABLES =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Navegación principal. Se pinta en la barra desde lg y, por debajo, dentro del
 * panel desplegable.
 *
 * `activa` es una función y no una comparación de href porque los criterios no
 * son uniformes: la Home solo coincide exacta, y un artículo individual marca
 * Centro de Recursos aunque su ruta sea otra.
 */
const NAV_LINKS: {
  label: string;
  href: string;
  activa: (ruta: string) => boolean;
}[] = [
  {
    label: "Servicios",
    href: "/servicio/",
    // Cubre el índice y cada página de servicio, que cuelgan de /servicio/.
    activa: (r) => r.startsWith("/servicio"),
  },
  {
    label: "Casos de Éxito",
    href: "/casos-de-exito/",
    activa: (r) => r.startsWith("/casos-de-exito"),
  },
  {
    label: "Conócenos",
    href: "/nosotros/",
    activa: (r) => r.startsWith("/nosotros"),
  },
  {
    label: "Centro de Recursos",
    href: "/recursos/",
    // Cubre el índice y cada artículo individual, que cuelgan de /recursos/.
    activa: (r) => r.startsWith("/recursos"),
  },
];

export type AnchorLink = { label: string; href: string };

type SiteHeaderProps = {
  /** Overlay style for the Home hero video. The only per-page variation. */
  transparent?: boolean;
  /**
   * In-page section shortcuts for pages that have them. Purely additive: the
   * toggle, logo and CTA are identical whether or not these are passed.
   */
  anchors?: AnchorLink[];
};

/*
  Banda de histéresis del disparo. Con un único umbral, un usuario que oscila
  alrededor del punto haría parpadear el header en cada píxel; separando entrada
  y salida hay que recorrer 40px entre un estado y el contrario.
*/
const SCROLL_ENTER = 80;
const SCROLL_EXIT = 40;

export function SiteHeader({ transparent = false, anchors }: SiteHeaderProps) {
  const { open } = useContactModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navId = useId();
  /* Panel deslizante: refs para el atrapado de foco (panelRef), el primer
     foco al abrir (cerrarRef, el botón "Cerrar" del propio panel) y la
     devolución de foco al cerrar (toggleRef, el botón hamburguesa que lo
     abrió). El panel cubre en pantalla el propio botón hamburguesa —vive en
     la esquina superior izquierda, donde también arranca el panel—, así que
     no puede seguir siendo él el control de cierre mientras está abierto. */
  const panelRef = useRef<HTMLElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const ruta = usePathname();
  /*
    Las páginas de servicio pasan sus anclas de sección y conservan el patrón
    anterior —botón desplegable siempre visible— porque su barra ya va llena con
    esa navegación contextual. El resto de páginas estrena la navegación
    principal a la vista.
  */
  const navContextual = Boolean(anchors?.length);

  /*
    Origen del último clic, para que el anillo de foco no aparezca con ratón.
    Un <a> nativo resuelve bien :focus-visible al pulsarlo, pero al navegar a un
    ancla de la misma página el foco se reposiciona por vía programática y el
    navegador enciende la marca de focus-visible. Quitando el foco cuando el
    clic vino de un puntero, el teclado conserva su anillo y el ratón no.
  */
  const clicConPuntero = useRef(false);

  useEffect(() => {
    let queued = false;
    function read() {
      queued = false;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y >= SCROLL_EXIT : y > SCROLL_ENTER));
    }
    function onScroll() {
      // rAF: el evento de scroll dispara muchas veces por frame y solo importa
      // el último valor antes de pintar.
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    }
    read(); // estado correcto si se entra con la página ya desplazada
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
    Cerrar el panel: útil desde Escape, el overlay y cada enlace de la lista.
    Devuelve el foco al botón hamburguesa —el mismo patrón de
    disparador/devolución que servicios-rueda.tsx usa con ServicioModal—,
    salvo que aquí el disparador es un único botón fijo y no hace falta
    trackearlo por ref aparte.
  */
  function cerrarPanel() {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }

  /*
    Mismo patrón que ServicioModal/ContactModal: overlay fijo, scroll del
    body bloqueado (más Lenis, que su propio bucle sigue moviendo el
    documento aunque el body no desborde), foco inicial en "Cerrar" y foco
    atrapado con Tab mientras esté abierto. Escape cierra; el clic fuera ya
    no hace falta detectarlo aquí porque lo resuelve el propio onClick del
    overlay, que cubre todo lo que el panel no cubre.
  */
  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";
    pausarScroll();
    cerrarRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cerrarPanel();
        return;
      }
      if (event.key !== "Tab") return;

      const foco = panelRef.current?.querySelectorAll<HTMLElement>(ENFOCABLES);
      if (!foco || foco.length === 0) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      reanudarScroll();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    /*
      El posicionamiento se mantiene distinto por página y no se unifica: en la
      Home es fixed para que el hero pueda medir exactamente 100vh con el header
      flotando encima; en el resto es sticky para que ocupe su hueco en el flujo
      y no tape el inicio del contenido. Pasar todo a fixed obligaría a añadir
      padding-top compensatorio en cada página.

      El fondo ya no vive aquí sino en la fila: es la fila la que se convierte en
      pill, y un fondo a ancho completo por detrás lo anularía visualmente.

      z-index: en la Home arranca en z-[15], por debajo del texto del hero (z-20)
      y de la onda (z-30), que es la superposición que ya tenía. Al desplazarse
      sube a z-50, por encima de todo el contenido y por debajo del modal de
      contacto y del panel deslizante de este mismo header (los dos en z-60).
    */
    <header
      className={`inset-x-0 top-0 transition-[padding] duration-300 ease-out ${
        transparent ? "fixed" : "sticky"
      } ${scrolled ? "z-50 px-4 pt-3" : transparent ? "z-[15]" : "z-50"}`}
    >
      {/*
        La fila es la que se transforma. max-width interpola entre 100% y 24rem
        —ambos son <length-percentage>, así que la transición es continua, cosa
        que no ocurriría con width:fit-content, que no es animable.

        24rem ≈ el ancho real del contenido: hamburguesa 44px + logo 110px (el
        viewBox es 3.44:1 a h-8) + CTA ~150px + gaps y padding.
      */}
      <div
        className={`mx-auto flex items-center justify-between gap-4 lg:gap-14 transition-[max-width,border-radius,background-color,box-shadow,padding] duration-300 ease-out ${
          scrolled
            ? /*
                pr-3 y no px-3/lg:px-8 simétrico: el hueco a la derecha del
                CTA debe igualar al que tiene arriba y abajo (py-3), y ese es
                el mismo en todos los breakpoints porque py-3 tampoco cambia
                con lg. pl sí crece en lg —conserva el aire que ya tenía el
                grupo hamburguesa/logo/nav, que no es lo que se está corrigiendo.
              */
              "max-w-[24rem] rounded-full bg-navy py-3 pr-3 pl-3 shadow lg:max-w-[54rem] lg:pl-8"
            : `max-w-full rounded-none px-[clamp(1rem,4vw,2.5rem)] py-5 ${
                transparent ? "bg-transparent" : "bg-navy"
              }`
        }`}
      >
        <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls={navId}
            aria-label={
              menuOpen ? "Cerrar menú del sitio" : "Abrir menú del sitio"
            }
            /* El anillo de foco global es magenta; sobre el navy del pill y
               sobre el CTA magenta se lee mal, así que aquí pasa a blanco. */
            className={`size-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-white ${
              navContextual ? "flex" : "flex lg:hidden"
            }`}
          >
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>

          <Link
            href="/"
            aria-label="ResponSable"
            className="rounded-sm text-white focus-visible:outline-white"
          >
            <Logo className="h-7 w-auto sm:h-8" />
          </Link>
        </div>

        {/*
          Overlay: cubre todo el viewport, no solo los tres cuartos que el
          panel deja libres —el panel, opaco, tapa por su cuenta el resto—.
          Un único
          onClick cierra desde cualquier punto fuera del panel, así que ya no
          hace falta detectar "clic fuera" comparando con containerRef como
          antes. Montado siempre (no de forma condicional) para poder animar
          también su entrada/salida; inert + aria-hidden lo sacan del foco y
          del árbol de accesibilidad mientras está cerrado, y
          pointer-events-none evita que un elemento en opacity-0 siga
          capturando clics.
        */}
        <div
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          onClick={cerrarPanel}
          className={`fixed inset-0 z-[60] bg-[rgba(10,12,30,0.6)] transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        {/*
          Panel deslizante: mismos enlaces que el dropdown anterior
          (NAV_LINKS), en un cajón de un cuarto del viewport (ver el ancho
          más abajo) que entra desde el borde izquierdo. fixed y no absolute:
          ya no depende de ningún
          ancestro relative, y cubre toda la altura de la pantalla en vez de
          solo anclarse bajo el botón. Montado siempre, igual que el overlay,
          para poder animar transform; inert lo saca del foco mientras está
          fuera de vista. El botón hamburguesa que lo abre queda tapado por
          el propio panel en su esquina superior izquierda mientras está
          abierto, así que el cierre manual vive en el botón "Cerrar" de
          dentro, no en volver a pulsar la hamburguesa.
        */}
        <nav
          ref={panelRef}
          id={navId}
          aria-label="Menú del sitio"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          /*
            25vw es la especificación (un cuarto del viewport), pero tomada
            tal cual sobre un móvil se queda en unos 90-100px: ni entra
            "Centro de Recursos" sin partirse, ni deja un cajón usable.
            max(25vw,280px) no es un breakpoint sino una sola fórmula continua:
            por debajo de los 1120px de ancho de pantalla (280px / 0.25) gana
            el mínimo fijo de 280px —suficiente para el enlace más largo con
            aire de sobra, y una anchura de cajón corriente en patrones de
            navegación móvil—, y a partir de esos 1120px gana el 25vw, que ya
            es igual o mayor que 280px: el cuarto exacto pedido entra en
            juego justo en el punto en que ya es usable por sí solo, sin
            necesidad de fijar el corte a mano en un breakpoint concreto.
          */
          className={`fixed inset-y-0 left-0 z-[60] flex w-[max(25vw,280px)] flex-col overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <Logo className="h-7 w-auto text-navy" />
            <button
              ref={cerrarRef}
              type="button"
              onClick={cerrarPanel}
              aria-label="Cerrar menú del sitio"
              className="flex size-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-off-white"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>

          <ul className="flex flex-col p-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={cerrarPanel}
                  className="font-head block rounded-sm px-3 py-2 text-sm font-medium text-navy hover:bg-off-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {navContextual ? null : (
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-6 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const activa = link.activa(ruta);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activa ? "page" : undefined}
                  onPointerDown={() => {
                    clicConPuntero.current = true;
                  }}
                  onClick={(event) => {
                    if (!clicConPuntero.current) return;
                    clicConPuntero.current = false;
                    event.currentTarget.blur();
                  }}
                  className={`font-head rounded-sm text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-white ${
                    activa
                      ? "text-white underline decoration-magenta decoration-2 underline-offset-8"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Contextual anchors only — the middle slot is simply empty on pages
            that do not pass any. */}
        {/* El pill solo contiene hamburguesa, logo y CTA: los anclas de sección
            se retiran al desplazarse, en las dos maquetaciones. */}
        <div className="flex items-center gap-6">
          {anchors?.length && !scrolled ? (
            <nav
              aria-label="Secciones de la página"
              /* Documented reflow: below 860px this drops to its own row and
                 scrolls horizontally instead of wrapping. */
              className="hidden items-center gap-6 min-[861px]:flex"
            >
              {anchors.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="font-head text-sm font-medium whitespace-nowrap text-white/80 transition-colors hover:text-white"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          ) : null}

          <button
            type="button"
            onClick={open}
            className="font-head shrink-0 rounded bg-magenta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C71268] focus-visible:outline-white sm:px-5"
          >
            Contáctenos
          </button>
        </div>
      </div>

      {anchors?.length && !scrolled ? (
        <nav aria-label="Secciones de la página" className="min-[861px]:hidden">
          <ul className="flex gap-5 overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] pb-3">
            {anchors.map((a) => (
              <li key={a.href}>
                <a
                  href={a.href}
                  className="font-head text-sm font-medium whitespace-nowrap text-white/80 transition-colors hover:text-white"
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
