import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "muted" | "ink" | "brand";
};

const variantClasses = {
  default: "bg-[var(--background)]",
  muted: "ds-section--muted",
  ink: "ds-section--ink",
  brand: "ds-section--ink",
} as const;

export function Section({
  children,
  className = "",
  id,
  variant = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`ds-section ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
