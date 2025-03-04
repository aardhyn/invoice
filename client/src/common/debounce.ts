import { useRef } from "react";

/**
 * # 🏀 useDebounce
 *
 * produces a debounced wrapper function that an invocation of `fn` by
 * `delayMs` and overrides a pending invocations.
 *
 * @param fn Function to debounce
 * @param delayMs Delay in milliseconds
 * @returns
 */
export function useDebounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
) {
  const timeout = useRef<NodeJS.Timeout>();
  return function (...args: Args) {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
