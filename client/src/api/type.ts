import { StatusCode } from "./constant";

export type APIResponse<T extends object, E = unknown> = {
  data: T | null;
  error: E | null;
  status: StatusCode;
};
