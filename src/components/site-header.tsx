"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useContactModal } from "@/context/contact-modal-context";

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
  { label: "Home", href: "/", activa: (r) => r === "/" },
  {
    label: "Servicios",
    // PROVISIONAL: /servicio/ es todavía un stub sin contenido, así que apunta
    // al ancla de la sección de servicios de la Home. Cambiar a "/servicio/"
    // en cuanto esa página exista.
    href: "/#servicios",
    activa: (r) => r.startsWith("/servicio"),
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

const LEGAL_LINKS = [
  { label: "Términos y Condiciones", href: "/legal/terminos-y-condiciones" },
  { label: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
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
  const containerRef = useRef<HTMLElement>(null);
  const ruta = usePathname();
  /*
    Las páginas de servicio pasan sus anclas de sección y conservan el patrón
    anterior —botón desplegable siempre visible— porque su barra ya va llena con
    esa navegación contextual. El resto de páginas estrena la navegación
    principal a la vista.
  */
  const navContextual = Boolean(anchors?.length);

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

  // Close the panel on Escape or on a click outside it.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
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
      sube a z-50, por encima de todo el contenido y por debajo del modal (z-60).
    */
    <header
      ref={containerRef}
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
            ? "max-w-[24rem] rounded-full bg-navy px-3 py-2.5 shadow lg:max-w-[58rem] lg:px-8"
            : `max-w-full rounded-none px-[clamp(1rem,4vw,2.5rem)] py-4 ${
                transparent ? "bg-transparent" : "bg-navy"
              }`
        }`}
      >
        <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
          <button
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

          {/* Full site navigation, anchored under the toggle. */}
          <nav
            id={navId}
            aria-label="Menú del sitio"
            hidden={!menuOpen}
            className="absolute top-full left-0 z-10 mt-2 min-w-60 rounded-sm border border-border bg-white p-2 shadow"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-head block rounded-sm px-3 py-2 text-sm font-medium text-navy hover:bg-off-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-2 flex flex-col border-t border-border pt-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-body block rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-off-white hover:text-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

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
            Contáctanos
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
