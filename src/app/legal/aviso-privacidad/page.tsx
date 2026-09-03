import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DESCRIPCION =
  "Aviso de privacidad de ResponSable: qué datos personales recabamos, con qué finalidad los tratamos y cómo puede ejercer sus derechos.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Aviso de Privacidad",
  description: DESCRIPCION,
  /* Mismo criterio que el resto de páginas nuevas: el sitio aún no está en
     producción y no se indexa todavía. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/legal/aviso-privacidad/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Aviso de Privacidad | ResponSable",
    description: DESCRIPCION,
    url: "/legal/aviso-privacidad/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/*
  Transcripción literal del documento publicado en
  https://responsable.net/aviso-de-privacidad/ (WordPress). Es un texto legal:
  no se corrige redacción, ortotipografía, terminología ni fechas. Cualquier
  cambio de contenido sale del cliente, no de aquí.

  Dos apuntes sobre la fidelidad de la transcripción:

  - Los títulos numerados son <h2> y no <li>. En el original la numeración la
    producía una cadena de <ol> con `start` —1, luego start=2, start=3…, un
    truco del editor visual para encadenar una lista partida por los párrafos
    intermedios—, así que el lector veía "1.", "2.", "3."… pero el marcado
    decía "lista de un solo elemento" nueve veces. Aquí el número se escribe en
    el propio encabezado: se ve exactamente igual y el árbol del documento pasa
    a ser navegable por encabezados.
  - Los subapartados 2.1, 2.2, 3.1 y 3.2 van como <h3>, y las viñetas como
    <ul>/<li>, que es lo que ya eran en el original.

  El correo hola@responsable.net se deja como texto y no como enlace mailto:
  no altera ni un carácter, pero introducir enlaces en un documento legal es
  una decisión del cliente.
*/
export default function AvisoPrivacidadPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* Variante clara de la ruta de navegación, la misma que
            casos-de-exito/[slug], recursos/articulos/[slug] y las páginas de
            solicitud. */}
        <div className="border-b border-border bg-off-white">
          <nav
            aria-label="Ruta de navegación"
            className="mx-auto max-w-[calc(var(--container)+3rem)] px-6 py-3"
          >
            <ol className="font-body flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-navy">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-navy">
                  Aviso de Privacidad
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Mismo contenedor y misma medida de lectura (68ch) que el cuerpo de
            un artículo, y la clase .articulo-prose para el tratamiento
            tipográfico de texto largo del sitio. */}
        <div className="mx-auto max-w-[calc(var(--container)+3rem)] px-6 py-[var(--section-y)]">
          <article className="max-w-[68ch]">
            <h1 className="font-head text-[clamp(1.9rem,4.2vw,2.9rem)] font-semibold text-balance text-navy">
              Aviso de Privacidad
            </h1>

            <div className="articulo-prose mt-8">
              <h2>1. Identidad y domicilio del Responsable</h2>
              <p>
                La empresa PROACTIVE STRATEGIES, S.C., con domicilio en AVENIDA
                RIO CHURUBUSCO #124, INTERIOR PH, COLONIA EL PRADO, ALCALDÍA
                IZTAPALAPA, C.P.: 09480, CIUDAD DE MÉXICO (en adelante, el
                «Responsable»), es la entidad responsable del tratamiento de sus
                datos personales de conformidad con la Ley Federal de Protección
                de Datos Personales en Posesión de los Particulares (LFPDPPP) y
                demás normatividad aplicable.
              </p>
              <p>
                Correo de contacto en materia de datos personales:
                hola@responsable.net
              </p>

              <h2>2. Datos personales que se recaban</h2>
              <p>
                A través del sitio web, el Responsable podrá recabar, de manera
                directa o automática, los siguientes datos personales:
              </p>

              <h3>2.1 Datos proporcionados directamente por el usuario</h3>
              <ul>
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Nombre de la empresa u organización</li>
                <li>Cargo o puesto</li>
                <li>Número de teléfono</li>
                <li>
                  Cualquier otro dato que el usuario proporcione voluntariamente
                  a través de formularios de contacto, suscripciones o
                  solicitudes de información
                </li>
              </ul>

              <h3>2.2 Datos recabados de forma automática</h3>
              <p>
                A través de tecnologías de rastreo instaladas en el sitio web se
                recopilan automáticamente datos de navegación y comportamiento,
                incluyendo:
              </p>
              <ul>
                <li>Dirección IP</li>
                <li>Tipo y versión de navegador</li>
                <li>Sistema operativo</li>
                <li>
                  Páginas visitadas, tiempo de permanencia y acciones realizadas
                  dentro del sitio
                </li>
                <li>Fuente de origen del tráfico (origen, medio, campaña)</li>
                <li>Identificadores de cookies y etiquetas de seguimiento</li>
              </ul>
              <p>
                Al proporcionar sus datos personales a través del sitio web,
                usted reconoce haber leído el presente Aviso de Privacidad y
                consiente el tratamiento de sus datos en los términos aquí
                establecidos.
              </p>
              <p>
                El Responsable no recaba ni trata datos personales sensibles a
                través del sitio web.
              </p>

              <h2>3. Finalidades del tratamiento</h2>

              <h3>3.1 Finalidades primarias</h3>
              <p>Los datos personales que recabamos son utilizados para:</p>
              <ul>
                <li>
                  Atender solicitudes de información, contacto o cotización
                </li>
                <li>
                  Gestionar la relación comercial con clientes y prospectos
                </li>
                <li>
                  Enviar comunicaciones relacionadas con los servicios de
                  ResponSable
                </li>
                <li>
                  Administrar el CRM interno y dar seguimiento a oportunidades
                  de negocio
                </li>
              </ul>

              <h3>3.2 Finalidades secundarias</h3>
              <p>
                Adicionalmente, y siempre que usted no manifieste su oposición,
                utilizamos sus datos para:
              </p>
              <ul>
                <li>
                  Envío de boletines, contenidos de valor, noticias y
                  actualizaciones sobre RSE y sustentabilidad
                </li>
                <li>
                  Análisis estadístico de comportamiento en el sitio para
                  mejorar la experiencia del usuario
                </li>
                <li>
                  Medición del rendimiento de campañas digitales y acciones de
                  marketing
                </li>
              </ul>
              <p>
                Usted puede oponerse al uso de sus datos para estas finalidades
                enviando un correo a hola@responsable.net
              </p>

              <h2>4. Uso de cookies y tecnologías de rastreo</h2>
              <p>
                Nuestro sitio web utiliza cookies, píxeles y etiquetas de
                seguimiento que permiten recopilar información sobre su
                comportamiento de navegación. A continuación, se detallan las
                siguientes herramientas que el sitio utiliza:
              </p>
              <ul>
                <li>
                  Google Analytics — Análisis de tráfico y comportamiento en el
                  sitio
                </li>
                <li>
                  Microsoft Clarity — Mapas de calor, grabaciones de sesión y
                  análisis de usabilidad
                </li>
                <li>
                  Google Tag Manager — Gestión y despliegue de etiquetas de
                  seguimiento
                </li>
                <li>
                  Meta Pixel (Facebook/Instagram) — Medición de conversiones y
                  creación de audiencias en plataformas Meta
                </li>
                <li>
                  LinkedIn Insight Tag — Medición de campañas y retargeting en
                  LinkedIn
                </li>
                <li>
                  Google Ads (Remarketing) — Medición de conversiones y campañas
                  de remarketing en la red de Google
                </li>
              </ul>
              <p>
                Usted puede gestionar o deshabilitar las cookies directamente
                desde la configuración de su navegador. La desactivación de
                algunas cookies puede afectar la funcionalidad del sitio.
              </p>
              <p>
                Al continuar navegando en el sitio, usted consiente el uso de
                dichas tecnologías en los términos del presente Aviso de
                Privacidad.
              </p>

              <h2>5. Transferencias de datos a terceros</h2>
              <p>
                El Responsable podrá transferir sus datos personales a terceros
                en los siguientes supuestos:
              </p>
              <ul>
                <li>
                  Plataformas de CRM y gestión de relaciones comerciales, con el
                  fin de dar seguimiento a la relación con clientes y
                  prospectos. Dichas transferencias no requieren consentimiento
                  conforme a los supuestos previstos en el artículo 37 de la
                  LFPDPPP.
                </li>
                <li>
                  Proveedores de servicios tecnológicos que actúan como
                  encargados del tratamiento bajo instrucción del Responsable y
                  con obligaciones de confidencialidad equivalentes
                </li>
                <li>
                  Autoridades competentes, en los casos previstos por la
                  legislación mexicana aplicable
                </li>
              </ul>
              <p>
                Dichas transferencias se realizan únicamente cuando resultan
                necesarias para las finalidades descritas en este Aviso, y los
                terceros receptores asumen las mismas obligaciones de protección
                de datos.
              </p>

              <h2>
                6. Opciones para limitar el uso o divulgación de sus datos
              </h2>
              <p>
                Usted puede limitar el uso o divulgación de sus datos personales
                enviando una solicitud a hola@responsable.net, indicando
                claramente la limitación deseada.
              </p>

              <h2>7. Derechos ARCO y cómo ejercerlos</h2>
              <p>
                Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse
                (Derechos ARCO) al tratamiento de sus datos personales, así como
                a revocar el consentimiento otorgado. Para ejercer cualquiera de
                estos derechos, puede enviar su solicitud a:
                hola@responsable.net
              </p>
              <p>
                Su solicitud deberá incluir: nombre completo, correo electrónico
                de contacto, descripción clara del derecho que desea ejercer y,
                en su caso, los datos a rectificar o la finalidad respecto de la
                cual desea oponerse.
              </p>
              <p>
                El Responsable dará respuesta en un plazo no mayor a 20 días
                hábiles para comunicar la determinación adoptada, y en su caso,
                hacerla efectiva dentro de los 15 días hábiles siguientes.
              </p>

              <h2>8. Cambios al presente Aviso de Privacidad</h2>
              <p>
                El Responsable se reserva el derecho de modificar el presente
                Aviso de Privacidad en cualquier momento. Cualquier modificación
                estará disponible en esta misma página web. Se recomienda
                revisar periódicamente este documento.
              </p>

              <h2>9. Fecha de última actualización</h2>
              <p>30 de abril de 2026.</p>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
