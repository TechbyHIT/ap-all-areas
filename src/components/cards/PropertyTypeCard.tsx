import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type PropertyTypeCardProps = {
  title: string;
  description: string;
  href?: string;
  className?: string;
};

export function PropertyTypeCard({
  title,
  description,
  href,
  className = "",
}: PropertyTypeCardProps) {
  return (
    <Card as="article" hover={Boolean(href)} className={`flex h-full flex-col ${className}`.trim()}>
      <h3 className="text-lg font-semibold text-zinc-900">
        {href ? (
          <Link
            href={href}
            className="hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
        {description}
      </p>
      {href ? (
        <Link
          href={href}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)]"
        >
          Learn more
          <span aria-hidden="true" className="ml-1">
            &rarr;
          </span>
        </Link>
      ) : null}
    </Card>
  );
}
