import type { Location } from ".";
import type { Override, Simplify } from "common";

export type Contact = {
  contact_id: number;
  name: string;
  cell: string;
  email: string;
  location: Location;
};

export type CreateContact = Omit<Contact, "contact_id">;

export type ContactWithOptionalLocation = Simplify<
  Override<Contact, { location?: Location }>
>;
