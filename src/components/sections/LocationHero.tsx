import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

type LocationHeroProps = {
  badge?: string;
  title: string;
  description: string;
  coverageMessage?: string;
  image?: { src: string; alt: string };
  /** Default false — SEO hubs prefer content + links over decorative hero media. */
  showImage?: boolean;
  trustLine?: string;
  breadcrumbs?: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  className?: string;
};

export function LocationHero({
  badge,
  title,
  description,
  coverageMessage = "Service availability in this location is confirmed after reviewing site access, measurements and technician scheduling. Listing an area does not mean we operate a local branch there.",
  image,
  showImage = false,
  trustLine = "Honest coverage confirmation before scheduling",
  breadcrumbs,
  breadcrumbItems,
  className = "",
}: LocationHeroProps) {
  const heroImage = image ?? {
    src: HERO_FALLBACK,
    alt: "Local safety installation coverage",
  };

  return (
    <section
      className={`border-b border-zinc-200 bg-gradient-to-b from-[var(--primary-50)] via-white to-white ${className}`.trim()}
    >
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
              <Link
                href={ROUTES.contact}
                className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
              >
                Check Coverage & Quote
              </Link>
              <Link
                href={ROUTES.services}
                className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                View Services
              </Link>
              <Link
                href={ROUTES.locations}
                className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                All AP locations
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500">{trustLine}</p>
          </div>

          {showImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 shadow-md">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
