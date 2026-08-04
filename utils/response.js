// ------------------------------------------------------------
// response.js
// Centralized JSON response helpers for consistent API output.
// ------------------------------------------------------------

/**
 * Send a successful JSON response.
 *
 * @param {object} res - Express response object
 * @param {any} data - Main payload
 * @param {number} status - HTTP status code (default: 200)
 * @param {object} meta - Optional metadata (pagination, counts, etc.)
 */
export function sendSuccess(res, data, status = 200, meta = null) {
  const response = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(status).json(response);
}

/**
 * Send an error JSON response.
 *
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {array|object|null} errors - Optional detailed errors
 */
export function sendError(res, status, message, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(status).json(response);
}
