export function invariant(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    console.error("Invariant not met:", message);
    throw new Error(message);
  }
}
