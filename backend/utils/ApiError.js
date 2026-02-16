/**
 * ApiError
 * ------------------------------------------------------------------
 * Centralized custom error class for handling operational API errors.
 * Extends the native Error object by adding:
 *  - HTTP status code
 *  - Optional validation/details object
 *  - Operational flag for error classification
 *
 * Usage:
 *   throw new ApiError(400, "Invalid request");
 *   throw new ApiError(404, "User not found");
 */

class ApiError extends Error {
  /**
   * Create an API error instance.
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable error message
   * @param {any} [errors=null] - Optional additional error details
   */
  constructor(statusCode, message, errors = null) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.errors = errors;
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
