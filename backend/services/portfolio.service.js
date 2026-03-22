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
 * Create a new student work portfolio
 * @param {Object} data - Portfolio attribute data
 * @returns {Promise<Object>} Formatted service response with new portfolio data
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
 * Fetch the portfolio associated with a specific student
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with portfolio data
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
 * Update portfolio content or metadata
 * @param {string} id - Portfolio identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated portfolio
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
 * Fetch a portfolio by its ID
 * @param {string} id - Portfolio identifier
 * @returns {Promise<Object>} Formatted service response
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
