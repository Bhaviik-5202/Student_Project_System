const knowledgeBaseService = require('../services/knowledgebase.service');
const sendResponse = require('../utils/response');

/**
 * KnowledgeBase Controller
 * Manages documentation, articles, and knowledge sharing assets for the system.
 */

/**
 * Create a new article or document in the knowledge base
 * @route POST /knowledge-base
 * @access admin, faculty
 */
exports.createKnowledgeBase = async (req, res) => {
  try {
    const result = await knowledgeBaseService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Article created successfully',
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
        message: 'Failed to create article',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all articles from the knowledge base
 * @route GET /knowledge-base
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
          ? 'Failed to fetch articles'
          : 'Articles fetched successfully',
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
 * Get detailed content for a specific knowledge base article
 * @route GET /knowledge-base/:id
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
          ? 'Article not found'
          : 'Article fetched successfully',
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
 * Update article content or metadata
 * @route PUT /knowledge-base/:id
 * @access admin, faculty
 */
exports.updateKnowledgeBase = async (req, res) => {
  try {
    const result = await knowledgeBaseService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Article not found'
          : 'Article updated successfully',
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
 * Permanently remove an article from the knowledge base
 * @route DELETE /knowledge-base/:id
 * @access admin
 */
exports.deleteKnowledgeBase = async (req, res) => {
  try {
    const result = await knowledgeBaseService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Article not found'
          : 'Article deleted successfully',
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
