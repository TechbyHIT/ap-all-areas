import Link from "next/link";
import {
  BUSINESS_CONFIG,
  getWhatsAppLink,
  isPhoneValidForProduction,
} from "@/config/business";
import { ROUTES } from "@/config/routes";
import { Container } from "@/components/ui/Container";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";

type FinalCTAProps = {
  title?: string;
  description?: string;
  whatsappMessage?: string;
  className?: string;
};

/** Enhanced final CTA band in the QuoteCTA visual language. */
export function FinalCTA({
  title = "Ready for a Clear Next Step?",
  description = "Tell us your city, area, service requirement and property type. We will confirm coverage and share next steps for measurement and quotation.",
  whatsappMessage = "Hello, I would like a quotation for installation service in Andhra Pradesh.",
  className = "",
}: FinalCTAProps) {
  const wa = getWhatsAppLink(whatsappMessage);
  const phoneReady = isPhoneValidForProduction();

  return (
    <section
      className={`border-t border-zinc-200 bg-zinc-950 py-12 text-white md:py-16 ${className}`.trim()}
    >
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-200">
            {description}
          </p>
          <p className="mt-3 text-sm text-zinc-400">
            Pricing depends on measurements, material grade, required spacing,
            installation complexity, building height, site accessibility and
            total project quantity.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={ROUTES.contact}
            className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            data-track-conversion="cta_click"
            data-cta-intent="quote_request"
          >
            Request Quote
          </Link>
          <PhoneNumberLink className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100" />
          {phoneReady && wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/40 bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
              data-track-conversion="whatsapp_click"
            >
              Send Photo on WhatsApp
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-5 py-2.5 text-sm text-zinc-300">
              Call {BUSINESS_CONFIG.phone.displayFormatted} / WhatsApp after
              verification
            </span>
          )}
        </div>
      </Container>
    </section>
  );
}
