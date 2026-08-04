/**
 * Report programmatic SEO addressable capacity vs 9-lakh target.
 * Usage: npm run scale:capacity
 */
import { buildScaleReport } from "../src/config/programmatic-scale";
import { KEYWORD_INTENTS } from "../src/data/keyword-intents";
import { countScaleLocalities } from "../src/data/ap-locality-expansion";

const report = buildScaleReport();

console.log("=== SK Invisible Grills — Programmatic Scale Report ===\n");
console.log(`Target:           ${report.target.toLocaleString("en-IN")} (9 lakh)`);
console.log(
  `Addressable:      ${report.addressableTotal.toLocaleString("en-IN")}`,
);
console.log(`Meets 9 lakh:     ${report.meetsNineLakh ? "YES" : "NO — expand localities/keywords"}`);
console.log(`Keyword intents:  ${KEYWORD_INTENTS.length}`);
console.log(`Scale localities: ${countScaleLocalities().toLocaleString("en-IN")}`);
console.log("\n--- Layers ---");
for (const layer of report.layers) {
  console.log(
    `${layer.id.padEnd(22)} ${layer.count.toLocaleString("en-IN").padStart(12)}  ${layer.formula}`,
  );
}
console.log("\n--- Publish tiers ---");
console.log(
  `P0 index-now:   ${report.publishTiers.p0IndexNow.toLocaleString("en-IN")}`,
);
console.log(
  `P1 draft:       ${report.publishTiers.p1DraftExpand.toLocaleString("en-IN")}`,
);
console.log(
  `P2 capacity:    ${report.publishTiers.p2CapacityOnly.toLocaleString("en-IN")}`,
);
console.log(
  "\nRule: Capacity can be 9L+. Index only pages with unique locality facts, FAQ, photo CTA, and parent links.",
);
