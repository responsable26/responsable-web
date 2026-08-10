"use client";

import { useEffect } from "react";
import { useContactModal } from "@/context/contact-modal-context";

/**
 * Abre el modal de contacto cuando la Home recibe `?contacto=1`, que es adonde
 * redirigen /contacto/ y /sigamos-en-contacto/ desde que la página propia
 * desapareció.
 *
 * Lee window.location en lugar de useSearchParams a propósito: ese hook obliga
 * a envolver el árbol en Suspense y saca la página del prerenderizado estático.
 * Aquí el parámetro solo dispara un efecto de cliente, así que no hace falta.
 */
export function AbrirContactoDesdeUrl() {
  const { open } = useContactModal();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("contacto") !== "1") return;

    open();

    /*
      replaceState y no pushState: el parámetro no debe dejar entrada en el
      historial, para que volver atrás no reabra el modal. Se conservan el resto
      de parámetros y el hash por si la URL traía algo más.
    */
    params.delete("contacto");
    const query = params.toString();
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, [open]);

  return null;
}
