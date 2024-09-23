import { CreateLocation } from "./location";

export type CreateContact = {
  name: string;
  cell: string;
  email: string;
  location: CreateLocation;
};

export type Contact = {
  contact_id: number;
  name: string;
  cell: string;
  email: string;
  location: CreateLocation;
};
