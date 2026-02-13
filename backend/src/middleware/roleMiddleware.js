// Role-based access control middleware
// Usage: roleMiddleware(["admin", "faculty"]) restricts route to admins and faculty only
const ApiError = require("../utils/ApiError");
module.exports = function (allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return next(new ApiError(403, "Access denied. No role found."));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Access denied. Insufficient permissions."),
      );
    }
    next();
  };
};
