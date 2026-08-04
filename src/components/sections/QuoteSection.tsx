import { QuoteCTA } from "@/components/sections/QuoteCTA";

type QuoteSectionProps = {
  title?: string;
  description?: string;
  whatsappMessage?: string;
};

/** CTA band wrapping QuoteCTA with form/contact link and contact channels. */
export function QuoteSection({
  title = "Request a Quotation",
  description = "Share your requirement, location and approximate measurements. We will confirm service availability and share a quotation after reviewing your site details.",
  whatsappMessage,
}: QuoteSectionProps) {
  return (
    <QuoteCTA
      title={title}
      description={description}
      whatsappMessage={whatsappMessage}
    />
  );
}
