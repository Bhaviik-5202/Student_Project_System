/**
 * Knowledgebase Service
 * Business logic layer for instructional guides and information articles.
 */
const knowledgebaseRepository = require('../repositories/knowledgebase.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create article
 * @param {Object} data - Knowledgebase data payload
 * @returns {Promise<Object>} Formatted service response with new article entry
 */
exports.create = async (data) => {
  try {
    const kb = await knowledgebaseRepository.create(data);
    return response(false, kb, 'Knowledgebase entry created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create kb entry');
  }
};

/**
 * Get all articles
 * @returns {Promise<Object>} Formatted service response with global article list
 */
exports.getAll = async () => {
  try {
    const entries = await knowledgebaseRepository.findAll();
    return response(
      false,
      entries,
      'Knowledgebase entries fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch kb entries');
  }
};

/**
 * Get article by ID
 * @param {string} id - Knowledgebase identifier
 * @returns {Promise<Object>} Formatted service response with specific article metadata
 */
exports.getById = async (id) => {
  try {
    const kb = await knowledgebaseRepository.findById(id);
    if (!kb) return response(true, null, 'Knowledgebase entry not found');
    return response(false, kb, 'Knowledgebase entry fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch kb entry');
  }
};

/**
 * Update article attributes
 * @param {string} id - Knowledgebase identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified article data
 */
exports.update = async (id, data) => {
  try {
    const kb = await knowledgebaseRepository.update(id, data);
    if (!kb) return response(true, null, 'Knowledgebase entry not found');
    return response(false, kb, 'Knowledgebase entry updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update kb entry');
  }
};

/**
 * Delete knowledgebase article
 * @param {string} id - Knowledgebase identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const kb = await knowledgebaseRepository.remove(id);
    if (!kb) return response(true, null, 'Knowledgebase entry not found');
    return response(false, null, 'Knowledgebase entry deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete kb entry');
  }
};
