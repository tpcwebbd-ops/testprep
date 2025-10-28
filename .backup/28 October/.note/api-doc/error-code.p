// src/lib/error-codes.ts

/**
 * Centralized API error and success codes with unique identifiers.
 * Helps with debugging and consistent frontend error handling.
 */

export const ERROR_CODES = {
  // ✅ Success Responses
  SUCCESS: { code: 200, message: 'OK', id: 'S2000' },
  CREATED: { code: 201, message: 'Created successfully', id: 'S2010' },
  UPDATED: { code: 200, message: 'Updated successfully', id: 'S2001' },
  DELETED: { code: 200, message: 'Deleted successfully', id: 'S2002' },

  // ⚠️ Client Errors
  BAD_REQUEST: { code: 400, message: 'Bad Request — Missing or invalid input', id: 'E4000' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized — Authentication required', id: 'E4010' },
  FORBIDDEN: { code: 403, message: 'Forbidden — Access denied', id: 'E4030' },
  NOT_FOUND: { code: 404, message: 'Resource not found', id: 'E4040' },
  CONFLICT: { code: 409, message: 'Conflict — Already exists', id: 'E4090' },
  UNPROCESSABLE: { code: 422, message: 'Unprocessable Entity — Validation failed', id: 'E4220' },

  // 💥 Server Errors
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error', id: 'E5000' },
  DATABASE_ERROR: { code: 503, message: 'Database connection failed', id: 'E5030' },
} as const;

/**
 * Helper function to standardize API JSON responses.
 */
export function jsonResponse(
  key: keyof typeof ERROR_CODES,
  customMessage?: string,
  data?: unknown
) {
  const { code, message, id } = ERROR_CODES[key];

  return new Response(
    JSON.stringify({
      success: code < 400,
      message: customMessage || message,
      errorCode: id, // 👈 Unique error ID for tracking
      data: data || null,
    }),
    {
      status: code,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
