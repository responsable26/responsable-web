import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaContacto } from "@/components/cta-contacto";
import { RuedaCuadrantes } from "@/components/servicio/rueda-cuadrantes";
import { POSTER_HERO, VIDEO_HERO } from "@/lib/video-hero";

const DESCRIPCION =
  "Consultoría en sostenibilidad y RSE desde 2011. Acompañamos a más de 200 empresas en México y Latinoamérica a convertir la sostenibilidad en decisiones de negocio.";

export const metadata: Metadata = {
  // Sin sufijo de marca: lo añade el template del layout raíz.
  title: "Conócenos",
  description: DESCRIPCION,
  alternates: { canonical: "/nosotros/" },
  openGraph: {
    type: "website",
    siteName: "ResponSable",
    // El openGraph sí lo lleva: el template solo alcanza a metadata.title.
    title: "Conócenos | ResponSable",
    description: DESCRIPCION,
    url: "/nosotros/",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Los siete pasos de RESILIO, en orden. La inicial va suelta del nombre para
 * poder pintarla en grande: puestos en fila, los siete iniciales deletrean la
 * palabra, que es la relación que la sección tiene que dejar evidente.
 *
 * No se deriva la inicial con nombre[0] aunque hoy coincida en los siete: si
 * algún paso cambiara de nombre, una inicial calculada rompería el acrónimo en
 * silencio, mientras que dos campos separados dejan el desajuste a la vista.
 */
const PASOS_RESILIO = [
  { inicial: "R", nombre: "Reflexionar" },
  { inicial: "E", nombre: "Estudiar" },
  { inicial: "S", nombre: "Solicitar" },
  { inicial: "I", nombre: "Institucionalizar" },
  { inicial: "L", nombre: "Lograr" },
  { inicial: "I", nombre: "Informar" },
  { inicial: "O", nombre: "Optimizar" },
];

/**
 * Los cinco puntos de "Lo que hacemos distinto", literales como los entregó el
 * cliente. Fuera del JSX para que el marcado de la lista se lea de un vistazo.
 */
const DIFERENCIALES = [
  "Integramos sostenibilidad, negocio y grupos de interés en una misma conversación.",
  "Convertimos temas complejos en prioridades claras, decisiones accionables y rutas viables de implementación.",
  "Aterrizamos una metodología robusta según el nivel de madurez, los riesgos, las capacidades y los objetivos de cada empresa.",
  "Combinamos rigor técnico con criterio ejecutivo, para facilitar conversaciones de alto nivel y decisiones bien sustentadas.",
  "Acompañamos todo el proceso, desde el diagnóstico y la definición de prioridades hasta la implementación y la comunicación.",
];

/**
 * Imagen de la sección "Lo que hacemos distinto". Tres estados:
 *
 * - "provisional" (HOY): la imagen no se ha entregado. En su lugar se pinta un
 *   bloque navy sólido, sin texto ni imagen y con las mismas medidas que la
 *   imagen real, para que el cliente vea la maqueta a dos columnas. PROVISIONAL: sustituir por la imagen real en cuanto llegue.
 * - { src, alt }: la imagen real. Sustituye al bloque sin tocar nada más.
 * - null: sin columna de imagen; la sección vuelve a una sola columna.
 *
 * QUÉ ENTREGAR: 4:5, 1200×1500, con el motivo centrado. En escritorio la caja
 * se estira a la altura del texto (en torno a 4:5) y en móvil y tablet se
 * recorta a 16:10, así que lo importante tiene que caber en la franja central.
 * El archivo va en /public y `src` es su ruta absoluta; `alt` vacío si la
 * imagen es decorativa y no aporta nada que el texto no diga.
 *
 * Declarada con `as` y no con anotación: con una anotación TypeScript la
 * estrecharía al valor asignado y las otras ramas no compilarían.
 */
type ImagenDiferenciales = { src: string; alt: string } | "provisional" | null;
const IMAGEN_DIFERENCIALES = "provisional" as ImagenDiferenciales;

/** Cifras de la banda. El valor va suelto del texto para poder darle su escala.
 *  Cifras y rótulos salen del documento de credenciales del cliente, que es la
 *  fuente: si cambian, se cambian allí primero. */
const CIFRAS = [
  { valor: "+600", etiqueta: "Proyectos de consultoría y capacitación" },
  { valor: "+200", etiqueta: "Empresas acompañadas en México y Latinoamérica" },
  { valor: "+15", etiqueta: "Años diseñando soluciones estratégicas en sostenibilidad" },
];

export default function NosotrosPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="bg-off-white px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            {/*
              El flanco derecho del encabezado lo ocupa la rueda, que antes
              quedaba vacío. Dos columnas desde md, con la rueda en una columna
              dimensionada al contenido (auto) y no a una fracción: manda ella
              su tamaño y el texto se queda con el resto. items-center las
              equilibra en vertical.
            */}
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
              <div>
                <p className="font-head text-[0.78rem] font-semibold tracking-[0.12em] text-magenta uppercase">
                  Conócenos
                </p>
                <h1 className="font-head mt-3 max-w-[26ch] text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-balance text-navy">
                  Desde 2011 hacemos sostenibilidad con sentido de negocio
                </h1>

                {/*
              El primer párrafo va como entradilla, a mayor cuerpo, y los ocho
              restantes en dos columnas desde lg, cuatro por columna. El
              original era un bloque corrido a ancho completo, difícil de
              entrar.
            */}
                {/* 752px = 68 caracteres a los 17.6px de este párrafo, la medida de
                  lectura única del sitio. En px y no en ch: el ch resolvería
                  contra los 16px heredados del cuerpo. */}
                <p className="font-body mt-8 max-w-[752px] text-[1.1rem] text-ink-soft">
                  En ResponSable acompañamos a empresas que quieren dejar atrás
                  una sostenibilidad dispersa, reactiva o difícil de justificar.
                  Les ayudamos a entender mejor su contexto, priorizar con
                  rigor, fortalecer relaciones con sus grupos de interés y
                  traducir la sostenibilidad en decisiones que protegen la
                  operación, generan valor y construyen resiliencia.
                </p>
              </div>

              {/*
                La rueda entera con sus cuatro etiquetas: los cuatro segmentos a
                color pleno —aquí no hay cuadrante elegido que destacar— más el
                isotipo del centro. Gráfico y nada más: aria-hidden, sin
                animación y sin interacción, a diferencia de la del Home, que al
                pulsarla abre el panel de servicios. En esta página no hay panel
                que abrir.

                24rem (384px) frente a los 420px del Home: menor, como se pidió,
                y a la vez suficiente para que las etiquetas se lean. El cuerpo
                del texto va en unidades del viewBox de 400, así que el tamaño
                real es 14.5 × (ancho/400): 13.9px aquí y 12.8px en el escalón
                de md. Bajar mucho más de ahí dejaría las preguntas ilegibles,
                que es lo que decide el suelo de este tamaño.

                hidden md:block, y no apilada bajo el texto en móvil: es
                decorativa y va aria-hidden, así que no aporta nada que el texto
                no diga, y allí el encabezado ya lo sigue el banner de video. Dos
                piezas gráficas grandes seguidas, antes de la primera línea de la
                historia, empujarían el contenido real fuera de pantalla. A eso
                se suma que las etiquetas curvas son justo lo que peor se lee a
                ese tamaño. En pantallas anchas no cuesta nada: ocupa una columna
                que si no quedaría vacía.
              */}
              <RuedaCuadrantes
                etiquetas
                className="hidden w-full max-w-[22rem] md:block lg:max-w-[24rem]"
              />
            </div>

            {/*
              Banner de la historia, a ancho completo del contenedor de
              contenido: al vivir dentro del max-w-[var(--container)] de la
              sección, sus bordes caen sobre la misma retícula que el título y
              los párrafos.

              El contenedor fija la caja —proporción, esquinas redondeadas y
              recorte— y el video la rellena en absoluto con object-cover, así
              que la proporción no depende de la del archivo.

              Dos proporciones. En pantallas anchas, 21/9 (~480px de alto sobre
              el contenedor de 1120px): apaisada pero con cuerpo, para que se
              lea como banner y no como una franja. Por debajo de md se abre a
              16/10 —la misma de las tarjetas de artículo y de caso— porque a
              ~330px de ancho el 21/9 dejaría una tira de 140px, y el objetivo
              en móvil no es recortar altura sino no dispararla: 16/10 da unos
              205px, un bloque proporcionado que no empuja el texto fuera de
              pantalla.

              Es el mismo metraje que los heroes, tomado de VIDEO_HERO para no
              repetir la ruta, y con su mismo póster para que no quede un hueco
              vacío mientras carga.

              Sin `controls`: no hay barra, ni botón de play, ni ninguna
              interfaz encima. Es un elemento visual, no un reproductor, de ahí
              también aria-hidden y tabIndex -1 —mismo tratamiento que el video
              de HeroFramed—: no aporta información y no debe recibir el foco.
            */}
            <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded bg-navy md:aspect-[21/9]">
              <video
                className="absolute inset-0 size-full object-cover"
                src={VIDEO_HERO}
                poster={POSTER_HERO}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>

            {/*
              Reparto 3 y 3: en una rejilla de dos columnas la lectura baja por
              la izquierda y sigue por la derecha, así que el orden del cliente
              se conserva. El corte va por la mitad del conteo, que con este
              texto es también el reparto más parejo en alto: los dos párrafos
              largos, el 2 y el 6, caen uno en cada columna, y la izquierda
              queda solo un par de líneas por encima. Cualquier otro corte que
              respete el orden (2 y 4, o 4 y 2) deja una columna al doble de la
              otra.
            */}
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col gap-8">
                <p className="font-body text-ink-soft">
                  ResponSable nació de una convicción: la sostenibilidad solo
                  genera valor cuando deja de ser un esfuerzo aislado y empieza
                  a formar parte de las decisiones reales del negocio.
                </p>
                <p className="font-body text-ink-soft">
                  Durante años, muchas empresas entendieron la responsabilidad
                  social como un conjunto de acciones valiosas, pero dispersas:
                  programas comunitarios, voluntariado, donativos, reportes,
                  iniciativas ambientales. Demostraban compromiso, pero rara vez
                  estaban conectadas con prioridades estratégicas, riesgos,
                  grupos de interés o resultados medibles. Después el entorno se
                  volvió exigente. Clientes, inversionistas, cadenas de
                  suministro, comunidades, autoridades y equipos internos
                  empezaron a pedir más. Ya no bastaba con hacer cosas buenas:
                  había que demostrar por qué importaban.
                </p>
                <p className="font-body text-ink-soft">
                  Desde 2011, cuando muchas empresas aún trataban la RSE como
                  programas aislados, ResponSable construyó una forma distinta
                  de acompañarlas. Una forma que combina estrategia, escucha,
                  análisis, gestión social y comunicación clara. No para hacer
                  más sostenibilidad, sino para hacer la sostenibilidad
                  correcta: la que ayuda a priorizar, anticipar riesgos, cuidar
                  la licencia social para operar y enfocar recursos donde
                  realmente generan valor.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <p className="font-body text-ink-soft">
                  Hemos acompañado a más de 200 empresas en México y
                  Latinoamérica, en distintos niveles de madurez y sectores.
                  Algunas apenas empiezan a ordenar su sostenibilidad. Otras
                  buscan elevar la sofisticación de su estrategia, responder a
                  mayores exigencias o demostrar con más claridad el valor de lo
                  que ya hacen.
                </p>
                <p className="font-body text-ink-soft">
                  Nuestro papel no es sustituir a quienes lideran la
                  sostenibilidad dentro de la empresa. Es darles estructura,
                  evidencia y criterio para tomar mejores decisiones, defender
                  prioridades ante la alta dirección, involucrar a otras áreas y
                  avanzar con mayor solidez.
                </p>
                <p className="font-body text-ink-soft">
                  Porque la sostenibilidad bien gestionada deja de ser un gasto
                  y se vuelve una inversión: protege la operación, fortalece
                  relaciones y sostiene la reputación. Y lo que se hace con
                  rigor tiene que comunicarse con claridad, o no construye
                  confianza. Al final, lo que entregamos no son estudios ni
                  reportes: es la capacidad de una empresa para decidir con
                  criterio propio, sostener esas decisiones ante quien las
                  cuestione y seguir operando cuando el entorno se pone difícil.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*
          Dos secciones nuevas entre la historia y la banda de cifras. Sus
          títulos van como h2: el h1 de la página es "Una Historia
          ResponSable", así que este es el nivel que les corresponde.

          Alternan fondo con lo que tienen alrededor —la historia va en
          off-white y la banda de cifras en blanco—, de modo que la secuencia
          queda off-white, blanco, off-white, blanco y cada bloque se lee como
          una pieza aparte y no como una sola tirada de texto.
        */}
        <section
          aria-labelledby="lo-que-hacemos-distinto"
          className="bg-white px-6 py-[var(--section-y)]"
        >
          {/*
            Con imagen, dos columnas desde lg: 5fr para la imagen y 7fr para el
            texto, que con el contenedor a 1280px deja la columna en ~709px,
            unos 67 caracteres del párrafo a 16.8px; las viñetas conservan su
            tope de 68ch. Sin imagen, el contenedor no lleva rejilla y la
            sección queda a una columna.

            En el DOM el texto va primero y la imagen después: así se apila en
            móvil y tablet, con el título abriendo la sección, y el orden de
            lectura coincide con el visual en esos anchos. Desde lg la imagen
            pasa a la primera columna con order-first.
          */}
          <div
            className={`mx-auto max-w-[var(--container)] ${
              IMAGEN_DIFERENCIALES
                ? "grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
                : ""
            }`}
          >
            <div>
              <h2
                id="lo-que-hacemos-distinto"
                className="font-head text-[clamp(1.6rem,4.3vw,2.6rem)] font-semibold text-navy"
              >
                Lo que hacemos distinto
              </h2>
              <p className="font-body mt-6 max-w-[68ch] text-[1.05rem] text-ink-soft">
                No creemos en recetas genéricas. Cada empresa tiene un contexto,
                una operación, una cultura y una relación distinta con sus grupos
                de interés. Por eso partimos de una metodología sólida y la
                llevamos a la realidad de cada organización, para convertir la
                sostenibilidad en decisiones útiles para el negocio.
              </p>

              {/*
                Lista real, no párrafos con guiones: son cinco elementos de una
                enumeración y un lector de pantalla debe anunciarlos como tales.
                El punto es un <span> decorativo con aria-hidden —no un marcador
                de list-style— para poder alinearlo con la primera línea cuando
                el texto ocupa varias.
              */}
              <ul className="mt-8 flex max-w-[68ch] flex-col gap-4">
                {DIFERENCIALES.map((punto) => (
                  <li key={punto} className="font-body flex gap-3 text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-magenta"
                    />
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>
            </div>

            {IMAGEN_DIFERENCIALES === "provisional" ? (
              /*
                PROVISIONAL, ver IMAGEN_DIFERENCIALES. Solo color, con las
                mismas medidas que la caja de la imagen real para que la
                maqueta que se aprueba sea la que se publica: 16:10 en móvil y
                tablet y, desde lg, estirado a la altura de la fila que marca
                el texto. aria-hidden porque no contiene nada.
              */
              <div
                aria-hidden="true"
                className="aspect-[16/10] w-full rounded bg-navy lg:order-first lg:aspect-auto lg:h-full"
              />
            ) : IMAGEN_DIFERENCIALES ? (
              /*
                16:10 en móvil y tablet. Desde lg sin proporción propia: la
                celda se estira a la altura de la fila, que la marca el texto,
                y la imagen la cubre con object-cover. Así no queda hueco bajo
                la imagen ni el texto se estira para igualarla.
              */
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-navy lg:order-first lg:aspect-auto lg:h-full">
                <Image
                  src={IMAGEN_DIFERENCIALES.src}
                  alt={IMAGEN_DIFERENCIALES.alt}
                  fill
                  sizes="(min-width: 1328px) 507px, (min-width: 1024px) calc((100vw - 7rem) * 5 / 12), calc(100vw - 3rem)"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </section>

        <section
          aria-labelledby="nuestra-forma-de-trabajar"
          className="bg-off-white px-6 py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)]">
            <h2
              id="nuestra-forma-de-trabajar"
              className="font-head text-center text-[clamp(1.6rem,4.3vw,2.6rem)] font-semibold text-navy"
            >
              Nuestra forma de trabajar
            </h2>

            {/*
              Centrado, y por eso más estrecho que la medida de lectura del
              sitio: en texto centrado cada línea empieza en un sitio distinto
              y el ojo tiene que buscar el arranque de la siguiente, así que
              conviene una línea más corta que en texto alineado. 632px son
              unos 60 caracteres a los 16.8px de estos párrafos (68 serían
              ~717px). En px y no en ch por lo mismo que la entradilla: el ch
              resolvería contra los 16px heredados y no contra 1.05rem.
            */}
            <div className="mx-auto mt-6 flex max-w-[632px] flex-col gap-4 text-center">
              <p className="font-body text-[1.05rem] text-ink-soft">
                Acompañamos a las empresas a responder las preguntas clave de su
                sostenibilidad: dónde están, hacia dónde deben avanzar, cómo
                implementarlo y cómo comunicarlo con credibilidad.
              </p>
              <p className="font-body text-[1.05rem] text-ink-soft">
                Este enfoque permite reducir dispersión, enfocar prioridades y
                construir una sostenibilidad más estratégica, medible y útil
                para el negocio.
              </p>
              <p className="font-body text-[1.05rem] text-ink-soft">
                Lo hacemos a través de RESILIO, una metodología propia que guía
                el proceso desde la reflexión estratégica y la escucha de grupos
                de interés, hasta la implementación, la comunicación y la mejora
                continua.
              </p>
            </div>

            {/*
              Los siete pasos como secuencia, no como lista suelta: <ol>, y una
              sola tira continua partida por filetes de un píxel —gap-px sobre
              bg-border, el mismo recurso que la ficha de datos de
              servicio/[slug]—, de modo que se leen como tramos de un mismo
              recorrido y no como siete tarjetas independientes.

              La inicial va en grande y en magenta encima de cada nombre: en
              lg, con las siete celdas en fila, esas iniciales deletrean RESILIO
              de izquierda a derecha. Por debajo de lg la tira se apila y el
              acrónimo se lee en vertical, que sigue siendo evidente; se
              prefiere una columna a dos porque siete celdas en dos columnas
              dejarían una huérfana y romperían la lectura de las iniciales.

              La inicial es aria-hidden: es un recurso visual, y el nombre
              completo que va debajo ya la contiene. Sin eso, un lector de
              pantalla diría "R, Reflexionar" siete veces.
            */}
            <ol className="mt-10 grid gap-px overflow-hidden rounded border border-border bg-border lg:grid-cols-7">
              {PASOS_RESILIO.map((paso, index) => (
                <li
                  key={index}
                  className="flex items-baseline gap-3 bg-white px-5 py-4 lg:flex-col lg:items-center lg:gap-1 lg:py-6 lg:text-center"
                >
                  <span
                    aria-hidden="true"
                    className="font-head text-2xl leading-none font-semibold text-magenta lg:text-3xl"
                  >
                    {paso.inicial}
                  </span>
                  <span className="font-head text-sm font-medium text-navy">
                    {paso.nombre}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="cifras"
          className="px-6 py-[var(--section-y)]"
        >
          <div className="mx-auto max-w-[var(--container)]">
            <h2 id="cifras" className="sr-only">
              ResponSable en cifras
            </h2>
            {/*
              Sin tarjetas ni bordes: la cifra y su etiqueta se sostienen solas,
              separadas por una divisoria fina entre columnas.
            */}
            <div className="grid gap-y-10 sm:grid-cols-3">
              {CIFRAS.map((cifra) => (
                <div
                  key={cifra.etiqueta}
                  className="border-border px-2 not-first:sm:border-l lg:px-6"
                >
                  <p className="font-head text-[clamp(2.6rem,7vw,3.8rem)] leading-none font-semibold text-magenta">
                    {cifra.valor}
                  </p>
                  <p className="font-body mt-3 text-sm text-ink-soft">
                    {cifra.etiqueta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
          Misión y visión enfrentadas con la marca en medio. El original las
          colocaba en diagonal —misión arriba a la izquierda, visión abajo a la
          derecha—, lo que dejaba dos huecos vacíos. Aquí comparten fila y el
          isotipo ocupa la columna central, así que la marca separa las dos
          declaraciones en vez de flotar entre huecos.
        */}
        <section className="bg-navy px-6 py-[var(--section-y)]">
          <div className="mx-auto max-w-[var(--container)]">
            {/*
              «Misión» y «Visión» son los encabezados reales de sus bloques, así
              que van como h2 visibles. Antes eran eyebrows con un h2 en sr-only
              por encima, lo que duplicaba el encabezado en el árbol de
              accesibilidad: se leía «Misión y visión» y acto seguido «Misión».
            */}
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
              {/*
                El texto va alineado a la izquierda en los dos bloques: en el de
                Misión, alinearlo a la derecha obligaba a buscar el inicio de
                cada renglón. La convergencia hacia el isotipo se resuelve con la
                posición del bloque —ml-auto lo empuja hacia el centro— y no con
                la alineación de sus líneas.
              */}
              <div className="lg:ml-auto lg:max-w-[34ch]">
                <h2 className="font-head text-[clamp(1.6rem,4vw,2.05rem)] font-semibold text-white">
                  Misión
                </h2>
                <p className="font-body mt-4 text-[1.1rem] text-white/85">
                  En ResponSable acompañamos a empresas a transformar su gestión
                  de sostenibilidad en decisiones estratégicas y relaciones
                  sólidas con sus grupos de interés, optimizando recursos,
                  reduciendo riesgos y fortaleciendo su licencia social para
                  operar.
                </p>
              </div>

              <div className="flex justify-center">
                <Image
                  src="/brand/isotipo.png"
                  alt=""
                  width={500}
                  height={500}
                  sizes="(min-width: 1024px) 128px, 96px"
                  className="size-24 lg:size-32"
                />
              </div>

              <div className="lg:mr-auto lg:max-w-[34ch]">
                <h2 className="font-head text-[clamp(1.6rem,4vw,2.05rem)] font-semibold text-white">
                  Visión
                </h2>
                <p className="font-body mt-4 text-[1.1rem] text-white/85">
                  Ser la consultoría líder en México y Centroamérica en
                  transformar la sostenibilidad en ventaja competitiva, mediante
                  metodologías propias, innovación y excelencia.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaContacto />
      </main>

      <SiteFooter />
    </>
  );
}
