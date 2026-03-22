const userService = require("../services/user.service");
const auditLogService = require("../services/auditlog.service");
const sendResponse = require("../utils/response");
const { validationResult } = require("express-validator");

/**
 * User Controller
 * Handles user management operations, including creation, retrieval, updates,
 * and deletion of user accounts with role-based access control.
 */

/**
 * Create a new user
 * @route POST /users
 * @access Admin
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
            .join(", "),
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const result = await userService.create(req.body);

    if (!result.error && result.data) {
      await auditLogService.create({
        action: "User Creation",
        user: req.user.id,
        details: `Admin created new user: ${result.data.email} (${result.data.role})`,
        status: "Success",
        ip: req.ip || "127.0.0.1",
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create user"
          : "User created successfully",
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
 * Get all users
 * @route GET /users
 * @access Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch users"
          : "Users fetched successfully",
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
 * Get a user by ID
 * @route GET /users/:id
 * @access Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const result = await userService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "User not found" : "User fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
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
 * Update a user by ID
 * @route PUT /users/:id
 * @access Admin
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
            .join(", "),
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const result = await userService.update(req.params.id, req.body);

    if (!result.error && result.data) {
      await auditLogService.create({
        action: "User Management",
        user: req.user.id,
        details: `Admin updated user: ${result.data.email} (${req.params.id})`,
        status: "Success",
        ip: req.ip || "127.0.0.1",
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "User not found" : "User updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
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
 * Delete a user by ID
 * @route DELETE /users/:id
 * @access Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.remove(req.params.id);

    if (!result.error) {
      await auditLogService.create({
        action: "User Management",
        user: req.user.id,
        details: `Admin deleted user with ID: ${req.params.id}`,
        status: "Success",
        ip: req.ip || "127.0.0.1",
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "User not found" : "User deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
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
