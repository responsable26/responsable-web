"use client";

import { useContactModal } from "@/context/contact-modal-context";

type Variant = "primary" | "dark" | "light";

/** Button variants from design-tokens.md §4. Base is pill except --primary,
 *  which uses --radius (see the header CTA decision). */
const VARIANTS: Record<Variant, string> = {
  primary: "rounded bg-magenta text-white hover:bg-[#C71268]",
  dark: "rounded-full bg-navy text-white hover:bg-[#1a2043]",
  light: "rounded-full bg-white text-navy hover:bg-off-white",
};

export function ContactButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const { open } = useContactModal();

  return (
    <button
      type="button"
      onClick={open}
      className={`font-head shrink-0 px-6 py-3 text-sm font-semibold transition-colors ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
