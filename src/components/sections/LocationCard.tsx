import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";

type LocationCardProps = {
  slug: string;
  name: string;
  summary?: string;
  district?: string;
  served?: boolean;
};

export function LocationCard({
  slug,
  name,
  summary,
  district,
  served = true,
}: LocationCardProps) {
  const href = ROUTES.location(slug);

  return (
    <Card as="article" hover className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <Heading as="h3">{name}</Heading>
        <Badge variant={served ? "accent" : "outline"}>
          {served ? "Served" : "Coming soon"}
        </Badge>
      </div>

      {district ? (
        <p className="mt-1 text-sm font-medium text-[var(--primary-700)]">{district}</p>
      ) : null}

      {summary ? (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {summary}
        </p>
      ) : null}

      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
      >
        View location
        <span aria-hidden="true" className="ml-1">
          &rarr;
        </span>
      </Link>
    </Card>
  );
}
