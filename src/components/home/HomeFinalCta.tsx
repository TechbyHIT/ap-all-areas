import {
  BUSINESS_CONFIG,
  getTelLink,
  getWhatsAppLink,
} from "@/config/business";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

export function HomeFinalCta() {
  const tel = getTelLink();
  const wa = getWhatsAppLink(
    "Hello, I am sharing opening photos for a free estimate in Andhra Pradesh.",
  );

  return (
    <section className="home-final-cta" id="get-quote">
      <div className="home-container">
        <h2>Make Your Balcony, Windows and Open Spaces Safer</h2>
        <p>
          Share your requirement and receive guidance for the most suitable
          installation option.
        </p>

        <div className="home-final-actions">
          {wa ? (
            <a href={wa} className="wa">
              WhatsApp Your Photos
            </a>
          ) : null}
          {tel ? (
            <a href={tel} className="call">
              Call Now
            </a>
          ) : null}
          <Link href={ROUTES.contact} className="quote">
            Request a Quote
          </Link>
        </div>

        <div className="home-final-meta">
          <p>Phone: {BUSINESS_CONFIG.phone.displayFormatted}</p>
          <p>WhatsApp available for photo estimates during business hours</p>
          <p>
            Major cities: Visakhapatnam, Vijayawada, Guntur, Tirupati,
            Rajahmundry, Kakinada and nearby Andhra Pradesh areas
          </p>
          <p>
            Measured quotations · Clear inclusions · Service-area installation
            support
          </p>
        </div>
      </div>
    </section>
  );
}

export { HomeFinalCta as HomeFinalCTA };