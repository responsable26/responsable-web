import type { OrigenContacto } from "@/components/formulario-contacto/formulario-contacto";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Nombre del evento de conversión de formulario.
 *
 * El sitio no tiene página de gracias —la confirmación sustituye al formulario
 * en el sitio—, así que la conversión no se puede medir por visita a una URL y
 * hay que empujarla al dataLayer a mano. Este es el nombre con el que se
 * configura el disparador en GTM.
 */
export const EVENTO_FORMULARIO = "envio_formulario";

/**
 * Empuja la conversión al dataLayer.
 *
 * Se llama solo cuando el servidor ha confirmado el envío, nunca al pulsar el
 * botón: un clic no es una conversión, y contarlo así inflaría la cifra con
 * todos los intentos que el servidor rechaza.
 *
 * El único dato que acompaña al evento es de qué formulario salió. Nada de lo
 * que escribió la persona —nombre, correo, teléfono, mensaje— entra aquí: el
 * dataLayer viaja a Google y a cualquier etiqueta que el contenedor tenga
 * configurada, que no es un destino para datos personales.
 *
 * El dataLayer se inicializa por si el evento llega antes que GTM: el array
 * guarda el empujón y el contenedor lo procesa al cargar. Sin esta línea, un
 * envío muy rápido se perdería.
 */
export function eventoFormularioEnviado(origen: OrigenContacto) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: EVENTO_FORMULARIO,
    formulario_origen: origen,
  });
}
