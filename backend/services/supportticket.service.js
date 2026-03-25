/**
 * Support Ticket Service
 * Business logic layer for managing system support requests and help tickets.
 */
const supportticketRepository = require('../repositories/supportticket.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create support ticket
 * @param {Object} data - Support ticket data payload
 * @returns {Promise<Object>} Formatted service response with new ticket record
 */
exports.create = async (data) => {
  try {
    const ticket = await supportticketRepository.create(data);
    return response(false, ticket, 'Support ticket created successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to create support ticket'
    );
  }
};

/**
 * Fetch all registered support tickets
 * @returns {Promise<Object>} Formatted service response with tickets list
 */
exports.getAll = async () => {
  try {
    const tickets = await supportticketRepository.findAll();
    return response(false, tickets, 'Support tickets fetched successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch support tickets'
    );
  }
};

/**
 * Get support ticket by ID
 * @param {string} id - Ticket identifier
 * @returns {Promise<Object>} Formatted service response with full request details
 */
exports.getById = async (id) => {
  try {
    const ticket = await supportticketRepository.findById(id);
    if (!ticket) return response(true, null, 'Support ticket not found');
    return response(false, ticket, 'Support ticket fetched successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch support ticket'
    );
  }
};

/**
 * Update support ticket
 * @param {string} id - Ticket identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified ticket data
 */
exports.update = async (id, data) => {
  try {
    const ticket = await supportticketRepository.update(id, data);
    if (!ticket) return response(true, null, 'Support ticket not found');
    return response(false, ticket, 'Support ticket updated successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to update support ticket'
    );
  }
};

/**
 * Delete support ticket
 * @param {string} id - Ticket identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const ticket = await supportticketRepository.remove(id);
    if (!ticket) return response(true, null, 'Support ticket not found');
    return response(false, null, 'Support ticket deleted successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to delete support ticket'
    );
  }
};
