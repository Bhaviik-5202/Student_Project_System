const Project = require("../models/project.model");
const User = require("../models/user.model");
const sendResponse = require("../utils/response");

/**
 * Get dashboard statistics
 * @route GET /api/v1/analytics/dashboard
 * @access Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Only allow admin
    if (req.user.role !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden",
          data: null,
          error: "Access denied",
        },
        403,
      );
    }

    // Get statistics
    const totalUsers = await User.countDocuments();
    const activeProjects = await Project.countDocuments({ status: "active" });
    const pendingApprovals = await Project.countDocuments({
      status: "pending",
    });
    const systemHealth = 99; // Placeholder

    const recentActivities = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt owner status")
      .populate("owner", "name");

    sendResponse(
      res,
      {
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: {
          totalUsers,
          activeProjects,
          pendingApprovals,
          systemHealth,
          recentActivities,
        },
        error: null,
      },
      200,
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
