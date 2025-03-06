/**
 * # 📃 PartialRecord
 * A type that represents a record with all properties of T being optional.
 * ### Example
 * ```ts
 * type A = Record<"a" | "b", number>;
 * const a: A = { a: 1, b: 2 };
 * const b: A = { a: 1 };
 */
export type PartialRecord<T> = Partial<Record<keyof T, unknown>>;

/**
 * # ✏️ Override
 * Override a properties of T with those in U.
 * ### Example
 * ```ts
 * type Base = { a: string; b: number };
 * type Derived = Override<A, { a: number }>; // defines { a: number; b: number }
 */
export type Override<T, U extends PartialRecord<T>> = Omit<T, keyof U> & U;

/**
 * # 🧘 Simplify
 * Expand `T` to its normalized human-readable form to simplify intellisense tooltips on complex types.
 * ### Example
 * ```ts
 * // this type is simple, so intellisense will expand it
 * // to `{ a: number; b: number; c: boolean }` (same)
 * type A = { a: string; b: number, c: string };
 *
 * // intellisense will not expand this expression into its simplified
 * // form of `{ a: number | string; b: number, d: boolean; }`
 * type B = Override<Omit<A, "c"> & { d: boolean }, { a: number | string }>;
 *
 * // Simplify forces intellisense to expand
 * // the type to `{ a: number | string; b: number; d: boolean; }`
 * type C = Simplify<B>;
 */
export type Simplify<T> = {
  [K in keyof T]: T[K];
} & {};
