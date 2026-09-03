/**
 * §62 Image alt text — describe the image; no keyword stuffing.
 */

const STUFFING_PATTERNS = [
  /\bbest\b.*\b(bangalore|bengaluru|hyderabad|chennai|mumbai)\b/i,
  /\b(balcony safety nets?)\b.*\1/i,
  /(safety nets?|invisible grills?).{0,40}\1/i,
];

const REPEATED_PHRASE = /\b([a-z][a-z\s]{3,40})\b(?:\s+\1){1,}/i;

export type AltTextIssue = {
  code: "empty" | "too-short" | "keyword-stuffed" | "filename-only";
  message: string;
};

export function validateImageAlt(alt: string, src?: string): {
  ok: boolean;
  issues: AltTextIssue[];
} {
  const issues: AltTextIssue[] = [];
  const trimmed = alt.trim();

  if (!trimmed) {
    issues.push({ code: "empty", message: "Alt text is empty" });
    return { ok: false, issues };
  }

  if (trimmed.length < 12) {
    issues.push({
      code: "too-short",
      message: "Alt text should briefly describe what is visible",
    });
  }

  for (const pattern of STUFFING_PATTERNS) {
    if (pattern.test(trimmed)) {
      issues.push({
        code: "keyword-stuffed",
        message: "Alt looks keyword-stuffed rather than descriptive",
      });
      break;
    }
  }

  if (REPEATED_PHRASE.test(trimmed)) {
    issues.push({
      code: "keyword-stuffed",
      message: "Alt repeats the same phrase",
    });
  }

  if (src) {
    const file = src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
    const slugWords = file.replace(/[-_]+/g, " ").toLowerCase();
    if (trimmed.toLowerCase() === slugWords) {
      issues.push({
        code: "filename-only",
        message: "Alt is only the filename — add a human description",
      });
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Build a natural alt. Location only when genuinely known for that photo.
 */
export function buildDescriptiveAlt(input: {
  whatVisible: string;
  city?: string | null;
  serviceName?: string | null;
}): string {
  const base = input.whatVisible.trim().replace(/\.$/, "");
  if (input.city) {
    return `${base} in ${input.city}`;
  }
  return base;
}
