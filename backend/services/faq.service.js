/**
 * FAQ Service
 * Business logic layer for managing frequently asked questions.
 */
const faqRepository = require('../repositories/faq.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create FAQ entry
 * @param {Object} data - FAQ data payload
 * @returns {Promise<Object>} Formatted service response with new FAQ document
 */
exports.create = async (data) => {
  try {
    const faq = await faqRepository.create(data);
    return response(false, faq, 'FAQ created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create FAQ');
  }
};

/**
 * Fetch all FAQ entries
 * @returns {Promise<Object>} Formatted service response with FAQ list
 */
exports.getAll = async () => {
  try {
    const faqs = await faqRepository.findAll();
    return response(false, faqs, 'FAQs fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch FAQs');
  }
};

/**
 * Get FAQ by ID
 * @param {string} id - FAQ identifier
 * @returns {Promise<Object>} Formatted service response with specific FAQ details
 */
exports.getById = async (id) => {
  try {
    const faq = await faqRepository.findById(id);
    if (!faq) return response(true, null, 'FAQ not found');
    return response(false, faq, 'FAQ fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch FAQ');
  }
};

/**
 * Update FAQ entry
 * @param {string} id - FAQ identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified FAQ data
 */
exports.update = async (id, data) => {
  try {
    const faq = await faqRepository.update(id, data);
    if (!faq) return response(true, null, 'FAQ not found');
    return response(false, faq, 'FAQ updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update FAQ');
  }
};

/**
 * Delete FAQ entry
 * @param {string} id - FAQ identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const faq = await faqRepository.remove(id);
    if (!faq) return response(true, null, 'FAQ not found');
    return response(false, null, 'FAQ deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete FAQ');
  }
};
