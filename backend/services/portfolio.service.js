/**
 * Portfolio Service
 * Business logic layer for managing student project portfolios.
 */
const portfolioRepository = require('../repositories/portfolio.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create student portfolio
 * @param {Object} data - Portfolio attribute data
 * @returns {Promise<Object>} Formatted service response with new portfolio entry
 */
exports.createPortfolio = async (data) => {
  try {
    const portfolio = await portfolioRepository.create(data);
    return response(false, portfolio, 'Portfolio created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create portfolio');
  }
};

/**
 * Get portfolio by student
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with student's project showcase
 */
exports.getPortfolioByStudent = async (studentId) => {
  try {
    const portfolio = await portfolioRepository.findOne({
      student: studentId,
    });
    if (!portfolio) return response(true, null, 'Portfolio not found');
    return response(false, portfolio, 'Portfolio fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch portfolio');
  }
};

/**
 * Update portfolio content
 * @param {string} id - Portfolio identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified portfolio data
 */
exports.updatePortfolio = async (id, data) => {
  try {
    const portfolio = await portfolioRepository.update(id, data);
    if (!portfolio) return response(true, null, 'Portfolio not found');
    return response(false, portfolio, 'Portfolio updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update portfolio');
  }
};

/**
 * Get portfolio by ID
 * @param {string} id - Portfolio identifier
 * @returns {Promise<Object>} Formatted service response with detailed portfolio data
 */
exports.getById = async (id) => {
  try {
    const portfolio = await portfolioRepository.findById(id);
    if (!portfolio) return response(true, null, 'Portfolio not found');
    return response(false, portfolio, 'Portfolio fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch portfolio');
  }
};

/**
 * List portfolios with optional filter and pagination
 * @param {Object} filter
 * @param {Object} options
 */
exports.getAll = async (filter = {}, options = {}) => {
  try {
    const portfolios = await portfolioRepository.findAll(filter, options);
    return response(false, portfolios, 'Portfolios listed successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to list portfolios');
  }
};

/**
 * Remove a portfolio by ID
 * @param {string} id
 */
exports.remove = async (id) => {
  try {
    const removed = await require('../repositories/portfolio.repository').remove(id);
    if (!removed) return response(true, null, 'Portfolio not found');
    return response(false, removed, 'Portfolio removed successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to remove portfolio');
  }
};
