const Project = require("../models/project.model");
const User = require("../models/user.model");

// GET /api/v1/analytics/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Only allow admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Get total users
    const totalUsers = await User.countDocuments();
    // Get active projects
    const activeProjects = await Project.countDocuments({ status: "active" });
    // Get pending approvals
    const pendingApprovals = await Project.countDocuments({ status: "pending" });
    // System health (dummy, can be improved)
    const systemHealth = 99;

    // Recent activities (last 5 projects)
    const recentActivities = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt owner status")
      .populate("owner", "name");

    res.json({
      success: true,
      data: {
        totalUsers,
        activeProjects,
        pendingApprovals,
        systemHealth,
        recentActivities,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
