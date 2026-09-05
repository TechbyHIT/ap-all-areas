import Image from "next/image";
import Link from "next/link";
import {
  BUSINESS_CONFIG,
  getWhatsAppLink,
} from "@/config/business";
import { ROUTES } from "@/config/routes";
import { pickPageImage } from "@/lib/visual/page-image-pick";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";

/**
 * Homepage hero — one real installation photo, one value line, primary CTAs.
 * No repeated image-grid in the first viewport.
 */
export function HomeHeroPremium() {
  const wa = getWhatsAppLink(
    "Hello, I am sharing opening photos for a free estimate in Andhra Pradesh.",
  );
  const hero = pickPageImage({
    pageKey: "home-hero",
    serviceSlug: "invisible-grills",
  });

  return (
    <section
      className="relative isolate min-h-[78vh] overflow-hidden bg-[var(--secondary-950)] text-white"
      aria-labelledby="home-hero-heading"
    >
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--secondary-950)] via-[var(--secondary-950)]/55 to-[var(--secondary-950)]/25"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-[var(--container)] flex-col justify-end px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-300)]">
          {BUSINESS_CONFIG.name}
        </p>
        <h1
          id="home-hero-heading"
          className="mt-3 max-w-3xl font-display text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] font-semibold leading-[1.08] tracking-tight"
        >
          Safer balconies. Clearer views. Measured installation.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          Invisible grills, balcony safety nets, pigeon nets, sports nets and
          cloth hangers across Andhra Pradesh — start with a free photo
          estimate.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PhoneNumberLink className="inline-flex min-h-12 items-center rounded-xl bg-[var(--accent-500)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[var(--shadow-interactive)] transition hover:bg-[var(--accent-600)]" />
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#25d366] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              WhatsApp photo estimate
            </a>
          ) : null}
          <Link
            href={ROUTES.services}
            className="inline-flex min-h-12 items-center rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
}
