import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

export function FaqJsonLd({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  if (faqs.length === 0) return null;
  const data = faqSchema(faqs);
  if (!data) return null;
  return <JsonLd data={data} />;
}
