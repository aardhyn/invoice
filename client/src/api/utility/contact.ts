import type { CreateLocation, Location } from ".";
import type { Override } from "common";

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
  location: Location;
};

export type ContactWithOptionalLocation = Override<
  Contact,
  { location?: Location }
>;
