const userService = require("../services/user.service");
const sendResponse = require("../utils/response");
/**
 * Auth Controller
 * Handles user authentication, registration, and password management.
 * Endpoints:
 * - POST /auth/register: Register a new user (Public)
 * - POST /auth/login: Authenticate a user and return a JWT (Public)
 * - POST /auth/forgot-password: Request a password reset link (Public)
 * - POST /auth/reset-password: Reset password using a token (Public)
 */

/**
 * Register a new user
 * @route POST /auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const result = await userService.register(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Registration failed"
          : "User registered successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Login a user and return JWT
 * @route POST /auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const result = await userService.login(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Login failed" : "Login successful",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Request password reset
 * @route POST /auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.message,
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Reset password
 * @route POST /auth/reset-password
 * @access Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await userService.resetPassword(token, password);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.message,
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
