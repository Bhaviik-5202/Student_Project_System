const faqService = require("../services/faq.service");
const sendResponse = require("../utils/response");

/**
 * Create a new FAQ
 * @route POST /faqs
 * @access Admin
 */
exports.createFAQ = async (req, res) => {
  try {
    const result = await faqService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create FAQ"
          : "FAQ created successfully",
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
 * Get all FAQs
 * @route GET /faqs
 * @access Public
 */
exports.getAllFAQs = async (req, res) => {
  try {
    const result = await faqService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch FAQs"
          : "FAQs fetched successfully",
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
 * Get a FAQ by ID
 * @route GET /faqs/:id
 * @access Public
 */
exports.getFAQById = async (req, res) => {
  try {
    const result = await faqService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "FAQ not found" : "FAQ fetched successfully",
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
 * Update a FAQ by ID
 * @route PUT /faqs/:id
 * @access Admin
 */
exports.updateFAQ = async (req, res) => {
  try {
    const result = await faqService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update FAQ"
          : "FAQ updated successfully",
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
 * Delete a FAQ by ID
 * @route DELETE /faqs/:id
 * @access Admin
 */
exports.deleteFAQ = async (req, res) => {
  try {
    const result = await faqService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete FAQ"
          : "FAQ deleted successfully",
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
