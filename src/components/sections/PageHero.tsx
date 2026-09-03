import type { ReactNode } from "react";
import { PremiumPageHero } from "@/components/sections/PremiumPageHero";
import type { HeroComposition } from "@/lib/visual/page-composition";

type PageHeroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  badge?: string;
  trustNote?: string;
  image?: { src: string; alt: string; caption?: string | null };
  gallery?: readonly { src: string; alt: string; caption?: string | null }[];
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  composition?: HeroComposition;
  className?: string;
};

/**
 * Page hero — delegates to PremiumPageHero with page-type compositions (§134–136).
 * Default composition remains commercial split for backward compatibility.
 */
export function PageHero(props: PageHeroProps) {
  return (
    <PremiumPageHero
      {...props}
      composition={props.composition ?? "service-split"}
    />
  );
}
