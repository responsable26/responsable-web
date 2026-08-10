import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TerminosYCondicionesPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--container)]">
          <h1 className="font-head text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-navy">
            Términos y condiciones
          </h1>
          <p className="font-body mt-4 text-ink-soft">Contenido próximamente.</p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
