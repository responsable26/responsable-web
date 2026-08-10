type ChevronIconProps = {
  direction?: "left" | "right" | "down";
  className?: string;
};

export function ChevronIcon({ direction = "right", className }: ChevronIconProps) {
  const rotation = {
    left: "rotate-180",
    right: "rotate-0",
    down: "rotate-90",
  }[direction];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${rotation} ${className ?? ""}`}
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
