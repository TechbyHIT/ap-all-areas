import Image from "next/image";
import Link from "next/link";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";
import { ROUTES } from "@/config/routes";
import { HOME_BENTO_SERVICES } from "@/data/home-page";

/**
 * Full visual services catalog — all 24 installation photos as content cards
 * (same pattern as Children Safety Nets / Main Services).
 */
export function HomeAllServices() {
  return (
    <section className="home-section home-section--soft" id="all-services">
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Our services</p>
          <h2 className="home-h2">
            Complete home &amp; building safety solutions
          </h2>
          <p className="home-lead">
            Every recent project photo with service content—invisible grills,
            children safety nets, sports nets, cloth hangers and more across
            Andhra Pradesh.
          </p>
        </header>

        <div className="home-all-services-grid">
          {HOME_BENTO_SERVICES.map((service) => (
            <article key={service.image} className="home-svc-tile">
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
                <ul className="home-service-benefits">
                  {service.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div className="home-svc-tile-actions">
                  <Link href={service.href} className="view">
                    View Details
                    <span aria-hidden> →</span>
                  </Link>
                  <PhoneNumberLink className="call" />
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
