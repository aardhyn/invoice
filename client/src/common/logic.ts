export function xor(...args: boolean[]): boolean {
  return args.filter(Boolean).length === 1;
}
