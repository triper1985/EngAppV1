// src/audio/once.ts

const spokenKeys = new Set<string>();

export function hasSpoken(key: string): boolean {
  return spokenKeys.has(key);
}

export function markSpoken(key: string): void {
  spokenKeys.add(key);
}

/**
 * Reset keys.
 * - resetOnceScope() clears everything
 * - resetOnceScope("quiz:unit123") clears all keys that start with that prefix
 */
export function resetOnceScope(prefix?: string): void {
  if (!prefix) {
    spokenKeys.clear();
    return;
  }

  for (const k of spokenKeys) {
    if (k.startsWith(prefix)) spokenKeys.delete(k);
  }
}
