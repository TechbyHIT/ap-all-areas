import type { Metadata } from "next";
import { HomeAllServices } from "@/components/home/HomeAllServices";
import { HomeCombos } from "@/components/home/HomeCombos";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { HomeGallery } from "@/components/home/HomeGallery";
import { HomeHeroPremium } from "@/components/home/HomeHeroPremium";
import { HomeLocations } from "@/components/home/HomeLocations";
import { HomeMaterials } from "@/components/home/HomeMaterials";
import { HomePricing } from "@/components/home/HomePricing";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeReviews } from "@/components/home/HomeReviews";
import { HomeSeoIntro } from "@/components/home/HomeSeoIntro";
import { HomeServicesBento } from "@/components/home/HomeServicesBento";
import { HomeTrustStrip } from "@/components/home/HomeTrustStrip";
import { HomeWhyChoose } from "@/components/home/HomeWhyChoose";
import { FAQSection } from "@/components/sections/FAQSection";
import { LinkDirectory } from "@/components/sections/LinkDirectory";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { SERVICE_DIRECTORY } from "@/data/service-directory";
import { HOMEPAGE_CONTENT } from "@/data/static-page-content";
import { SUB_SERVICE_MAP } from "@/data/sub-services";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

const SUB_SERVICE_DIRECTORY = INITIAL_SERVICES.map((service) => ({
  title: service.name,
  href: ROUTES.service(service.slug),
  links: service.subServices.map((sub) => ({
    label: sub.name,
    href: SUB_SERVICE_MAP[sub.slug]
      ? ROUTES.service(sub.slug)
      : ROUTES.service(service.slug),
  })),
}));

export const metadata: Metadata = generatePageMetadata({
  title:
    "Invisible Grills & Safety Nets in Andhra Pradesh | Free Photo Estimate",
  metaDescription:
    "Balcony safety nets, invisible grills & pigeon nets across Andhra Pradesh — free photo estimate, measured quote. Visakhapatnam, Vijayawada, Guntur, Tirupati & more.",
  canonicalUrl: buildCanonicalUrl("/"),
  ...staticPageIndexability(true),
});

export default function HomePage() {
  return (
    <div className="home-shell">
      <FaqJsonLd faqs={HOMEPAGE_CONTENT.faqs} />
      <HomeHeroPremium />
      <HomeTrustStrip />
      <HomeServicesBento />
      <HomeAllServices />
      <HomeSeoIntro />
      <HomeWhyChoose />
      <HomeMaterials />
      <HomeProcess />
      <HomeGallery />
      <HomeLocations />
      <HomePricing />
      <HomeReviews />
      <HomeCombos />
      <LinkDirectory
        title="Complete service directory"
        description="Browse every service category across Andhra Pradesh—invisible grills, balcony nets, bird protection, sports nets, cloth hangers and more."
        categories={SERVICE_DIRECTORY}
      />
      <LinkDirectory
        title="All sub-services"
        description="Every specialised installation type we offer—linked for local search across Andhra Pradesh."
        categories={SUB_SERVICE_DIRECTORY}
      />
      <FAQSection
        title="Frequently asked installation questions"
        subtitle="Practical answers before you send photos or book a measurement discussion."
        items={HOMEPAGE_CONTENT.faqs}
      />
      <HomeFinalCta />
    </div>
  );
}
