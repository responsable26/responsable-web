import type { Metadata } from "next";
import { PaginaSolicitud } from "@/components/pagina-solicitud";
import type { CampoConfig } from "@/components/formulario-contacto/formulario-contacto";

/*
  Campos definidos por el cliente: Nombre y Correo, más el mensaje, que va
  siempre. Sin Apellido, Teléfono, Compañía ni Cargo.

  El enlace al CV va opcional. Aquí no hay campo de archivo, así que exigirlo
  convertiría en un muro el caso más corriente —tener el CV en PDF en el
  ordenador y ningún sitio donde esté publicado—: obligaría a subirlo a algún
  lado antes de poder escribirnos. Quien tenga LinkedIn o un portafolio lo pega
  en dos segundos, y quien no, lo cuenta en el mensaje y nosotros se lo pedimos.
  Perder candidatos en la puerta cuesta más que pedir el CV en el segundo
  correo. Si el cliente prefiere lo contrario, es cambiar una palabra.
*/
const CAMPOS: readonly CampoConfig[] = [
  { campo: "nombre", obligatorio: true },
  { campo: "correo", obligatorio: true },
  { campo: "cv" },
];

const DESCRIPCION =
  "¿Quiere formar parte del equipo de ResponSable? Cuéntenos qué hace, qué le interesa y cómo trabaja, y revisaremos su perfil.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Trabaja con nosotros",
  description: DESCRIPCION,
  /* Igual que /proveedores/, /servicio/ y /casos-de-exito/: el sitio nuevo aún
     no está en producción, así que las páginas nuevas no se indexan todavía.
     Tampoco entra en el sitemap por el mismo motivo. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/trabaja-con-nosotros/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Trabaja con nosotros | ResponSable",
    description: DESCRIPCION,
    url: "/trabaja-con-nosotros/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

export default function TrabajaConNosotrosPage() {
  return (
    <PaginaSolicitud
      breadcrumb="Trabaja con nosotros"
      eyebrow="Trabaja con nosotros"
      titulo="Súmese a nuestro equipo"
      intro="Acompañamos a empresas de sectores y niveles de madurez muy distintos, así que buscamos personas con criterio propio, rigor analítico y ganas de entender a fondo cada negocio antes de proponer nada. Si le interesa trabajar en sostenibilidad con esa forma de hacer las cosas, cuéntenos quién es, qué ha hecho y qué le gustaría aportar. Revisamos todos los perfiles que recibimos y nos pondremos en contacto con usted si encaja con alguna de nuestras búsquedas."
      etiquetaFormulario="Formulario para candidaturas"
      tituloFormulario="Cuéntenos sobre usted"
      campos={CAMPOS}
      etiquetaEnvio="Enviar Solicitud"
    />
  );
}
