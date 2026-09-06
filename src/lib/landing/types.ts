/**
 * Universal landing page data model.
 *
 * Business-agnostic on purpose: a landing page is an intent (what the visitor
 * wants) plus evidence (why we can help) plus a next step. Nothing here names
 * an industry, so the same template serves services, products, categories,
 * locations, industries or audiences.
 *
 * Templates render from this model. Routes build the model from real data —
 * they must never invent facts to fill a section. Omit a section instead.
 */

import type { ReactNode } from "react";
import type { HeroComposition, VisualPageType } from "@/lib/visual/page-composition";

export type LandingIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "local"
  | "navigational";

export type LandingLink = {
  label: string;
  href: string;
  description?: string;
};

export type LandingBreadcrumb = {
  label: string;
  href?: string;
};

export type LandingImage = {
  src: string;
  alt: string;
};

/** Hero — must answer: what is this, who is it for, why, what next. */
export type LandingHero = {
  /** H1. Built per page intent, never one cloned pattern. */
  title: string;
  description: string;
  eyebrow?: string;
  badge?: string;
  image?: LandingImage;
  /** Short factual line under the CTAs (no invented claims). */
  trustLine?: string;
  /** Honest scope/coverage note rendered as a callout. */
  coverageMessage?: string;
  composition?: HeroComposition;
};

/** "Not sure what you need?" — contextual entry points. */
export type LandingQuickStart = {
  title?: string;
  description?: string;
  options: LandingLink[];
};

/** Problem-first cards: what is the visitor trying to solve. */
export type LandingProblem = {
  title: string;
  summary: string;
  href: string;
};

/** Featured offerings (services, products, categories…). */
export type LandingOffering = {
  name: string;
  slug: string;
  summary: string;
  image?: string;
  benefits?: readonly string[];
  href: string;
  quoteHref?: string;
};

export type LandingBenefit = {
  title: string;
  description: string;
};

/** Who/what the offering suits — audiences, property types, segments. */
export type LandingUseCase = {
  title: string;
  description: string;
  href?: string;
};

/** Variations of the offering with honest limitations. */
export type LandingOption = {
  title: string;
  bestFor: string;
  description: string;
  considerations?: string;
  href?: string;
};

export type LandingProcessStep = {
  title: string;
  description: string;
};

/** Pricing model transparency — never invented numbers. */
export type LandingPricing = {
  factors: readonly string[];
  honestStatement: string;
  title?: string;
};

export type LandingFaq = {
  question: string;
  answer: string;
};

export type LandingRelatedGroup = {
  title: string;
  description?: string;
  links: LandingLink[];
};

export type LandingCta = {
  title: string;
  description: string;
  /** Prefill for the messaging CTA. */
  message?: string;
};

/**
 * Complete landing page definition.
 *
 * Optional fields drive the section engine: a section renders only when its
 * data exists and passes validation. That is what keeps a location page from
 * becoming a city-name-swapped clone of another page.
 */
export type LandingPageData = {
  /** Drives layout strategy + section order via page-composition.ts */
  pageType: VisualPageType;
  intent: LandingIntent;
  canonicalUrl: string;

  breadcrumbs?: LandingBreadcrumb[];
  hero: LandingHero;

  /** Compact trust metrics bar; label gives it page context. */
  trustLabel?: string;

  quickStart?: LandingQuickStart;
  problems?: LandingProblem[];
  /** Place or subject named in the problem-first heading. */
  problemsLabel?: string;

  /** Long-form primary content — the reason the page deserves to exist. */
  primaryContent?: ReactNode;
  primaryContentTitle?: string;
  /** Honest scope note printed under primary content. */
  primaryContentNote?: string;

  offerings?: {
    title: string;
    description?: string;
    items: LandingOffering[];
  };

  benefits?: {
    title: string;
    description?: string;
    items: LandingBenefit[];
  };

  useCases?: {
    title: string;
    description?: string;
    items: LandingUseCase[];
  };

  options?: {
    title: string;
    description?: string;
    items: LandingOption[];
  };

  requirements?: {
    title: string;
    items: readonly string[];
  };

  process?: {
    title: string;
    description?: string;
    steps: LandingProcessStep[];
  };

  pricing?: LandingPricing;

  /** Extra editorial blocks (encyclopedia, local context) rendered in order. */
  contentBlocks?: ReactNode;

  /** Real evidence only — photos, projects, reviews. */
  evidence?: ReactNode;

  coverage?: {
    title: string;
    text: string;
    links?: LandingLink[];
  };

  faqs?: LandingFaq[];
  faqTitle?: string;
  /**
   * FAQPage JSON-LD is emitted with visible FAQs by default. Routes that end
   * up noindexed set this false — marking up a page we ask Google to skip has
   * no upside and muddies the structured-data signal.
   */
  emitFaqSchema?: boolean;

  related?: LandingRelatedGroup[];

  /** Extra directory/link sections, rendered with `related` and before the FAQ. */
  appendSections?: ReactNode;

  cta: LandingCta;
};
