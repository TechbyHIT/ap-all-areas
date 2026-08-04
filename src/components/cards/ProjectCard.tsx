import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type ProjectCardProps = {
  title: string;
  image: string;
  href?: string;
  alt: string;
  className?: string;
};

export function ProjectCard({
  title,
  image,
  href,
  alt,
  className = "",
}: ProjectCardProps) {
  const media = (
    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover transition duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );

  return (
    <Card
      as="article"
      hover={Boolean(href)}
      className={`group overflow-hidden p-0 ${className}`.trim()}
    >
      {href ? (
        <Link href={href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]">
          {media}
          <div className="p-4 sm:p-5">
            <h3 className="text-base font-semibold text-zinc-900 group-hover:text-[var(--primary-700)]">
              {title}
            </h3>
          </div>
        </Link>
      ) : (
        <>
          {media}
          <div className="p-4 sm:p-5">
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
          </div>
        </>
      )}
    </Card>
  );
}
