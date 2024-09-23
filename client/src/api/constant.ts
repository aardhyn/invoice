export const StatusCode = {
  // Informational //
  OK: 200,
  CREATED: 201,
  // Client Error //
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  // Server Error //
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const TIMESTAMPZ_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;
