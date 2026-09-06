import { Fragment } from "react";
import { LocationHero } from "@/components/sections/LocationHero";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { PremiumPageHero } from "@/components/sections/PremiumPageHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { QuickStartSection } from "@/components/sections/QuickStartSection";
import { ChooseByNeedSection } from "@/components/sections/ChooseByNeedSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { UseCasesSection } from "@/components/sections/UseCasesSection";
import { OptionsSection } from "@/components/sections/OptionsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { RelatedLinksSection } from "@/components/sections/RelatedLinksSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  resolveLandingSections,
  type LandingSectionId,
} from "@/lib/landing/section-engine";
import type { LandingPageData } from "@/lib/landing/types";

type LandingPageProps = {
  data: LandingPageData;
};

/**
 * Universal landing renderer.
 *
 * One brand system, one section rhythm — but the stack itself is decided by
 * the section engine from the data each page actually has. Page types differ
 * by hero composition and by which sections earn a place, not by bespoke
 * per-route JSX.
 */
export function LandingPage({ data }: LandingPageProps) {
  const sections = resolveLandingSections(data);
  const showBreadcrumbs = sections.includes("breadcrumbs");

  const breadcrumbItems = (data.breadcrumbs ?? []).map((crumb) => ({
    label: crumb.label,
    href: crumb.href,
  }));

  const render = (id: LandingSectionId) => {
    switch (id) {
      case "hero":
        return renderHero(data, showBreadcrumbs ? breadcrumbItems : undefined);

      case "trust":
        return <TrustStrip contextLabel={data.trustLabel} />;

      case "quick-start":
        return data.quickStart ? (
          <QuickStartSection
            title={data.quickStart.title}
            description={data.quickStart.description}
            options={data.quickStart.options}
          />
        ) : null;

      case "problems":
        return data.problems ? (
          <ChooseByNeedSection
            locationName={data.problemsLabel ?? data.hero.title}
            paths={data.problems}
          />
        ) : null;

      case "primary-content":
        return (
          <MaterialsSection
            title={data.primaryContentTitle ?? "What this covers"}
            prose={data.primaryContent}
            note={data.primaryContentNote}
          />
        );

      case "offerings":
        return data.offerings ? (
          <ServiceCards
            title={data.offerings.title}
            description={data.offerings.description}
            services={data.offerings.items}
            pageKey={data.canonicalUrl}
            variant="muted"
          />
        ) : null;

      case "content-blocks":
        return <>{data.contentBlocks}</>;

      case "benefits":
        return data.benefits ? (
          <BenefitsSection
            title={data.benefits.title}
            description={data.benefits.description}
            items={data.benefits.items}
          />
        ) : null;

      case "use-cases":
        return data.useCases ? (
          <UseCasesSection
            title={data.useCases.title}
            description={data.useCases.description}
            items={data.useCases.items}
            variant="muted"
          />
        ) : null;

      case "options":
        return data.options ? (
          <OptionsSection
            title={data.options.title}
            description={data.options.description}
            items={data.options.items}
          />
        ) : null;

      case "requirements":
        return data.requirements ? (
          <QualitySection
            title={data.requirements.title}
            items={data.requirements.items}
          />
        ) : null;

      case "process":
        return data.process ? (
          <InstallationProcess
            title={data.process.title}
            description={data.process.description}
            steps={data.process.steps}
            variant="muted"
          />
        ) : null;

      case "pricing":
        return data.pricing ? (
          <PricingFactors
            title={data.pricing.title ?? "What affects your quote"}
            items={data.pricing.factors}
            honestStatement={data.pricing.honestStatement}
          />
        ) : null;

      case "evidence":
        return <>{data.evidence}</>;

      case "coverage":
        return data.coverage ? (
          <CoverageSection
            title={data.coverage.title}
            coverageText={data.coverage.text}
            links={data.coverage.links}
            variant="muted"
          />
        ) : null;

      case "related":
        return data.related ? (
          <RelatedLinksSection groups={data.related} />
        ) : null;

      case "faq":
        return data.faqs ? (
          <FAQSection
            title={data.faqTitle ?? "Frequently asked questions"}
            items={data.faqs}
          />
        ) : null;

      case "append":
        return <>{data.appendSections}</>;

      case "final-cta":
        return (
          <FinalCTA
            title={data.cta.title}
            description={data.cta.description}
            whatsappMessage={data.cta.message}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {data.faqs && data.faqs.length > 0 && data.emitFaqSchema !== false ? (
        <FaqJsonLd faqs={data.faqs} />
      ) : null}

      {sections.map((id) =>
        id === "breadcrumbs" ? null : (
          <Fragment key={id}>{render(id)}</Fragment>
        ),
      )}
    </>
  );
}

/** Hero composition varies by page type so templates never look cloned. */
function renderHero(
  data: LandingPageData,
  breadcrumbItems?: Array<{ label: string; href?: string }>,
) {
  const { hero, pageType } = data;

  const isLocationLike =
    pageType === "city" || pageType === "locality" || pageType === "property";

  const isServiceLike =
    pageType === "service" ||
    pageType === "city-service" ||
    pageType === "locality-service" ||
    pageType === "solution";

  if (isLocationLike) {
    return (
      <LocationHero
        title={hero.title}
        description={hero.description}
        badge={hero.badge}
        image={hero.image}
        trustLine={hero.trustLine}
        breadcrumbItems={breadcrumbItems}
        composition={
          (hero.composition as "city-context" | "locality-orient") ??
          "city-context"
        }
        {...(hero.coverageMessage
          ? { coverageMessage: hero.coverageMessage }
          : {})}
      />
    );
  }

  if (isServiceLike) {
    return (
      <ServiceHero
        title={hero.title}
        description={hero.description}
        badge={hero.badge}
        image={hero.image}
        trustLine={hero.trustLine}
        breadcrumbItems={breadcrumbItems}
        whatsappMessage={data.cta.message}
        composition={
          (hero.composition as
            | "service-split"
            | "service-local-split"
            | "locality-service-split") ?? "service-split"
        }
      />
    );
  }

  return (
    <PremiumPageHero
      title={hero.title}
      description={hero.description}
      eyebrow={hero.eyebrow}
      badge={hero.badge}
      trustNote={hero.trustLine}
      image={hero.image}
      composition={hero.composition ?? "editorial"}
      breadcrumbs={
        breadcrumbItems ? <Breadcrumbs items={breadcrumbItems} /> : undefined
      }
    />
  );
}
