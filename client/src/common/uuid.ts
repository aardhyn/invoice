import { v4 as uuidv4 } from "uuid"; // fixme: use our own uuid generator... this is a bit overkill

export type Uuid = string; // fixme: brand type?

export function uuid() {
  return uuidv4();
}
