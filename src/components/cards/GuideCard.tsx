import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type GuideCardProps = {
  title: string;
  href: string;
  summary: string;
  className?: string;
};

export function GuideCard({
  title,
  href,
  summary,
  className = "",
}: GuideCardProps) {
  return (
    <Card as="article" hover className={`flex h-full flex-col ${className}`.trim()}>
      <h3 className="text-lg font-semibold text-zinc-900">
        <Link
          href={href}
          className="hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
        >
          {title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
        {summary}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)]"
      >
        Read guide
        <span aria-hidden="true" className="ml-1">
          &rarr;
        </span>
      </Link>
    </Card>
  );
}
