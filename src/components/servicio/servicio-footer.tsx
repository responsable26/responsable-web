import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  ENLACES_LEGALES,
  ENLACES_NAVEGACION,
  LINKEDIN_URL,
} from "@/lib/navegacion";

/**
 * Footer used by the service pages. Mirrors the live site's four-column layout
 * (brand + Explore / Legal / Síguenos) with a two-sided bottom bar. The Home
 * keeps its own SiteFooter — these are deliberately different.
 */
/**
 * Las dos primeras columnas salen de la fuente única de navegación: antes tenían
 * su propia lista y por eso arrastraban el enlace roto a
 * /informe-de-sostenibilidad/ y un "Mapa del sitio" que llevaba a la Home.
 */
const COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  { title: "Explore", links: ENLACES_NAVEGACION },
  { title: "Legal", links: ENLACES_LEGALES },
  {
    title: "Síguenos",
    links: [{ label: "LinkedIn", href: LINKEDIN_URL, external: true }],
  },
];

export function ServicioFooter() {
  return (
    <footer className="bg-[#181D3C] pt-16 pb-8 text-white">
      <div className="mx-auto max-w-[var(--container)] px-[clamp(1rem,4vw,2rem)]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo className="h-8 w-auto text-white" />
            <p className="font-body mt-4 text-sm text-white/75">
              Agencia de sostenibilidad y RSE. Le ayudamos a medir, reportar y
              mejorar su impacto.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-white uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-body text-sm text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6">
          <span className="font-body text-sm text-white/60">
            © 2026 ResponSable. Todos los derechos reservados.
          </span>
          <Link
            href="/"
            className="font-body text-sm text-white/60 transition-colors hover:text-white"
          >
            responsable.net
          </Link>
        </div>
      </div>
    </footer>
  );
}
