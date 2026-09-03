import type { ReactNode } from "react";
import Image from "next/image";
import { HERO_SCROLL_IMAGES } from "@/config/installation-photos";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { HeroImageScroll } from "@/components/ui/HeroImageScroll";
import type { HeroComposition } from "@/lib/visual/page-composition";
import { ASPECT_RATIOS } from "@/lib/visual/visual-quality";

type HeroImage = { src: string; alt: string; caption?: string | null };

type PremiumPageHeroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  badge?: string;
  trustNote?: string;
  image?: HeroImage;
  gallery?: readonly HeroImage[];
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  /** §136 composition varies by page type */
  composition?: HeroComposition;
  className?: string;
};

/**
 * Premium page hero (§134–136, §160).
 * Same brand tokens; different composition per page strategy.
 */
export function PremiumPageHero({
  title,
  description,
  eyebrow,
  badge,
  trustNote,
  image,
  gallery,
  actions,
  breadcrumbs,
  composition = "service-split",
  className = "",
}: PremiumPageHeroProps) {
  const scrollImages: HeroImage[] =
    gallery && gallery.length > 0
      ? [...gallery]
      : image
        ? [image, ...HERO_SCROLL_IMAGES.slice(0, 4).map((p) => ({ src: p.src, alt: p.alt }))]
        : HERO_SCROLL_IMAGES.slice(0, 6).map((p) => ({ src: p.src, alt: p.alt }));

  const primary: HeroImage | undefined = image ?? scrollImages[0];
  const isEditorial = composition === "editorial";
  const isProject = composition === "project-gallery-lead";
  const isDecision = composition === "decision-split";
  const isCityish =
    composition === "city-context" ||
    composition === "locality-orient" ||
    composition === "property-context";

  if (isEditorial) {
    return (
      <section
        className={`border-b border-zinc-200 bg-[var(--neutral-50)] ${className}`.trim()}
      >
        {breadcrumbs ? (
          <div className="border-b border-zinc-200/80">{breadcrumbs}</div>
        ) : null}
        <Container className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
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
            <h1 className="text-[clamp(1.875rem,1.1rem+2.8vw,3rem)] font-bold tracking-tight text-zinc-900">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {actions}
              </div>
            ) : null}
            {trustNote ? (
              <p className="mt-4 text-sm text-zinc-500">{trustNote}</p>
            ) : null}
          </div>
          {primary ? (
            <div
              className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl bg-zinc-100"
              style={{ aspectRatio: ASPECT_RATIOS.hero }}
            >
              <Image
                src={primary.src}
                alt={primary.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </section>
    );
  }

  if (isProject && primary) {
    return (
      <section className={`bg-zinc-950 text-white ${className}`.trim()}>
        {breadcrumbs ? (
          <div className="border-b border-white/10 bg-zinc-950">{breadcrumbs}</div>
        ) : null}
        <div className="relative min-h-[52vh] w-full">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          <Container className="relative flex min-h-[52vh] flex-col justify-end py-12">
            {badge ? (
              <span className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {badge}
              </span>
            ) : null}
            <h1 className="max-w-3xl text-[clamp(1.875rem,1.1rem+2.8vw,3rem)] font-bold tracking-tight">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
            ) : null}
            {primary.caption ? (
              <p className="mt-4 text-sm text-white/70">{primary.caption}</p>
            ) : null}
          </Container>
        </div>
      </section>
    );
  }

  const shellClass = isCityish
    ? "border-b border-zinc-200 bg-gradient-to-br from-[var(--primary-50)] via-white to-zinc-50"
    : isDecision
      ? "border-b border-zinc-200 bg-white"
      : "border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white";

  return (
    <section className={`${shellClass} ${className}`.trim()}>
      {breadcrumbs ? (
        <div className="border-b border-zinc-200/80">{breadcrumbs}</div>
      ) : null}

      <Container className="py-10 md:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
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
            {trustNote ? (
              <p className="mt-3 text-sm font-medium text-zinc-500">{trustNote}</p>
            ) : null}
            {actions ? (
              <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
            ) : null}
          </div>

          {scrollImages.length > 0 ? (
            <HeroImageScroll
              images={scrollImages}
              variant="panel"
              fit="cover"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
