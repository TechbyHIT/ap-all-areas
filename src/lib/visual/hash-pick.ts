/**
 * Stable hash for diversifying media / FAQ selection per URL without randomness.
 */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickByHash<T>(items: readonly T[], seed: string): T | null {
  if (items.length === 0) return null;
  return items[hashString(seed) % items.length] ?? null;
}

export function rotateByHash<T>(items: readonly T[], seed: string): T[] {
  if (items.length === 0) return [];
  const offset = hashString(seed) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
