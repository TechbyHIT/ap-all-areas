import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";

type ServiceCardProps = {
  slug: string;
  name: string;
  summary: string;
  image?: string;
  badge?: string;
};

export function ServiceCard({
  slug,
  name,
  summary,
  image,
  badge,
}: ServiceCardProps) {
  const href = ROUTES.service(slug);

  return (
    <Card as="article" hover className="flex h-full flex-col overflow-hidden p-0">
      {image ? (
        <div className="relative aspect-[16/10] bg-zinc-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-[var(--primary-700)] to-[var(--secondary-950)]" />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {badge ? (
          <Badge variant="brand" className="mb-3 self-start">
            {badge}
          </Badge>
        ) : null}

        <Heading as="h3">{name}</Heading>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {summary}
        </p>

        <Link
          href={href}
          className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
        >
          Learn more
          <span aria-hidden="true" className="ml-1">
            &rarr;
          </span>
        </Link>
      </div>
    </Card>
  );
}
