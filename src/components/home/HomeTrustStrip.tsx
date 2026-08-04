import { HOME_TRUST_STATS } from "@/data/home-page";

export function HomeTrustStrip() {
  return (
    <section className="home-trust" aria-label="Service highlights">
      <div className="home-container">
        <div className="home-trust-panel">
          {HOME_TRUST_STATS.map((stat) => (
            <div key={stat.label} className="home-trust-item">
              <p className="home-trust-value">{stat.value}</p>
              <p className="home-trust-label">{stat.label}</p>
              <p className="home-trust-detail">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
