"use client";

import { ChevronIcon } from "@/components/icons";
import { usePistaArrastrable } from "@/components/use-pista-arrastrable";
import type { PasoProceso } from "@/lib/contenido-servicios";

/**
 * A partir de cinco pasos la rejilla deja de cuadrar.
 *
 * Con el ancho del contenedor y el gap, en la fila entran cuatro columnas: el
 * quinto paso bajaba solo a una segunda fila y rompía el bloque. Por debajo de
 * ese número la rejilla es mejor que un carrusel —se ve el proceso entero de un
 * vistazo, sin interacción—, así que el carrusel solo entra cuando hace falta.
 * Siete de los diez servicios traen cinco pasos y tres traen cuatro.
 */
const MAXIMO_EN_REJILLA = 4;

/** Un paso. Idéntico en las dos disposiciones: solo cambia el contenedor.
 *
 *  h-full y flex-col para que dentro de la pista todos los pasos midan lo mismo
 *  aunque sus descripciones tengan longitudes distintas: los elementos de un
 *  flex se estiran al alto de la fila, y sin h-full el contenido no ocuparía ese
 *  alto. En la rejilla no hace falta, pero tampoco estorba. */
function Paso({ paso, numero }: { paso: PasoProceso; numero: number }) {
  return (
    <div className="flex h-full flex-col">
      <span className="font-head flex size-11 shrink-0 items-center justify-center rounded-full bg-magenta text-lg font-bold text-white">
        {numero}
      </span>
      <h3 className="font-head mt-4 text-[1.15rem] font-semibold text-navy">
        {paso.titulo}
      </h3>
      <p className="font-body mt-2 text-sm text-ink-soft">{paso.descripcion}</p>
    </div>
  );
}

export function ProcesoPasos({ pasos }: { pasos: PasoProceso[] }) {
  const { ref, desplazarUnPaso, propsPista, clasesPista } =
    usePistaArrastrable<HTMLOListElement>();

  if (pasos.length <= MAXIMO_EN_REJILLA) {
    return (
      <div className="mt-12 rounded bg-white p-8 shadow sm:p-12">
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((paso, indice) => (
            <li key={paso.titulo}>
              <Paso paso={paso} numero={indice + 1} />
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    /*
      La tarjeta blanca pierde el padding horizontal y lo asume la pista, que lo
      replica como scroll-padding: así los pasos se recortan contra el borde de
      la tarjeta al deslizarse, en lugar de aparecer y desaparecer dentro de una
      franja de padding, y el snap sigue anclándolos donde empieza el contenido.
    */
    <div className="mt-12 overflow-hidden rounded bg-white py-8 shadow sm:py-12">
      {/*
        Los controles van dentro de la tarjeta blanca y no junto al titular de la
        sección, que está sobre navy: es lo que permite conservar el tratamiento
        exacto de los del carrusel de artículos —borde navy en el anterior,
        magenta sólido en el siguiente—, que sobre navy no se leería.
      */}
      <div className="mb-6 flex justify-end gap-3 px-8 sm:px-12">
        <button
          type="button"
          onClick={() => desplazarUnPaso(-1)}
          aria-label="Pasos anteriores"
          className="flex size-11 items-center justify-center rounded-full border border-navy text-navy transition-colors hover:border-magenta hover:text-magenta active:bg-magenta/10"
        >
          <ChevronIcon direction="left" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => desplazarUnPaso(1)}
          aria-label="Pasos siguientes"
          className="flex size-11 items-center justify-center rounded-full bg-magenta text-white transition-colors hover:bg-[#C71268] active:bg-[#A50E56]"
        >
          <ChevronIcon direction="right" className="size-5" />
        </button>
      </div>

      <ol
        ref={ref}
        {...propsPista}
        /*
          items-stretch explícito —aunque sea el valor por defecto de flex—
          porque es lo que iguala el alto de todos los pasos: sin él, cada uno
          mediría lo que midiera su descripción y el pie de la pista quedaría
          irregular al deslizar.
        */
        className={`${clasesPista} items-stretch gap-6 px-8 scroll-pl-8 sm:px-12 sm:scroll-pl-12`}
      >
        {pasos.map((paso, indice) => (
          /*
            Anchos por número de pasos a la vista, con el último asomando: 4.5 en
            desktop —cuatro completos y el quinto cortado, que es lo que delata
            que hay más—, 2.5 en tablet y 1.25 en móvil, donde a cuatro cada paso
            se quedaría en unos 60px y no se leería nada.

            El divisor lleva descontados los gap que caen dentro de la franja
            visible: cuatro para 4.5, dos para 2.5 y uno para 1.25.
          */
          <li
            key={paso.titulo}
            className="w-[calc((100%-1.5rem)/1.25)] shrink-0 snap-start sm:w-[calc((100%-3rem)/2.5)] lg:w-[calc((100%-6rem)/4.5)]"
          >
            <Paso paso={paso} numero={indice + 1} />
          </li>
        ))}
      </ol>
    </div>
  );
}
