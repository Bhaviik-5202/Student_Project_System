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
      {
        success: true,
        message: "Portfolio created successfully",
        data: portfolio,
        error: null,
      },
      201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to create portfolio",
        data: null,
        error: error.message,
      },
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
      {
        success: true,
        message: "Portfolio fetched successfully",
        data: portfolio,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch portfolio",
        data: null,
        error: error.message,
      },
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
      {
        success: true,
        message: "Portfolio updated successfully",
        data: portfolio,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to update portfolio",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};
