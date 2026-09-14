/*
  Persistencia del identificador de clic de Google Ads (gclid, gbraid, wbraid).

  El identificador solo viaja en la URL del primer aterrizaje. Si se lee en el
  momento de enviar el formulario, se pierde en cuanto el visitante navega una
  página —y en el modal de contacto, que se abre desde cualquier ruta, eso es
  lo normal—: se atribuía a Ads solo a quien rellenaba el formulario sin
  moverse de la página de entrada.

  localStorage y no sessionStorage: el ciclo de decisión de este cliente es de
  semanas, y un identificador que muere al cerrar la pestaña deja fuera
  justamente las conversiones que llegan en una segunda visita. Se guarda con
  la fecha de captura y caduca a los 90 días, la ventana de conversión de
  Google Ads: pasado ese plazo la conversión ya no se puede importar y el
  identificador solo ensuciaría el correo.

  Se guarda también cuál de los tres parámetros era: la importación sin
  conexión los recibe en columnas distintas, así que el valor solo no basta.

  Cada acceso va en try/catch. localStorage lanza —no devuelve null— en
  navegación privada de algunos navegadores y con el almacenamiento bloqueado
  por configuración o extensión, y una excepción ahí dejaría el formulario sin
  poder enviarse. Perder la atribución es aceptable; romper el formulario, no.
*/

const CLAVE = "responsable:clic-ads";

/** En orden de preferencia si la URL trae más de uno: gclid es el que Google
 *  Ads acepta en más tipos de importación. */
export const PARAMETROS_CLIC_ADS = ["gclid", "gbraid", "wbraid"] as const;

export type ParametroClicAds = (typeof PARAMETROS_CLIC_ADS)[number];

export type ClicAds = { parametro: ParametroClicAds; valor: string };

type ClicGuardado = ClicAds & { capturado: string };

const VIGENCIA_MS = 90 * 24 * 60 * 60 * 1000;

function clicEnUrl(): ClicAds | null {
  const busqueda = new URLSearchParams(window.location.search);
  for (const parametro of PARAMETROS_CLIC_ADS) {
    const valor = busqueda.get(parametro)?.trim();
    if (valor) return { parametro, valor };
  }
  return null;
}

/**
 * Guarda el identificador de clic de la URL actual, si lo trae.
 *
 * Sobrescribe siempre que la URL traiga uno, aunque el guardado siga vigente
 * o sea de otro tipo: Google atribuye al último clic, no al primero.
 */
export function capturarClicAds() {
  if (typeof window === "undefined") return;
  const clic = clicEnUrl();
  if (!clic) return;
  const guardado: ClicGuardado = {
    ...clic,
    capturado: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(guardado));
  } catch {
    /* Sin almacenamiento el identificador sigue disponible mientras no se
       navegue: leerClicAds() mira primero la URL. */
  }
}

/**
 * El identificador de clic vigente: el de la URL si sigue ahí, y si no el
 * guardado, siempre que no tenga más de 90 días. Uno vencido o ilegible se
 * borra para no volver a leerlo.
 */
export function leerClicAds(): ClicAds | null {
  if (typeof window === "undefined") return null;
  const enUrl = clicEnUrl();
  if (enUrl) return enUrl;
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    if (!bruto) return null;
    const guardado = JSON.parse(bruto) as Partial<ClicGuardado>;
    const capturado = Date.parse(guardado.capturado ?? "");
    const valido =
      PARAMETROS_CLIC_ADS.includes(guardado.parametro as ParametroClicAds) &&
      typeof guardado.valor === "string" &&
      guardado.valor !== "" &&
      Number.isFinite(capturado) &&
      Date.now() - capturado <= VIGENCIA_MS;
    if (!valido) {
      window.localStorage.removeItem(CLAVE);
      return null;
    }
    return {
      parametro: guardado.parametro as ParametroClicAds,
      valor: guardado.valor as string,
    };
  } catch {
    return null;
  }
}
