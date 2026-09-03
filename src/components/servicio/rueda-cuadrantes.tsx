"use client";

import { useId } from "react";
import {
  ARROW_TRANSFORM,
  COLORES,
  CUNAS,
  ISOTIPO_HOJAS,
  ISOTIPO_TRANSFORM,
  trazadoEtiqueta,
} from "@/components/home/servicios-rueda";
import { CUADRANTES } from "@/lib/servicios";

/**
 * La rueda de servicios como gráfico, no como control: los cuatro segmentos, el
 * isotipo central y —opcionalmente— las etiquetas curvas de la rueda del Home,
 * sin animación y sin responder a hover, foco ni clic. La del Home abre el
 * panel de servicios al pulsarla; esta no lleva panel detrás en ninguna de sus
 * ubicaciones. Va como aria-hidden porque todo lo que dice ya lo dice el texto
 * que la acompaña en cada sitio donde se usa.
 *
 * Reutiliza la geometría exportada de servicios-rueda.tsx —CUNAS[i].arco y
 * ARROW_TRANSFORM para los segmentos, ISOTIPO_HOJAS e ISOTIPO_TRANSFORM para
 * el isotipo, COLORES para los rellenos—, así que son literalmente los mismos
 * datos que pinta la rueda interactiva y no una copia redibujada.
 *
 * Vive en su propio módulo, y no dentro de servicios-cuadrantes.tsx como al
 * principio, porque ahora lo usan dos sitios: el encabezado de /servicio/ —una
 * página de servidor— y las secciones de cuadrante. El "use client" es
 * obligatorio aunque el componente no tenga estado: importa constantes de un
 * módulo "use client", y un componente de servidor que las importara recibiría
 * referencias de cliente en vez de los objetos.
 *
 * `activo` es el índice del cuadrante que va a color pleno, con los otros tres
 * atenuados; con null van los cuatro a color pleno, que es el estado sin
 * cuadrante elegido todavía.
 *
 * `etiquetas` añade las cuatro preguntas curvadas sobre el cuerpo de cada
 * flecha, con el mismo riel y el mismo color de contraste que la rueda del
 * Home. Va apagado por defecto porque a los tamaños pequeños —las ruedas que
 * encabezan cada sección de /servicio/— el texto no sería legible y el título
 * de al lado ya dice lo mismo.
 *
 * `girando` hace rotar el anillo de flechas, despacio y sin fin. Apagado por
 * defecto y opt-in explícito: cuatro ruedas girando a la vez mientras se hace
 * scroll —una por sección de cuadrante— sería mareante, así que la decisión de
 * animar es de cada ubicación y no del componente. No lo combine con
 * `etiquetas`: al girar el anillo, el texto de la mitad inferior acabaría
 * cabeza abajo.
 */
export function RuedaCuadrantes({
  activo = null,
  etiquetas = false,
  girando = false,
  className,
}: {
  activo?: number | null;
  etiquetas?: boolean;
  girando?: boolean;
  className?: string;
}) {
  /* Prefijo de los id de los rieles de texto. Cada <textPath> apunta al suyo
     por id, y la rueda puede aparecer más de una vez en la misma página —las
     cuatro de /servicio/—, así que no pueden ser fijos. */
  const uid = useId();

  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      {/*
        El giro envuelve solo al anillo de flechas. El isotipo queda fuera de
        este grupo, más abajo, y por eso no rota con él.

        transform-box/transform-origin fijan el eje en el centro del viewBox
        —(200,200), el eje real de la rueda— y no en el de la caja envolvente
        de las flechas, que no tiene por qué coincidir. La animación en sí es
        --animate-rueda-girar (globals.css); motion-reduce:animate-none la
        retira además de la regla global de movimiento reducido.
      */}
      <g
        className={
          girando
            ? "animate-rueda-girar [transform-box:view-box] [transform-origin:50%_50%] motion-reduce:animate-none"
            : undefined
        }
      >
        {CUNAS.map((cuna, index) => {
          const cuadrante = CUADRANTES[index];
          const color = COLORES[cuadrante.colorToken];
          const atenuado = activo !== null && index !== activo;
          const rielId = `${uid}-riel-${index}`;

          return (
            <g key={index} className={atenuado ? "opacity-20" : undefined}>
              <path
                d={cuna.arco}
                transform={ARROW_TRANSFORM}
                className={color.relleno}
              />

              {etiquetas ? (
                <>
                  {/* Riel: no se pinta, solo guía al textPath. */}
                  <path id={rielId} d={trazadoEtiqueta(cuna)} fill="none" />
                  {/*
                  14.5px son unidades del viewBox de 400, no píxeles de
                  pantalla: el tamaño real sale de multiplicarlos por
                  (ancho pintado / 400). Es el mayor de los dos cuerpos que usa
                  la rueda del Home, ya validado contra el riel con la etiqueta
                  más larga —"¿Cómo Comunico?"—, y se usa el mayor a propósito
                  porque aquí la rueda se pinta más pequeña y el texto encoge
                  con ella. Quien la monte tiene que darle ancho suficiente para
                  que el resultado siga siendo legible.
                */}
                  <text
                    className={`font-head [font-size:14.5px] font-semibold ${color.texto}`}
                    dominantBaseline="middle"
                    textAnchor="middle"
                  >
                    <textPath
                      href={`#${rielId}`}
                      startOffset={`${cuna.etiquetaOffset}%`}
                    >
                      {cuadrante.pregunta}
                    </textPath>
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
      </g>

      {/* Mismo isotipo, mismo transform y mismos hex de marca que en el centro
          del donut de la rueda grande: se escala con el resto del viewBox.
          Fuera del grupo que gira: permanece fijo. */}
      <g transform={ISOTIPO_TRANSFORM}>
        {ISOTIPO_HOJAS.map((hoja, index) => (
          <path key={index} d={hoja.d} fill={hoja.fill} />
        ))}
      </g>
    </svg>
  );
}
