import type { ReactNode } from "react";

/** Admin hits Prisma — never prerender at build time. */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
