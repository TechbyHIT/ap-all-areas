"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BUSINESS_CONFIG,
  getTelLink,
  getWhatsAppLink,
} from "@/config/business";
import {
  NAV_LOCATIONS,
  NAV_SERVICES,
} from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { MobileNav } from "@/components/navigation/MobileNav";
import { NavDropdown } from "@/components/navigation/NavDropdown";
import { Button } from "@/components/ui/Button";
import { PhoneNumberLink } from "@/components/ui/PhoneNumberLink";

export function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const telLink = getTelLink();
  const whatsAppLink = getWhatsAppLink(
    "Hello, I am sharing opening photos for a free estimate.",
  );

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMenuOpen);
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1051px)");
    const onChange = () => {
      if (mq.matches) setIsMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-container">
          <Link
            href={ROUTES.home}
            className="header-logo flex shrink-0 items-center"
            aria-label={`${BUSINESS_CONFIG.name} home`}
          >
            <Image
              src={BUSINESS_CONFIG.logo}
              alt="Hiranya Enterprises"
              width={340}
              height={90}
              priority
              className="header-logo-img"
            />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link
              href={ROUTES.home}
              className="ds-link-underline rounded-[var(--radius-md)] px-2 py-2 text-sm font-medium text-[var(--secondary-800)] hover:text-[var(--primary-700)]"
            >
              Home
            </Link>
            <NavDropdown
              label="Services"
              href={ROUTES.services}
              items={[...NAV_SERVICES]}
            />
            <NavDropdown
              label="Areas"
              href={ROUTES.locations}
              items={[...NAV_LOCATIONS]}
            />
            <Link
              href={ROUTES.projects}
              className="ds-link-underline rounded-[var(--radius-md)] px-2 py-2 text-sm font-medium text-[var(--secondary-800)] hover:text-[var(--primary-700)]"
            >
              Projects
            </Link>
            <Link
              href={ROUTES.guides}
              className="ds-link-underline rounded-[var(--radius-md)] px-2 py-2 text-sm font-medium text-[var(--secondary-800)] hover:text-[var(--primary-700)]"
            >
              Guides
            </Link>
            <Link
              href={ROUTES.about}
              className="ds-link-underline rounded-[var(--radius-md)] px-2 py-2 text-sm font-medium text-[var(--secondary-800)] hover:text-[var(--primary-700)]"
            >
              About
            </Link>
            <Link
              href={ROUTES.contact}
              className="ds-link-underline rounded-[var(--radius-md)] px-2 py-2 text-sm font-medium text-[var(--secondary-800)] hover:text-[var(--primary-700)]"
            >
              Contact
            </Link>
          </nav>

          <div className="header-actions">
            <PhoneNumberLink className="header-phone" />
            {whatsAppLink ? (
              <Button
                href={whatsAppLink}
                variant="whatsapp"
                className="btn-compact btn-wa-header"
              >
                WhatsApp
              </Button>
            ) : null}
            <Button
              href={ROUTES.contact}
              variant="outline"
              className="btn-compact"
            >
              Get Free Quote
            </Button>
          </div>

          <div className="mobile-quick-actions">
            <PhoneNumberLink className="header-phone header-phone--mobile" />
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-navigation">
        <MobileNav
          isOpen={isMenuOpen}
          onClose={closeMenu}
          telLink={telLink}
          whatsAppLink={whatsAppLink}
          phoneDisplay={BUSINESS_CONFIG.phone.displayFormatted}
        />
      </div>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
