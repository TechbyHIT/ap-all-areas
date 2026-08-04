import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BUSINESS_CONFIG,
  getEmailLink,
  getTelLink,
  getWhatsAppLink,
} from "@/config/business";
import {
  FOOTER_LOCATIONS,
  FOOTER_POLICY_LINKS,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
} from "@/config/navigation";
import { ROUTES } from "@/config/routes";

const COMPANY_LINKS = [
  { label: "About", href: ROUTES.about },
  { label: "Gallery", href: ROUTES.gallery },
  { label: "Blog", href: ROUTES.blog },
  { label: "Testimonials", href: ROUTES.testimonials },
  { label: "Sitemap", href: "/sitemap.xml" },
] as const;

const FOOTER_YEAR = 2026;

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="pb-3 text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </p>
      {children}
    </div>
  );
}

export function Footer() {
  const tel = getTelLink();
  const wa = getWhatsAppLink();
  const email = getEmailLink();
  const domain = BUSINESS_CONFIG.domain;

  return (
    <footer className="site-footer mt-auto border-t border-[var(--secondary-800)] bg-[var(--secondary-950)] text-[var(--neutral-300)]">
      <div className="ds-container grid gap-8 py-10 md:gap-10 md:py-12 lg:grid-cols-5">
        <div>
          <Link
            href={ROUTES.home}
            className="footer-brand-link inline-flex max-w-full flex-col gap-3"
            aria-label={`${BUSINESS_CONFIG.name} home`}
          >
            <span className="footer-logo-frame">
              <Image
                src={BUSINESS_CONFIG.logo}
                alt={BUSINESS_CONFIG.name}
                width={360}
                height={110}
                className="footer-logo-img"
              />
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
              {BUSINESS_CONFIG.name}
            </span>
          </Link>
          <p className="mt-2 text-xs uppercase tracking-[var(--tracking-wide)] text-[var(--accent-400)]">
            {BUSINESS_CONFIG.tagline}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--neutral-400)]">
            {BUSINESS_CONFIG.description}
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {tel ? (
              <a href={tel} className="block hover:text-[var(--primary-300)]">
                {BUSINESS_CONFIG.phone.displayFormatted}
              </a>
            ) : null}
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[var(--primary-300)]"
              >
                WhatsApp Quote
              </a>
            ) : null}
            <a href={email} className="block hover:text-[var(--primary-300)]">
              {BUSINESS_CONFIG.email}
            </a>
            <a
              href={BUSINESS_CONFIG.websiteUrl}
              className="block font-medium text-[var(--primary-300)] hover:text-white"
            >
              {domain}
            </a>
            <p className="text-[var(--neutral-500)]">
              Business hours: Mon–Sat, by appointment
            </p>
          </div>
        </div>

        <FooterGroup title="Company">
          <ul className="space-y-2 text-sm">
            {COMPANY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--primary-300)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterGroup>

        <FooterGroup title="Services">
          <ul className="space-y-2 text-sm">
            {FOOTER_SERVICES.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <Link href={item.href} className="hover:text-[var(--primary-300)]">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ROUTES.services} className="hover:text-[var(--primary-300)]">
                View All Services
              </Link>
            </li>
          </ul>
        </FooterGroup>

        <FooterGroup title="Locations">
          <ul className="space-y-2 text-sm">
            {FOOTER_LOCATIONS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--primary-300)]">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ROUTES.locations} className="hover:text-[var(--primary-300)]">
                View All Locations
              </Link>
            </li>
          </ul>
        </FooterGroup>

        <FooterGroup title="Resources">
          <ul className="mb-4 space-y-2 text-sm">
            {FOOTER_QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--primary-300)]">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ROUTES.contact} className="hover:text-[var(--primary-300)]">
                Contact
              </Link>
            </li>
            <li>
              <Link href={ROUTES.faq} className="hover:text-[var(--primary-300)]">
                FAQ
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 text-sm">
            {FOOTER_POLICY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--primary-300)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterGroup>
      </div>

      <div className="border-t border-[var(--secondary-800)]">
        <div className="ds-container flex flex-col gap-2 py-4 text-xs text-[var(--neutral-500)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {FOOTER_YEAR} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <p>
            <a
              href={BUSINESS_CONFIG.websiteUrl}
              className="hover:text-[var(--primary-300)]"
            >
              {domain}
            </a>
            {" · "}
            Serving across Andhra Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
