// Middleware to handle express-validator errors
const { validationResult } = require("express-validator");

// Middleware to handle express-validator errors
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: true,
      data: null,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
