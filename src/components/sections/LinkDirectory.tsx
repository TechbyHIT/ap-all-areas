import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { DirectoryCategory } from "@/data/service-directory";

type LinkDirectoryProps = {
  categories: readonly DirectoryCategory[];
  title?: string;
  description?: string;
  className?: string;
};

/**
 * Clean multi-column service link directory.
 * Matches a minimal footer/sitemap style: bold category, hairline rule, grey links.
 */
export function LinkDirectory({
  categories,
  title,
  description,
  className = "",
}: LinkDirectoryProps) {
  if (categories.length === 0) return null;

  return (
    <Section variant="default" className={`bg-white ${className}`.trim()}>
      <Container className="py-12 md:py-16">
        {title ? (
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-base leading-relaxed text-zinc-600">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <nav
              key={category.title}
              aria-label={category.title}
              className="min-w-0"
            >
              {category.href ? (
                <Link
                  href={category.href}
                  className="block text-base font-bold text-zinc-900 transition-colors hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
                >
                  {category.title}
                </Link>
              ) : (
                <h3 className="text-base font-bold text-zinc-900">
                  {category.title}
                </h3>
              )}

              <div
                className="mt-3 border-t border-zinc-200"
                aria-hidden="true"
              />

              <ul className="mt-4 space-y-2.5">
                {category.links.map((link) => (
                  <li key={`${category.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] leading-snug text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>
    </Section>
  );
}
