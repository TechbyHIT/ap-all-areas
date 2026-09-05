"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type NavDropdownItem = {
  label: string;
  href: string;
};

type NavDropdownProps = {
  label: string;
  href: string;
  items: readonly NavDropdownItem[];
};

export function NavDropdown({ label, href, items }: NavDropdownProps) {
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
    closeTimer.current = setTimeout(() => setIsOpen(false), 120);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        containerRef.current
          ?.querySelector<HTMLElement>("[data-dropdown-trigger]")
          ?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
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
        data-dropdown-trigger
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-teal-50 hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
            requestAnimationFrame(() => {
              document
                .getElementById(menuId)
                ?.querySelector<HTMLAnchorElement>("a")
                ?.focus();
            });
          }
        }}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
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
        role="menu"
        aria-label={label}
        className={`absolute left-0 top-full z-50 min-w-[14rem] pt-1 transition ${
          isOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <ul className="max-h-[70vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
          {/* Mount menu items only when open — avoids shipping every area link into the DOM on every page load */}
          {isOpen
            ? items.map((item, index) => {
            const isViewAll = item.label.startsWith("View All");
            return (
              <li key={item.href + item.label} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  className={`block min-h-11 px-4 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--primary-600)] ${
                    isViewAll
                      ? "mt-1 border-t border-zinc-100 font-semibold text-[var(--primary-700)] hover:bg-[var(--accent-50)]"
                      : "text-zinc-700 hover:bg-[var(--accent-50)] hover:text-[var(--primary-700)]"
                  }`}
                  onKeyDown={(event) => {
                    const menu = document.getElementById(menuId);
                    const links = menu
                      ? Array.from(menu.querySelectorAll<HTMLAnchorElement>("a"))
                      : [];
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      links[(index + 1) % links.length]?.focus();
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      links[(index - 1 + links.length) % links.length]?.focus();
                    }
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setIsOpen(false);
                      containerRef.current
                        ?.querySelector<HTMLElement>("[data-dropdown-trigger]")
                        ?.focus();
                    }
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })
            : null}
        </ul>
      </div>
    </div>
  );
}
