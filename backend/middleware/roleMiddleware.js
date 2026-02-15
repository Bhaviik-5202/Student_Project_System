/**
 * Middleware to restrict access by user role.
 * Usage: roleMiddleware('admin'), roleMiddleware(['admin', 'faculty'])
 * @function
 * @param {string|string[]} roles - Allowed role(s) for the route
 * @returns {import('express').RequestHandler}
 */
module.exports = function roleMiddleware(roles) {
  if (!Array.isArray(roles)) roles = [roles];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        data: null,
        message: "Forbidden: insufficient role",
      });
    }
    next();
  };
};
