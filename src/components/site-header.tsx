"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useContactModal } from "@/context/contact-modal-context";

/**
 * Every site destination. This panel is the full navigation, so it has to be
 * reachable from every page — which is why the toggle is not conditional.
 */
const GLOBAL_LINKS = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Centro de Recursos", href: "/recursos" },
  { label: "Servicios", href: "/servicio" },
  { label: "Contacto", href: "/contacto" },
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

export function SiteHeader({ transparent = false, anchors }: SiteHeaderProps) {
  const { open } = useContactModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const navId = useId();
  const containerRef = useRef<HTMLElement>(null);

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
    <header
      ref={containerRef}
      className={
        transparent
          ? "fixed inset-x-0 top-0 z-[15] bg-transparent"
          : "sticky top-0 z-50 bg-navy"
      }
    >
      {/* The bar background always spans the viewport (it lives on <header>).
          This row holds the controls at a single 40px inset on every page. */}
      <div className="flex items-center justify-between gap-4 px-[clamp(1rem,4vw,2.5rem)] py-4">
        <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls={navId}
            aria-label={menuOpen ? "Cerrar menú del sitio" : "Abrir menú del sitio"}
            className="flex size-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-sm text-white transition-colors hover:bg-white/10"
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

          <Link href="/" aria-label="ResponSable" className="text-white">
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
              {GLOBAL_LINKS.map((link) => (
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

        {/* Contextual anchors only — the middle slot is simply empty on pages
            that do not pass any. */}
        <div className="flex items-center gap-6">
          {anchors?.length ? (
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
            className="font-head shrink-0 rounded bg-magenta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C71268] sm:px-5"
          >
            Contáctanos
          </button>
        </div>
      </div>

      {anchors?.length ? (
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
