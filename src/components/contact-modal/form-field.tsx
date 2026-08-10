type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  full?: boolean;
};

export function FormField({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  invalid,
  full,
}: FormFieldProps) {
  return (
    <div className={`field flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={name} className="font-head text-[0.8rem] font-medium text-white/90">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className={`font-body rounded-sm border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-magenta ${
          invalid ? "is-invalid border-[#ff5a7a]" : "border-transparent"
        }`}
      />
      {invalid ? <span className="text-xs text-[#ff8fa8]">Este campo es obligatorio.</span> : null}
    </div>
  );
}
