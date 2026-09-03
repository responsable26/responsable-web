type FormFieldProps = {
  label: string;
  /**
   * id del <input>, y destino del htmlFor de su etiqueta. Va aparte de `name`
   * porque el formulario puede estar dos veces en la misma página —el modal de
   * contacto abierto sobre /proveedores/, por ejemplo— y los id han de ser
   * únicos en el documento aunque el name se repita.
   */
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  /**
   * Mensaje de error a mostrar, o undefined si el campo está bien. Es un texto
   * y no un booleano porque los motivos no son intercambiables: un obligatorio
   * vacío y una URL mal escrita necesitan decir cosas distintas.
   */
  error?: string;
  full?: boolean;
};

export function FormField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  error,
  full,
}: FormFieldProps) {
  return (
    <div
      className={`field flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}
    >
      <label
        htmlFor={id}
        className="font-head text-[0.8rem] font-medium text-white/90"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`font-body rounded-sm border bg-white px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-soft/60 focus:border-magenta ${
          error ? "is-invalid border-[#ff5a7a]" : "border-transparent"
        }`}
      />
      {error ? (
        <span id={`${id}-error`} className="text-xs text-[#ff8fa8]">
          {error}
        </span>
      ) : null}
    </div>
  );
}
