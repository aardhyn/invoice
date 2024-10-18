/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Semantic stringification of a boolean value.
 */
export function stringifyBoolean(
  value: boolean,
  { yes = "yes", no = "no" }: { yes?: string; no?: string } = {},
) {
  return value ? yes : no;
}
