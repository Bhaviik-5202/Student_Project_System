const faqService = require('../services/faq.service');
const sendResponse = require('../utils/response');

/**
 * FAQ Controller
 * Manages frequently asked questions, help documentation, and support resources.
 */

/**
 * Create a new FAQ
 * @route   POST /api/faqs
 * @desc    Register a new frequently asked question and its answer
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createFAQ = async (req, res) => {
  try {
    const result = await faqService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'FAQ created successfully',
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
        message: 'Failed to create FAQ',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all FAQs
 * @route   GET /api/faqs
 * @desc    Retrieve a list of all frequently asked questions
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllFAQs = async (req, res) => {
  try {
    const result = await faqService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch FAQs'
          : 'FAQs fetched successfully',
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
 * Get FAQ by ID
 * @route   GET /api/faqs/:id
 * @desc    Retrieve detailed information for a specific FAQ entry
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFAQById = async (req, res) => {
  try {
    const result = await faqService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'FAQ not found' : 'FAQ fetched successfully',
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
 * Update an FAQ
 * @route   PUT /api/faqs/:id
 * @desc    Modify the question or answer for an existing FAQ entry
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateFAQ = async (req, res) => {
  try {
    const result = await faqService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'FAQ not found' : 'FAQ updated successfully',
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
 * Delete an FAQ
 * @route   DELETE /api/faqs/:id
 * @desc    Permanently remove an FAQ entry from the system
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteFAQ = async (req, res) => {
  try {
    const result = await faqService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'FAQ not found' : 'FAQ deleted successfully',
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
