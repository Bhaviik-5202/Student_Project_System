const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const ApiError = require("../utils/ApiError");

// Auth middleware: verifies JWT and attaches user to req
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "No token provided"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid token"));
  }
};
