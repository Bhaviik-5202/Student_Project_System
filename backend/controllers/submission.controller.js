const submissionService = require("../services/submission.service");
const sendResponse = require("../utils/response");

/**
 * Create a new submission
 * @route POST /submissions
 * @access Student
 */
exports.createSubmission = async (req, res) => {
  const result = await submissionService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all submissions
 * @route GET /submissions
 * @access Faculty, Admin
 */
exports.getAllSubmissions = async (req, res) => {
  const result = await submissionService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a submission by ID
 * @route GET /submissions/:id
 * @access Faculty, Admin
 */
exports.getSubmissionById = async (req, res) => {
  const result = await submissionService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a submission by ID
 * @route PUT /submissions/:id
 * @access Faculty, Admin
 */
exports.updateSubmission = async (req, res) => {
  const result = await submissionService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a submission by ID
 * @route DELETE /submissions/:id
 * @access Faculty, Admin
 */
exports.deleteSubmission = async (req, res) => {
  const result = await submissionService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
