import { Timestampz } from "api";

/**
 * Date from a timestamp string
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
 * Time from a timestamp string
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
