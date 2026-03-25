const sendResponse = require('../utils/response');

/**
 * Middleware factory to restrict access by user role.
 * @param {String|String[]} roles - Required role(s) for access
 * @returns {Function} Express middleware function
 *
 * Usage:
 *   roleMiddleware("admin")
 *   roleMiddleware(["admin", "faculty"])
 */
module.exports = function roleMiddleware(roles) {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendResponse(
          res,
          {
            success: false,
            message: 'Unauthorized',
            data: null,
            error: 'User not authenticated',
          },
          401
        );
      }

      if (!roles.includes(req.user.role)) {
        return sendResponse(
          res,
          {
            success: false,
            message: 'Forbidden: insufficient role',
            data: null,
            error: `Required role(s): ${roles.join(', ')}`,
          },
          403
        );
      }

      next();
    } catch (error) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Internal server error',
          data: null,
          error: error.message,
        },
        500
      );
    }
  };
};
