import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

type CTABannerProps = {
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function CTABanner({
  title,
  description,
  primaryCta,
  secondaryCta,
}: CTABannerProps) {
  return (
    <Section variant="brand" className="py-12 md:py-14">
      <Container>
        <div className="ds-cta-band p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <Heading as="h2" inverted>
              {title}
            </Heading>
            {description ? (
              <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0">
            <Button href={primaryCta.href} variant="primary">
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
