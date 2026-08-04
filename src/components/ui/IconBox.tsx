import type { ReactNode } from "react";

type IconBoxSize = "sm" | "md" | "lg";
type IconBoxTone = "brand" | "accent" | "muted";

type IconBoxProps = {
  children: ReactNode;
  size?: IconBoxSize;
  tone?: IconBoxTone;
  className?: string;
};

const sizeClasses: Record<IconBoxSize, string> = {
  sm: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-14 w-14 [&_svg]:h-6 [&_svg]:w-6",
};

const toneClasses: Record<IconBoxTone, string> = {
  brand: "bg-[var(--primary-50)] text-[var(--primary-700)]",
  accent: "bg-[var(--accent-50)] text-[var(--accent-800)]",
  muted: "bg-[var(--neutral-100)] text-[var(--neutral-700)]",
};

export function IconBox({
  children,
  size = "md",
  tone = "brand",
  className = "",
}: IconBoxProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${sizeClasses[size]} ${toneClasses[tone]} ${className}`.trim()}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
