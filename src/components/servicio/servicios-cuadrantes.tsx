"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ChevronIcon } from "@/components/icons";
import { ServicioModal } from "@/components/home/servicio-modal";
import { COLORES } from "@/components/home/servicios-rueda";
import { RuedaCuadrantes } from "@/components/servicio/rueda-cuadrantes";
import { irAAncla } from "@/lib/scroll-suave";
import {
  ANCLAS_CUADRANTES as ANCLAS,
  CUADRANTES,
  type Servicio,
} from "@/lib/servicios";

/**
 * Los cuatro cuadrantes del Home, desplegados en vertical y siempre visibles,
 * para /servicio/: nada detrás de clic salvo la ficha de cada servicio (mismo
 * modal que ya abre el panel de la rueda). Sustituye a <ServiciosRueda /> en
 * esa página; el Home conserva la rueda interactiva sin cambios.
 *
 * La rueda que encabeza cada sección la pinta <RuedaCuadrantes />, que
 * reutiliza la geometría exportada de servicios-rueda.tsx. De ahí sale también
 * COLORES, el mapa color↔contraste ya vigente en el resto del sitio, para el
 * acento del título y la píldora de la pestaña activa: así ambas vistas usan
 * los mismos pares de color, sin un segundo mapa que pueda desincronizarse.
 */

/**
 * Separación visible entre el header y la pastilla de pestañas, en px. Es el
 * mismo hueco (12px, pt-3) con el que el header despega su propio pill del
 * borde de la pantalla. Va como número y no como clase porque entra en dos
 * cuentas: el `top` de la pastilla sticky y el margen que se reserva al
 * desplazarse a una sección.
 */
const SEPARACION = 12;

export function ServiciosCuadrantes() {
  const [servicioModal, setServicioModal] = useState<Servicio | null>(null);
  /* Botón que abrió el modal, para devolverle el foco al cerrar. Mismo
     mecanismo que ServiciosRueda (disparador + efecto), reproducido aquí
     porque este componente gestiona su propio modal en vez de compartir el
     de la rueda. */
  const disparador = useRef<HTMLButtonElement | null>(null);

  /* Pastilla de pestañas: su alto real hace falta al desplazarse a una sección
     (para que no tape el destino al llegar), así que se mide sobre el nodo en
     el momento del clic y no se cablea. */
  const pastillaRef = useRef<HTMLElement>(null);
  /* Centinela invisible en la posición de flujo de la pastilla: dice si ya
     está pegada bajo el header. Ver el efecto que lo observa. */
  const centinelaRef = useRef<HTMLDivElement>(null);
  const [pegada, setPegada] = useState(false);
  /* Alto real del header, para el `top` de la barra sticky. El header del
     sitio también es sticky y cambia de alto al desplazarse (fila py-5 →
     pill py-3 con pt-3 por fuera), así que un valor fijo dejaría hueco en un
     estado y solapamiento en el otro. */
  const [altoHeader, setAltoHeader] = useState(0);
  /* Cuadrante que ocupa la franja de lectura del viewport. Arranca en 0: por
     encima de la primera sección la barra aún no está pegada al header, y la
     primera pestaña es la lectura correcta de "por dónde vas". */
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    if (servicioModal === null && disparador.current) {
      disparador.current.focus();
      disparador.current = null;
    }
  }, [servicioModal]);

  /*
    ResizeObserver y no el evento de scroll: lo que importa es el alto del
    header, no la posición de la página. Observando su caja de borde se
    recogen tanto el cambio de estado normal↔pill como los fotogramas
    intermedios de su transición de 300ms —así la barra acompaña al header en
    vez de saltar al final— y también los reflows por cambio de ancho de
    ventana, que ningún listener de scroll vería.
  */
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const medir = () => setAltoHeader(header.getBoundingClientRect().height);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(header, { box: "border-box" });
    return () => observador.disconnect();
  }, []);

  /*
    ¿Está la pastilla ya pegada bajo el header? Con IntersectionObserver sobre
    un centinela y no leyendo posiciones en cada scroll: el centinela ocupa la
    posición de flujo de la pastilla, y el recorte superior del root —el alto
    real del header más la separación— es exactamente la línea a la que la
    pastilla se pega. Mientras el centinela quede por debajo de esa línea, la
    pastilla está suelta; en cuanto la cruza, está pegada.

    El margen inferior desmesurado extiende el root muy por debajo del
    viewport: sin él, un centinela que aún no ha entrado en pantalla tampoco
    intersecaría y se leería como "pegada" desde lo alto de la página.

    Depende de altoHeader porque el header cambia de alto: el observador se
    recrea con cada valor nuevo, que son un puñado durante su transición y
    ninguno el resto del tiempo.
  */
  useEffect(() => {
    const centinela = centinelaRef.current;
    if (!centinela) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setPegada(!entrada.isIntersecting),
      { rootMargin: `-${Math.round(altoHeader) + SEPARACION}px 0px 9999px 0px` },
    );
    observador.observe(centinela);
    return () => observador.disconnect();
  }, [altoHeader]);

  /*
    Pestaña activa por IntersectionObserver y no por cálculos atados al scroll:
    el navegador ya sabe qué secciones cruzan la franja y avisa solo cuando
    eso cambia.

    rootMargin recorta el viewport a una banda fina alrededor de su 45% —la
    altura de lectura—, no a la línea justo bajo la barra: en porcentaje no
    hay que recalcularla cada vez que el header cambia de alto, y con cuatro
    secciones largas siempre hay exactamente una cruzándola. El conjunto
    `visibles` existe para el instante en que dos se solapan en la banda (el
    borde entre secciones): gana la primera en orden de documento, que es la
    que se está dejando atrás, en vez de depender del orden en que lleguen
    las entradas. Si no cruza ninguna —por encima de la primera sección o por
    debajo de la última— se conserva la última marcada.
  */
  useEffect(() => {
    const secciones = ANCLAS.map((id) => document.getElementById(id)).filter(
      (nodo): nodo is HTMLElement => nodo !== null,
    );
    if (secciones.length === 0) return;

    const visibles = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visibles.add(entrada.target.id);
          else visibles.delete(entrada.target.id);
        }
        const indice = ANCLAS.findIndex((id) => visibles.has(id));
        if (indice !== -1) setActivo(indice);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secciones.forEach((seccion) => observador.observe(seccion));
    return () => observador.disconnect();
  }, []);

  /*
    Las pestañas son navegación dentro de la página, no un conmutador: las
    cuatro secciones siguen apiladas y visibles, y el clic solo desplaza. Van
    en <a href="#id"> para que sigan funcionando sin JS (salto nativo, con el
    scroll-mt de cada sección haciendo de margen); con JS se intercepta y se
    pasa por irAAncla, el mismo mecanismo que el header, pasándole el alto
    medido de la barra además del del header.
  */
  function irACuadrante(
    event: ReactMouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    const altoPastilla = pastillaRef.current?.getBoundingClientRect().height ?? 0;
    if (irAAncla(id, altoPastilla + SEPARACION)) event.preventDefault();
  }

  function abrirServicio(servicio: Servicio, boton: HTMLButtonElement) {
    disparador.current = boton;
    setServicioModal(servicio);
  }

  return (
    <>
      {/*
        Centinela de la posición de flujo de la pastilla, para saber si ya
        está pegada. h-0 en el contenedor: no ocupa nada en el flujo, así que
        no abre ningún hueco entre secciones; el 1px real que el observador
        necesita como diana va absoluto y sin pintar, fuera del flujo.
        (Un objetivo de altura cero no es diana fiable: varios navegadores
        nunca lo dan por intersecado.)
      */}
      <div className="relative h-0">
        <div
          ref={centinelaRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
        />
      </div>

      {/*
        Pastilla flotante de pestañas: blanca, de esquinas completamente
        redondeadas y con sombra suave, para que se lea como una pieza que
        flota sobre el contenido. Toma del pill del header solo la forma y la
        idea de pieza suelta y centrada, y se queda deliberadamente por debajo
        de él: tipografía un escalón menor (text-xs frente a text-sm), altura
        bastante menor y ancho contenido, nunca a ancho completo del viewport.

        El envoltorio sticky mide h-0 y no pinta nada: no ocupa alto en el
        flujo, así que entre la sección de arriba y la de abajo no queda
        ninguna franja —antes sí, y por ahí se veía el blanco del <body>
        cruzando la página de lado a lado—. La pastilla desborda hacia abajo y
        flota sobre el relleno superior de la primera sección, con el contenido
        de la página visible a ambos lados.

        `top` en línea y no como clase porque es un valor medido: el alto real
        del header —que cambia entre sus dos estados— más la separación entre
        ambas piezas. Al no ocupar sitio en el flujo, ese hueco ya no entra
        solo en el margen de irAAncla y se le pasa sumado a mano.

        px-6 lg:px-10 y no un valor propio: es el mismo padding lateral que
        llevan las secciones de esta página, así que en el estado suelto —donde
        la pastilla se abre hasta --container— sus bordes caen exactamente
        sobre la retícula del contenido, alineados con "Nuestros Servicios" y
        con las tarjetas de servicios. De paso deja más margen lateral en móvil
        del que dejaba el px-4 anterior.

        pointer-events: el envoltorio ocupa todo el ancho pero solo se ve la
        pastilla; sin esto, las bandas transparentes a izquierda y derecha
        interceptarían los clics del contenido que pasa por debajo.

        z-40 la deja por debajo del header (z-50) y de su panel deslizante y
        los modales (z-60), y por encima del contenido de las secciones.
      */}
      <div
        style={{ top: altoHeader + SEPARACION }}
        className="pointer-events-none sticky z-40 h-0 px-6 lg:px-10"
      >
        {/*
          Dos anchos, no uno. Suelta en el flujo mide --container, el mismo
          ancho que la retícula de contenido de la página, así que sus bordes
          se alinean con los del texto y las tarjetas. Al pegarse bajo el
          header se recoge al ancho compacto, que es el que le corresponde
          cuando comparte franja con él. La transición va sobre max-width y no
          sobre width —mismo recurso que el header para pasar de barra a
          pill—: son dos longitudes, así que interpola de forma continua, cosa
          que no haría un width:fit-content.

          36rem (576px) para el estado pegado, y no menos: el ancho mínimo en
          el que las cuatro pestañas entran completas son 509px, medidos sobre
          los avances reales de Poppins Medium a 12px (87.3 + 86.5 + 99.4 +
          116.1 de texto, más 24px de px-3 por pestaña, 4px de gap entre ellas
          y el px-1.5 de la propia pastilla). Los ~67px que sobran son margen
          deliberado: mientras la webfont carga se compone con la de respaldo,
          de métricas parecidas pero no idénticas, y un ajuste al milímetro
          asomaría una barra de scroll durante ese intervalo. La cuenta es
          solo horizontal: el relleno vertical de la pastilla y de las pestañas
          se subió después sin tocarla, y por eso sigue siendo válida. Cambiar
          el cuerpo, el peso, el relleno horizontal o las etiquetas sí obliga a
          rehacerla.

          overflow-x-auto: por debajo de sm las cuatro preguntas no caben en la
          pastilla, y antes que encogerlas hasta lo ilegible se desplazan en
          horizontal dentro de ella; ahí las pestañas van a su ancho natural
          (flex-none). Desde sm se reparten el ancho a partes iguales
          (sm:flex-1) y no llega a activarse en ningún ancho de escritorio: el
          hueco disponible más estrecho posible son los 592px de un viewport
          de 640px con este padding, por encima de los 509px que exige el
          contenido, y el estado pegado se queda en 576px, también por encima.
        */}
        <nav
          ref={pastillaRef}
          aria-label="Cuadrantes de servicios"
          className={`pointer-events-auto mx-auto overflow-x-auto rounded-full bg-white p-1.5 shadow-sm transition-[max-width] duration-300 ease-out ${
            pegada ? "max-w-[36rem]" : "max-w-[var(--container)]"
          }`}
        >
          <ul className="flex items-center gap-1">
            {CUADRANTES.map((cuadrante, index) => {
              const color = COLORES[cuadrante.colorToken];
              const activa = index === activo;
              return (
                <li key={cuadrante.numero} className="flex-none sm:flex-1">
                  <a
                    href={`#${ANCLAS[index]}`}
                    onClick={(event) => irACuadrante(event, ANCLAS[index])}
                    aria-current={activa ? "true" : undefined}
                    /*
                      La pestaña activa se marca con una píldora del color
                      pleno de su cuadrante —los mismos cuatro colores que ya
                      identifican al cuadrante en la rueda y en el acento del
                      título—, no con un subrayado: dentro de una pastilla de
                      esquinas redondeadas, una píldora concéntrica encaja y
                      una línea al pie no.

                      transition-colors en las cuatro, activa o no: al cambiar
                      de sección el fondo de la que sale se funde a
                      transparente mientras el de la que entra aparece, así que
                      el color se mueve por la pastilla en vez de saltar.

                      text-black y no navy ni ink: el mismo texto pasa por los
                      cuatro fondos, así que hace falta un color que cumpla el
                      mínimo AA (4.5:1 a este cuerpo) en los cuatro, y solo el
                      negro lo hace. Contrastes medidos, sobre amarillo /
                      magenta / lavanda / teal:
                        negro  12.07 · 4.89 · 6.20 · 7.99   ✔ los cuatro
                        ink     9.66 · 3.91 · 4.96 · 6.40   ✘ magenta
                        navy    7.96 · 3.22 · 4.09 · 5.27   ✘ magenta, lavanda
                        blanco  1.74 · 4.30 · 3.39 · 2.63   ✘ tres de cuatro
                      (COLORES[].texto no sirve aquí: da el color de contraste
                      de cada cuadrante por separado, y este texto es uno solo
                      bajo un fondo que cambia.)
                    */
                    className={`font-head block rounded-full px-3 py-2.5 text-center text-xs font-medium whitespace-nowrap transition-colors duration-300 ease-out ${
                      activa
                        ? `${color.fondo} text-black`
                        : "text-ink-soft hover:text-navy"
                    }`}
                  >
                    {cuadrante.pregunta}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {CUADRANTES.map((cuadrante, index) => {
        const color = COLORES[cuadrante.colorToken];
        const tituloId = `${ANCLAS[index]}-title`;

        return (
          <section
            key={cuadrante.numero}
            id={ANCLAS[index]}
            aria-labelledby={tituloId}
            /*
              scroll-mt-36 (9rem) y no el scroll-mt-28 del resto de anclas del
              sitio: aquí el destino tiene encima el header y además la barra
              de pestañas. Solo lo usa el salto nativo del navegador (llegada
              por hash desde otra página, o clic sin JS); el clic en una
              pestaña mide ambas alturas de verdad y no depende de este valor.

              Alterna bg-off-white/bg-white entre cuadrantes, igual que las
              secciones de servicio/[slug]/page.tsx (para-que-sirve, off-white;
              beneficios, blanco): con cuatro secciones seguidas del mismo
              color se leerían como una sola pieza en vez de cuatro distintas.
            */
            className={`scroll-mt-36 px-6 py-[var(--section-y)] lg:px-10 ${
              index % 2 === 0 ? "bg-off-white" : "bg-white"
            }`}
          >
            <div className="mx-auto grid max-w-[var(--container)] gap-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              {/*
                Columna izquierda: mismo ancho de columna de título
                (minmax(0,20rem)) que BloqueTexto en servicio/[slug]/page.tsx,
                para que estas secciones lean como parte de la misma familia
                de páginas de servicio.
              */}
              <div>
                {/* Rueda de posición dentro del ciclo: el segmento de este
                    cuadrante a color pleno y los otros tres atenuados. Bastante
                    menor que la del encabezado de la página, que es la pieza
                    principal y va con los cuatro a color. */}
                <RuedaCuadrantes activo={index} className="size-28" />

                <h2
                  id={tituloId}
                  className={`font-head mt-4 border-l-4 ${color.acento} pl-4 text-2xl font-semibold text-navy`}
                >
                  {cuadrante.pregunta}
                </h2>

                <p className="font-body mt-4 text-ink-soft">
                  {cuadrante.intro}
                </p>
              </div>

              {/*
                Columna derecha: el listado completo de servicios del
                cuadrante, siempre visible. Cada fila es el mismo botón que ya
                usa el panel de la rueda —abre ServicioModal, que decide por
                su cuenta si añade el enlace a la página propia según
                servicio.href/noEnlazable—, así que el comportamiento al
                hacer clic es idéntico, no una reimplementación.
              */}
              <ul className="flex flex-col gap-3">
                {cuadrante.servicios.map((servicio) => (
                  <li key={servicio.nombre}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={(event) =>
                        abrirServicio(servicio, event.currentTarget)
                      }
                      className="font-body flex w-full items-center justify-between gap-4 rounded-sm border border-border bg-white px-4 py-3 text-left text-sm text-ink transition-colors hover:border-magenta"
                    >
                      <span>{servicio.nombre}</span>
                      <ChevronIcon
                        direction="right"
                        className="size-4 shrink-0 text-magenta"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <ServicioModal
        servicio={servicioModal}
        onClose={() => setServicioModal(null)}
      />
    </>
  );
}
