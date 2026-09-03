import {
  BUSINESS_CONFIG,
  getTelLink,
  isPhoneValidForProduction,
} from "@/config/business";

type PhoneNumberLinkProps = {
  className?: string;
  /** Show +91 formatting. Default true. */
  formatted?: boolean;
  /** Optional prefix text before the digits (kept outside the number). */
  prefix?: string;
};

/**
 * Always renders the real phone digits as a clickable `tel:` link.
 * Use this anywhere a number must be visible and tappable — not icon-only.
 */
export function PhoneNumberLink({
  className = "",
  formatted = true,
  prefix,
}: PhoneNumberLinkProps) {
  if (!isPhoneValidForProduction()) return null;

  const href = getTelLink();
  if (!href) return null;

  const number = formatted
    ? BUSINESS_CONFIG.phone.displayFormatted
    : BUSINESS_CONFIG.phone.display;

  return (
    <a
      href={href}
      className={`phone-number-link ${className}`.trim()}
      aria-label={`Call ${BUSINESS_CONFIG.phone.displayFormatted}`}
      data-track-conversion="phone_click"
    >
      {prefix ? <span className="phone-number-prefix">{prefix}</span> : null}
      <span className="phone-number-digits">{number}</span>
    </a>
  );
}
