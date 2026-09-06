type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** max-width token: sm–4xl or default site container */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "default";
};

const sizeVar: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "var(--shell-sm)",
  md: "var(--shell-md)",
  lg: "var(--shell-lg)",
  xl: "var(--shell-xl)",
  "2xl": "var(--shell-2xl)",
  "3xl": "var(--shell-3xl)",
  "4xl": "var(--shell-4xl)",
  default: "var(--shell)",
};

export function Container({
  children,
  className = "",
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={`ds-container ${className}`.trim()}
      style={{ maxWidth: sizeVar[size] }}
    >
      {children}
    </div>
  );
}
