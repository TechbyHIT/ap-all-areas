import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type LocationCardProps = {
  name: string;
  href: string;
  parentLabel?: string;
  description: string;
  serviceCount?: number;
  className?: string;
};

export function LocationCard({
  name,
  href,
  parentLabel,
  description,
  serviceCount,
  className = "",
}: LocationCardProps) {
  return (
    <Card as="article" hover className={`flex h-full flex-col ${className}`.trim()}>
      <div className="flex flex-1 flex-col">
        {parentLabel ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--primary-700)]">
            {parentLabel}
          </p>
        ) : null}

        <h3 className="text-lg font-semibold text-zinc-900">
          <Link
            href={href}
            className="hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
          >
            {name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>

        {typeof serviceCount === "number" ? (
          <p className="mt-3 text-xs font-medium text-zinc-500">
            {serviceCount} service{serviceCount === 1 ? "" : "s"} available
          </p>
        ) : null}

        <Link
          href={href}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
        >
          View location
          <span aria-hidden="true" className="ml-1">
            &rarr;
          </span>
        </Link>
      </div>
    </Card>
  );
}
