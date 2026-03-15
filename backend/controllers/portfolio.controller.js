const portfolioService = require("../services/portfolio.service");
const sendResponse = require("../utils/response");

/**
 * Portfolio Controller
 * Manages student professional portfolios and project showcases.
 */

/**
 * Create a new student portfolio
 * @route POST /portfolios
 * @access Student
 */
exports.createPortfolio = async (req, res) => {
  try {
    const result = await portfolioService.upsert(req.user.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update portfolio"
          : "Portfolio updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Fetch a portfolio by student ID
 * @route GET /portfolios/student/:studentId
 * @access Authenticated
 */
exports.getPortfolioByStudent = async (req, res) => {
  try {
    const result = await portfolioService.getByUserId(req.params.userId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Portfolio not found"
          : "Portfolio fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
/**
 * Update an existing portfolio
 * @route PUT /portfolios/:id
 * @access Student
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const result = await portfolioService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Portfolio not found"
          : "Portfolio updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
