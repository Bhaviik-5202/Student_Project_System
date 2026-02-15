const evaluationService = require("../services/evaluation.service");
const sendResponse = require("../utils/response");

/**
 * Create a new evaluation
 * @route POST /evaluations
 * @access Faculty, Admin
 */
exports.createEvaluation = async (req, res) => {
  const result = await evaluationService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all evaluations
 * @route GET /evaluations
 * @access Authenticated
 */
exports.getAllEvaluations = async (req, res) => {
  const result = await evaluationService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get an evaluation by ID
 * @route GET /evaluations/:id
 * @access Authenticated
 */
exports.getEvaluationById = async (req, res) => {
  const result = await evaluationService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update an evaluation by ID
 * @route PUT /evaluations/:id
 * @access Faculty, Admin
 */
exports.updateEvaluation = async (req, res) => {
  const result = await evaluationService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete an evaluation by ID
 * @route DELETE /evaluations/:id
 * @access Faculty, Admin
 */
exports.deleteEvaluation = async (req, res) => {
  const result = await evaluationService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
