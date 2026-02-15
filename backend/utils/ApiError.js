/**
 * Centralized error class for API errors.
 * Extends the built-in Error class to include status code and additional error details.
 * @module utils/ApiError
 */
class ApiError extends Error {
  /**
   * Creates an ApiError instance.
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {any} [errors=null] - Additional error details
   */
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
