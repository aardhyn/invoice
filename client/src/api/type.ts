import { STATUS_CODE } from "api";
import { type Simplify, xor } from "common";

export const HTTP_METHODS = ["POST"] as const; // yes, we're only using POST for now
export type HTTPMethod = (typeof HTTP_METHODS)[number];

export interface APIData {
  [key: string]: string | number | boolean | undefined | APIData | APIData[];
}

export type APIRequest = {
  method: HTTPMethod;
  data: APIData;
};

export type APIResponse<T extends object, E = string> = Simplify<
  { status: StatusCode } & ({ data: T; error: null } | { data: null; error: E })
>;

export function isAPIResponse<T extends object, E = string>(response: unknown): response is APIResponse<T, E> {
  if (typeof response !== "object" || response === null) return false;

  const { data, error, status } = response as Record<string, unknown>;

  if (typeof data !== "object" && data !== null) return false;
  if (typeof error !== "string" && error !== null) return false;
  if (typeof status !== "number") return false;
  if (!xor(!!data, !!error)) return false; // either data or error should be present

  return true;
}

export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];
