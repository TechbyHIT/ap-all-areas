import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { HOMEPAGE_CONTENT } from "@/data/static-page-content";
import { HOME_WHY_BENEFITS } from "@/data/home-page";

export function HomeWhyChoose() {
  return (
    <section className="home-section home-section--soft" id="why-choose-us">
      <div className="home-container">
        <div className="home-why-grid">
          <div className="home-why-media">
            <div className="home-why-frame">
              <Image
                src="/images/projects/balcony-invisible-grills-10.jpg"
                alt="Professional balcony safety installation finish"
                width={800}
                height={1000}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
            <div className="home-why-badge">
              <strong>Quality-focused fitting</strong>
              <span>Measured openings · Written scope · Neat handover</span>
            </div>
          </div>

          <div>
            <p className="home-eyebrow">Why choose us</p>
            <h2 className="home-h2">Safety Designed Around Your Property</h2>
            <p className="home-lead">
              Start with the opening problem, then confirm materials and fixing
              after measurement—so the recommendation matches how the space is
              used.
            </p>

            <ul className="home-benefit-list">
              {HOME_WHY_BENEFITS.map((item, index) => (
                <li key={item.title}>
                  <span className="home-benefit-icon" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="home-cta-row">
              <Link href={ROUTES.contact} className="home-btn">
                Book a Site Inspection
              </Link>
            </div>

            <div className="home-seo-prose">
              {HOMEPAGE_CONTENT.businessIntroduction
                .split("\n\n")
                .slice(0, 2)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
