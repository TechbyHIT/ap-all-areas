"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BUSINESS_CONFIG } from "@/config/business";
import { ROUTES } from "@/config/routes";
import {
  SERVICES_MEGA_MENU_COLUMNS,
  type DirectoryCategory,
} from "@/data/service-directory";

type ServicesMegaMenuProps = {
  label?: string;
  href?: string;
};

function CategoryBlock({
  category,
  onNavigate,
}: {
  category: DirectoryCategory;
  onNavigate: () => void;
}) {
  return (
    <div className="services-mega-category">
      {category.href ? (
        <Link
          href={category.href}
          className="services-mega-heading"
          onClick={onNavigate}
        >
          {category.title}
        </Link>
      ) : (
        <p className="services-mega-heading">{category.title}</p>
      )}
      <ul className="services-mega-list">
        {category.links.map((link) => (
          <li key={`${category.title}-${link.label}`}>
            <Link href={link.href} onClick={onNavigate}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServicesMegaMenu({
  label = "Services",
  href = ROUTES.services,
}: ServicesMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const open = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setIsOpen(false), 140);
  };

  const close = () => {
    clearCloseTimer();
    setIsOpen(false);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        containerRef.current
          ?.querySelector<HTMLElement>("[data-mega-trigger]")
          ?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="services-mega"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocusCapture={open}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <Link
        href={href}
        data-mega-trigger
        className={`services-mega-trigger${isOpen ? " is-open" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        onKeyDown={(event) => {
          if (
            event.key === "ArrowDown" ||
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            open();
          }
        }}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      <div
        id={menuId}
        role="region"
        aria-label={`${BUSINESS_CONFIG.name} services`}
        className={`services-mega-panel${isOpen ? " is-open" : ""}`}
      >
        <div className="services-mega-scroll">
          <div className="services-mega-inner">
            <div className="services-mega-grid">
              {SERVICES_MEGA_MENU_COLUMNS.map((column, columnIndex) => (
                <div key={columnIndex} className="services-mega-column">
                  {column.map((category) => (
                    <CategoryBlock
                      key={category.title}
                      category={category}
                      onNavigate={close}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="services-mega-footer">
          <div className="services-mega-inner services-mega-footer-inner">
            <div>
              <p className="services-mega-brand">{BUSINESS_CONFIG.name}</p>
              <p className="services-mega-note">
                Invisible grills, safety nets, bird control, sports nets and
                cloth hangers across Andhra Pradesh.
              </p>
            </div>
            <Link
              href={ROUTES.services}
              className="services-mega-all"
              onClick={close}
            >
              View all services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
