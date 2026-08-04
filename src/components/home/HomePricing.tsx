import Link from "next/link";
import {
  getWhatsAppLink,
} from "@/config/business";
import { HOMEPAGE_CONTENT } from "@/data/static-page-content";
import { HOME_PRICE_FACTORS } from "@/data/home-page";

export function HomePricing() {
  const wa = getWhatsAppLink(
    "Hello, I am sharing opening photos for a free estimate in Andhra Pradesh.",
  );

  return (
    <section className="home-section home-section--white" id="pricing">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Pricing &amp; quotation</p>
          <h2 className="home-h2">What Determines Your Installation Cost?</h2>
          <p className="home-lead">
            {HOMEPAGE_CONTENT.pricingFactorsExplanation}
          </p>
        </header>

        <div className="home-price-grid">
          <ul className="home-factor-list">
            {HOME_PRICE_FACTORS.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>

          <aside className="home-quote-card">
            <h3>Get a measured estimate</h3>
            <ol>
              <li>Send photos of the opening</li>
              <li>Share approximate measurements if known</li>
              <li>Receive a measured estimate after review</li>
            </ol>
            <div className="home-cta-row">
              {wa ? (
                <a href={wa} className="home-btn" style={{ background: "#16a34a" }}>
                  Send Photos for Estimate
                </a>
              ) : (
                <Link href="/contact/" className="home-btn">
                  Request a Quote
                </Link>
              )}
            </div>
            <p className="home-note" style={{ color: "#94a3b8" }}>
              Also see the{" "}
              <Link href="/pricing-guide/" style={{ color: "#93c5fd" }}>
                pricing guide
              </Link>
              .
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
