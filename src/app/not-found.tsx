import Link from "next/link";
import { HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function NotFound() {
  return (
    <>
      <PageHero
        badge="404"
        title="Page not found"
        description="The page you are looking for does not exist or may have been moved. Use the links below to continue browsing our services and locations."
        image={{
          src: HERO_FALLBACK,
          alt: "Page not found — continue to services and contact",
        }}
        actions={
          <>
            <Link
              href={ROUTES.home}
              className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            >
              Go home
            </Link>
            <Link
              href={ROUTES.contact}
              className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
            >
              Contact us
            </Link>
          </>
        }
      />

      <RelatedGuides
        title="Helpful Places to Continue"
        description="Popular destinations while you find the right page."
        guides={[
          {
            title: "Our Services",
            href: ROUTES.services,
            summary:
              "Invisible grills, safety nets, sports nets and cloth drying hangers across Andhra Pradesh.",
          },
          {
            title: "Service Locations",
            href: ROUTES.locations,
            summary:
              "Browse cities and districts. Coverage is confirmed after site review — not a branch map.",
          },
          {
            title: "Request a Quote",
            href: ROUTES.contact,
            summary:
              "Share your city, area and requirement for measurement and quotation next steps.",
          },
          {
            title: "Pricing Guide",
            href: "/pricing-guide/",
            summary:
              "Understand what affects installation cost before requesting a quote.",
          },
          {
            title: "FAQ",
            href: ROUTES.faq,
            summary:
              "Common questions about coverage, materials, measurement and installation.",
          },
          {
            title: "Safety Guide",
            href: "/safety-guide/",
            summary:
              "Usage and maintenance safety information for homes and practice areas.",
          },
        ]}
      />

      <FinalCTA
        title="Need Help Finding the Right Page?"
        description="Tell us your city, area and service requirement. We will confirm coverage and share the right next step."
      />
    </>
  );
}
