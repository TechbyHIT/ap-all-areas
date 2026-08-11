import { HOMEPAGE_CONTENT } from "@/data/static-page-content";

/** Long-form homepage SEO intro — encyclopaedic, honest service-area copy. */
export function HomeSeoIntro() {
  const paragraphs = HOMEPAGE_CONTENT.businessIntroduction
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      className="home-section home-section--white"
      aria-labelledby="home-seo-intro-heading"
    >
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Andhra Pradesh installation guide</p>
          <h2 id="home-seo-intro-heading">
            Invisible grills, safety nets and related protections—explained
          </h2>
          <p className="home-lead">
            Clear product definitions, honest coverage notes and a problem-first
            path from photos to measured quotation.
          </p>
        </header>
        <div className="home-seo-intro-prose">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
