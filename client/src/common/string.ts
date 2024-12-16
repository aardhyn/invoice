const SPACE = " ";

/**
 * Capitalizes the first letter of a string.
 * @example capitalize("hello, WORLD!"); // "Hello, world!"
 */
export function capitalize(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

/**
 * Converts a space separated string to Sentence Case.
 * @example toSentenceCase("hello world"); // "Hello World"
 */
export function toSentenceCase(str: string) {
  return str
    .split(SPACE)
    .map((word) => capitalize(word))
    .join(SPACE);
}

/**
 * Converts a snake case string to a human readable string.
 * @example fromSnakeCase("hello_world"); // "hello world"
 */
export function fromSnakeCase(str: string) {
  return str.replace(/_/g, SPACE);
}

/**
 * Semantic stringification of a boolean value.
 * @example stringifyBoolean(true); // "yes"
 * stringifyBoolean(true, { yes: "affirmative" no: "negative" }); // "affirmative"
 */
export function stringifyBoolean(
  value: boolean,
  { yes = "yes", no = "no" }: { yes?: string; no?: string } = {},
) {
  return value ? yes : no;
}
