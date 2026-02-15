const userService = require("../services/user.service");
const sendResponse = require("../utils/response");

/**
 * Register a new user
 * @route POST /auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  const result = await userService.register(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Login a user and return JWT
 * @route POST /auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  const result = await userService.login(req.body);
  sendResponse(res, result, result.error ? 400 : 200);
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
      error: false,
      data: null,
      message: "Password reset link sent (demo only)",
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
      error: false,
      data: null,
      message: "Password reset successful (demo only)",
    },
    200,
  );
};
