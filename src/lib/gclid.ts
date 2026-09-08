/*
  Persistencia del gclid de Google Ads.

  El identificador solo viaja en la URL del primer aterrizaje. Si se lee en el
  momento de enviar el formulario, se pierde en cuanto el visitante navega una
  página —y en el modal de contacto, que se abre desde cualquier ruta, eso es
  lo normal—: se atribuía a Ads solo a quien rellenaba el formulario sin
  moverse de la página de entrada.

  sessionStorage y no localStorage: la atribución es de esta visita. Un gclid
  guardado durante semanas acabaría pegado a un envío de otra sesión, entrada
  por otro camino, y atribuiría a Ads una conversión que no le corresponde.

  Cada acceso va en try/catch. sessionStorage lanza —no devuelve null— en
  navegación privada de algunos navegadores y con el almacenamiento bloqueado
  por configuración o extensión, y una excepción ahí dejaría el formulario sin
  poder enviarse. Perder la atribución es aceptable; romper el formulario, no.
*/

const CLAVE = "responsable:gclid";

/**
 * Guarda el gclid de la URL actual, si lo trae.
 *
 * Sobrescribe siempre que la URL traiga uno: si el visitante vuelve a entrar
 * por otro anuncio dentro de la misma sesión, el clic que atribuye es el
 * último, no el primero.
 */
export function capturarGclid() {
  if (typeof window === "undefined") return;
  const enUrl = new URLSearchParams(window.location.search).get("gclid");
  if (!enUrl) return;
  try {
    window.sessionStorage.setItem(CLAVE, enUrl);
  } catch {
    /* Sin almacenamiento el gclid sigue disponible mientras no se navegue:
       leerGclid() mira primero la URL. */
  }
}

/** El gclid de esta visita: el de la URL si sigue ahí, y si no el guardado. */
export function leerGclid(): string {
  if (typeof window === "undefined") return "";
  const enUrl = new URLSearchParams(window.location.search).get("gclid");
  if (enUrl) return enUrl;
  try {
    return window.sessionStorage.getItem(CLAVE) ?? "";
  } catch {
    return "";
  }
}
