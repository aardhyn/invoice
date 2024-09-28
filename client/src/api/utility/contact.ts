import { CreateLocation, Location } from ".";
import { Override } from "../../common/type";

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
