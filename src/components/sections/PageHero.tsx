import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

type PageHeroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  badge?: string;
  image?: { src: string; alt: string };
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
  actions,
  breadcrumbs,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white ${className}`.trim()}
    >
      {breadcrumbs ? <div className="border-b border-zinc-200/80">{breadcrumbs}</div> : null}

      <Container className="py-10 md:py-14">
        <div
          className={
            image
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

          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 shadow-md">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
