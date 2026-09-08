"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { FormField } from "@/components/formulario-contacto/form-field";

/**
 * El formulario de contacto del sitio: campos, validación, envío y los tres
 * estados posteriores (enviando, error, confirmación). Vivía dentro de
 * ContactModal; se extrajo aquí cuando /proveedores/ necesitó exactamente el
 * mismo formulario, para que las dos superficies compartan una sola
 * implementación en vez de mantener dos copias que acaban divergiendo.
 *
 * Estilado para fondo oscuro: las etiquetas van en blanco y los mensajes de
 * error en rosa claro (ver form-field.tsx). Quien lo monte debe darle un fondo
 * navy —el panel del modal, o la tarjeta de /proveedores/—.
 *
 * No expone ningún método de reinicio: el estado vive dentro y se reinicia solo
 * al desmontarse. ContactModal deja de renderizarlo al cerrarse, así que la
 * siguiente apertura arranca con el formulario vacío sin que nadie tenga que
 * acordarse de limpiarlo.
 */

type FormValues = {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  compania: string;
  cargo: string;
  cv: string;
  mensaje: string;
  consiento: boolean;
  hp: string;
};

const INITIAL_VALUES: FormValues = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
  compania: "",
  cargo: "",
  cv: "",
  mensaje: "",
  consiento: false,
  hp: "",
};

/** Los campos de texto que el formulario sabe pintar. El mensaje y la casilla
 *  de consentimiento no entran aquí: van siempre, en las tres superficies. */
export type CampoContacto =
  "nombre" | "apellido" | "correo" | "telefono" | "compania" | "cargo" | "cv";

/** Etiqueta y tipo de cada campo. Vive aquí para que las tres superficies no
 *  puedan escribir "Correo Electronico" de tres maneras distintas; lo que sí
 *  decide cada una es cuáles aparecen y cuáles son obligatorios. */
const CATALOGO: Record<
  CampoContacto,
  { label: string; type?: string; placeholder?: string }
> = {
  nombre: { label: "Nombre" },
  apellido: { label: "Apellido" },
  correo: { label: "Correo Electrónico", type: "email" },
  telefono: { label: "Teléfono", type: "tel" },
  compania: { label: "Compañía" },
  cargo: { label: "Cargo" },
  /*
    type "url" y no "text": en móvil abre el teclado con "/" y ".com" a mano.
    La etiqueta dice "Enlace" y el placeholder enseña un ejemplo real, porque
    aquí no hay adjunto: quien espere un botón de subir archivo tiene que
    entender a la primera que lo que se pide es una dirección.
  */
  cv: {
    label: "Enlace a su CV o perfil profesional",
    type: "url",
    placeholder: "linkedin.com/in/su-perfil, Drive, portafolio…",
  },
};

export type CampoConfig = { campo: CampoContacto; obligatorio?: boolean };

/**
 * De qué superficie sale el envío. Viaja en el cuerpo del POST y es lo que
 * /api/contacto usa para el asunto del correo.
 *
 * Es un dato explícito y no algo que el servidor deduzca del juego de campos:
 * esa deducción se rompía en silencio en cuanto una superficie cambiaba sus
 * campos —un envío de proveedores sin teléfono se clasificaba como solicitud
 * de trabajo—. Los valores repiten la ruta de cada superficie para que un
 * asunto en el buzón se pueda rastrear hasta su página sin traducir nada.
 */
export type OrigenContacto =
  | "modal-contacto"
  | "proveedores"
  | "trabaja-con-nosotros";

/**
 * Da por buena una dirección escrita a mano y la devuelve completa, o null si
 * no tiene forma de URL.
 *
 * Acepta que falte el esquema —"linkedin.com/in/alguien" es lo que la gente
 * escribe— y lo añade, de modo que lo que se envía siempre es una dirección
 * navegable. El constructor de URL solo, sin embargo, es demasiado permisivo:
 * "https://hola" le parece válido. De ahí la comprobación del host, que exige
 * al menos un punto y ningún espacio, y que de paso descarta esquemas
 * inventados: "ftp://x.com" acaba con host "ftp", sin punto, y se rechaza.
 */
function normalizarUrl(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return null;
  const conEsquema = /^https?:\/\//i.test(limpio)
    ? limpio
    : `https://${limpio}`;
  try {
    const url = new URL(conEsquema);
    if (!/^[^\s.]+(\.[^\s.]+)+$/.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Contexto de navegación que acompaña al envío.
 *
 * Lo captura el cliente porque el servidor no puede saberlo: la página real
 * solo la conoce el navegador —el modal se abre desde cualquier ruta, así que
 * no se deduce del `origen`—, y el referrer y el gclid viven en el documento y
 * en la URL, no en la petición.
 *
 * Se lee en el momento de enviar y no al montar: entre una cosa y otra el
 * visitante puede haber navegado con el modal abierto, y lo que interesa es
 * dónde estaba al pulsar el botón.
 */
function contextoNavegacion() {
  if (typeof window === "undefined") return {};
  return {
    pagina: window.location.href,
    /* Solo el de la URL actual. Si el visitante llegó con ?gclid= y después
       navegó, ya no está: persistirlo entre páginas sería otra decisión. */
    gclid: new URLSearchParams(window.location.search).get("gclid") ?? "",
    referrer: document.referrer,
  };
}

type Status = "idle" | "submitting" | "error" | "success";

export function FormularioContacto({
  titulo,
  origen,
  campos,
  etiquetaEnvio = "Enviar Información",
}: {
  /** Encabezado sobre el formulario. Lo sustituye la confirmación al enviarse. */
  titulo: string;
  /**
   * Superficie desde la que se envía. Sin valor por defecto y obligatorio, por
   * el mismo motivo que `campos`: si una superficie nueva se olvida de
   * declararlo, tiene que fallar de compilación y no heredar en silencio el de
   * otra ni acabar en un asunto equivocado.
   */
  origen: OrigenContacto;
  /**
   * Campos de texto a pintar, en este orden, y cuáles son obligatorios. Sin
   * valor por defecto a propósito: el juego de campos lo define el cliente y es
   * distinto en cada superficie, así que cada una lo declara a la vista en vez
   * de heredar en silencio el de otra.
   */
  campos: readonly CampoConfig[];
  /** Texto del botón, para que cada superficie lo ajuste a su contexto. */
  etiquetaEnvio?: string;
}) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const confirmacionRef = useRef<HTMLDivElement>(null);
  /* Prefijo de los id de los campos. El formulario puede aparecer dos veces en
     el mismo documento —el modal de contacto abierto sobre /proveedores/—, y
     dos <input> con el mismo id romperían la asociación de sus etiquetas. */
  const uid = useId();

  /*
    Al confirmarse el envío, el formulario desaparece y con él el elemento que
    tenía el foco (el botón de enviar), que si no lo movemos deja el foco
    huérfano en el <body>. Se lleva al panel de confirmación, que es donde está
    el mensaje nuevo.

    El panel es además role="status": moverle el foco ya hace que la mayoría de
    lectores lean su contenido, y el rol cubre a los que no anuncian el foco
    programático. Es una región educada, así que no interrumpe lo que se esté
    leyendo en ese momento.
  */
  useEffect(() => {
    if (status === "success") confirmacionRef.current?.focus();
  }, [status]);

  function updateField<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  /*
    Solo se valida lo que está a la vista: un campo que esta superficie no
    pinta no puede ser obligatorio, porque nadie podría rellenarlo. De ahí que
    la lista salga de `campos` y no de una constante fija.

    El consentimiento queda fuera de esa cuenta: va siempre y siempre es
    obligatorio, en las tres superficies.
  */
  function validate() {
    const invalid: Record<string, string> = {};
    for (const { campo, obligatorio } of campos) {
      const valor = values[campo].trim();
      if (obligatorio && !valor) {
        invalid[campo] = "Este campo es obligatorio.";
        continue;
      }
      /*
        El enlace se valida siempre que traiga algo, sea obligatorio o no: un
        campo opcional mal escrito no debe colarse como si nada, porque el
        destinatario se quedaría con una dirección que no abre.
      */
      if (campo === "cv" && valor && !normalizarUrl(valor)) {
        invalid[campo] =
          "Escriba una dirección válida, por ejemplo linkedin.com/in/su-perfil";
      }
    }
    if (!values.consiento) invalid.consiento = "";
    return invalid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (values.hp) return; // honeypot tripped — silently drop

    const invalid = validate();
    setErrores(invalid);
    if (Object.keys(invalid).length > 0) return;

    /*
      Se envía el enlace ya completo, no lo que se tecleó: quien escribió
      "linkedin.com/in/alguien" quiso decir "https://linkedin.com/in/alguien",
      y así lo recibe el destinatario. Se refleja también en el campo para que
      el cambio no ocurra a espaldas de quien lo escribió.
    */
    const cv = normalizarUrl(values.cv) ?? values.cv;
    const envio = { ...values, cv };
    if (cv !== values.cv) setValues(envio);

    setStatus("submitting");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...envio, origen, ...contextoNavegacion() }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    /*
      El envío correcto sustituye al formulario entero, no se añade debajo: ya
      no hay nada que rellenar ni que reenviar.
    */
    return (
      <div
        ref={confirmacionRef}
        tabIndex={-1}
        role="status"
        className="modal__success flex flex-col items-start outline-none"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-teal text-white">
          <CheckIcon className="size-7" />
        </span>
        <h2 className="font-head mt-6 text-2xl font-semibold text-white">
          Su información fue enviada
        </h2>
        <p className="font-body mt-3 text-white/85">
          Gracias por escribirnos. Nos pondremos en contacto con usted tan
          pronto como sea posible.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-head text-2xl font-semibold text-white">{titulo}</h2>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="form-grid mt-8 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/*
            Los campos salen de `campos`, en su orden. Si el número es impar,
            el último ocupa las dos columnas: con tres campos, una rejilla de
            dos dejaría media fila vacía a la derecha, y ese hueco se lee como
            un descuadre y no como una decisión. Con un número par no cambia
            nada, así que el modal —seis campos— se pinta exactamente igual que
            antes.
          */}
          {campos.map(({ campo, obligatorio }, index) => (
            <FormField
              key={campo}
              label={CATALOGO[campo].label}
              id={`${uid}-${campo}`}
              name={campo}
              type={CATALOGO[campo].type}
              placeholder={CATALOGO[campo].placeholder}
              required={obligatorio}
              value={values[campo]}
              onChange={(v) => updateField(campo, v)}
              error={errores[campo]}
              full={campos.length % 2 === 1 && index === campos.length - 1}
            />
          ))}

          <div className="field field--full flex flex-col gap-1.5 sm:col-span-2">
            <label
              htmlFor={`${uid}-mensaje`}
              className="font-head text-[0.8rem] font-medium text-white/90"
            >
              Escriba más información de su solicitud
            </label>
            <textarea
              id={`${uid}-mensaje`}
              name="mensaje"
              rows={4}
              value={values.mensaje}
              onChange={(e) => updateField("mensaje", e.target.value)}
              className="font-body rounded-sm border border-transparent bg-white px-4 py-2.5 text-sm text-ink transition-colors focus:border-magenta"
            />
          </div>

          <label className="field field--full font-body flex items-start gap-2 text-sm text-white/85 sm:col-span-2">
            <input
              type="checkbox"
              name="consiento"
              checked={values.consiento}
              onChange={(e) => updateField("consiento", e.target.checked)}
              className={`mt-0.5 size-4 shrink-0 accent-magenta ${
                "consiento" in errores
                  ? "is-invalid outline-2 outline-offset-2 outline-[#ff5a7a]"
                  : ""
              }`}
            />
            <span>
              Acepto recibir comunicaciones de ResponSable y he leído el{" "}
              <Link
                href="/legal/aviso-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Aviso de Privacidad
              </Link>
            </span>
          </label>

          <div
            className="hp absolute left-[-9999px] size-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor={`${uid}-empresa`}>No llenar este campo</label>
            <input
              type="text"
              id={`${uid}-empresa`}
              name="empresa"
              tabIndex={-1}
              autoComplete="off"
              value={values.hp}
              onChange={(e) => updateField("hp", e.target.value)}
            />
          </div>
        </div>

        {status === "error" ? (
          <div className="modal__form-error rounded-sm border border-[rgba(255,90,122,0.5)] bg-[rgba(255,90,122,0.15)] px-4 py-3 text-sm text-[#ffd5dd]">
            Ocurrió un error al enviar su información. Por favor, inténtelo de
            nuevo.
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="font-head self-start rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C71268] disabled:opacity-60"
        >
          {status === "submitting" ? "Enviando…" : etiquetaEnvio}
        </button>
      </form>
    </>
  );
}
