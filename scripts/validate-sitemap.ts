/**
 * Validates the live App Router sitemap registry (same source as `/sitemap.xml`
 * index + `/sitemaps/*.xml` urlsets).
 *
 * Usage:
 *   npm run seo:validate-sitemap
 *   SITEMAP_VALIDATE_BASE=https://hiranayaenterprises.in npm run seo:validate-sitemap
 *   SITEMAP_VALIDATE_FULL=1 npm run seo:validate-sitemap   # HTTP-check every URL
 *   SITEMAP_VALIDATE_HTTP=0 npm run seo:validate-sitemap   # registry integrity only
 */

import {
  buildSitemapChunks,
  buildSitemapRegistry,
  countAllSitemapUrls,
  getSitemapFile,
  isSitemapRedirectPath,
  listSitemapIndexNames,
  SITEMAP_CHUNK_SIZE,
  SCALE_SITEMAP_CHUNK,
  type SitemapRegistryEntry,
} from "../src/lib/seo/sitemap-registry";

type Issue = { url: string; message: string };

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  return !["0", "false", "no", "off"].includes(value.toLowerCase());
}

function sampleEntries(registry: SitemapRegistryEntry[]): SitemapRegistryEntry[] {
  if (parseBool(process.env.SITEMAP_VALIDATE_FULL, false)) {
    return registry;
  }

  const hubs = registry.filter((e) => e.kind === "hub");
  const money = registry.filter((e) => e.kind === "money");
  const moneySampleSize = Math.min(
    Number(process.env.SITEMAP_VALIDATE_MONEY_SAMPLE ?? 40),
    money.length,
  );

  const step = moneySampleSize > 0 ? Math.max(1, Math.floor(money.length / moneySampleSize)) : 1;
  const moneySample: SitemapRegistryEntry[] = [];
  for (let i = 0; i < money.length && moneySample.length < moneySampleSize; i += step) {
    moneySample.push(money[i]!);
  }

  const seen = new Set<string>();
  const out: SitemapRegistryEntry[] = [];
  for (const entry of [...hubs, ...moneySample]) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    out.push(entry);
  }
  return out;
}

function assertRegistryIntegrity(registry: SitemapRegistryEntry[]): Issue[] {
  const issues: Issue[] = [];
  const seen = new Set<string>();

  for (const entry of registry) {
    if (!entry.url.startsWith("https://")) {
      issues.push({ url: entry.url, message: "URL must be absolute HTTPS" });
    }
    if (!entry.url.endsWith("/") || !entry.path.endsWith("/")) {
      issues.push({ url: entry.url, message: "URL/path must use trailing slash" });
    }
    if (!entry.lastModified) {
      issues.push({ url: entry.url, message: "Missing lastModified" });
    }
    if (isSitemapRedirectPath(entry.path)) {
      issues.push({
        url: entry.url,
        message: "Redirect-equivalent service-in-city path must not be listed",
      });
    }
    if (seen.has(entry.url)) {
      issues.push({ url: entry.url, message: "Duplicate URL" });
    }
    seen.add(entry.url);
  }

  const chunks = buildSitemapChunks();
  for (const chunk of chunks) {
    if (chunk.length > SITEMAP_CHUNK_SIZE) {
      issues.push({
        url: "(chunk)",
        message: `Chunk exceeds ${SITEMAP_CHUNK_SIZE} URLs (${chunk.length})`,
      });
    }
  }

  const flatCount = chunks.reduce((n, c) => n + c.length, 0);
  if (flatCount !== registry.length) {
    issues.push({
      url: "(chunks)",
      message: `Chunk flat count ${flatCount} != registry ${registry.length}`,
    });
  }

  return issues;
}

function extractCanonical(html: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
  ) ?? html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i,
  );
  return match?.[1] ?? null;
}

function extractRobots(html: string): string | null {
  const match = html.match(
    /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i,
  ) ?? html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']robots["']/i,
  );
  return match?.[1]?.toLowerCase() ?? null;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    let path = u.pathname;
    if (!path.endsWith("/")) path = `${path}/`;
    return `${u.origin}${path}${u.search}`;
  } catch {
    return url;
  }
}

async function validateHttp(
  entry: SitemapRegistryEntry,
  baseOrigin: string,
): Promise<Issue[]> {
  const issues: Issue[] = [];
  const target = entry.url.replace(
    new URL(entry.url).origin,
    baseOrigin.replace(/\/$/, ""),
  );

  let response: Response;
  try {
    response = await fetch(target, {
      redirect: "manual",
      headers: { "user-agent": "ap-sitemap-validator/1.0" },
    });
  } catch (error) {
    issues.push({
      url: target,
      message: `Fetch failed: ${error instanceof Error ? error.message : String(error)}`,
    });
    return issues;
  }

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location") ?? "(none)";
    issues.push({
      url: target,
      message: `Unexpected redirect ${response.status} → ${location} (sitemap URLs must be final 200)`,
    });
    return issues;
  }

  if (response.status !== 200) {
    issues.push({
      url: target,
      message: `HTTP ${response.status}`,
    });
    return issues;
  }

  const html = await response.text();
  const canonical = extractCanonical(html);
  if (!canonical) {
    issues.push({ url: target, message: "Missing rel=canonical" });
  } else if (normalizeUrl(canonical) !== normalizeUrl(entry.url)) {
    // When probing a non-production base, compare path only.
    const canonPath = new URL(canonical, baseOrigin).pathname;
    const expectedPath = new URL(entry.url).pathname;
    if (canonPath !== expectedPath) {
      issues.push({
        url: target,
        message: `Canonical mismatch: got ${canonical}, expected path ${expectedPath}`,
      });
    }
  }

  const robots = extractRobots(html);
  if (robots && /\bnoindex\b/i.test(robots)) {
    issues.push({
      url: target,
      message: `robots meta is noindex (${robots})`,
    });
  }

  return issues;
}

async function main() {
  const registry = buildSitemapRegistry();
  console.log(`Core registry URLs: ${registry.length}`);
  console.log(`Full sitemap URLs: ${countAllSitemapUrls().toLocaleString("en-IN")}`);
  console.log(`Child sitemaps: ${listSitemapIndexNames().length}`);
  console.log(`Core chunks: ${buildSitemapChunks().length} (max ${SITEMAP_CHUNK_SIZE})`);
  console.log(`Keyword child cap: ${SCALE_SITEMAP_CHUNK}`);

  const issues = assertRegistryIntegrity(registry);
  const keywordSample = getSitemapFile("andhra-pradesh-keywords-1");
  if (keywordSample) {
    issues.push(...assertRegistryIntegrity(keywordSample.entries.slice(0, 20)));
    if (keywordSample.entries.length > SCALE_SITEMAP_CHUNK) {
      issues.push({
        url: "(andhra-pradesh-keywords-1)",
        message: `Keyword child exceeds ${SCALE_SITEMAP_CHUNK}`,
      });
    }
  }

  const httpEnabled = parseBool(process.env.SITEMAP_VALIDATE_HTTP, true);
  const base =
    process.env.SITEMAP_VALIDATE_BASE?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "";

  if (httpEnabled && base) {
    const sample = sampleEntries(registry);
    console.log(`HTTP checks: ${sample.length} URLs against ${base}`);
    for (const entry of sample) {
      issues.push(...(await validateHttp(entry, base)));
    }
  } else if (httpEnabled && !base) {
    console.log(
      "HTTP checks skipped (set SITEMAP_VALIDATE_BASE or NEXT_PUBLIC_SITE_URL). Registry integrity still enforced.",
    );
  } else {
    console.log("HTTP checks disabled (SITEMAP_VALIDATE_HTTP=0).");
  }

  if (issues.length > 0) {
    console.error(`\nFAIL: ${issues.length} issue(s)`);
    for (const issue of issues.slice(0, 50)) {
      console.error(`- ${issue.url}: ${issue.message}`);
    }
    if (issues.length > 50) {
      console.error(`... and ${issues.length - 50} more`);
    }
    process.exit(1);
  }

  console.log("PASS: sitemap registry validation ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
