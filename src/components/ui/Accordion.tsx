"use client";

import { useId, useState, type ReactNode } from "react";

export type AccordionItem = {
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: readonly AccordionItem[];
  defaultOpenIndex?: number | null;
  className?: string;
};

export function Accordion({
  items,
  defaultOpenIndex = 0,
  className = "",
}: AccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  if (items.length === 0) return null;

  return (
    <div
      className={`divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`.trim()}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={`${item.title}-${index}`}>
            <h3>
              <button
                id={triggerId}
                type="button"
                className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--primary-600)] sm:px-6"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              >
                <span>{item.title}</span>
                <span
                  className={`shrink-0 text-[var(--primary-700)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`px-4 pb-4 text-sm leading-relaxed text-zinc-600 sm:px-6 sm:text-base ${
                isOpen ? "" : "hidden"
              }`}
            >
              {/* Keep FAQ answers in the HTML document for SEO; schema mirrors these. */}
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
