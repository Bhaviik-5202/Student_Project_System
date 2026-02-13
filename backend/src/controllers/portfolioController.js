const Portfolio = require("../models/Portfolio");
const ApiError = require("../utils/ApiError");

// Get portfolio by student
exports.getPortfolioByStudent = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      student: req.params.studentId,
    });
    if (!portfolio) {
      return next(new ApiError(404, "Portfolio not found"));
    }
    return res.json({ success: true, data: portfolio });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch portfolio", [err.message]));
  }
};

// Save (create or update) portfolio
exports.savePortfolio = async (req, res, next) => {
  try {
    const { student, ...portfolioData } = req.body;
    let portfolio = await Portfolio.findOneAndUpdate(
      { student },
      { $set: portfolioData },
      { new: true, upsert: true },
    );
    return res.status(201).json({ success: true, data: portfolio });
  } catch (err) {
    return next(new ApiError(400, "Failed to save portfolio", [err.message]));
  }
};
