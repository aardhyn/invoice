import type { Contact, Location } from ".";

export type Client = {
  clientId: number;
  name: string;
  location: Location;
  contact: Contact;
};
