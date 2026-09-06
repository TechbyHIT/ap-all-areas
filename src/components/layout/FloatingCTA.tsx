"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-load floating contact FAB so primary content paints first (INP/LCP).
 */
const FloatingContactButtons = dynamic(
  () =>
    import("@/components/ui/FloatingContactButtons").then(
      (m) => m.FloatingContactButtons,
    ),
  { ssr: false, loading: () => null },
);

export function FloatingCTA() {
  return <FloatingContactButtons />;
}
