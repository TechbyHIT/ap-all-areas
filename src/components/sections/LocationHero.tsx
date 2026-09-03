import type { ReactNode } from "react";
import Link from "next/link";
import { HERO_SCROLL_IMAGES } from "@/config/installation-photos";
import { ROUTES } from "@/config/routes";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HeroImageScroll } from "@/components/ui/HeroImageScroll";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import type { HeroComposition } from "@/lib/visual/page-composition";

type LocationHeroProps = {
  badge?: string;
  title: string;
  description: string;
  coverageMessage?: string;
  image?: { src: string; alt: string };
  gallery?: readonly { src: string; alt: string }[];
  showImage?: boolean;
  trustLine?: string;
  breadcrumbs?: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  /** §136 — city vs locality visual strategy */
  composition?: Extract<
    HeroComposition,
    "city-context" | "locality-orient" | "property-context"
  >;
  className?: string;
};

/**
 * Location hero — city / locality compositions share brand tokens but differ
 * in shell treatment and CTA emphasis (§134–136, §151–152).
 */
export function LocationHero({
  badge,
  title,
  description,
  coverageMessage = "Service availability in this location is confirmed after reviewing site access, measurements and technician scheduling. Listing an area does not mean we operate a local branch there.",
  image,
  gallery,
  showImage = true,
  trustLine = "Honest coverage confirmation before scheduling",
  breadcrumbs,
  breadcrumbItems,
  composition = "city-context",
  className = "",
}: LocationHeroProps) {
  const scrollImages =
    gallery && gallery.length > 0
      ? gallery
      : image
        ? [image, ...HERO_SCROLL_IMAGES.slice(0, 6)]
        : HERO_SCROLL_IMAGES.slice(0, 8);

  const isLocality = composition === "locality-orient";
  const shellClass = isLocality
    ? "border-b border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-[var(--primary-50)]"
    : "border-b border-zinc-200 bg-gradient-to-br from-[var(--primary-50)] via-white to-zinc-50";

  const secondaryCtaLabel = isLocality
    ? "Confirm visit & quote"
    : "Check Coverage & Quote";

  return (
    <section className={`${shellClass} ${className}`.trim()}>
      {breadcrumbs ??
        (breadcrumbItems ? <Breadcrumbs items={breadcrumbItems} /> : null)}

      <Container className="py-10 md:py-14">
        <div
          className={
            showImage
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

            <h1 className="text-[clamp(1.875rem,1.1rem+2.8vw,3rem)] font-bold tracking-tight leading-tight text-zinc-900">
              {title}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              {description}
            </p>

            <p className="mt-4 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
              {coverageMessage}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <PhoneNumberLink className="inline-flex min-h-11 items-center rounded-xl bg-[var(--primary-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-700)]" />
              <Link
                href={ROUTES.contact}
                className={
                  isLocality
                    ? "inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                    : "inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
                }
              >
                {secondaryCtaLabel}
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500">{trustLine}</p>
          </div>

          {showImage ? (
            <HeroImageScroll images={scrollImages} variant="panel" fit="cover" />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
