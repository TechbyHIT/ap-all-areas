import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export default function AdminPublishingPage() {
  return (
    <Section>
      <Container>
        <Heading as="h1">Publishing Controls</Heading>
        <p className="mt-4 text-zinc-600">
          Run controlled publishing batches. Use CLI: npm run pages:publish -- --batch-size=500
        </p>
      </Container>
    </Section>
  );
}
