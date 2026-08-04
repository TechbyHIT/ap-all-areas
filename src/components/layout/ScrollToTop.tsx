"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Jump to the top of the page on route change.
 *
 * `html { scroll-behavior: smooth }` in base.css turns the router's own scroll
 * reset into an animation, and the incoming render interrupts it — leaving a new
 * page sitting at the previous scroll offset. Passing an explicit
 * `behavior: "instant"` overrides the CSS rule, so in-page anchors keep their
 * smooth scrolling while navigation does not.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // A link to /page#section must be left to scroll to that section.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
