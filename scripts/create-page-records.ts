import { prisma } from "../src/lib/prisma";
import { buildCanonicalUrl } from "../src/lib/routing/paths";
import { INITIAL_SERVICES } from "../src/data/initial-services";

const args = process.argv.slice(2);
const typeArg = args.find((a) => a.startsWith("--type="));
const limitArg = args.find((a) => a.startsWith("--limit="));
const pageType = typeArg?.split("=")[1] ?? "service-location";
const limit = parseInt(limitArg?.split("=")[1] ?? "1000", 10);

const priorityCities = [
  "visakhapatnam",
  "vijayawada",
  "guntur",
  "tirupati",
  "rajamahendravaram",
  "kakinada",
  "nellore",
  "kurnool",
  "anantapur",
];

async function main() {
  let created = 0;

  if (pageType === "service-location") {
    for (const citySlug of priorityCities) {
      const location = await prisma.location.findUnique({
        where: { slug: citySlug },
      });
      if (!location) continue;

      for (const service of INITIAL_SERVICES) {
        if (created >= limit) break;
        const path = `/${citySlug}/${service.slug}/`;
        const exists = await prisma.page.findUnique({ where: { path } });
        if (exists) continue;

        const dbService = await prisma.service.findUnique({
          where: { slug: service.slug },
        });

        await prisma.page.create({
          data: {
            path,
            slug: `${citySlug}-${service.slug}`,
            pageType: "service-location",
            title: `${service.name} in ${location.name} | Service Available`,
            metaDescription: `${service.name} installation service available in ${location.name}, Andhra Pradesh. Coverage subject to site confirmation.`,
            h1: `${service.name} in ${location.name}`,
            canonicalUrl: buildCanonicalUrl(path),
            serviceId: dbService?.id,
            locationId: location.id,
            publicationStatus: "draft",
            allowIndexing: false,
            minimumRequiredWordCount: 1000,
            sitemapGroup: "service-location-1",
          },
        });
        created++;
      }
    }
  }

  console.log(`Created ${created} page records of type ${pageType}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
