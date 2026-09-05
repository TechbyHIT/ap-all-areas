import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Card } from "@/components/ui/Card";

export type ServiceCardProps = {
  name: string;
  slug: string;
  summary: string;
  benefits?: string[];
  image: string;
  href?: string;
  quoteHref?: string;
  className?: string;
};

export function ServiceCard({
  name,
  slug,
  summary,
  benefits = [],
  image,
  href,
  quoteHref,
  className = "",
}: ServiceCardProps) {
  const serviceHref = href ?? ROUTES.service(slug);
  const quoteLink = quoteHref ?? `${ROUTES.contact}?service=${encodeURIComponent(slug)}`;
  const shownBenefits = benefits.slice(0, 3);

  return (
    <Card
      as="article"
      hover
      className={`flex h-full flex-col overflow-hidden p-0 ${className}`.trim()}
    >
      <div className="relative aspect-[16/10] bg-zinc-100">
        <Image
          src={image}
          alt={`${name} installation example`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-zinc-900">
          <Link
            href={serviceHref}
            className="hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
          >
            {name}
          </Link>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {summary}
        </p>

        {shownBenefits.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {shownBenefits.map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-700)]"
                  aria-hidden
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          <Link
            href={serviceHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[var(--primary-600)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-500)] sm:flex-none"
          >
            View Service
          </Link>
          <Link
            href={quoteLink}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 sm:flex-none"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </Card>
  );
}
