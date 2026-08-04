import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { HOME_PROCESS_STEPS } from "@/data/home-page";

export function HomeProcess() {
  return (
    <section className="home-section home-section--muted" id="process">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Installation process</p>
          <h2 className="home-h2">From Enquiry to Professional Fitting</h2>
          <p className="home-lead">
            A clear sequence keeps decisions useful before any drilling starts.
          </p>
        </header>

        <ol className="home-timeline">
          {HOME_PROCESS_STEPS.map((step, index) => (
            <li key={step.title} className="home-step">
              <span className="home-step-num" aria-hidden>
                {index + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="home-cta-row">
          <Link href={ROUTES.contact} className="home-btn">
            Start with a Free Measurement Discussion
          </Link>
          <Link
            href="/installation-process/"
            className="home-btn home-btn--outline"
            style={{ marginInlineStart: "0.75rem" }}
          >
            Full process guide
          </Link>
        </div>
      </div>
    </section>
  );
}