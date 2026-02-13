const analyticsService = require("../services/analyticsService");
const ApiError = require("../utils/ApiError");

// Get grade distribution
exports.getGradeDistribution = async (req, res, next) => {
  try {
    const distribution = await analyticsService.getGradeDistribution();
    return res.json({ success: true, data: distribution });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch grade distribution", [err.message]),
    );
  }
};

// Get project performance metrics
exports.getPerformanceMetrics = async (req, res, next) => {
  try {
    const metrics = await analyticsService.getPerformanceMetrics();
    return res.json({ success: true, data: metrics });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch performance metrics", [err.message]),
    );
  }
};

// Get usage statistics
exports.getUsageStatistics = async (req, res, next) => {
  try {
    const stats = await analyticsService.getUsageStatistics();
    return res.json({ success: true, data: stats });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch usage statistics", [err.message]),
    );
  }
};
