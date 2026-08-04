import { prisma } from "../src/lib/prisma";
import { isPageIndexable } from "../src/lib/publishing/indexability";

const args = process.argv.slice(2);
const batchArg = args.find((a) => a.startsWith("--batch-size="));
const batchSize = Math.min(
  parseInt(batchArg?.split("=")[1] ?? "100", 10),
  500,
);

async function main() {
  const candidates = await prisma.page.findMany({
    where: {
      publicationStatus: { in: ["draft", "review"] },
      qualityScore: { gte: 80 },
      contentReviewed: true,
      localDataVerified: true,
    },
    take: batchSize,
  });

  let published = 0;
  for (const page of candidates) {
    if (
      isPageIndexable({
        ...page,
        minimumRequiredWordCount: page.minimumRequiredWordCount,
      })
    ) {
      await prisma.page.update({
        where: { id: page.id },
        data: {
          publicationStatus: "published",
          allowIndexing: true,
          publishedAt: new Date(),
        },
      });
      published++;
    }
  }

  await prisma.publishingBatch.create({
    data: {
      name: `Batch ${new Date().toISOString()}`,
      batchSize,
      status: "completed",
      pagesCount: published,
      log: [{ published, candidates: candidates.length }],
    },
  });

  console.log(`Published ${published} of ${candidates.length} candidates`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
