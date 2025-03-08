import type { Location } from ".";
import type { Override, Simplify } from "common";

export type Contact = {
  contactId: number;
  name: string;
  cell: string;
  email: string;
  location: Location;
};

export type CreateContact = Omit<Contact, "contactId">;

export type ContactWithOptionalLocation = Simplify<
  Override<Contact, { location?: Location }>
>;
