import { StatusCode, TIMESTAMPZ_REGEX } from "./constant";

export type APIResponse<T extends object, E = object> = {
  data: T | null;
  error: E | null;
  status: StatusCode;
};

export function isAPIResponse<T extends object, E = object>(
  response: unknown,
): response is APIResponse<T, E> {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const { data, error, status } = response as Record<string, unknown>;

  if (typeof data !== "object" && data !== null) {
    return false;
  }

  if (typeof error !== "string" && error !== null) {
    return false;
  }

  if (typeof status !== "number") {
    return false;
  }

  return true;
}

export type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];

export type Timestampz = string; // fixme: brand type?

export function isTimestampz(value: unknown): value is Timestampz {
  return typeof value === "string" && TIMESTAMPZ_REGEX.test(value);
}
