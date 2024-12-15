import { v4 as uuidv4 } from "uuid";

export type Uuid = string; // fixme: brand type?

export function uuid() {
  return uuidv4();
}
