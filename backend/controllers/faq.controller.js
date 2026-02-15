const faqService = require("../services/faq.service");
const sendResponse = require("../utils/response");

/**
 * Create a new FAQ
 * @route POST /faqs
 * @access Admin
 */
exports.createFAQ = async (req, res) => {
  const result = await faqService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all FAQs
 * @route GET /faqs
 * @access Public
 */
exports.getAllFAQs = async (req, res) => {
  const result = await faqService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a FAQ by ID
 * @route GET /faqs/:id
 * @access Public
 */
exports.getFAQById = async (req, res) => {
  const result = await faqService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a FAQ by ID
 * @route PUT /faqs/:id
 * @access Admin
 */
exports.updateFAQ = async (req, res) => {
  const result = await faqService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a FAQ by ID
 * @route DELETE /faqs/:id
 * @access Admin
 */
exports.deleteFAQ = async (req, res) => {
  const result = await faqService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
