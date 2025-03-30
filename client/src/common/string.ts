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
    .filter(Boolean)
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

/**
 * Modern API wrapper for `JSON.stringify` with sensible defaults.
 * @example formatJson({ hello: "world" }); // "{\n  \"hello\": \"world\"\n}"
 */
export function formatJson(
  json: unknown,
  {
    indent = 2,
    replacer,
  }: {
    indent?: number;
    replacer?(key: string, value: unknown): unknown;
  } = {},
) {
  if (typeof json === "string") {
    return formatJson(JSON.parse(json), { indent, replacer });
  } else {
    return JSON.stringify(json, replacer, indent);
  }
}
