const userService = require("../services/user.service");
const sendResponse = require("../utils/response");

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
 * Request password reset (demo)
 * @route POST /auth/forgot-password
 * @access Public
 */
exports.forgotPassword = (req, res) => {
  sendResponse(
    res,
    {
      success: true,
      message: "Password reset link sent (demo only)",
      data: null,
      error: null,
    },
    200,
  );
};

/**
 * Reset password (demo)
 * @route POST /auth/reset-password
 * @access Public
 */
exports.resetPassword = (req, res) => {
  sendResponse(
    res,
    {
      success: true,
      message: "Password reset successful (demo only)",
      data: null,
      error: null,
    },
    200,
  );
};
