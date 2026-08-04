import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
};

const paddingClasses = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

export function Card({
  children,
  className = "",
  as: Tag = "div",
  padding = "md",
  hover = false,
}: CardProps) {
  const surface = hover
    ? "ds-card"
    : "rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)]";

  return (
    <Tag className={`${surface} ${paddingClasses[padding]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
