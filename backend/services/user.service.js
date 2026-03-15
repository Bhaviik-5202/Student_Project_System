const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register a new user with standard credentials
 * @param {Object} userData - User registration payload
 * @param {string} userData.name - Full name of the user
 * @param {string} userData.email - Unique email address
 * @param {string} userData.password - Plain text password (hashed before save)
 * @param {string} userData.role - User role (student, faculty, admin)
 * @returns {Promise<Object>} Formatted service response
 */
exports.register = async ({ name, email, password, role }) => {
  try {
    const existing = await userRepository.findByEmail(email);
    if (existing) return response(true, null, "Email already registered");

    await userRepository.create({ name, email, password, role });
    return response(false, null, "User registered successfully");
  } catch (err) {
    console.error("Registration error:", err);
    return response(true, null, err.message || "Registration failed");
  }
};

/**
 * Authenticate user and generate JWT access token
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Account email
 * @param {string} credentials.password - Account password
 * @returns {Promise<Object>} Formatted service response with token and user profile
 */
exports.login = async ({ email, password }) => {
  try {
    const user = await userRepository.findByEmail(email, {
      select: "+password",
    });
    if (!user || !user.password)
      return response(true, null, "Invalid credentials");

    const match = await user.comparePassword(password);
    if (!match) return response(true, null, "Invalid credentials");

    let expiresIn = TOKEN_EXPIRES_IN || "1d";
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn,
    });

    return response(
      false,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (err) {
    console.error("Login error:", err);
    return response(true, null, err.message || "Login failed");
  }
};

/**
 * Fetch all registered users
 * @returns {Promise<Object>} Formatted service response with user list
 */
exports.getAll = async () => {
  try {
    const users = await userRepository.findAll();
    return response(false, users, "Users fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch users");
  }
};

/**
 * Get detailed user profile by ID
 * @param {string} id - User UUID/ObjectID
 * @returns {Promise<Object>} Formatted service response with user data
 */
exports.getById = async (id) => {
  try {
    const user = await userRepository.findById(id);
    if (!user) return response(true, null, "User not found");
    return response(false, user, "User fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch user");
  }
};

/**
 * Create a user (Admin/System use)
 * @param {Object} data - User creation data
 * @returns {Promise<Object>} Formatted service response with new user data
 */
exports.create = async (data) => {
  try {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) return response(true, null, "Email already exists");

    const user = await userRepository.create(data);
    return response(false, user, "User created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create user");
  }
};

/**
 * Update user attributes
 * @param {string} id - User ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated user
 */
exports.update = async (id, data) => {
  try {
    const user = await userRepository.update(id, data);
    if (!user) return response(true, null, "User not found");
    return response(false, user, "User updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update user");
  }
};

/**
 * Delete a user from the system
 * @param {string} id - User ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const user = await userRepository.remove(id);
    if (!user) return response(true, null, "User not found");
    return response(false, null, "User deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete user");
  }
};
