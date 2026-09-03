import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Newsletter } from "@/components/newsletter";
import { ContactButton } from "@/components/contact-button";
import {
  DESCRIPCION_RESPONSABLE,
  ENLACES_LEGALES,
  ENLACES_NAVEGACION,
  LINKEDIN_URL,
} from "@/lib/navegacion";
import { SERVICIOS_FOOTER } from "@/lib/servicios";

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

        {/*
          Grid y no el flex-wrap anterior: con basis fijo en las columnas, el
          espacio que el contenido no llenaba se quedaba vacío a la derecha en
          vez de repartirse. Mismo patrón que ya usa ServicioFooter (columna de
          marca más ancha, 1.4fr, y el resto a partes iguales), así que las dos
          plantillas de footer del sitio comparten proporción.
        */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo className="h-8 w-auto text-white" />
            <p className="font-body mt-4 text-sm text-white/75">
              {DESCRIPCION_RESPONSABLE}
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

          <div>
            <h3 className="font-head text-sm font-semibold text-white">
              Compañía
            </h3>
            {/*
              No se usa ENLACES_NAVEGACION tal cual: es la misma fuente que
              alimenta el "Explore" de ServicioFooter, así que quitar "Home" o
              añadir aquí un enlace habría cambiado también esa otra columna.
              Los ajustes pedidos para esta columna en concreto —quitar
              "Home", añadir el índice de servicios antes de Casos de Éxito
              (mismo orden que "Servicios" en la navegación principal del
              header, NAV_LINKS en site-header.tsx) y cerrar con Proveedores y
              Trabaja con nosotros— se aplican aquí, en local, sin tocar
              lib/navegacion.ts ni ServicioFooter.

              "Todos los Servicios" y no "Servicios": esta misma fila de
              columnas ya tiene una columna llamada "Servicios" (los cinco de
              SERVICIOS_FOOTER), y el rótulo tiene que distinguir con
              claridad que este enlace va al índice completo, no a otro
              servicio suelto de esa lista.
            */}
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/servicio/"
                  className="font-body text-sm text-white/75 transition-colors hover:text-white"
                >
                  Todos los Servicios
                </Link>
              </li>
              {ENLACES_NAVEGACION.filter((link) => link.label !== "Home").map(
                (link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
              {/*
                Al final de la columna y no dentro de ENLACES_NAVEGACION:
                Proveedores y Trabaja con nosotros son destinos de este footer,
                no de la navegación general, y meterlos en la constante los
                habría colado también en el "Explore" del footer de servicio.
              */}
              <li>
                <Link
                  href="/proveedores/"
                  className="font-body text-sm text-white/75 transition-colors hover:text-white"
                >
                  Proveedores
                </Link>
              </li>
              <li>
                <Link
                  href="/trabaja-con-nosotros/"
                  className="font-body text-sm text-white/75 transition-colors hover:text-white"
                >
                  Trabaja con nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/*
            SERVICIOS_FOOTER es una selección editorial (servicios.ts), no
            "todos los servicios con página": esos siguen enlazados desde
            "Servicios relacionados" en cada página de servicio. Aquí van solo
            los cinco que el footer decide destacar, en el orden que define
            esa lista.
          */}
          <div>
            <h3 className="font-head text-sm font-semibold text-white">
              Servicios
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICIOS_FOOTER.map((servicio) => (
                <li key={servicio.href}>
                  <Link
                    href={servicio.href}
                    className="font-body text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {servicio.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
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
