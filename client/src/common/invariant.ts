export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    console.error("Invariant not met:", message);
    throw new Error(message);
  }
}
