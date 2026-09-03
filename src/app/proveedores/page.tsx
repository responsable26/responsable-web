import type { Metadata } from "next";
import { PaginaSolicitud } from "@/components/pagina-solicitud";
import type { CampoConfig } from "@/components/formulario-contacto/formulario-contacto";

/** Campos definidos por el cliente para proveedores: los tres obligatorios más
 *  el mensaje, que va siempre. Sin Apellido, Compañía ni Cargo. */
const CAMPOS: readonly CampoConfig[] = [
  { campo: "nombre", obligatorio: true },
  { campo: "correo", obligatorio: true },
  { campo: "telefono", obligatorio: true },
];

const DESCRIPCION =
  "¿Su empresa ofrece servicios que pueden sumar a los proyectos de ResponSable? Cuéntenos qué hace y revisaremos su propuesta.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Proveedores",
  description: DESCRIPCION,
  /* Igual que /servicio/, /casos-de-exito/ y las páginas de caso: el sitio
     nuevo aún no está en producción, así que las páginas nuevas no se indexan
     todavía. Tampoco entra en el sitemap por el mismo motivo. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/proveedores/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Proveedores | ResponSable",
    description: DESCRIPCION,
    url: "/proveedores/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function ProveedoresPage() {
  return (
    <PaginaSolicitud
      breadcrumb="Proveedores"
      eyebrow="Proveedores"
      titulo="Ofrezca sus servicios a ResponSable"
      intro="Trabajamos con especialistas, agencias y consultoras que complementan nuestras capacidades en cada proyecto. Si su empresa ofrece servicios que pueden sumar a los nuestros, cuéntenos qué hace y cómo trabaja. Revisamos todas las propuestas que recibimos y nos pondremos en contacto con usted si su perfil encaja con alguna de nuestras necesidades."
      etiquetaFormulario="Formulario para proveedores"
      tituloFormulario="Cuéntenos sobre su empresa"
      campos={CAMPOS}
      etiquetaEnvio="Enviar Propuesta"
    />
  );
}
