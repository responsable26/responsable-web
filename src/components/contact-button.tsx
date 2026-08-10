"use client";

import { useContactModal } from "@/context/contact-modal-context";

type Variant = "primary" | "dark" | "light";
type Size = "sm" | "md" | "lg";

/** Button variants from design-tokens.md §4. Base is pill except --primary,
 *  which uses --radius (see the header CTA decision). */
const VARIANTS: Record<Variant, string> = {
  primary: "rounded bg-magenta text-white hover:bg-[#C71268]",
  dark: "rounded-full bg-navy text-white hover:bg-[#1a2043]",
  light: "rounded-full bg-white text-navy hover:bg-off-white",
};

/**
 * El tamaño es una prop y no una clase pasada por `className` a propósito: la
 * cascada de Tailwind resuelve `px-6` y `px-8` por orden en la hoja generada,
 * no por orden en el atributo, así que sobrescribir el padding desde fuera
 * funciona por casualidad. `lg` existe para el CTA del footer, que debe leerse
 * como acción principal frente al botón del header.
 */
const SIZES: Record<Size, string> = {
  /** Para botones embebidos en listas o acordeones: por debajo del CTA del
   *  header (px-4 py-2.5), para que no compitan con él. */
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function ContactButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const { open } = useContactModal();

  return (
    <button
      type="button"
      onClick={open}
      className={`font-head shrink-0 font-semibold transition-colors ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
