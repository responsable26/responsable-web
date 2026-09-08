import { Resend } from "resend";
import { correoHtml, correoTexto, type LineaCorreo } from "./correo";

/*
  Endpoint de los tres formularios del sitio. Las tres superficies —el modal de
  contacto, /proveedores/ y /trabaja-con-nosotros/— montan el mismo
  FormularioContacto y envían siempre el objeto de valores completo, con los
  campos que esa superficie no pinta en cadena vacía, más un campo `origen` que
  dice de cuál de las tres viene (OrigenContacto, en formulario-contacto.tsx).

  Ese campo es la única fuente de la clasificación. Antes se deducía del juego
  de campos y era frágil de dos maneras: cambiar los campos de una superficie
  rompía la clasificación sin que nada fallara, y un envío de proveedores sin
  teléfono acababa clasificado como solicitud de trabajo. Un origen ausente o
  desconocido se rechaza con 400 en vez de adivinarlo.

  El contrato con el cliente es solo el código de estado: formulario-contacto.tsx
  hace `if (!res.ok) throw` y no mira el cuerpo. 200 es éxito, cualquier otro
  código enciende su estado de error. Por eso el cuerpo JSON que se devuelve es
  para depuración, no para la interfaz.
*/

export const runtime = "nodejs";

/* Dominio verificado en Resend, con DKIM/SPF/MX en la zona. El remitente no es
   configurable por entorno a propósito: cambiarlo exige verificar el dominio
   nuevo en Resend, así que no es un ajuste de despliegue. */
const REMITENTE = "ResponSable <web@mail.responsable.net>";

const CAMPOS_TEXTO = [
  "nombre",
  "apellido",
  "correo",
  "telefono",
  "compania",
  "cargo",
  "cv",
  "mensaje",
] as const;

type CampoTexto = (typeof CAMPOS_TEXTO)[number];

const ETIQUETAS: Record<CampoTexto, string> = {
  nombre: "Nombre",
  apellido: "Apellido",
  correo: "Correo electrónico",
  telefono: "Teléfono",
  compania: "Compañía",
  cargo: "Cargo",
  cv: "CV o perfil profesional",
  mensaje: "Mensaje",
};

/* Las claves son los valores de OrigenContacto que manda el cliente. Los
   obligatorios de cada superficie replican los `obligatorio: true` que declara
   su CAMPOS. Se validan aquí de nuevo porque la validación del navegador es
   una comodidad, no una garantía: el endpoint es público y recibe lo que le
   manden. */
const SUPERFICIES = {
  "modal-contacto": {
    asunto: "Contacto desde el sitio",
    obligatorios: ["nombre", "apellido", "correo", "telefono", "compania"],
  },
  proveedores: {
    asunto: "Propuesta de proveedor",
    obligatorios: ["nombre", "correo", "telefono"],
  },
  "trabaja-con-nosotros": {
    asunto: "Solicitud de trabajo",
    obligatorios: ["nombre", "correo"],
  },
} satisfies Record<
  string,
  { asunto: string; obligatorios: readonly CampoTexto[] }
>;

type Superficie = keyof typeof SUPERFICIES;

/* Contexto de navegación que manda el cliente (ver contextoNavegacion en
   formulario-contacto.tsx). Son datos de rastreo, no del formulario: si no
   vienen, el correo simplemente no enseña esa línea. */
const CONTEXTO = {
  pagina: "Página",
  gclid: "gclid",
  referrer: "Referrer",
} as const;

type ClaveContexto = keyof typeof CONTEXTO;

/* Tope de longitud de lo que llega del cliente. Nada legítimo se acerca a
   estos valores y evita que un envío hostil infle el correo. */
const MAX_CONTEXTO = 500;

function esSuperficie(valor: unknown): valor is Superficie {
  return typeof valor === "string" && valor in SUPERFICIES;
}

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Lista de direcciones separadas por coma tal como viven en el entorno. */
function listaDeCorreos(valor: string | undefined): string[] {
  return (valor ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

/**
 * Configuración de entorno, o un error que dice exactamente qué falta.
 *
 * No hay valores por defecto ni direcciones escritas en el código: sin las
 * variables el endpoint no puede funcionar, y es mejor un 500 registrado que
 * un envío silencioso a un buzón equivocado.
 */
function leerEntorno():
  | { ok: true; apiKey: string; para: string[]; copia: string[] }
  | { ok: false; motivo: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, motivo: "falta RESEND_API_KEY" };

  const para = listaDeCorreos(process.env.CONTACTO_DESTINATARIOS);
  if (para.length === 0) {
    return { ok: false, motivo: "falta CONTACTO_DESTINATARIOS o está vacía" };
  }

  /* CONTACTO_COPIA sí puede no estar: una lista de copia vacía es una
     configuración válida, no un fallo. Lo que no se admite es que traiga
     basura, que Resend rechazaría el envío entero. */
  const copia = listaDeCorreos(process.env.CONTACTO_COPIA);

  const invalidas = [...para, ...copia].filter((c) => !FORMATO_CORREO.test(c));
  if (invalidas.length > 0) {
    return {
      ok: false,
      motivo: `${invalidas.length} dirección(es) con formato inválido en CONTACTO_DESTINATARIOS/CONTACTO_COPIA`,
    };
  }

  return { ok: true, apiKey, para, copia };
}

/** Solo los campos con contenido: los que esa superficie no pinta llegan
 *  vacíos y no aportan nada al correo. El mensaje va aparte, en su propio
 *  bloque destacado de la plantilla. */
function lineasDatos(v: Record<CampoTexto, string>): LineaCorreo[] {
  return CAMPOS_TEXTO.filter((c) => c !== "mensaje" && v[c]).map((c) => ({
    etiqueta: ETIQUETAS[c],
    valor: v[c],
  }));
}

export async function POST(request: Request) {
  let datos: unknown;
  try {
    datos = await request.json();
  } catch {
    return Response.json({ error: "cuerpo no es JSON" }, { status: 400 });
  }
  if (typeof datos !== "object" || datos === null) {
    return Response.json({ error: "cuerpo no es un objeto" }, { status: 400 });
  }
  const bruto = datos as Record<string, unknown>;

  /* Todo lo que no sea cadena se descarta a cadena vacía en vez de rechazar el
     envío: lo que importa es que los obligatorios tengan contenido, y un campo
     con un tipo raro es exactamente igual de inútil que uno ausente. */
  const valores = Object.fromEntries(
    CAMPOS_TEXTO.map((c) => [
      c,
      typeof bruto[c] === "string" ? bruto[c].trim() : "",
    ]),
  ) as Record<CampoTexto, string>;

  /*
    Honeypot. El campo se pinta fuera de pantalla y sin etiqueta visible, así
    que una persona no lo rellena nunca y un bot que rellena todo, sí. Se
    responde 200 y no se envía nada: un 400 le diría al bot que ha sido
    detectado y le invitaría a reintentar sin ese campo.
  */
  if (typeof bruto.hp === "string" && bruto.hp.trim()) {
    return Response.json({ ok: true }, { status: 200 });
  }

  /* El origen se comprueba antes que los campos porque es lo que decide cuáles
     son obligatorios: sin él no hay contra qué validar. */
  if (!esSuperficie(bruto.origen)) {
    console.warn("[contacto] envío rechazado: origen ausente o no reconocido");
    return Response.json({ error: "origen inválido" }, { status: 400 });
  }
  const superficie = bruto.origen;
  const { asunto, obligatorios } = SUPERFICIES[superficie];

  /* string[] y no el tipo estrecho de `obligatorios`: a la lista se suman
     también "correo" por formato y "consiento", que no es un campo de texto. */
  const faltan: string[] = obligatorios.filter((c) => !valores[c]);
  if (!FORMATO_CORREO.test(valores.correo)) faltan.push("correo");
  /* El consentimiento va en las tres superficies y es siempre obligatorio.
     Tiene que ser exactamente true: un "true" de texto o un 1 no son una
     casilla marcada por una persona. */
  if (bruto.consiento !== true) faltan.push("consiento");

  if (faltan.length > 0) {
    /* Se registran los nombres de los campos, nunca su contenido. */
    console.warn(
      `[contacto] envío rechazado (${superficie}): campos inválidos → ${[...new Set(faltan)].join(", ")}`,
    );
    return Response.json(
      { error: "campos inválidos", campos: [...new Set(faltan)] },
      { status: 400 },
    );
  }

  const entorno = leerEntorno();
  if (!entorno.ok) {
    console.error(`[contacto] configuración incompleta: ${entorno.motivo}`);
    return Response.json({ error: "configuración" }, { status: 500 });
  }

  /* El formulario del que viene encabeza el bloque técnico: es el dato que
     dice qué superficie se usó, distinto de la página en la que estaba el
     visitante —el modal se abre desde cualquier ruta—. */
  const tecnicos: LineaCorreo[] = [
    { etiqueta: "Formulario", valor: superficie },
    ...(Object.keys(CONTEXTO) as ClaveContexto[])
      .map((clave) => ({
        etiqueta: CONTEXTO[clave],
        valor:
          typeof bruto[clave] === "string"
            ? bruto[clave].trim().slice(0, MAX_CONTEXTO)
            : "",
      }))
      /* Sin valor no se pinta la línea: una etiqueta con el hueco vacío se lee
         como un fallo del correo y no como un dato que no había. */
      .filter((linea) => linea.valor),
  ];

  const contenido = {
    asunto,
    datos: lineasDatos(valores),
    mensaje: valores.mensaje,
    tecnicos,
  };
  const quien = valores.apellido
    ? `${valores.nombre} ${valores.apellido}`
    : valores.nombre;

  try {
    const { error } = await new Resend(entorno.apiKey).emails.send({
      from: REMITENTE,
      to: entorno.para,
      ...(entorno.copia.length > 0 ? { cc: entorno.copia } : {}),
      /* Responder al correo lleva directamente a quien escribió, sin tener que
         copiar la dirección del cuerpo. */
      replyTo: valores.correo,
      subject: `${asunto} — ${quien}`,
      /* Las dos versiones en el mismo envío: Resend las monta como
         multipart/alternative y cada cliente elige la que sepa pintar. */
      text: correoTexto(contenido),
      html: correoHtml(contenido),
    });

    if (error) {
      /* El error de Resend trae nombre y mensaje del fallo (dominio no
         verificado, clave inválida, destinatario rechazado); no trae el
         contenido del correo. */
      console.error(`[contacto] Resend rechazó el envío: ${error.name}`);
      return Response.json({ error: "envío" }, { status: 502 });
    }
  } catch (e) {
    console.error(
      `[contacto] fallo de red contra Resend: ${e instanceof Error ? e.name : "desconocido"}`,
    );
    return Response.json({ error: "envío" }, { status: 502 });
  }

  /* Ni aquí ni en ningún punto anterior se registra el contenido del mensaje ni
     los datos de quien lo envía: la traza dice qué superficie y si salió, nada
     más. */
  console.info(`[contacto] envío entregado a Resend (${superficie})`);
  return Response.json({ ok: true }, { status: 200 });
}
