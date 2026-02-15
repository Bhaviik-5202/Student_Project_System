// services/portfolio.service.js
const Portfolio = require("../models/portfolio.model");

/**
 * Create a new portfolio
 * @param {Object} data - Portfolio data
 * @returns {Promise<Object>} Created portfolio
 */
exports.createPortfolio = async (data) => {
  const portfolio = new Portfolio(data);
  return await portfolio.save();
};

/**
 * Get a portfolio by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object|null>} Portfolio or null
 */
exports.getPortfolioByStudent = async (studentId) => {
  return await Portfolio.findOne({ student: studentId });
};

/**
 * Update a portfolio by ID
 * @param {string} id - Portfolio ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated portfolio or null
 */
exports.updatePortfolio = async (id, data) => {
  return await Portfolio.findByIdAndUpdate(id, data, { new: true });
};
