"use client";

import {
  BUSINESS_CONFIG,
  getEmailLink,
  getTelLink,
  getWhatsAppLink,
  isPhoneValidForProduction,
} from "@/config/business";

/**
 * Right-side vertical stack of circular icon FABs (no bottom bar, no text).
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
          title={BUSINESS_CONFIG.phone.displayFormatted}
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
        aria-label={`Email ${BUSINESS_CONFIG.email}`}
        title={BUSINESS_CONFIG.email}
      >
        <MailIcon />
      </a>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 3.4 17.8L2 22l4.3-1.3A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.8.8-2.5-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.3 7.3 0 0 1-2.2-1.3 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4s-1 1-1 2.4 1 2.8 1.2 3 .2.3 2 3.1c1.7 1.5 2 1.7 3.4 2.2.4.1.8.1 1.1.1.5 0 1.1-.3 1.3-.7s.5-1.1.4-1.3-.2-.3-.5-.4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
