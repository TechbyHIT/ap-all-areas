/**
 * §43 Redirect registry — permanent redirects only; prefer A→C over A→B→C.
 */

import { SERVICE_SLUG_REDIRECTS } from "@/config/geo";
import { normalizePath } from "@/lib/routing/paths";
import { matchLegacySiloRedirect } from "@/lib/routing/location-silo";

export type RedirectRule = {
  from: string;
  to: string;
  status: 301 | 308;
  reason: string;
};

/** Explicit static redirects (also implemented in `proxy.ts`). */
export const STATIC_REDIRECT_RULES: RedirectRule[] = [
  {
    from: "/terms/",
    to: "/terms-and-conditions/",
    status: 308,
    reason: "legacy terms alias",
  },
  {
    from: "/service-areas/",
    to: "/locations/andhra-pradesh/",
    status: 308,
    reason: "legacy service-areas hub → state silo",
  },
  ...Object.entries(SERVICE_SLUG_REDIRECTS).map(([fromSlug, toSlug]) => ({
    from: `/services/${fromSlug}/`,
    to: `/services/${toSlug}/`,
    status: 308 as const,
    reason: "service slug alias",
  })),
];

const STATIC_MAP = new Map(
  STATIC_REDIRECT_RULES.map((rule) => [normalizePath(rule.from), rule]),
);

/** Single-hop lookup from the registry + legacy silo matcher. */
export function lookupRedirect(pathname: string): RedirectRule | null {
  const path = normalizePath(pathname);
  const staticHit = STATIC_MAP.get(path);
  if (staticHit) return staticHit;

  const legacy = matchLegacySiloRedirect(path);
  if (legacy && normalizePath(legacy) !== path) {
    return {
      from: path,
      to: normalizePath(legacy),
      status: 308,
      reason: "legacy silo / alias → canonical",
    };
  }

  return null;
}

/**
 * Resolve to the final destination, detecting chains and loops.
 * Prefer registering flattened A→C rules when a chain is found.
 */
export function resolveRedirectTarget(
  pathname: string,
  maxHops = 8,
): {
  finalPath: string;
  hops: string[];
  chain: boolean;
  loop: boolean;
} {
  const hops: string[] = [];
  let current = normalizePath(pathname);
  const seen = new Set<string>();

  for (let i = 0; i < maxHops; i++) {
    if (seen.has(current)) {
      return { finalPath: current, hops, chain: hops.length > 1, loop: true };
    }
    seen.add(current);
    const next = lookupRedirect(current);
    if (!next) break;
    hops.push(current);
    current = normalizePath(next.to);
  }

  return {
    finalPath: current,
    hops,
    chain: hops.length > 1,
    loop: false,
  };
}

/** Audit all static rules for chains / loops (legacy matcher not fully expanded). */
export function auditRedirectRegistry(): {
  chains: Array<{ from: string; hops: string[]; finalPath: string }>;
  loops: Array<{ from: string; hops: string[] }>;
  ok: boolean;
} {
  const chains: Array<{ from: string; hops: string[]; finalPath: string }> = [];
  const loops: Array<{ from: string; hops: string[] }> = [];

  for (const rule of STATIC_REDIRECT_RULES) {
    const resolved = resolveRedirectTarget(rule.from);
    if (resolved.loop) {
      loops.push({ from: rule.from, hops: resolved.hops });
    } else if (resolved.chain) {
      chains.push({
        from: rule.from,
        hops: [...resolved.hops, resolved.finalPath],
        finalPath: resolved.finalPath,
      });
    }
  }

  return { chains, loops, ok: chains.length === 0 && loops.length === 0 };
}
