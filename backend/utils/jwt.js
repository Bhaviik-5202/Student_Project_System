/**
 * Utility functions for JWT token generation and verification.
 * @module utils/jwt
 */
const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for the given payload.
 * @param {Object} payload - Data to encode in the token
 * @param {string} [expiresIn="1d"] - Expiration time (e.g., '1d', '2h')
 * @returns {string} The signed JWT token
 */
const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT token and returns the decoded payload if valid.
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload if valid, otherwise null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
