import { type Dispatch, type SetStateAction, useState } from "react";

/**
 * A standard useState hook, but with an additional function called before the value is set.
 * @param initialValue
 * @param onChange
 * @returns
 */
export function useStateUpdate<T>(
  initialValue: T,
  update: (value: T) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [get, set] = useState(initialValue);
  const handleChange = (change: SetStateAction<T>) => {
    set((prev) => {
      // handle the in-place update or function call before passing into the main effect.
      const next = change instanceof Function ? change(prev) : change;
      return update(next);
    });
  };
  return [get, handleChange];
}

/**
 * A standard useState hook, but with an additional effect called after each call to set.
 * @param initialValue
 * @param onChange
 * @returns
 */
export function useStateEffect<T>(
  initialValue: T,
  effect: (value: T) => void,
): [T, Dispatch<SetStateAction<T>>] {
  const [get, set] = useState(initialValue);
  const handleChange = (change: SetStateAction<T>) => {
    set((prev) => {
      // handle the in-place update or function call before passing into the main effect.
      const next = change instanceof Function ? change(prev) : change;
      effect(next);
      return next;
    });
  };
  return [get, handleChange];
}
