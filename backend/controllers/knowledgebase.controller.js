const knowledgeBaseService = require("../services/knowledgebase.service");
const sendResponse = require("../utils/response");

/**
 * Create a new knowledge base entry
 * @route POST /knowledgebase
 * @access Admin, Faculty
 */
exports.createKnowledgeBase = async (req, res) => {
  const result = await knowledgeBaseService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all knowledge base entries
 * @route GET /knowledgebase
 * @access Authenticated
 */
exports.getAllKnowledgeBases = async (req, res) => {
  const result = await knowledgeBaseService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a knowledge base entry by ID
 * @route GET /knowledgebase/:id
 * @access Authenticated
 */
exports.getKnowledgeBaseById = async (req, res) => {
  const result = await knowledgeBaseService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a knowledge base entry by ID
 * @route PUT /knowledgebase/:id
 * @access Admin, Faculty
 */
exports.updateKnowledgeBase = async (req, res) => {
  const result = await knowledgeBaseService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a knowledge base entry by ID
 * @route DELETE /knowledgebase/:id
 * @access Admin, Faculty
 */
exports.deleteKnowledgeBase = async (req, res) => {
  const result = await knowledgeBaseService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
