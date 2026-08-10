import { ContactButton } from "@/components/contact-button";

/**
 * CTA de la columna lateral de artículo. Es un componente propio y no
 * CtaContacto: aquel es una sección a ancho completo sobre fondo claro, este es
 * una tarjeta estrecha que convive con el índice.
 *
 * El texto llega por props y no lleva valores por defecto a propósito: es copy
 * de marca y debe decidirse fuera del componente.
 */
export function CtaArticulo({
  titulo,
  apoyo,
}: {
  titulo: string;
  apoyo: string;
}) {
  return (
    <div className="rounded border border-border bg-white p-5 shadow-sm">
      <p className="font-head text-base font-semibold text-navy">{titulo}</p>
      <p className="font-body mt-2 text-sm text-ink-soft">{apoyo}</p>
      <ContactButton variant="primary" size="sm" className="mt-4">
        Contáctanos
      </ContactButton>
    </div>
  );
}
