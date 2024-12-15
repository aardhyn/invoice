/**
 * Boolean xor operation on JavaScript boolean types.
 *
 * @returns `true` if one and only one value of ...args is `true`
 */
export function xor(...args: boolean[]): boolean {
  return args.filter(Boolean).length === 1;
}
