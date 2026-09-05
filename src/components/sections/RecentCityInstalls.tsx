import {
  listPublishedProjects,
  type ProjectCase,
} from "@/data/projects";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pickPageImage } from "@/lib/visual/page-image-pick";

type RecentCityInstallsProps = {
  citySlug: string;
  cityName: string;
  serviceSlug?: string;
  limit?: number;
};

/**
 * Recent installs for a city — only when projects are tagged to that city.
 * Falls back to a clearly labeled representative set (no fake city claims).
 */
export function RecentCityInstalls({
  citySlug,
  cityName,
  serviceSlug,
  limit = 3,
}: RecentCityInstallsProps) {
  const cityProjects = listPublishedProjects(serviceSlug).filter(
    (p) => p.city === citySlug,
  );

  const hasLocal = cityProjects.length > 0;
  const items: Array<{
    key: string;
    href: string;
    title: string;
    src: string;
    alt: string;
    note: string;
  }> = hasLocal
    ? cityProjects.slice(0, limit).map((p: ProjectCase) => ({
        key: p.slug,
        href: ROUTES.project(p.slug),
        title: p.projectName,
        src: p.images[0]?.src ?? pickPageImage({ pageKey: p.slug }).src,
        alt: p.images[0]?.alt ?? p.projectName,
        note: `Verified project photo · ${cityName}`,
      }))
    : Array.from({ length: limit }, (_, i) => {
        const pick = pickPageImage({
          pageKey: `${citySlug}:recent:${i}`,
          serviceSlug: serviceSlug ?? "safety-nets",
          citySlug,
          cityName,
        });
        return {
          key: `rep-${i}`,
          href: ROUTES.gallery,
          title: pick.alt,
          src: pick.src,
          alt: pick.alt,
          note: "Representative installation — city not verified on this photo",
        };
      });

  return (
    <Section variant="muted">
      <Container>
        <SectionHeading
          title={
            hasLocal
              ? `Recent installs in ${cityName}`
              : `Installation examples for ${cityName} enquiries`
          }
          description={
            hasLocal
              ? `Real project photographs tagged to ${cityName}.`
              : `We only label a photo as a ${cityName} project when the location is verified. Until then, these are representative installations.`
          }
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-[var(--color-text-primary)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {item.note}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
