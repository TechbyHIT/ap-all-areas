import Image from "next/image";
import Link from "next/link";
import { HOME_BENTO_SERVICES } from "@/data/home-page";

export function HomeServicesBento() {
  return (
    <section className="home-section home-section--white" id="services">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Main services</p>
          <h2 className="home-h2">
            Professional Safety Solutions for Every Space
          </h2>
          <p className="home-lead">
            Choose a service based on your property, opening and safety need.
            Full related photo first, then the service content for that topic.
          </p>
        </header>

        <div className="home-bento">
          {HOME_BENTO_SERVICES.map((service) => (
            <article
              key={service.name}
              className={`home-service-card${service.featured ? " is-featured" : ""}`}
            >
              <Link
                href={service.href}
                className="home-service-media"
                tabIndex={-1}
                aria-hidden
              >
                <Image
                  src={service.image}
                  alt={service.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  className="home-native-img"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
              <div className="home-service-body">
                <h3>
                  <Link href={service.href}>{service.name}</Link>
                </h3>
                <p>{service.summary}</p>
                <ul className="home-service-benefits">
                  {service.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div className="home-service-actions">
                  <Link href={service.href} className="view">
                    View Service
                  </Link>
                  <Link href={service.quoteHref} className="quote">
                    Get Quote
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
