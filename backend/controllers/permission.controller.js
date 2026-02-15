const permissionService = require("../services/permission.service");
const sendResponse = require("../utils/response");

/**
 * Create a new permission
 * @route POST /permissions
 * @access Admin
 */
exports.createPermission = async (req, res) => {
  const result = await permissionService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all permissions
 * @route GET /permissions
 * @access Admin
 */
exports.getAllPermissions = async (req, res) => {
  const result = await permissionService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a permission by ID
 * @route GET /permissions/:id
 * @access Admin
 */
exports.getPermissionById = async (req, res) => {
  const result = await permissionService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a permission by ID
 * @route PUT /permissions/:id
 * @access Admin
 */
exports.updatePermission = async (req, res) => {
  const result = await permissionService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a permission by ID
 * @route DELETE /permissions/:id
 * @access Admin
 */
exports.deletePermission = async (req, res) => {
  const result = await permissionService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
