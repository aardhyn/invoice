/**
 * A timestamp string in the format of "YYYY-MM-DDTHH:MM:SS.SSSZ"
 */
export type Timestampz =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

/**
 * Check if a value is a timestamp string
 * ### Example
 * ```ts
 * const timestamp = "2021-08-01T12:34:56.789Z";
 * isTimestampz(timestamp); // true
 * ```
 */
export function isTimestampz(value: unknown): value is Timestampz {
  return typeof value === "string" && TIMESTAMPZ_REGEX.test(value);
}

export const TIMESTAMPZ_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;

export function splitTimestamp(timestamp: Timestampz) {
  const [date, time] = timestamp.split("T");
  return { date, time };
}

/**
 * cast a date or string date to a timestamp string
 * ### Example
 * ```ts
 * const date = "2021-08-01"
 * const timestamp = toTimestampz(date); // "2021-08-01T00:00:00.000Z"
 * isTimestampz(timestamp); // true
 * ```
 * @param date
 */
export function toTimestampz(date: Date | string): Timestampz {
  return new Date(date).toISOString() as Timestampz;
}

/**
 * Build a date from a timestamp string discarding the time
 * ### Example
 * ```ts
 * const timestamp = "2021-08-01T12:34:56.789Z";
 * const date = dateFromTimestamp(timestamp);
 * console.log(date); // "1 August 2021"
 * ```
 * @param timestamp
 */
export function dateFromTimestamp(timestamp: Timestampz) {
  return new Date(timestamp).toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Build a date from a timestamp string
 * ### Example
 * ```ts
 * const timestamp = "2021-08-01T12:34:56.789Z";
 * const time = timeFromTimestamp(timestamp);
 * console.log(time); // "12:34 PM"
 * ```
 * @param timestamp
 */
export function timeFromTimestamp(timestamp: Timestampz) {
  return new Date(timestamp).toLocaleTimeString("en-NZ", {
    hour: "numeric",
    minute: "numeric",
  });
}

/**
 * Date and time from a timestamp string
 * ### Example
 * ```ts
 * const timestamp = "2021-08-01T12:34:56.789Z";
 * const dateTime = dateTimeFromTimestamp(timestamp);
 * console.log(dateTime); // "1 August 2021 at 12:34 PM"
 * ```
 * @param timestamp string representation of a timestamp provided by the server
 */
export function dateTimeFromTimestamp(timestamp: Timestampz) {
  return new Date(timestamp).toLocaleString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
