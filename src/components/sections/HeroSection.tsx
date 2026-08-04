import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { src: string; alt: string };
  inverted?: boolean;
};

export function HeroSection({
  title,
  subtitle,
  description,
  eyebrow,
  primaryCta,
  secondaryCta,
  image,
  inverted = false,
}: HeroSectionProps) {
  return (
    <Section variant={inverted ? "brand" : "muted"} className="py-14 md:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <Heading
              as="h1"
              eyebrow={eyebrow}
              subtitle={subtitle ?? description}
              inverted={inverted}
            >
              {title}
            </Heading>

            {(primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryCta ? (
                  <Button href={primaryCta.href} variant="primary">
                    {primaryCta.label}
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    href={secondaryCta.href}
                    variant={inverted ? "outline" : "secondary"}
                    className={inverted ? "border-white/30 text-white hover:bg-white/10" : ""}
                  >
                    {secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200 shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
