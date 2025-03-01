/**
 * Borrowed from Rust. If T has some value map it to U otherwise return undefined.
 * ### Example
 * ```ts
 * // from
 * const value = someFunction() ? someValue : undefined;
 * const value2 = someValue ? process(someValue) : undefined;
 * // to
 * const value = map(someFunction(), someValue);
 * const value2 = map(someFunction(), process);
 * ```
 * @param value
 * @param then
 * @returns
 */
export function map<T, U>(
  value: T,
  then: ((value: Exclude<T, undefined | null>) => U) | U,
): U | undefined {
  return value === undefined || value === null
    ? undefined
    : typeof then === "function"
      ? (then as (value: T) => U)(value)
      : then;
}
