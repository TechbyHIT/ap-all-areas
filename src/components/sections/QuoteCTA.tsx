import Link from "next/link";
import { ROUTES } from "@/config/routes";
import {
  getTelLink,
  getWhatsAppLink,
  isPhoneValidForProduction,
} from "@/config/business";
import { Container } from "@/components/ui/Container";

type QuoteCTAProps = {
  title?: string;
  description?: string;
  whatsappMessage?: string;
};

export function QuoteCTA({
  title = "Request a Quotation",
  description = "Share your requirement, location and approximate measurements. We will confirm service availability and share a quotation after reviewing your site details.",
  whatsappMessage = "Hello, I would like a quotation for installation service in Andhra Pradesh.",
}: QuoteCTAProps) {
  const tel = getTelLink();
  const wa = getWhatsAppLink(whatsappMessage);
  const phoneReady = isPhoneValidForProduction();

  return (
    <section className="border-t border-[var(--primary-800)] bg-[var(--secondary-950)] py-12 text-white">
      <Container>
        <div className="ds-cta-band p-6 sm:p-8">
          <h2 className="ds-h2 text-white">{title}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">
            {description}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            Pricing depends on measurements, material grade, required spacing,
            installation complexity, building height, site accessibility and total
            project quantity.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={ROUTES.contact}
              className="inline-flex min-h-11 items-center rounded-[var(--radius-lg)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--primary-800)] transition hover:bg-[var(--primary-50)]"
            >
              Request Quote
            </Link>
            {phoneReady && tel ? (
              <a
                href={tel}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-lg)] border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Call Now
              </a>
            ) : null}
            {phoneReady && wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-lg)] bg-[var(--whatsapp)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--whatsapp-dark)]"
              >
                WhatsApp Quote
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-[var(--radius-lg)] border border-white/20 px-5 py-2.5 text-sm text-white/70">
                Call / WhatsApp available after phone number verification
              </span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
