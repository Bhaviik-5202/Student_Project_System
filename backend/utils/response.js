/**
 * Centralized Response Utility
 * ------------------------------------------------------------------
 * Ensures consistent API response structure across the application.
 * Standard Response Format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: any,
 *   meta?: object
 * }
 *
 * @param {import("express").Response} res
 * @param {Object} options
 * @param {boolean} [options.success=true]
 * @param {any} [options.data=null]
 * @param {string} [options.message=""]
 * @param {Object} [options.meta]
 * @param {number} [status=200]
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
