import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Newsletter } from "@/components/newsletter";
import { ContactButton } from "@/components/contact-button";
import {
  ENLACES_LEGALES,
  ENLACES_NAVEGACION,
  LINKEDIN_URL,
} from "@/lib/navegacion";

export function SiteFooter() {
  return (
    <footer className="bg-[#181D3C] px-6 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-[var(--container)]">
        {/*
          Ritmo del footer: el newsletter se separa de las columnas con el mismo
          pb-16 que usa el pt-16 de <footer>, sin borde ni cambio de fondo, para
          que ambos bloques se lean como una secuencia.
        */}
        <div className="pb-16">
          <Newsletter />
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="max-w-sm basis-full sm:basis-[35%]">
            <Logo className="h-8 w-auto text-white" />
            <p className="font-body mt-4 text-sm text-white/75">
              ResponSable es una agencia de sostenibilidad que acompaña a las
              empresas a llevar su estrategia de RSE, la doble materialidad y la
              gestión social al corazón del negocio, para generar valor real y
              fortalecer su resiliencia.
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de ResponSable"
              className="mt-5 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.12 20.45H3.56V9h3.56z" />
              </svg>
            </a>

            {/* El footer se queda sin ruta de contacto al desaparecer
                /contacto/: el botón lo sustituye abriendo el modal. */}
            <div className="mt-6">
              <ContactButton variant="primary" size="sm">
                Contáctenos
              </ContactButton>
            </div>
          </div>

          <div className="basis-40">
            <h3 className="font-head text-sm font-semibold text-white">
              Nosotros
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {ENLACES_NAVEGACION.map((link) => (
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
            <h3 className="font-head text-sm font-semibold text-white">
              Más Información
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {ENLACES_LEGALES.map((link) => (
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
