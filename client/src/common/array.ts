export function dedupe<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}
