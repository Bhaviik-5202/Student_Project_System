const userService = require('../services/user.service');
const auditLogService = require('../services/auditlog.service');
const sendResponse = require('../utils/response');

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
 * Register a new user account
 * @route   POST /api/auth/register
 * @desc    Create a new student account in the system
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const result = await userService.register(req.body);

    if (!result.error && result.data) {
      // Log successful registration
      await auditLogService.create({
        action: 'User Registration',
        user: result.data.id || result.data._id,
        details: `New user registered: ${req.body.email}`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Registration failed'
          : 'User registered successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Authenticate user and return token
 * @route   POST /api/auth/login
 * @desc    Verify credentials and return access token
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const result = await userService.login(req.body);

    if (!result.error && result.data && result.data.user) {
      // Log successful login
      await auditLogService.create({
        action: 'User Login',
        user: result.data.user.id || result.data.user._id,
        details: `User logged in: ${req.body.email}`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Login failed' : 'Login successful',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Request password reset link
 * @route   POST /api/auth/forgot-password
 * @desc    Send a reset token to the user's email
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Reset account password
 * @route   POST /api/auth/reset-password
 * @desc    Verify reset token and update password
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Logout current user (stateless JWT stub)
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    // With stateless JWT there's nothing to revoke here; return success for client convenience
    sendResponse(res, { success: true, message: 'Logout successful', data: null }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: 'Internal server error', data: null, error: error.message }, 500);
  }
};

/**
 * Get current user profile
 * @route   GET /api/auth/profile
 * @desc    Retrieve details of the currently authenticated user
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    const result = await userService.getById(req.user.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'User not found'
          : 'Profile fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update current user profile
 * @route   PUT /api/auth/profile
 * @desc    Modify account attributes for the current user
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    // Prevent role change via profile update
    const { role, ...updateData } = req.body;

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const result = await userService.update(req.user.id, updateData);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Update failed'
          : 'Profile updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Change account password
 * @route   POST /api/auth/change-password
 * @desc    Update password while authenticated
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Current and new passwords are required',
          data: null,
          error: 'Validation error',
        },
        400
      );
    }

    const result = await userService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.message,
        data: null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update user preferences
 * @route   PATCH /api/auth/settings
 * @desc    Modify system settings for the current user
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSettings = async (req, res) => {
  try {
    const result = await userService.update(req.user.id, {
      settings: req.body,
    });
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to update settings'
          : 'Settings updated successfully',
        data: result.data ? result.data.settings : null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Delete account record
 * @route   DELETE /api/auth/account
 * @desc    Remove the authenticated user's account from the system
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteAccount = async (req, res) => {
  try {
    // Protect master admin from self-deletion
    const userResult = await userService.getById(req.user.id);
    if (
      userResult.data &&
      userResult.data.email === 'er.bhavik5202@gmail.com'
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Master administrator account cannot be deleted',
        },
        403
      );
    }

    const result = await userService.remove(req.user.id);

    if (!result.error) {
      await auditLogService.create({
        action: 'Account Deletion',
        user: req.user.id,
        details: `User deleted their own account: ${userResult.data.email}`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to delete account'
          : 'Account deleted successfully',
        data: null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
