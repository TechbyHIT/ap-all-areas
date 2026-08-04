"use client";

import {
  BUSINESS_CONFIG,
  getEmailLink,
  getTelLink,
  getWhatsAppLink,
  isPhoneValidForProduction,
} from "@/config/business";

/**
 * Right-side circular FABs (Call / WhatsApp / Email).
 */
export function FloatingContactButtons() {
  const phoneReady = isPhoneValidForProduction();
  const tel = getTelLink();
  const wa = getWhatsAppLink(
    "Hello, I would like a free quote and site inspection.",
  );
  const email = getEmailLink();

  return (
    <div className="floating-contact" aria-label="Quick contact">
      {phoneReady && tel ? (
        <a
          href={tel}
          className="is-call"
          aria-label={`Call ${BUSINESS_CONFIG.phone.displayFormatted}`}
          title={`Call ${BUSINESS_CONFIG.phone.displayFormatted}`}
        >
          <PhoneIcon />
        </a>
      ) : null}

      {phoneReady && wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="is-wa"
          aria-label="WhatsApp enquiry"
          title="WhatsApp enquiry"
        >
          <WhatsAppIcon />
        </a>
      ) : null}

      <a
        href={email}
        className="is-mail"
        aria-label="Email us"
        title="Email us"
      >
        <MailIcon />
      </a>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 3.4 17.8L2 22l4.3-1.3A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.8.8-2.5-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.3 7.3 0 0 1-2.2-1.3 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4s-1 1-1 2.4 1 2.8 1.2 3 .2.3 2 3.1c1.7 1.5 2 1.7 3.4 2.2.4.1.8.1 1.1.1.5 0 1.1-.3 1.3-.7s.5-1.1.4-1.3-.2-.3-.5-.4z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
