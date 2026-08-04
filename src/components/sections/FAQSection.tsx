"use client";

import type { FaqItem } from "@/types/content";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

type FAQSectionProps = {
  title?: string;
  subtitle?: string;
  items: readonly FaqItem[];
  id?: string;
};

export function FAQSection({
  title = "Frequently Asked Questions",
  subtitle,
  items,
  id = "faq",
}: FAQSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section id={id} variant="default">
      <Container>
        <Heading as="h2" subtitle={subtitle} className="mb-8 md:mb-10">
          {title}
        </Heading>

        <Accordion
          items={items.map((item) => ({
            title: item.question,
            content: item.answer,
          }))}
          defaultOpenIndex={0}
        />
      </Container>
    </Section>
  );
}
