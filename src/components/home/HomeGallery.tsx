import Image from "next/image";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { HOME_MAIN_SERVICE_IMAGE_SRCS } from "@/data/home-page";
import { HOME_VISUAL_SERVICES } from "@/config/design";

/**
 * Remaining installation photos as a natural-ratio wall — skips srcs already
 * used in Main Services / Our Services so nothing duplicates.
 */
export function HomeGallery() {
  const used = new Set([
    ...HOME_MAIN_SERVICE_IMAGE_SRCS,
    ...HOME_VISUAL_SERVICES.map((s) => s.image),
  ]);
  const photos = INSTALLATION_PHOTOS.filter((photo) => !used.has(photo.src));

  if (photos.length === 0) return null;

  return (
    <section className="home-section home-section--white" id="projects">
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Project photos</p>
          <h2 className="home-h2">More installation photos</h2>
          <p className="home-lead">
            Extra project shots not shown in the service cards above—full image,
            natural aspect ratio.
          </p>
        </header>

        <div className="home-photo-wall home-photo-wall--native" role="list">
          {photos.map((photo) => (
            <figure
              key={photo.src}
              className="home-photo-wall-item"
              role="listitem"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={900}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
                className="home-native-img"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
