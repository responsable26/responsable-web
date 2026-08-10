"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContactModal } from "@/context/contact-modal-context";
import { CloseIcon } from "@/components/icons";
import { FormField } from "@/components/contact-modal/form-field";

type FormValues = {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  compania: string;
  cargo: string;
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
  mensaje: "",
  consiento: false,
  hp: "",
};

const REQUIRED_TEXT_FIELDS = ["nombre", "apellido", "correo", "telefono", "compania"] as const;

type Status = "idle" | "submitting" | "error" | "success";

export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>("idle");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function reset() {
    setValues(INITIAL_VALUES);
    setInvalidFields(new Set());
    setStatus("idle");
  }

  function handleClose() {
    close();
    reset();
  }

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate() {
    const invalid = new Set<string>();
    for (const field of REQUIRED_TEXT_FIELDS) {
      if (!values[field].trim()) invalid.add(field);
    }
    if (!values.consiento) invalid.add("consiento");
    return invalid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (values.hp) return; // honeypot tripped — silently drop

    const invalid = validate();
    setInvalidFields(invalid);
    if (invalid.size > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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
        onClick={handleClose}
        aria-label="Cerrar"
        className="fixed top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-navy transition-colors hover:bg-white"
      >
        <CloseIcon className="size-5" />
      </button>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="modal__media flex flex-col bg-off-white px-8 py-16 sm:px-12">
          <h2 id="contact-modal-title" className="font-head text-4xl font-semibold text-navy">
            Contáctanos
          </h2>
          <p className="font-body mt-4 max-w-md text-ink-soft">
            Agradecemos tu interés en ResponSable. Elije entre las siguientes
            opciones, nos comunicaremos contigo tan pronto como sea posible.
          </p>
          <Image
            src="/modal.webp"
            alt=""
            width={1182}
            height={1182}
            className="mt-auto hidden w-full max-w-md self-center pt-12 sm:block"
          />
        </div>

        <div className="modal__panel flex flex-col bg-navy px-8 py-16 sm:px-12">
          <h2 className="font-head text-2xl font-semibold text-white">
            Completa el formulario
          </h2>

          <form noValidate onSubmit={handleSubmit} className="form-grid mt-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Nombre"
                name="nombre"
                required
                value={values.nombre}
                onChange={(v) => updateField("nombre", v)}
                invalid={invalidFields.has("nombre")}
              />
              <FormField
                label="Apellido"
                name="apellido"
                required
                value={values.apellido}
                onChange={(v) => updateField("apellido", v)}
                invalid={invalidFields.has("apellido")}
              />
              <FormField
                label="Correo Electrónico"
                name="correo"
                type="email"
                required
                value={values.correo}
                onChange={(v) => updateField("correo", v)}
                invalid={invalidFields.has("correo")}
              />
              <FormField
                label="Teléfono"
                name="telefono"
                type="tel"
                required
                value={values.telefono}
                onChange={(v) => updateField("telefono", v)}
                invalid={invalidFields.has("telefono")}
              />
              <FormField
                label="Compañía"
                name="compania"
                required
                value={values.compania}
                onChange={(v) => updateField("compania", v)}
                invalid={invalidFields.has("compania")}
              />
              <FormField
                label="Cargo"
                name="cargo"
                value={values.cargo}
                onChange={(v) => updateField("cargo", v)}
              />

              <div className="field field--full flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="mensaje" className="font-head text-[0.8rem] font-medium text-white/90">
                  Escribe más información de tu solicitud
                </label>
                <textarea
                  id="mensaje"
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
                    invalidFields.has("consiento")
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

              <div className="hp absolute left-[-9999px] size-px overflow-hidden" aria-hidden="true">
                <label htmlFor="empresa">No llenar este campo</label>
                <input
                  type="text"
                  id="empresa"
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
                Ocurrió un error al enviar tu información. Por favor intenta de
                nuevo.
              </div>
            ) : null}

            {status === "success" ? (
              <div className="modal__success flex items-center gap-3 rounded-sm bg-white/5 px-4 py-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                  ✓
                </span>
                <p className="font-body text-sm text-white">
                  ¡Gracias! Tu información fue enviada correctamente. Nos
                  pondremos en contacto contigo pronto.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="font-head self-start rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C71268] disabled:opacity-60"
              >
                {status === "submitting" ? "Enviando…" : "Enviar Información"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
