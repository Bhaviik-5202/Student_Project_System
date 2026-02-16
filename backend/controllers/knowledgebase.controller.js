const knowledgeBaseService = require("../services/knowledgebase.service");
const sendResponse = require("../utils/response");

/**
 * Create a new knowledge base entry
 * @route POST /knowledgebase
 * @access Admin, Faculty
 */
exports.createKnowledgeBase = async (req, res) => {
  try {
    const result = await knowledgeBaseService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create knowledge base entry"
          : "Knowledge base entry created successfully",
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
 * Get all knowledge base entries
 * @route GET /knowledgebase
 * @access Authenticated
 */
exports.getAllKnowledgeBases = async (req, res) => {
  try {
    const result = await knowledgeBaseService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch knowledge base entries"
          : "Knowledge base entries fetched successfully",
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
 * Get a knowledge base entry by ID
 * @route GET /knowledgebase/:id
 * @access Authenticated
 */
exports.getKnowledgeBaseById = async (req, res) => {
  try {
    const result = await knowledgeBaseService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Knowledge base entry not found"
          : "Knowledge base entry fetched successfully",
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
 * Update a knowledge base entry by ID
 * @route PUT /knowledgebase/:id
 * @access Admin, Faculty
 */
exports.updateKnowledgeBase = async (req, res) => {
  try {
    const result = await knowledgeBaseService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update knowledge base entry"
          : "Knowledge base entry updated successfully",
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
 * Delete a knowledge base entry by ID
 * @route DELETE /knowledgebase/:id
 * @access Admin, Faculty
 */
exports.deleteKnowledgeBase = async (req, res) => {
  try {
    const result = await knowledgeBaseService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete knowledge base entry"
          : "Knowledge base entry deleted successfully",
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
