import type { ReactNode } from "react";
import { HERO_SCROLL_IMAGES } from "@/config/installation-photos";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { HeroImageScroll } from "@/components/ui/HeroImageScroll";

type PageHeroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  badge?: string;
  image?: { src: string; alt: string };
  gallery?: readonly { src: string; alt: string }[];
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
};

export function PageHero({
  title,
  description,
  eyebrow,
  badge,
  image,
  gallery,
  actions,
  breadcrumbs,
  className = "",
}: PageHeroProps) {
  const scrollImages =
    gallery && gallery.length > 0
      ? gallery
      : image
        ? [image, ...HERO_SCROLL_IMAGES.slice(0, 6)]
        : HERO_SCROLL_IMAGES.slice(0, 8);

  const withImage = scrollImages.length > 0;

  return (
    <section
      className={`border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white ${className}`.trim()}
    >
      {breadcrumbs ? <div className="border-b border-zinc-200/80">{breadcrumbs}</div> : null}

      <Container className="py-10 md:py-14">
        <div
          className={
            withImage
              ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              : "max-w-3xl"
          }
        >
          <div>
            {badge ? (
              <Badge variant="brand" className="mb-3">
                {badge}
              </Badge>
            ) : null}

            {eyebrow ? (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--primary-700)]">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="text-[clamp(1.875rem,1.1rem+2.8vw,3rem)] font-bold tracking-tight leading-tight text-zinc-900">
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                {description}
              </p>
            ) : null}

            {actions ? (
              <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
            ) : null}
          </div>

          {withImage ? (
            <HeroImageScroll images={scrollImages} variant="panel" />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
