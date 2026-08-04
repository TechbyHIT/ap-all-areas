import { prisma } from "../src/lib/prisma";

const args = process.argv.slice(2);
const qualityArg = args.find((a) => a.startsWith("--quality-below="));
const threshold = parseInt(qualityArg?.split("=")[1] ?? "80", 10);

async function main() {
  const result = await prisma.page.updateMany({
    where: {
      qualityScore: { lt: threshold },
      publicationStatus: "published",
    },
    data: {
      publicationStatus: "noindex",
      allowIndexing: false,
    },
  });

  console.log(`Set ${result.count} pages to noindex (quality below ${threshold})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
