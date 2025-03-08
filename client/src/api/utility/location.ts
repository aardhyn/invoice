export type Location = {
  address: string;
  suburb: string | null;
  city: string;
};

export function locationStringify(
  location: Location,
  delimiter: string = ", ",
) {
  return [location.address, location.suburb, location.city]
    .filter(Boolean)
    .join(delimiter);
}
