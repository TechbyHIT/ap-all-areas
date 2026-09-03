import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import {
  buildContentQualityDashboard,
  buildSeoHealthDashboard,
  runAutomatedSeoQa,
} from "@/lib/seo/seo-health";

export const dynamic = "force-dynamic";

export default function AdminAuditsPage() {
  const qa = runAutomatedSeoQa();
  const health = buildSeoHealthDashboard();
  const content = buildContentQualityDashboard();

  return (
    <Section>
      <Container>
        <Heading as="h1">SEO Health</Heading>
        <p className="mt-2 text-sm text-zinc-600">
          Live snapshot from sitemap registry + governance modules. CLI:{" "}
          <code className="rounded bg-zinc-100 px-1">npm run seo:qa</code>
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-zinc-500">Sitemap URLs</p>
            <p className="text-2xl font-bold">{health.totals.sitemapUrls}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Availability cells</p>
            <p className="text-2xl font-bold">
              {health.totals.availabilityIndexable}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">QA critical</p>
            <p className="text-2xl font-bold text-red-700">{qa.critical}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">QA warnings</p>
            <p className="text-2xl font-bold text-amber-700">{qa.warn}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Orphan critical</p>
            <p className="text-2xl font-bold">{health.totals.orphanCritical}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Schema errors</p>
            <p className="text-2xl font-bold">{health.totals.schemaErrors}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Alt issues</p>
            <p className="text-2xl font-bold">{health.totals.altErrors}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Content gaps</p>
            <p className="text-2xl font-bold">{content.lowQualityCandidates}</p>
          </Card>
        </div>

        <div className="mt-10">
          <Heading as="h2">By page type</Heading>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {Object.entries(health.byPageType).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <Heading as="h2">Services needing content gaps review</Heading>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {content.servicesNeedingGaps.slice(0, 8).map((row) => (
              <li key={row.service}>
                {row.service}: {row.gapCount} gaps
              </li>
            ))}
          </ul>
          {content.notes.map((note) => (
            <p key={note} className="mt-2 text-xs text-zinc-500">
              {note}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <Heading as="h2">CLI audits</Heading>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            <li>
              <code>npm run seo:qa</code>
            </li>
            <li>
              <code>npm run seo:orphans</code>
            </li>
            <li>
              <code>npm run seo:link-health</code>
            </li>
            <li>
              <code>npm run seo:validate-sitemap</code>
            </li>
            <li>
              <Link href="/admin/" className="text-[var(--primary-700)] hover:underline">
                Back to admin
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
