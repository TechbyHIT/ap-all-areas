"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MAIN_NAV,
  NAV_LOCATIONS,
  NAV_SERVICES,
} from "@/config/navigation";
import { ROUTES } from "@/config/routes";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  telLink: string | null;
  whatsAppLink: string | null;
  phoneDisplay: string;
};

function ExpandableGroup({
  label,
  items,
  onNavigate,
  defaultOpen = false,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
  onNavigate: () => void;
  defaultOpen?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const panelId = `mobile-nav-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <li>
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-zinc-800 hover:bg-[var(--accent-50)] hover:text-[var(--accent-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((open) => !open)}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 shrink-0 text-[var(--primary-700)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isExpanded ? (
        <ul
          id={panelId}
          className="mb-1 ml-2 space-y-0.5 border-l-2 border-[var(--accent-100)] pl-2"
        >
          {items.map((item) => {
            const isViewAll = item.label.startsWith("View All");
            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={`block min-h-11 rounded-lg px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)] ${
                    isViewAll
                      ? "font-semibold text-[var(--primary-700)] hover:bg-[var(--accent-50)]"
                      : "text-zinc-700 hover:bg-[var(--accent-50)] hover:text-[var(--primary-700)]"
                  }`}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

export function MobileNav({
  isOpen,
  onClose,
  telLink,
  whatsAppLink,
  phoneDisplay,
}: MobileNavProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="mobile-nav-shell is-open fixed inset-0 z-[1100]"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/50"
        aria-label="Close menu"
        onClick={onClose}
      />

      <nav
        className="absolute right-0 top-0 flex h-full w-[min(100%,22rem)] flex-col bg-white shadow-xl"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
          <span className="text-sm font-semibold text-[var(--secondary-900)]">
            Menu
          </span>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-700 hover:bg-[var(--accent-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
            aria-label="Close menu"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-2 py-4">
          {MAIN_NAV.map((item) => {
            if (item.label === "Services") {
              return (
                <ExpandableGroup
                  key={item.href}
                  label="Services"
                  items={NAV_SERVICES}
                  onNavigate={onClose}
                  defaultOpen
                />
              );
            }
            if (item.label === "Locations") {
              return (
                <ExpandableGroup
                  key={item.href}
                  label="Locations"
                  items={NAV_LOCATIONS}
                  onNavigate={onClose}
                />
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-12 rounded-lg px-3 py-3 text-base font-medium text-zinc-800 hover:bg-[var(--accent-50)] hover:text-[var(--accent-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="space-y-2 border-t border-zinc-200 p-4">
          <Link
            href={ROUTES.contact}
            className="flex min-h-12 items-center justify-center rounded-lg bg-[var(--accent-500)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-600)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-500)]"
            onClick={onClose}
          >
            Get Quote
          </Link>
          {telLink ? (
            <a
              href={telLink}
              className="flex min-h-12 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
            >
              {phoneDisplay}
            </a>
          ) : null}
          {whatsAppLink ? (
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center rounded-lg bg-[var(--whatsapp)] px-4 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--whatsapp)]"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
