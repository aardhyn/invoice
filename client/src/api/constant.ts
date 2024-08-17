export const StatusCode = {
  // Informational //
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  // Client Error //
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  // Server Error //
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];
