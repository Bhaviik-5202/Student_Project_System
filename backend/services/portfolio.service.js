const Portfolio = require("../models/portfolio.model");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new portfolio
 * @param {Object} data - Portfolio data
 * @returns {Promise<Object>} Created portfolio
 */
exports.createPortfolio = async (data) => {
  try {
    const portfolio = new Portfolio(data);
    const savedPortfolio = await portfolio.save();
    return response(false, savedPortfolio, "Portfolio created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create portfolio");
  }
};

/**
 * Get a portfolio by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object|null>} Portfolio or null
 */
exports.getPortfolioByStudent = async (studentId) => {
  try {
    const portfolio = await Portfolio.findOne({ student: studentId });
    if (!portfolio) return response(true, null, "Portfolio not found");
    return response(false, portfolio, "Portfolio fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch portfolio");
  }
};

/**
 * Update a portfolio by ID
 * @param {string} id - Portfolio ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated portfolio or null
 */
exports.updatePortfolio = async (id, data) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(id, data, {
      new: true,
    });
    return response(false, portfolio, "Portfolio updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update portfolio");
  }
};
