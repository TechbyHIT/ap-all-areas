import { TrustStrip } from "@/components/sections/TrustStrip";
import { SITE_TRUST_STATS } from "@/config/trust";

export function HomeTrustStrip() {
  return <TrustStrip stats={SITE_TRUST_STATS} />;
}
