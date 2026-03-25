const sendResponse = require('../utils/response');

/**
 * Role-Based Access Control Middleware
 * Restricts route access to specific user roles (admin, faculty, student, staff).
 * @param {String|String[]} roles - Allowed role(s) for the route
 * @returns {Function} Express middleware function
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
