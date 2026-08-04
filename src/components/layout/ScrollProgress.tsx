"use client";

import { useEffect } from "react";

/** Lightweight top scroll progress — CSS variable only, passive scroll. */
export function ScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight;
      const value = max > 0 ? (window.scrollY / max) * 100 : 0;
      root.style.setProperty("--scroll-progress", `${value}%`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="ds-scroll-progress" aria-hidden="true" />;
}
