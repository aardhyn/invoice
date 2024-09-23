import { Contact, Location } from ".";

export type Client = {
  client_id: number;
  name: string;
  location: Location;
  contact: Contact;
};
