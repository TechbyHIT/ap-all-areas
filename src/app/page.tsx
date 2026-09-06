import type { Metadata } from "next";
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
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { FAQSection } from "@/components/sections/FAQSection";
import { LinkDirectory } from "@/components/sections/LinkDirectory";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { SERVICE_DIRECTORY } from "@/data/service-directory";
import { HOMEPAGE_CONTENT } from "@/data/static-page-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

/** Full menu catalog — same categories as the header mega menu. */
const SERVICE_CRAWL_HUB = SERVICE_DIRECTORY;

export const metadata: Metadata = generatePageMetadata({
  title:
    "Invisible Grills & Safety Nets in Andhra Pradesh | Free Photo Estimate",
  metaDescription:
    "Balcony safety nets, invisible grills & pigeon nets across Andhra Pradesh — free photo estimate, measured quote. Visakhapatnam, Vijayawada, Guntur, Tirupati & more.",
  canonicalUrl: buildCanonicalUrl("/"),
  openGraphImage: "/images/projects/installations/invisible-grill-day-city.webp",
  openGraphImageAlt:
    "Invisible grill installation on an Andhra Pradesh apartment balcony",
  ...staticPageIndexability(true),
});

/**
 * Homepage — GFG basics: clear H1/CTA, quality sections, internal links,
 * FAQ schema, fast LCP (single hero). Heavy duplicate grids removed.
 */
export default function HomePage() {
  return (
    <div className="home-shell">
      <FaqJsonLd faqs={HOMEPAGE_CONTENT.faqs} />
      <HomeHeroPremium />
      <HomeTrustStrip />
      <HomeServicesBento />
      <HomeSeoIntro />
      <HomeWhyChoose />
      <HomeMaterials />
      <HomeProcess />
      <HomeGallery />
      <HomeLocations />
      <HomePricing />
      <HomeReviews />
      <HomeCombos />
      <BlogTeaser limit={3} />
      <LinkDirectory
        title="Explore services & Andhra Pradesh coverage"
        description="Crawl-friendly hubs for invisible grills, balcony nets, bird protection, sports nets and cloth hangers — then open your city."
        categories={SERVICE_CRAWL_HUB}
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
