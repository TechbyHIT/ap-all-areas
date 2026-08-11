import Link from "next/link";
import {
  BUSINESS_CONFIG,
  getWhatsAppLink,
} from "@/config/business";
import { HERO_SCROLL_IMAGES } from "@/config/installation-photos";
import { ROUTES } from "@/config/routes";
import { HeroImageScroll } from "@/components/ui/HeroImageScroll";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";

export function HomeHeroPremium() {
  const wa = getWhatsAppLink(
    "Hello, I am sharing opening photos for a free estimate in Andhra Pradesh.",
  );

  return (
    <section className="home-hero home-hero--bleed" aria-labelledby="home-hero-heading">
      <HeroImageScroll images={HERO_SCROLL_IMAGES} variant="bleed" fit="cover" />

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
            <PhoneNumberLink className="btn-secondary-hero phone-cta" />
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
