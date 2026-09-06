import type { ReactNode } from "react";
import Link from "next/link";
import {
  getWhatsAppLink,
} from "@/config/business";
import { installationPhotosForService } from "@/config/installation-photos";
import { ROUTES } from "@/config/routes";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HeroLcpImage } from "@/components/ui/HeroLcpImage";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import type { HeroComposition } from "@/lib/visual/page-composition";

type ServiceHeroProps = {
  badge?: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  /** API compat — only the first image is used for LCP. */
  gallery?: readonly { src: string; alt: string }[];
  /** When set, prefers a matching installation photo. */
  serviceSlug?: string;
  /** Hide the hero media panel (SEO / content-first landings). */
  showImage?: boolean;
  trustLine?: string;
  breadcrumbs?: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  quoteHref?: string;
  /** Prefill for WhatsApp photo-estimate CTA */
  whatsappMessage?: string;
  /** §136 — service vs service+geo composition */
  composition?: Extract<
    HeroComposition,
    | "service-split"
    | "service-local-split"
    | "locality-service-split"
  >;
  className?: string;
};

export function ServiceHero({
  badge,
  title,
  description,
  image,
  gallery,
  serviceSlug,
  showImage = true,
  trustLine = "Send a photo for estimate · Quotation after site measurement",
  breadcrumbs,
  breadcrumbItems,
  quoteHref = ROUTES.contact,
  whatsappMessage = "Hello, I am sharing opening photos for a free estimate in Andhra Pradesh.",
  composition = "service-split",
  className = "",
}: ServiceHeroProps) {
  const wa = getWhatsAppLink(whatsappMessage);

  const primary = (() => {
    if (image?.src) return image;
    if (gallery && gallery.length > 0) return gallery[0];
    if (serviceSlug) {
      const list = installationPhotosForService(serviceSlug);
      if (list[0]) return list[0];
    }
    return installationPhotosForService("safety-nets")[0];
  })();

  const withImage = showImage && Boolean(primary?.src);
  const isLocalMoney =
    composition === "service-local-split" ||
    composition === "locality-service-split";
  const shellClass = isLocalMoney
    ? "border-b border-zinc-200 bg-gradient-to-br from-[var(--primary-50)] via-white to-zinc-50"
    : "border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white";

  return (
    <section className={`${shellClass} ${className}`.trim()}>
      {breadcrumbs ??
        (breadcrumbItems ? <Breadcrumbs items={breadcrumbItems} /> : null)}

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

            <h1 className="text-[clamp(1.875rem,1.1rem+2.8vw,3rem)] font-bold tracking-tight leading-tight text-zinc-900">
              {title}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-xl bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                >
                  Send a Photo for Estimate
                </a>
              ) : null}
              <PhoneNumberLink className="inline-flex min-h-11 items-center rounded-xl bg-[var(--primary-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-interactive)] transition hover:bg-[var(--primary-700)]" />
              <Link
                href={quoteHref}
                className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                Request measured quote
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500">{trustLine}</p>
          </div>

          {withImage && primary ? (
            <HeroLcpImage src={primary.src} alt={primary.alt} />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
