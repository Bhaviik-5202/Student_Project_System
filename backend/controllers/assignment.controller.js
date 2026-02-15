
const assignmentService = require("../services/assignment.service");
const sendResponse = require("../utils/response");
const { validationResult } = require("express-validator");

/**
 * Create a new assignment
 * @route POST /assignments
 * @access Admin, Faculty
 */
exports.createAssignment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, { error: true, data: null, message: errors.array().map(e => e.msg).join(", ") }, 400);
  }
  const result = await assignmentService.create(req.body);
  if (result.error) {
    return sendResponse(res, result, 400);
  }
  sendResponse(res, result, 201);
};

/**
 * Get all assignments with pagination and filtering
 * @route GET /assignments
 * @access Authenticated
 * @query page, limit, title, etc.
 */
exports.getAllAssignments = async (req, res) => {
  const result = await assignmentService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get an assignment by ID
 * @route GET /assignments/:id
 * @access Authenticated
 */
exports.getAssignmentById = async (req, res) => {
  const result = await assignmentService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update an assignment by ID
 * @route PUT /assignments/:id
 * @access Admin, Faculty
 */
exports.updateAssignment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, { error: true, data: null, message: errors.array().map(e => e.msg).join(", ") }, 400);
  }
  const result = await assignmentService.update(req.params.id, req.body);
  if (result.error) {
    return sendResponse(res, result, 404);
  }
  sendResponse(res, result, 200);
};

/**
 * Delete an assignment by ID
 * @route DELETE /assignments/:id
 * @access Admin, Faculty
 */
exports.deleteAssignment = async (req, res) => {
  const result = await assignmentService.remove(req.params.id);
  if (result.error) {
    return sendResponse(res, result, 404);
  }
  sendResponse(res, result, 200);
};
