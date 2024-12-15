/**
 * Evaluate an expected truthy `expression` and assert `message` if falsy
 */
export function invariant(
  expression: unknown,
  message: string,
): asserts expression {
  if (!expression) {
    console.error("Invariant not met:", message);
    throw new Error(message);
  }
}
