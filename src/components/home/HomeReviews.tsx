import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { HOME_REVIEW_PLACEHOLDERS } from "@/data/home-page";

export function HomeReviews() {
  const [featured, ...rest] = HOME_REVIEW_PLACEHOLDERS;

  return (
    <section className="home-section home-section--muted" id="reviews">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Customer reviews</p>
          <h2 className="home-h2">What Customers Ask Us to Prioritise</h2>
          <p className="home-lead">
            We publish verified customer reviews only. Until those are
            confirmed, use project photos and a measured quotation conversation
            to evaluate fit.
          </p>
        </header>

        <div className="home-reviews-grid">
          <article className="home-review-card is-featured">
            <span className="home-placeholder-flag">Placeholder for replacement</span>
            <p>{featured.content}</p>
            <div className="home-review-meta">
              <span className="home-pill">{featured.city}</span>
              <span className="home-pill">{featured.service}</span>
            </div>
          </article>

          {rest.map((review) => (
            <article key={`${review.city}-${review.service}`} className="home-review-card">
              <span className="home-placeholder-flag">Placeholder</span>
              <p>{review.content}</p>
              <div className="home-review-meta">
                <span className="home-pill">{review.city}</span>
                <span className="home-pill">{review.service}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="home-cta-row">
          <Link href={ROUTES.testimonials} className="home-btn home-btn--outline">
            Read More Customer Reviews
          </Link>
          <Link
            href={ROUTES.gallery}
            className="home-btn home-btn--outline"
            style={{ marginInlineStart: "0.75rem" }}
          >
            View installation photos
          </Link>
        </div>
      </div>
    </section>
  );
}
