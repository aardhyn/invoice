import { Simplify } from "common";

export type CreateLocation = {
  address: string;
  suburb: string;
  city: string;
};

export type Location = {
  location_id: number;
  address: string;
  suburb: string;
  city: string;
};

export type AnonymousLocation = Simplify<CreateLocation>;

export function locationStringify(
  location: Location | CreateLocation,
  delimiter: string = ", ",
) {
  return [location.address, location.suburb, location.city]
    .filter(Boolean)
    .join(delimiter);
}
