import { prisma } from "../src/lib/prisma";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

async function main() {
  const thin = await prisma.page.findMany({
    where: { wordCount: { lt: 700 }, publicationStatus: "published" },
    select: { id: true, path: true, wordCount: true },
    take: 1000,
  });

  const report = { thinPages: thin, count: thin.length, generatedAt: new Date().toISOString() };
  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "content-quality.json"), JSON.stringify(report, null, 2));
  console.log(`Content audit: ${thin.length} thin pages found`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
