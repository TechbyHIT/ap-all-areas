import Image from "next/image";
import Link from "next/link";
import {
  BUSINESS_CONFIG,
  getTelLink,
  getWhatsAppLink,
} from "@/config/business";
import { HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";

export function HomeHeroPremium() {
  const tel = getTelLink();
  const wa = getWhatsAppLink(
    "Hello, I am sharing opening photos for a free estimate in Andhra Pradesh.",
  );

  return (
    <section className="home-hero home-hero--bleed" aria-labelledby="home-hero-heading">
      <div className="home-hero-media-bleed" aria-hidden>
        <Image
          src={HERO_FALLBACK}
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-media-bleed-img"
        />
        <div className="home-hero-scrim" />
      </div>

      <div className="home-container home-hero-inner">
        <div className="home-hero-center">
          <p className="home-hero-brand">{BUSINESS_CONFIG.name}</p>

          <h1 id="home-hero-heading">
            Premium Invisible Grills &amp; Safety Nets
          </h1>

          <p className="home-hero-tagline">
            Safe, stylish and secure protection for homes across Andhra Pradesh
          </p>

          <p className="home-hero-desc">
            Professional installation for apartments, villas, balconies, windows
            and sports spaces. Share photos for a clear measured quotation.
          </p>

          <div className="home-hero-actions">
            {tel ? (
              <a href={tel} className="btn-secondary-hero">
                <PhoneIcon />
                Call Now
              </a>
            ) : null}
            {wa ? (
              <a href={wa} className="btn-primary-hero">
                <WhatsAppIcon />
                WhatsApp Us
              </a>
            ) : null}
          </div>

          <Link href={ROUTES.services} className="home-hero-link">
            Explore all services
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 3.4 17.8L2 22l4.3-1.3A11 11 0 1 0 20.5 3.5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
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
