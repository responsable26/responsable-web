"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContactModal } from "@/context/contact-modal-context";
import { CloseIcon } from "@/components/icons";
import { pausarScroll, reanudarScroll } from "@/lib/scroll-suave";
import {
  FormularioContacto,
  type CampoConfig,
} from "@/components/formulario-contacto/formulario-contacto";

/** Los campos del modal, sin cambios: son los que tenía antes de que el juego
 *  de campos pasara a ser configurable. Seis, número par, así que la rejilla de
 *  dos columnas se llena sin huecos. */
const CAMPOS: readonly CampoConfig[] = [
  { campo: "nombre", obligatorio: true },
  { campo: "apellido", obligatorio: true },
  { campo: "correo", obligatorio: true },
  { campo: "telefono", obligatorio: true },
  { campo: "compania", obligatorio: true },
  { campo: "cargo" },
];

/** Los dos desvíos del pie del formulario. Van en una constante para que el
 *  JSX de abajo se lea de un vistazo, igual de corto que la pastilla. */
const OTRAS_SOLICITUDES = [
  { label: "Ofrezca sus servicios", href: "/proveedores/" },
  { label: "Trabaje con nosotros", href: "/trabaja-con-nosotros/" },
];

/**
 * El formulario en sí —campos, validación, envío y estados— vive en
 * <FormularioContacto />, compartido con /proveedores/. Aquí queda solo lo
 * propio del modal: la caja, el bloqueo del scroll, Escape y el foco inicial.
 *
 * Al cerrarse, el modal deja de renderizar a su hijo, y con él se va el estado
 * del formulario: la siguiente apertura arranca vacía sin necesidad de un
 * reset explícito.
 */
export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    // El overflow del body no basta con Lenis: su bucle sigue moviendo el
    // documento aunque el body no desborde.
    pausarScroll();
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      reanudarScroll();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="modal fixed inset-0 z-[60] overflow-y-auto bg-[rgba(10,12,30,0.6)]"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={close}
        aria-label="Cerrar"
        className="fixed top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-navy transition-colors hover:bg-white"
      >
        <CloseIcon className="size-5" />
      </button>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/*
          justify-center más un bloque de ancho acotado: los tres elementos se
          leen como una unidad centrada en la columna. Antes la ilustración
          llevaba mt-auto, que la empujaba al fondo de una columna de
          min-h-screen y abría un vacío enorme entre el párrafo y ella; ahora la
          separación es un margen normal y es el conjunto el que se centra.
        */}
        <div className="modal__media flex flex-col justify-center bg-off-white px-8 py-16 sm:px-12">
          <div className="mx-auto w-full max-w-md">
            <h2
              id="contact-modal-title"
              className="font-head text-4xl font-semibold text-navy"
            >
              Contáctenos
            </h2>
            <p className="font-body mt-4 text-ink-soft">
              Agradecemos su interés en ResponSable. Elija entre las siguientes
              opciones, nos comunicaremos con usted tan pronto como sea posible.
            </p>
            <Image
              src="/modal.webp"
              alt=""
              width={1182}
              height={1182}
              className="mt-8 hidden w-full sm:block"
            />
          </div>
        </div>

        {/*
          El contenido va en un bloque de ancho acotado y centrado (mx-auto),
          no estirado de borde a borde de la columna: con dos campos por fila,
          dejarlo suelto en una pantalla ancha daba campos larguísimos y el
          bloque quedaba visualmente descuadrado respecto a la columna. 34rem
          reparte los márgenes a partes iguales y deja cada campo en unos 16rem,
          un ancho de lectura y de escritura razonable.
        */}
        <div className="modal__panel flex flex-col justify-center bg-navy px-8 py-16 sm:px-12">
          <div className="mx-auto w-full max-w-[34rem]">
            <FormularioContacto
              titulo="Completa el formulario"
              campos={CAMPOS}
              /*
                Vía alternativa, no acción principal: fondo apenas insinuado
                sobre el navy, tipografía pequeña y enlaces subrayados en vez
                de botones, para que a nadie se le confunda con el de enviar.
                Va como `pie` y no suelto tras el formulario porque así
                desaparece solo al confirmarse el envío.

                close() antes de navegar: sin él, el modal seguiría montado
                sobre la página de destino, y al volver atrás el usuario se lo
                encontraría abierto encima. El <Link> de Next ejecuta este
                onClick antes de navegar, así que el orden está garantizado.
              */
              pie={
                <div className="mt-8 rounded-lg bg-white/5 px-4 py-3">
                  <p className="font-body text-xs text-white/60">
                    ¿Buscaba otra cosa?
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
                    {OTRAS_SOLICITUDES.map((enlace) => (
                      <Link
                        key={enlace.href}
                        href={enlace.href}
                        onClick={close}
                        className="font-body text-sm text-white/85 underline underline-offset-4 transition-colors hover:text-white"
                      >
                        {enlace.label}
                      </Link>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
