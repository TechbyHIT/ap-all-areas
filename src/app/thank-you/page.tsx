import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Thank You — Enquiry Received",
  metaDescription: "Thank you for your enquiry. We will contact you shortly.",
  canonicalUrl: buildCanonicalUrl("/thank-you/"),
  ...staticPageIndexability(false),
});

export default function ThankYouPage() {
  return (
    <>
      <PageHero
        title="Thank You"
        description="Your enquiry has been received. We will contact you shortly to confirm service availability and next steps."
      />
      <Container>
        <p className="text-zinc-600 dark:text-zinc-400">
          If you need urgent assistance, please call or message us directly. Service
          coverage across Andhra Pradesh is confirmed after reviewing your site details.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={ROUTES.home}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
          <Link
            href={ROUTES.services}
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700"
          >
            Browse Services
          </Link>
        </div>
      </Container>
    </>
  );
}
