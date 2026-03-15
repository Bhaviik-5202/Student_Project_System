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
 * Request password reset
 * @route POST /auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // NOTE: This is a stub implementation. Integration with an email service 
    // and reset-token storage should be implemented here for production use.
    sendResponse(
      res,
      {
        success: true,
        message: "If the account exists, a password reset link has been dispatched to your email.",
        data: null,
        error: null,
      },
      200,
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
    // NOTE: This is a stub implementation. Token verification and password 
    // update logic should be implemented here for production use.
    sendResponse(
      res,
      {
        success: true,
        message: "Your password has been reset successfully.",
        data: null,
        error: null,
      },
      200,
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
