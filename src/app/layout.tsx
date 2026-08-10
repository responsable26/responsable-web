import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ContactModalProvider } from "@/context/contact-modal-context";
import { ContactModal } from "@/components/contact-modal/contact-modal";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
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
