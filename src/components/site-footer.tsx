import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNA_NOSOTROS = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Informe de Sostenibilidad", href: "/informe-de-sostenibilidad" },
  { label: "Mapa del Sitio", href: "/" },
  { label: "Sigamos en contacto", href: "/contacto" },
  { label: "Términos y Condiciones", href: "/legal/terminos-y-condiciones" },
  { label: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
];

const COLUMNA_INFO = [
  { label: "Home", href: "/" },
  { label: "Mapa del Sitio", href: "/" },
  { label: "Términos y Condiciones", href: "/legal/terminos-y-condiciones" },
  { label: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#181D3C] px-6 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-[var(--container)]">
        <div className="flex flex-wrap gap-12">
          <div className="max-w-sm basis-full sm:basis-[35%]">
            <Logo className="h-8 w-auto text-white" />
            <p className="font-body mt-4 text-sm text-white/75">
              ResponSable es una agencia de sostenibilidad que acompaña a las
              empresas a llevar su estrategia de RSE, la doble materialidad
              y la gestión social al corazón del negocio, para generar valor
              real y fortalecer su resiliencia.
            </p>
            <a
              href="https://www.linkedin.com/company/responsable-asesoria-sostenibilidad-rse-esg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de ResponSable"
              className="mt-5 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.12 20.45H3.56V9h3.56z" />
              </svg>
            </a>
          </div>

          <div className="basis-40">
            <h3 className="font-head text-sm font-semibold text-white">Nosotros</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {COLUMNA_NOSOTROS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="basis-40">
            <h3 className="font-head text-sm font-semibold text-white">Más Información</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {COLUMNA_INFO.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6">
          <Logo className="h-5 w-auto text-white/85" />
          <p className="font-body text-sm text-white/60">
            2026 - ResponSable, una marca de ProActive Strategies, S.C.
          </p>
        </div>
      </div>
    </footer>
  );
}
