import { prisma } from "../src/lib/prisma";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

async function main() {
  const pages = await prisma.page.findMany({
    where: { publicationStatus: "published", allowIndexing: true },
    select: { id: true, path: true },
    take: 5000,
  });

  const links = await prisma.internalLink.findMany({ select: { toPageId: true } });
  const linkedPageIds = new Set(links.map((l: { toPageId: string }) => l.toPageId));

  const orphans = pages.filter((p: { id: string }) => !linkedPageIds.has(p.id));

  const report = {
    orphans: orphans.map((p: { path: string }) => p.path),
    count: orphans.length,
    generatedAt: new Date().toISOString(),
  };
  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "internal-links.json"), JSON.stringify(report, null, 2));
  console.log(`Link audit: ${orphans.length} orphan pages found`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
