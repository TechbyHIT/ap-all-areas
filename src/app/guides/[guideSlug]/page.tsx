import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import {
  BulletListSection,
  ProseSection,
} from "@/components/sections/ContentBlocks";
import { PLACEHOLDER_GUIDES } from "@/data/placeholder-content";
import { GUIDE_ARTICLES, type GuideArticle } from "@/data/guide-articles";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { buildPageMediaBundle } from "@/lib/visual/page-media";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ guideSlug: string }>;
};

function getGuideArticle(guideSlug: string): GuideArticle | null {
  switch (guideSlug) {
    case "invisible-grills-buying-guide":
      return GUIDE_ARTICLES["invisible-grills-buying-guide"] ?? null;
    case "safety-nets-installation-guide":
      return GUIDE_ARTICLES["safety-nets-installation-guide"] ?? null;
    case "choosing-cloth-drying-hangers":
      return GUIDE_ARTICLES["choosing-cloth-drying-hangers"] ?? null;
    default:
      return GUIDE_ARTICLES[guideSlug] ?? null;
  }
}

export async function generateStaticParams() {
  return PLACEHOLDER_GUIDES.map((guide) => ({ guideSlug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { guideSlug } = await params;
  const guide = PLACEHOLDER_GUIDES.find((g) => g.slug === guideSlug);
  if (!guide) return {};

  return generatePageMetadata({
    title: guide.title,
    metaDescription: guide.summary,
    canonicalUrl: buildCanonicalUrl(`/guides/${guide.slug}/`),
    ...staticPageIndexability(true),
  });
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { guideSlug } = await params;
  const guide = PLACEHOLDER_GUIDES.find((g) => g.slug === guideSlug);
  if (!guide) notFound();

  const article = getGuideArticle(guideSlug);
  if (!article) notFound();

  const media = buildPageMediaBundle({
    pageType: "guide",
    h1: guide.title,
    serviceSlug: "safety-nets",
  });

  return (
    <>
      <PageHero
        title={guide.title}
        description={guide.summary}
        eyebrow="Guide"
        composition="editorial"
        image={{
          src: media.heroImage.src,
          alt: media.heroImage.alt,
        }}
        trustNote="Editorial guidance — not a sales landing"
      />

      <ProseSection title="Overview">
        <p>
          This guide expands on practical decisions for households and facility
          managers across Andhra Pradesh. Use the sections below to prepare for
          measurement and quotation. Service availability is confirmed per site —
          listing a locality on this website does not mean a permanent office exists
          there.
        </p>
      </ProseSection>

      {article.sections.map((section, index) => (
        <ProseSection
          key={section.title}
          title={section.title}
          variant={index % 2 === 0 ? "muted" : "default"}
        >
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 64)}>{paragraph}</p>
          ))}
        </ProseSection>
      ))}

      <BulletListSection title="Key Takeaways" items={article.takeaways} />

      <QuoteCTA
        title="Want Advice for Your Openings?"
        description="Share your city or area, photos and priorities. We will confirm whether measurement can be scheduled and outline a site-specific recommendation."
        whatsappMessage={`Hello, I read the ${guide.title} and would like guidance for my site in Andhra Pradesh.`}
      />
    </>
  );
}
