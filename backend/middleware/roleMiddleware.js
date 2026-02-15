// middleware/roleMiddleware.js
// Usage: roleMiddleware('admin'), roleMiddleware(['admin', 'faculty'])

// Middleware to restrict access by user role
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
