const Student = require("../models/Student");
const Project = require("../models/Project");

// Get grade distribution
exports.getGradeDistribution = async (req, res) => {
  try {
    const students = await Student.find();
    const distribution = {};
    students.forEach((student) => {
      student.grades.forEach((g) => {
        if (!distribution[g.grade]) distribution[g.grade] = 0;
        distribution[g.grade]++;
      });
    });
    res.json(distribution);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch grade distribution",
        error: err.message,
      });
  }
};

// Get project performance metrics
exports.getPerformanceMetrics = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completed = await Project.countDocuments({ status: "completed" });
    const inProgress = await Project.countDocuments({ status: "in_progress" });
    res.json({ totalProjects, completed, inProgress });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch metrics", error: err.message });
  }
};

const User = require("../models/User");

// Get usage statistics (real)
exports.getUsageStatistics = async (req, res) => {
  try {
    const users = await User.countDocuments();
    // For 'active' users, let's assume users who logged in within the last 30 days (if such a field exists)
    // If not, fallback to total users for both
    let active = users;
    if (User.schema.paths.lastLogin) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      active = await User.countDocuments({
        lastLogin: { $gte: thirtyDaysAgo },
      });
    }
    const projects = await Project.countDocuments();
    res.json({ users, active, projects });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch usage statistics",
        error: err.message,
      });
  }
};
