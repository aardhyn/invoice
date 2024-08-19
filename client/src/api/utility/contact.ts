import { CreateLocation } from "./location";

export type CreateContact = {
  name: string;
  cell: string;
  email: string;
  location: CreateLocation;
};
