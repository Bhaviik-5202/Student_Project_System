const Student = require("../models/Student");
const Project = require("../models/Project");
const User = require("../models/User");

exports.getGradeDistribution = async () => {
  const students = await Student.find();
  const distribution = {};
  students.forEach((student) => {
    student.grades.forEach((g) => {
      if (!distribution[g.grade]) distribution[g.grade] = 0;
      distribution[g.grade]++;
    });
  });
  return distribution;
};

exports.getPerformanceMetrics = async () => {
  const totalProjects = await Project.countDocuments();
  const completed = await Project.countDocuments({ status: "completed" });
  const inProgress = await Project.countDocuments({ status: "in_progress" });
  return { totalProjects, completed, inProgress };
};

exports.getUsageStatistics = async () => {
  const users = await User.countDocuments();
  let active = users;
  if (User.schema.paths.lastLogin) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    active = await User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } });
  }
  const projects = await Project.countDocuments();
  return { users, active, projects };
};
