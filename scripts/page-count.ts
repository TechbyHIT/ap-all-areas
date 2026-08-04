import { prisma } from "../src/lib/prisma";

async function main() {
  const [total, published, indexable, draft, noindex] = await Promise.all([
    prisma.page.count(),
    prisma.page.count({ where: { publicationStatus: "published" } }),
    prisma.page.count({
      where: {
        publicationStatus: "published",
        allowIndexing: true,
        qualityScore: { gte: 80 },
      },
    }),
    prisma.page.count({ where: { publicationStatus: "draft" } }),
    prisma.page.count({ where: { publicationStatus: "noindex" } }),
  ]);

  const summary = {
    total,
    published,
    indexable,
    draft,
    noindex,
    generatedAt: new Date().toISOString(),
  };

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
