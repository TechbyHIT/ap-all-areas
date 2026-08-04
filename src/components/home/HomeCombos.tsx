import Link from "next/link";
import { HOME_COMBOS } from "@/data/home-page";

export function HomeCombos() {
  return (
    <section className="home-section home-section--white" id="combinations">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Frequently installed together</p>
          <h2 className="home-h2">Helpful Service Combinations</h2>
          <p className="home-lead">
            Many homes need more than one opening solution. These combinations
            explain common pairings with links to the relevant pages.
          </p>
        </header>

        <div className="home-combo-grid">
          {HOME_COMBOS.map((combo) => (
            <article key={combo.title} className="home-combo-card">
              <h3>{combo.title}</h3>
              <p>{combo.why}</p>
              <div className="home-combo-links">
                {combo.links.map((link) => (
                  <Link key={link.href + link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
