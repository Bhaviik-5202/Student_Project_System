/**
 * JWT Utility
 * ------------------------------------------------------------------
 * Handles JSON Web Token generation and verification using 
 * environment-based secrets and configuration.
 */

const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token.
 * @param {Object} payload - Data to encode in the token
 * @param {string} [expiresIn] - Token expiration (overrides env)
 * @returns {string} Signed JWT token
 */
const generateToken = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a valid object");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || "1d",
  });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  if (!token) {
    throw new Error("Token is required");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
