/**
 * Centralized response utility for consistent API responses.
 * Sends a JSON response with error, data, and message fields.
 *
 * @param {import('express').Response} res - Express response object
 * @param {Object} options - Response options
 * @param {boolean} [options.error] - Indicates if there was an error
 * @param {any} [options.data] - Data to send in the response
 * @param {string} [options.message] - Message to send in the response
 * @param {number} [status=200] - HTTP status code
 */
module.exports = function (res, { error, data, message }, status = 200) {
  res.status(status).json({ error, data, message });
};
