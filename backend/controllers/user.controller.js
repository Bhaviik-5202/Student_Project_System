const userService = require('../services/user.service');
const auditLogService = require('../services/auditlog.service');
const sendResponse = require('../utils/response');
const { validationResult } = require('express-validator');

/**
 * User Controller
 * Handles user management operations, including creation, retrieval, updates,
 * and deletion of user accounts with role-based access control.
 */

/**
 * Create a new user record
 * @route   POST /api/users
 * @desc    Onboard a new user with specified role and credentials
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        {
          success: false,
          message: errors
            .array()
            .map((e) => e.msg)
            .join(', '),
          data: null,
          error: 'Validation error',
        },
        400
      );
    }

    const result = await userService.create(req.body);

    if (!result.error && result.data) {
      await auditLogService.create({
        action: 'User Creation',
        user: req.user.id,
        details: `Admin created new user: ${result.data.email} (${result.data.role})`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to create user'
          : 'User created successfully',
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
 * Fetch all registered users
 * @route   GET /api/users
 * @desc    Retrieve a list of all users in the system
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAll(req.query);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch users'
          : 'Users fetched successfully',
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
 * Get detailed user profile by ID
 * @route   GET /api/users/:id
 * @desc    Retrieve a specific user's attributes and role information
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  try {
    const result = await userService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'User not found' : 'User fetched successfully',
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
 * Update user attributes
 * @route   PUT /api/users/:id
 * @desc    Modify existing user details (excluding sensitive credentials)
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        {
          success: false,
          message: errors
            .array()
            .map((e) => e.msg)
            .join(', '),
          data: null,
          error: 'Validation error',
        },
        400
      );
    }

    const userResult = await userService.getById(req.params.id);
    if (
      userResult.data &&
      userResult.data.email === 'er.bhavik5202@gmail.com'
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Master administrator cannot be modified via this endpoint',
        },
        403
      );
    }

    const result = await userService.update(req.params.id, req.body);

    if (!result.error && result.data) {
      await auditLogService.create({
        action: 'User Management',
        user: req.user.id,
        details: `Admin updated user: ${result.data.email} (${req.params.id})`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'User not found' : 'User updated successfully',
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
 * Delete a user from the system
 * @route   DELETE /api/users/:id
 * @desc    Permanently remove a user account
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  try {
    const userResult = await userService.getById(req.params.id);
    if (
      userResult.data &&
      userResult.data.email === 'er.bhavik5202@gmail.com'
    ) {
      return sendResponse(
        res,
        { success: false, message: 'Master administrator cannot be deleted' },
        403
      );
    }

    const result = await userService.remove(req.params.id);

    if (!result.error) {
      await auditLogService.create({
        action: 'User Management',
        user: req.user.id,
        details: `Admin deleted user with ID: ${req.params.id}`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'User not found' : 'User deleted successfully',
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
