type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** max-width token: sm–4xl or default site container */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "default";
};

const sizeVar: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "var(--container-sm)",
  md: "var(--container-md)",
  lg: "var(--container-lg)",
  xl: "var(--container-xl)",
  "2xl": "var(--container-2xl)",
  "3xl": "var(--container-3xl)",
  "4xl": "var(--container-4xl)",
  default: "var(--container)",
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
