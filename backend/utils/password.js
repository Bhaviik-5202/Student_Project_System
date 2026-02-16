/**
 * Password Utility
 * ------------------------------------------------------------------
 * Handles password hashing and comparison using bcrypt.
 * Environment Variables:
 *   BCRYPT_SALT_ROUNDS (optional, default: 10)
 */

const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash a plain text password.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a valid string");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain password with hashed password.
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match, otherwise false
 */
const comparePassword = async (password, hash) => {
  if (!password || !hash) {
    throw new Error("Password and hash are required");
  }

  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
