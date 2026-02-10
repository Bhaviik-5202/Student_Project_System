// utils/generateToken.js
// Utility to generate JWT tokens

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "default_secret";

function generateToken(payload, expiresIn = "1d") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

module.exports = generateToken;
