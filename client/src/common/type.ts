/**
 * A type that represents a record with all properties of T being optional.
 * ### Example
 * ```ts
 * type A = Record<"a" | "b", number>;
 * const a: A = { a: 1, b: 2 };
 * const b: A = { a: 1 };
 */
export type PartialRecord<T> = Partial<Record<keyof T, unknown>>;

/**
 * Override a properties of T with those in U.
 * ### Example
 * ```ts
 * type Base = { a: string; b: number };
 * type Derived = Override<A, { a: number }>; // defines { a: number; b: number }
 */
export type Override<T, U extends PartialRecord<T>> = Omit<T, keyof U> & U;
