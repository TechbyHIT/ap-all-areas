import type { EncyclopediaSection } from "@/data/service-encyclopedia";
import { ProseSection } from "@/components/sections/ContentBlocks";

/** Renders Wikipedia-style explainer blocks from shared service encyclopedia. */
export function SeoEncyclopediaSections({
  sections,
}: {
  sections: readonly EncyclopediaSection[];
}) {
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => (
        <ProseSection
          key={section.heading}
          title={section.heading}
          variant={index % 2 === 1 ? "muted" : "default"}
        >
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 64)}>{paragraph}</p>
          ))}
        </ProseSection>
      ))}
    </>
  );
}
