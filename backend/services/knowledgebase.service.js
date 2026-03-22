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
 * Persist a new knowledgebase entry
 * @param {Object} data - Knowledgebase data payload
 * @returns {Promise<Object>} Formatted service response
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
 * Fetch all registered knowledgebase entries
 * @returns {Promise<Object>} Formatted service response with entry list
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
 * Get detailed knowledgebase entry by ID
 * @param {string} id - Knowledgebase identifier
 * @returns {Promise<Object>} Formatted service response with entry data
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
 * Update knowledgebase attributes
 * @param {string} id - Knowledgebase identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated entry
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
 * Delete a knowledgebase entry from the system
 * @param {string} id - Knowledgebase identifier
 * @returns {Promise<Object>} Formatted service response
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
