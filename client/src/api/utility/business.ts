import type { Contact, Location, Payment } from ".";

export type Business = {
  business_id: number;
  name: string;
  location?: Location;
  contact: Contact;
  payment: Payment;
};
