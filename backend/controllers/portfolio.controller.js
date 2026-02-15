const portfolioService = require("../services/portfolio.service");
const sendResponse = require("../utils/response");

/**
 * Create a new portfolio
 * @route POST /portfolios
 * @access Authenticated
 */
exports.createPortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioService.createPortfolio(req.body);
    sendResponse(
      res,
      { error: false, data: portfolio, message: "Portfolio created" },
      201,
    );
  } catch (err) {
    sendResponse(
      res,
      { error: err.message, data: null, message: "Failed to create portfolio" },
      400,
    );
  }
};

/**
 * Get a portfolio by student ID
 * @route GET /portfolios/student/:studentId
 * @access Authenticated
 */
exports.getPortfolioByStudent = async (req, res) => {
  try {
    const portfolio = await portfolioService.getPortfolioByStudent(
      req.params.studentId,
    );
    sendResponse(
      res,
      { error: false, data: portfolio, message: "Portfolio fetched" },
      200,
    );
  } catch (err) {
    sendResponse(
      res,
      { error: err.message, data: null, message: "Failed to fetch portfolio" },
      400,
    );
  }
};

/**
 * Update a portfolio by its ID
 * @route PUT /portfolios/:id
 * @access Authenticated
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioService.updatePortfolio(
      req.params.id,
      req.body,
    );
    sendResponse(
      res,
      { error: false, data: portfolio, message: "Portfolio updated" },
      200,
    );
  } catch (err) {
    sendResponse(
      res,
      { error: err.message, data: null, message: "Failed to update portfolio" },
      400,
    );
  }
};
