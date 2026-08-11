import Image from "next/image";
import Link from "next/link";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";
import { ROUTES } from "@/config/routes";
import { HOME_VISUAL_SERVICES } from "@/config/design";
import { HOME_MAIN_SERVICE_IMAGE_SRCS } from "@/data/home-page";

/**
 * Full services catalog (previous services list) — topic images only,
 * skipping any src already used in Main Services.
 */
export function HomeAllServices() {
  const services = HOME_VISUAL_SERVICES.filter(
    (service) => !HOME_MAIN_SERVICE_IMAGE_SRCS.has(service.image),
  );

  return (
    <section className="home-section home-section--soft" id="all-services">
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Our services</p>
          <h2 className="home-h2">
            Complete home &amp; building safety solutions
          </h2>
          <p className="home-lead">
            Full service list across Andhra Pradesh—each card uses a
            topic-matched photo (no duplicates from Main Services).
          </p>
        </header>

        <div className="home-all-services-grid">
          {services.map((service) => (
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
                  width={900}
                  height={700}
                  loading="lazy"
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  className="home-native-img"
                  style={{ width: "100%", height: "auto" }}
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
