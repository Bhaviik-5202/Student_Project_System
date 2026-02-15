const staffService = require("../services/staff.service");
const sendResponse = require("../utils/response");

/**
 * Create a new staff member
 * @route POST /staff
 * @access Admin
 */
exports.createStaff = async (req, res) => {
  const result = await staffService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all staff members
 * @route GET /staff
 * @access Admin
 */
exports.getAllStaff = async (req, res) => {
  const result = await staffService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a staff member by ID
 * @route GET /staff/:id
 * @access Admin
 */
exports.getStaffById = async (req, res) => {
  const result = await staffService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a staff member by ID
 * @route PUT /staff/:id
 * @access Admin
 */
exports.updateStaff = async (req, res) => {
  const result = await staffService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a staff member by ID
 * @route DELETE /staff/:id
 * @access Admin
 */
exports.deleteStaff = async (req, res) => {
  const result = await staffService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
