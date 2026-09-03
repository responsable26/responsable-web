"use client";

import {
  ARROW_TRANSFORM,
  COLORES,
  CUNAS,
  ISOTIPO_HOJAS,
  ISOTIPO_TRANSFORM,
} from "@/components/home/servicios-rueda";
import { CUADRANTES } from "@/lib/servicios";

/**
 * La rueda de servicios como gráfico, no como control: los cuatro segmentos y
 * el isotipo central de la rueda del Home, sin sus etiquetas curvas, sin
 * animación y sin responder a hover, foco ni clic. Va como aria-hidden porque
 * todo lo que dice ya lo dice el texto que acompaña en cada sitio donde se usa.
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
 */
export function RuedaCuadrantes({
  activo = null,
  className,
}: {
  activo?: number | null;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      {CUNAS.map((cuna, index) => (
        <path
          key={index}
          d={cuna.arco}
          transform={ARROW_TRANSFORM}
          className={`${COLORES[CUADRANTES[index].colorToken].relleno} ${
            activo === null || index === activo ? "" : "opacity-20"
          }`}
        />
      ))}

      {/* Mismo isotipo, mismo transform y mismos hex de marca que en el centro
          del donut de la rueda grande: se escala con el resto del viewBox. */}
      <g transform={ISOTIPO_TRANSFORM}>
        {ISOTIPO_HOJAS.map((hoja, index) => (
          <path key={index} d={hoja.d} fill={hoja.fill} />
        ))}
      </g>
    </svg>
  );
}
