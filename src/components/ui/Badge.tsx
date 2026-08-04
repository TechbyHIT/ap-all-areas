import type { ReactNode } from "react";

type BadgeVariant = "default" | "brand" | "accent" | "outline";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-100 text-zinc-700",
  brand: "bg-[var(--brand-soft)] text-[var(--primary-800)]",
  accent: "bg-green-50 text-green-800",
  outline: "border border-zinc-300 bg-white text-zinc-700",
};

export function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
