/**
 * Utility functions for password hashing and comparison using bcrypt.
 * @module utils/password
 */
const bcrypt = require("bcrypt");

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
