// Role-based access control middleware
// Usage: roleMiddleware(["admin", "faculty"]) restricts route to admins and faculty only
module.exports = function (allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied. No role found." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
