import Image from "next/image";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";

/**
 * All installation photos as a clean photo wall — images only, no content cards.
 */
export function HomeGallery() {
  return (
    <section className="home-section home-section--white" id="projects">
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Project photos</p>
          <h2 className="home-h2">Installation gallery</h2>
        </header>

        <div className="home-photo-wall" role="list">
          {INSTALLATION_PHOTOS.map((photo) => (
            <figure key={photo.src} className="home-photo-wall-item" role="listitem">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={900}
                height={700}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
