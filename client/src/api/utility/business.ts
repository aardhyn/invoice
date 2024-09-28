import { Contact, Location } from ".";

export type Business = {
  business_id: number;
  name: string;
  location: Location;
  contact: Contact;
};
