import { getWhatsAppLink } from "@/config/business";

export function TopBar() {
  const wa = getWhatsAppLink("Hello, I need a free quote.");

  return (
    <div className="top-bar">
      <div className="top-bar-inner top-bar-desktop">
        <div className="top-bar-left">
          <span>
            Professional Invisible Grills &amp; Safety Solutions Across Andhra
            Pradesh
          </span>
        </div>
        <div className="top-bar-right">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="top-bar-wa hover:opacity-90"
              aria-label="WhatsApp for a free quote"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>

      <div className="top-bar-mobile">
        <span>Serving Andhra Pradesh · Get Free Estimate</span>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="top-bar-wa"
            aria-label="WhatsApp for a free quote"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
