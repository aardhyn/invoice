import { StatusCode } from "./constant";

export const HTTP_METHODS = ["POST"] as const; // yes, we're only using POST for now
export type HTTPMethod = (typeof HTTP_METHODS)[number];

export interface APIData {
  [key: string]: string | number | boolean | undefined | APIData | APIData[];
}

export type APIRequest = {
  method: HTTPMethod;
  data: APIData;
};

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
