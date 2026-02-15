
const userService = require("../services/user.service");
const sendResponse = require("../utils/response");
const { validationResult } = require("express-validator");

/**
 * Create a new user
 * @route POST /users
 * @access Admin
 */
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, { error: true, data: null, message: errors.array().map(e => e.msg).join(", ") }, 400);
  }
  const result = await userService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all users with pagination and filtering
 * @route GET /users
 * @access Admin
 * @query page, limit, name, email, etc.
 */
exports.getAllUsers = async (req, res) => {
  const result = await userService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a user by ID
 * @route GET /users/:id
 * @access Admin
 */
exports.getUserById = async (req, res) => {
  const result = await userService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a user by ID
 * @route PUT /users/:id
 * @access Admin
 */
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, { error: true, data: null, message: errors.array().map(e => e.msg).join(", ") }, 400);
  }
  const result = await userService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a user by ID
 * @route DELETE /users/:id
 * @access Admin
 */
exports.deleteUser = async (req, res) => {
  const result = await userService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
