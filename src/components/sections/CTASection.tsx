import Link from "next/link";
import { ROUTES } from "@/config/routes";

type CTASectionProps = {
  title?: string;
  description?: string;
};

export function CTASection({
  title = "Request a Free Quotation",
  description = "Share your requirement and we will confirm service availability for your area after a site review.",
}: CTASectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-2xl bg-blue-600 px-6 py-10 text-white sm:px-10">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-3 max-w-2xl text-blue-100">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={ROUTES.contact}
            className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get a Quote
          </Link>
          <Link
            href={ROUTES.services}
            className="inline-flex rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
