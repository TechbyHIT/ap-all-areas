"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function jumpToTop() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = previous;
}

/**
 * Jump to the top of the page on route change.
 *
 * `html { scroll-behavior: smooth }` turns the router's scroll reset into an
 * animation that incoming renders interrupt — leaving new pages mid-scroll
 * (“content on the backside”). Force an instant jump and disable browser
 * scroll restoration for App Router navigations.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) return;

    jumpToTop();
    const raf = window.requestAnimationFrame(jumpToTop);
    const t = window.setTimeout(jumpToTop, 0);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
