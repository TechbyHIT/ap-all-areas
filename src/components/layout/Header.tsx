import { HeaderClient } from "@/components/layout/HeaderClient";
import { TopBar } from "@/components/layout/TopBar";

/** Announcement bar (in flow) → sticky main header → page content. */
export function Header() {
  return (
    <>
      <TopBar />
      <HeaderClient />
    </>
  );
}
