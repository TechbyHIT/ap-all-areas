import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-lg)] px-5 py-2.5 text-sm font-semibold tracking-tight transition-[background-color,color,border-color,transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary-600)] text-white shadow-[var(--shadow-interactive)] hover:bg-[var(--primary-700)] focus-visible:outline-[var(--primary-500)]",
  secondary:
    "bg-[var(--secondary-950)] text-white hover:bg-[var(--secondary-900)] focus-visible:outline-[var(--secondary-800)]",
  outline:
    "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--hover)] focus-visible:outline-[var(--primary-400)]",
  whatsapp:
    "bg-[var(--whatsapp)] text-white hover:bg-[var(--whatsapp-dark)] focus-visible:outline-[var(--whatsapp)]",
  ghost:
    "border border-white/70 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white",
};

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("https://wa.me")
  );
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    className = "",
    disabled,
    ...rest
  } = props;
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    if (isExternalHref(href)) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
