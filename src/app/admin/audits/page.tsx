import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export default function AdminAuditsPage() {
  return (
    <Section>
      <Container>
        <Heading as="h1">SEO Audits</Heading>
        <p className="mt-4 text-zinc-600">
          Run audits via CLI: npm run seo:audit, npm run content:audit, npm run duplicates:audit
        </p>
      </Container>
    </Section>
  );
}
