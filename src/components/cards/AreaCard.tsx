import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type AreaCardProps = {
  name: string;
  href: string;
  cityName: string;
  description?: string;
  className?: string;
};

export function AreaCard({
  name,
  href,
  cityName,
  description,
  className = "",
}: AreaCardProps) {
  return (
    <Card as="article" hover className={`flex h-full flex-col ${className}`.trim()}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-700)]">
        {cityName}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-zinc-900">
        <Link
          href={href}
          className="hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
        >
          {name}
        </Link>
      </h3>
      {description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      ) : null}
      <Link
        href={href}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)]"
      >
        View area
        <span aria-hidden="true" className="ml-1">
          &rarr;
        </span>
      </Link>
    </Card>
  );
}
