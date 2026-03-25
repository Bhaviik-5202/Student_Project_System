const knowledgeBaseService = require('../services/knowledgebase.service');
const sendResponse = require('../utils/response');

/**
 * KnowledgeBase Controller
 * Manages documentation, articles, and knowledge sharing assets for the system.
 */

/**
 * Create a new article
 * @route   POST /api/knowledge-base
 * @desc    Publish a new documentation article or guide
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Fetch all articles
 * @route   GET /api/knowledge-base
 * @desc    Retrieve all published documentation and knowledge resources
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get article by ID
 * @route   GET /api/knowledge-base/:id
 * @desc    Retrieve detailed content for a specific article
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Update an article
 * @route   PUT /api/knowledge-base/:id
 * @desc    Modify the content or metadata of an existing article
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Delete an article
 * @route   DELETE /api/knowledge-base/:id
 * @desc    Permanently remove an article from the knowledge base
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
