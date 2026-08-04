import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type HeadingProps = {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  subtitle?: string;
  inverted?: boolean;
};

const levelClasses: Record<HeadingLevel, string> = {
  h1: "ds-h1",
  h2: "ds-h2",
  h3: "ds-h3",
  h4: "text-[length:var(--text-h4)] font-semibold leading-[var(--leading-snug)]",
};

export function Heading({
  as: Tag = "h2",
  children,
  className = "",
  id,
  eyebrow,
  subtitle,
  inverted = false,
}: HeadingProps) {
  const textColor = inverted ? "text-white" : "text-[var(--foreground)]";
  const subtitleColor = inverted
    ? "text-white/75"
    : "text-[var(--muted-foreground)]";
  const eyebrowColor = inverted
    ? "text-[var(--primary-300)]"
    : "text-[var(--primary-700)]";

  return (
    <div className={className}>
      {eyebrow ? (
        <p
          className={`mb-2 text-[length:var(--text-caption)] font-semibold uppercase tracking-[var(--tracking-wide)] ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className={`${levelClasses[Tag]} text-balance ${textColor}`}>
        {children}
      </Tag>
      {subtitle ? (
        <p
          className={`mt-3 max-w-3xl text-[length:var(--text-body)] leading-[var(--leading-relaxed)] sm:text-[length:var(--text-body-lg)] ${subtitleColor}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
