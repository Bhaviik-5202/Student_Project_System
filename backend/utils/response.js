/**
 * API Response Utility
 * ------------------------------------------------------------------
 * Ensures consistent structure for all API responses across the platform.
 */

/**
 * Send a standardized API response
 * @param {Object} res - Express response object
 * @param {Object} payload - Response data and metadata
 * @param {boolean} [payload.success=true] - Operation success status
 * @param {any} [payload.data=null] - Payload content
 * @param {string} [payload.message=""] - Status description
 * @param {Object} [payload.meta] - Additional metadata
 * @param {number} [status=200] - HTTP status code
 * @returns {Object} Standardized JSON response
 */

module.exports = function sendResponse(
  res,
  { success = true, data = null, message = "", meta } = {},
  status = 200,
) {
  const response = {
    success,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(status).json(response);
};
