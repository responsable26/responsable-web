import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ContactModalProvider } from "@/context/contact-modal-context";
import { ContactModal } from "@/components/contact-modal/contact-modal";
import "./globals.css";

/*
  Única familia del sitio. Los cinco pesos son exactamente los que se usan:
    400  cuerpo de texto (no lleva clase, hereda el normal del navegador)
    500  font-medium — enlaces del menú y de las anclas
    600  font-semibold — la mayoría de títulos, botones y <strong> de artículos
    700  font-bold y el bold por defecto de <b>/<strong> fuera de .articulo-prose
    800  font-extrabold
  Añadir un peso nuevo en una clase obliga a añadirlo aquí: si no está cargado,
  el navegador lo sintetiza engordando el trazo y el resultado es sucio.
*/
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://responsable.net"),
  title: {
    default: "ResponSable | Consultoría en sostenibilidad y ESG",
    template: "%s | ResponSable",
  },
  description:
    "ResponSable es una agencia de sostenibilidad y RSE. Desde 2011 acompaña a su empresa a convertir la estrategia ESG en decisiones y resultados medibles.",
  icons: {
    icon: "/brand/isotipo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ContactModalProvider>
          {children}
          <ContactModal />
        </ContactModalProvider>
      </body>
    </html>
  );
}
