const faqService = require('../services/faq.service');
const sendResponse = require('../utils/response');

/**
 * FAQ Controller
 * Manages frequently asked questions, help documentation, and support resources.
 */

/**
 * Create a new FAQ entry
 * @route POST /faqs
 * @access admin
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
 * Fetch all FAQ entries
 * @route GET /faqs
 * @access Authenticated
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
 * Get detailed information for a specific FAQ by ID
 * @route GET /faqs/:id
 * @access Authenticated
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
 * Update an existing FAQ entry
 * @route PUT /faqs/:id
 * @access admin
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
 * Permanently remove an FAQ entry
 * @route DELETE /faqs/:id
 * @access admin
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
