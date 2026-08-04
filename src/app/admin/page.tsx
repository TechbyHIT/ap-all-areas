import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isPhoneValidForProduction, BUSINESS_CONFIG } from "@/config/business";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const [serviceCount, locationCount, pageCount, publishedCount, indexableCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.location.count(),
      prisma.page.count(),
      prisma.page.count({ where: { publicationStatus: "published" } }),
      prisma.page.count({
        where: {
          publicationStatus: "published",
          allowIndexing: true,
          qualityScore: { gte: 80 },
        },
      }),
    ]).catch(() => [4, 0, 0, 0, 0]);

  const phoneWarning = !isPhoneValidForProduction();

  return (
    <Section>
      <Container>
        <Heading as="h1">Admin Dashboard</Heading>

        {phoneWarning && (
          <Card className="mt-4 border-amber-300 bg-amber-50">
            <p className="font-semibold text-amber-800">Phone number validation warning</p>
            <p className="mt-1 text-sm text-amber-700">
              The configured number ({BUSINESS_CONFIG.phone.display}) is not a valid
              10-digit Indian mobile. Call links, WhatsApp links, form notifications and
              production publishing are blocked until corrected.
            </p>
          </Card>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><p className="text-sm text-zinc-500">Services</p><p className="text-2xl font-bold">{serviceCount}</p></Card>
          <Card><p className="text-sm text-zinc-500">Locations</p><p className="text-2xl font-bold">{locationCount}</p></Card>
          <Card><p className="text-sm text-zinc-500">Total Pages</p><p className="text-2xl font-bold">{pageCount}</p></Card>
          <Card><p className="text-sm text-zinc-500">Published</p><p className="text-2xl font-bold">{publishedCount}</p></Card>
          <Card><p className="text-sm text-zinc-500">Indexable</p><p className="text-2xl font-bold">{indexableCount}</p></Card>
        </div>

        <div className="mt-8">
          <Heading as="h2">Quick Links</Heading>
          <ul className="mt-4 list-disc pl-5 space-y-1">
            <li><Link href="/admin/services/" className="text-[var(--primary-700)] hover:underline">Services</Link></li>
            <li><Link href="/admin/locations/" className="text-[var(--primary-700)] hover:underline">Locations</Link></li>
            <li><Link href="/admin/pages/" className="text-[var(--primary-700)] hover:underline">Pages</Link></li>
            <li><Link href="/admin/publishing/" className="text-[var(--primary-700)] hover:underline">Publishing</Link></li>
            <li><Link href="/admin/audits/" className="text-[var(--primary-700)] hover:underline">Audits</Link></li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
