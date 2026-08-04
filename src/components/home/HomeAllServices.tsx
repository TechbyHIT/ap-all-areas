import Image from "next/image";
import Link from "next/link";
import { getTelLink } from "@/config/business";
import { ROUTES } from "@/config/routes";
import { HOME_VISUAL_SERVICES } from "@/config/design";

/**
 * Full visual services catalog — image-above cards matching the
 * "Complete home & building safety solutions" layout.
 */
export function HomeAllServices() {
  const tel = getTelLink();

  return (
    <section className="home-section home-section--soft" id="all-services">
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Our services</p>
          <h2 className="home-h2">
            Complete home &amp; building safety solutions
          </h2>
          <p className="home-lead">
            Every major installation type we offer across Andhra Pradesh—with
            real project photos, clear scope and measured quotations.
          </p>
        </header>

        <div className="home-all-services-grid">
          {HOME_VISUAL_SERVICES.map((service) => (
            <article key={service.name} className="home-svc-tile">
              <Link
                href={service.href}
                className="home-svc-tile-media"
                tabIndex={-1}
                aria-hidden
              >
                <Image
                  src={service.image}
                  alt={service.alt}
                  width={640}
                  height={400}
                  loading="lazy"
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                />
              </Link>
              <div className="home-svc-tile-body">
                <h3>
                  <Link href={service.href}>{service.name}</Link>
                </h3>
                <p>{service.summary}</p>
                <div className="home-svc-tile-actions">
                  <Link href={service.href} className="view">
                    View Details
                    <span aria-hidden> →</span>
                  </Link>
                  {tel ? (
                    <a href={tel} className="call">
                      Call
                    </a>
                  ) : (
                    <Link href={ROUTES.contact} className="call">
                      Call
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="home-all-services-cta">
          <Link href={ROUTES.services} className="home-all-services-all">
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
