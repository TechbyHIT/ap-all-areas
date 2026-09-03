/**
 * §48–49 Schema validation — syntax, required fields, no fabricated claims.
 */

export type SchemaIssue = {
  path: string;
  message: string;
};

type JsonLd = Record<string, unknown>;

const REQUIRED_BY_TYPE: Record<string, string[]> = {
  Organization: ["name", "url"],
  LocalBusiness: ["name", "address"],
  Service: ["name", "provider"],
  BreadcrumbList: ["itemListElement"],
  WebSite: ["name", "url"],
  WebPage: ["name", "url"],
  FAQPage: ["mainEntity"],
  Article: ["headline"],
  ImageObject: ["contentUrl"],
  HowTo: ["name", "step"],
  ItemList: ["itemListElement"],
};

function isObject(value: unknown): value is JsonLd {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectTypes(node: JsonLd): string[] {
  const raw = node["@type"];
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === "string");
  return [];
}

function validateNode(
  node: JsonLd,
  path: string,
  issues: SchemaIssue[],
  options?: { enforceRequired?: boolean },
): void {
  const enforceRequired =
    options?.enforceRequired ?? (path === "$" || path.startsWith("$["));
  const types = collectTypes(node);
  if (types.length === 0 && path === "$") {
    issues.push({ path, message: "Missing @type" });
  }

  // Required-field checks apply to top-level schema nodes only.
  // Nested entity refs (e.g. provider Organization) often omit url intentionally.
  if (enforceRequired) {
    for (const type of types) {
      const required = REQUIRED_BY_TYPE[type];
      if (!required) continue;
      for (const field of required) {
        if (node[field] == null || node[field] === "") {
          issues.push({
            path,
            message: `${type} missing required field: ${field}`,
          });
        }
      }
    }
  }

  if (typeof node.url === "string" && node.url.startsWith("http://localhost")) {
    issues.push({ path: `${path}.url`, message: "URL must not use localhost in public schema" });
  }

  // Reject fabricated review aggregates without genuine data.
  if (node.aggregateRating != null) {
    issues.push({
      path: `${path}.aggregateRating`,
      message: "aggregateRating requires verified genuine reviews — remove if fabricated",
    });
  }

  for (const [key, value] of Object.entries(node)) {
    if (isObject(value)) validateNode(value, `${path}.${key}`, issues);
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isObject(item)) validateNode(item, `${path}.${key}[${index}]`, issues);
      });
    }
  }
}

export function validateJsonLd(data: unknown): {
  ok: boolean;
  issues: SchemaIssue[];
} {
  const issues: SchemaIssue[] = [];

  if (data == null) {
    return { ok: false, issues: [{ path: "$", message: "Schema is null/undefined" }] };
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return { ok: false, issues: [{ path: "$", message: "Invalid JSON-LD syntax" }] };
    }
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (!isObject(item)) {
        issues.push({ path: `$[${index}]`, message: "Expected object node" });
        return;
      }
      if (item["@context"] == null && index === 0) {
        // @context may live only on the first graph node
      }
      validateNode(item, `$[${index}]`, issues);
    });
    return { ok: issues.length === 0, issues };
  }

  if (!isObject(data)) {
    return { ok: false, issues: [{ path: "$", message: "Expected object or array" }] };
  }

  if (data["@context"] == null) {
    issues.push({ path: "$", message: "Missing @context" });
  }

  validateNode(data, "$", issues);
  return { ok: issues.length === 0, issues };
}

/** Detect duplicate @type blocks that often indicate copy-paste schema spam. */
export function findDuplicateSchemaTypes(blocks: unknown[]): string[] {
  const counts = new Map<string, number>();
  for (const block of blocks) {
    if (!isObject(block)) continue;
    for (const type of collectTypes(block)) {
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .map(([type]) => type);
}
