import type { Contact, Location, Payment } from ".";

export type Business = {
  businessId: number;
  name: string;
  location?: Location;
  contact: Contact;
  payment: Payment;
};
