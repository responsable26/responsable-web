import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DESCRIPCION =
  "Términos y condiciones de uso del sitio de ResponSable: alcance de la información publicada y condiciones bajo las que se ofrece.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Términos y Condiciones",
  description: DESCRIPCION,
  /* Mismo criterio que el resto de páginas nuevas: el sitio aún no está en
     producción y no se indexa todavía. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/legal/terminos-y-condiciones/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Términos y Condiciones | ResponSable",
    description: DESCRIPCION,
    url: "/legal/terminos-y-condiciones/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/*
  Transcripción literal del documento publicado en
  https://responsable.net/terminos-y-condiciones/ (WordPress). Es un texto
  legal: no se corrige redacción, ortotipografía, terminología ni fechas.
  Cualquier cambio de contenido sale del cliente, no de aquí.

  Se transcriben tal cual, sin tocarlos, varios defectos del original: el
  apartado "Sitios Web de Terceros" nombra seis veces a "Time Inc." —texto
  ajeno que se copió y nunca se adaptó—, la enumeración del apartado de
  condiciones de acceso salta de la (c) a la (e), y la sección de ley aplicable
  escribe "www.reponsable.net", sin la ese. Están reportados al cliente.

  A diferencia del Aviso de Privacidad, aquí no hubo que reconstruir ninguna
  numeración: el original ya trae los títulos de sección como <h2> reales, y no
  como la cadena de <ol start=N> que el editor visual usaba allí. Tampoco hay
  listas ni subapartados —la única enumeración va en línea dentro de un
  párrafo—, así que el marcado es el mismo que el del original: encabezados y
  párrafos.

  Los enlaces sí se conservan como enlaces, y aquí sí difiere del Aviso de
  Privacidad: allí el correo era texto plano en el original y se dejó como
  texto; aquí son <a> de verdad en el HTML de origen, así que respetarlos es lo
  fiel. La única corrección de marcado —no de texto— es el href del enlace de
  "Protección de datos", que en el original es relativo ("www.responsable.net")
  y por tanto resuelve a una ruta inexistente dentro del propio sitio; se
  normaliza al mismo destino absoluto que usan los otros dos.
*/
export default function TerminosYCondicionesPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* Variante clara de la ruta de navegación, la misma que el Aviso de
            Privacidad, casos-de-exito/[slug] y recursos/articulos/[slug]. */}
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
                  Términos y Condiciones
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Mismo contenedor, misma medida de lectura (68ch) y misma clase
            .articulo-prose que el Aviso de Privacidad y el cuerpo de un
            artículo. */}
        <div className="mx-auto max-w-[calc(var(--container)+3rem)] px-6 py-[var(--section-y)]">
          <article className="max-w-[68ch]">
            <h1 className="font-head text-[clamp(1.9rem,4.2vw,2.9rem)] font-semibold text-balance text-navy">
              Términos y Condiciones
            </h1>

            <div className="articulo-prose mt-8">
              <p>
                <strong>¡Bienvenido a ResponSable.net!</strong>
              </p>
              <p>
                Gracias por utilizar nuestra página y blog{" "}
                <a
                  href="https://www.responsable.net"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.responsable.net
                </a>{" "}
                (“Servicios”). Los Servicios son proporcionados por ProActive
                Strategies S.C (“ResponSable”), ubicado en Álvaro 286 6B Col.
                Roma Norte Del. Cuauhtémoc 06700 México D.F.
              </p>
              <p>
                Nuestros Servicios son muy diversos, de modo que en ocasiones
                podrían ser aplicables condiciones adicionales u otros
                requisitos. Las condiciones adicionales estarán disponibles
                junto con los Servicios pertinentes y formarán parte de su
                contrato con nosotros al utilizar tales Servicios.
              </p>
              <p>
                Mediante la utilización de nuestros Servicios usted está
                aceptando estas condiciones. Por favor, léalas detenidamente.
              </p>
              <p>
                Se establece además que los Términos y Condiciones podrán ser
                modificados en todo o en parte por ResponSable, y dichos cambios
                e implementación tendrán vigencia a partir del momento mismo en
                que sean publicados o insertados en este sitio o desde que sean
                notificados al usuario por cualquier medio, lo que primero
                ocurra. Por lo expuesto, aconsejamos que nos visite
                periódicamente.
              </p>

              <h2>Uso de nuestros Servicios</h2>
              <p>
                Debe seguir las políticas disponibles para usted dentro de los
                Servicios.
              </p>
              <p>
                No utilice nuestros Servicios de forma indebida. Por ejemplo, no
                interfiera en nuestros Servicios ni intente acceder a ellos por
                otro método diferente a la interfaz y las instrucciones que le
                proporcionamos. Puede utilizar nuestros Servicios solo como se
                permite por ley, incluidas las leyes y regulaciones
                correspondientes de control de exportación y reexportación.
                Podremos suspender o dejar de proveerle nuestros Servicios si
                usted incumple nuestras condiciones o políticas o si estamos
                investigando una presunta conducta indebida.
              </p>
              <p>
                En relación con su uso de los Servicios, podremos enviarle
                anuncios del servicio, mensajes administrativos y otra
                información. Usted podrá rechazar algunas de dichas
                comunicaciones.
              </p>

              <h2>Condiciones de acceso y utilización del sitio web</h2>
              <p>
                Usted se compromete a hacer un uso de esta página única y
                exclusivamente para actividades lícitas y a comportarse de
                acuerdo con los fines, términos y condiciones aquí establecidos.
                Por lo tanto, ResponSable se guarda el derecho de retirar
                cualquier comentario con fines o efectos ilícitos, ilegales,
                contrarios a lo establecido en las presentes Condiciones
                Generales, a la buena fe y al orden público, lesivos de los
                derechos e intereses de terceros, o que de cualquier forma
                puedan resultar ofensivos en sentido amplio.
              </p>
              <p>
                Si un usuario o tercero, considera que algún comentario
                publicado en el Blog o alguno de sus enlaces son ilícitos tienen
                las características establecidas en el párrafo anterior deberán
                comunicarlo en la mayor brevedad posible a la dirección{" "}
                <a href="mailto:hola@responsable.net">hola@responsable.net</a>
              </p>
              <p>
                Usted se obliga a usar los Contenidos de una forma lícita en
                general y, en particular, se compromete a abstenerse de (a)
                utilizar los Contenidos de forma, con fines o efectos contrarios
                a la ley, a la moral y a las buenas costumbres generalmente
                aceptadas o al orden público; (b) reproducir o copiar,
                distribuir, transformar o modificar los Contenidos, (c) emplear
                los Contenidos con fines económicos, venta directa o con
                cualquier otra clase de finalidad comercial, mensajes no
                solicitados dirigidos a una pluralidad de personas con
                independencia de su finalidad, así como a abstenerse de
                comercializar o divulgar de cualquier modo dicha información;
                (e) publicar cualquier contenido amenazante, injurioso,
                calumnioso, obsceno, pornográfico o que de otro modo infrinja la
                Ley.
              </p>
              <p>
                <strong>Sitios Web de Terceros.</strong> Usted puede enlazar
                (link) del Sitio Web a sitios web de terceros y terceros pueden
                enlazarse al Sitio Web («Sitios Enlazados»). Usted reconoce y
                está de acuerdo en que nosotros no tenemos responsabilidad sobre
                la información, contenido, productos, servicios, anuncios,
                códigos u otros materiales que puedan o no puedan ser
                proporcionados por o a través de los Sitios Enlazados, aún si
                son propiedad de o son dirigidos por afiliados nuestros. Los
                enlaces (links) a Sitios Enlazados no constituyen un aval o
                patrocinio nuestro de dichos sitios web o de la información,
                contenido, productos, servicios, anuncios, códigos u otros
                materiales presentados en o a través de dichos sitios web. La
                inclusión de cualquier enlace a dichos sitios en nuestro Sitio
                no implica el aval, patrocinio o recomendación de ese sitio de
                Time Inc. Time Inc. rechaza cualquier responsabilidad por los
                enlaces (1) de otro sitio web a este Sitio Web y (2) a otro
                sitio web de este Sitio Web. Time Inc. no puede garantizar los
                estándares de cualquier sitio web al cual se le proporcionen
                enlaces en este Sitio Web, ni será Time Inc. responsable de los
                contenidos de dichos sitios, o de cualquier enlace subsecuente.
                Time Inc. no representa o garantiza que los contenidos del sitio
                web de algún tercero sean exactos, que cumplan con la ley
                estatal o federal, o que cumplan con las leyes de derechos de
                autor o con otras leyes de propiedad intelectual. Time Inc.
                tampoco es responsable de cualquier forma de transmisión
                recibida de cualquier sitio web enlazado. Cualquier confianza
                depositada en los contenidos de un sitio web de terceros es
                hecha por su propio riesgo y usted asume todas las
                responsabilidades y consecuencias que resulten de dicha
                confianza.
              </p>

              <h2>Su cuenta de ResponSable</h2>
              <p>
                En algunos casos es necesario crear una cuenta de ResponSable
                para utilizar algunos de nuestros Servicios. Usted podrá crear
                su propia cuenta de ResponSable.
              </p>
              <p>
                Para proteger su cuenta de ResponSable, mantenga la
                confidencialidad de su contraseña. Usted es responsable de la
                actividad que se desarrolle en su cuenta de ResponSable o a
                través de ella. Intente no reutilizar la contraseña de su cuenta
                de ResponSable en aplicaciones de terceros.
              </p>

              <h2>Protección de datos</h2>
              <p>
                En cumplimiento de la Ley de Protección de Datos de Carácter
                Personal, se informa que los datos obtenidos a través de nuestra
                página y blog{" "}
                <a
                  href="https://www.responsable.net"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.responsable.net
                </a>{" "}
                se almacenarán en ficheros automatizados y no automatizados,
                propiedad de ResponSable a los cuales se les dará el tratamiento
                estipulado por la Ley de Protección de Datos.
              </p>
              <p>
                Los usuarios responderán en cualquier caso, de la veracidad de
                los datos facilitados, reservándose la Entidad el derecho a
                excluir a todo usuario que haya facilitado datos falsos o
                erróneos, sin perjuicio de las demás acciones que procedan en
                Derecho.
              </p>
              <p>
                La presente Política de Privacidad puede ser modificada
                atendiendo escrupulosamente tanto a posibles cambios
                legislativos que se produzcan, como a las directrices emanadas
                de los agentes regulatorios correspondientes.
              </p>

              <h2>Propiedad intelectual</h2>
              <p>
                Se entenderá por contenidos a todas los comentarios, mensajes,
                gráficos, dibujos, diseños, logotipos, nombres, marcas, archivos
                de sonido y/o imagen, fotografías, grabaciones, software y, en
                general, cualquier clase de material accesible a través de
                www.responsable.net Dichos contenidos están protegidos por la
                legislación vigente en materia de propiedad intelectual. Se
                prohíbe expresamente la copia, modificación, reproducción,
                descarga, transmisión, distribución o transformación de los
                contenidos de la página, sin la previa autorización del titular
                de los correspondientes derechos o se encuentre legalmente
                permitido.
              </p>
              <p>
                El uso de nuestros Servicios no otorga derecho de propiedad
                intelectual alguno sobre nuestros Servicios o contenido al que
                acceda. No podrá utilizar el contenido de nuestros Servicios a
                menos que obtenga el permiso de su propietario o que ello esté
                permitido por ley. Estas condiciones no le otorgan el derecho de
                utilizar marca o logotipo alguno utilizado en nuestros
                Servicios. No elimine, oculte ni modifique ningún aviso legal
                mostrado en nuestros Servicios o junto a ellos.
              </p>

              <h2>Responsabilidad por el funcionamiento del blog</h2>
              <p>
                ResponSable podrá, cuando lo considere conveniente, realizar
                correcciones, mejoras o modificaciones en la información
                contenida en el Blog sin que ello de lugar, ni derecho a ninguna
                reclamación o indemnización, ni implique reconocimiento de
                responsabilidad alguna. Tampoco se hará responsable por los
                daños y perjuicios de cualquier naturaleza que se pudieran
                derivar de la disponibilidad y continuidad técnica del
                funcionamiento de la página.
              </p>

              <h2>Uso de cookies</h2>
              <p>
                Las cookies de{" "}
                <a
                  href="https://www.responsable.net"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.responsable.net
                </a>{" "}
                se usan para personalizar el contenido y analizar el tráfico
              </p>

              <h2>Información que recolectamos</h2>
              <p>
                Responsable.net, adicional a la información que el usuario nos
                proporciona, recolecta información como dirección IP, tipo de
                navegador, tiempo de duración de la visita en el sitio, veces
                que se visita el sitio, preferencias de configuración, páginas
                visitadas en el sitio, localización, etc.
              </p>
              <p>
                Dicha información se utiliza para fines estadísticos y de mejora
                en la calidad de los Servicios.
              </p>

              <h2>Ley y jurisdicción aplicable</h2>
              <p>
                Las presentes Condiciones de este aviso legales se rigen por las
                Leyes mexicanas. Cualquier disputa en relación con
                www.reponsable.net se sustanciará ante la jurisdicción mexicana,
                sometiéndose las partes a la Jurisdicción de los Juzgados y
                Tribunales de la Ciudad de México y sus superiores jerárquicos,
                con expresa renuncia a sus fueros si lo tuvieren y fueran
                diferentes de los reseñados.
              </p>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
