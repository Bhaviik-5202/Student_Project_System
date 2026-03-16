const projectRepository = require("../repositories/project.repository");
const userRepository = require("../repositories/user.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const meetingRepository = require("../repositories/meeting.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Generate high-level system dashboard metrics
 * @returns {Promise<Object>} Formatted service response with system stats
 */
exports.getDashboardStats = async () => {
  try {
    const totalUsers = await userRepository.count();
    const totalProjects = await projectRepository.count();
    const activeProjects = await projectRepository.count({ status: "in_progress" });
    const pendingApprovals = await projectRepository.count({ status: "planning" });
    const totalAssignments = await assignmentRepository.count();
    const totalMeetings = await meetingRepository.count();

    const recentProjects = await projectRepository.findAll(
      {},
      {
        sort: { updatedAt: -1 },
        limit: 5,
        populate: "createdBy",
      },
    );

    return response(
      false,
      {
        totalUsers,
        totalProjects,
        activeProjects,
        pendingApprovals,
        totalAssignments,
        totalMeetings,
        systemHealth: 100,
        recentActivities: recentProjects.map((p) => ({
          title: p.title,
          updatedAt: p.updatedAt,
          owner: p.createdBy ? { name: p.createdBy.name } : null,
          status: p.status,
        })),
      },
      "Dashboard statistics fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch dashboard statistics",
    );
  }
};

/**
 * Align with controller expected methods
 */
exports.getGlobalStats = exports.getDashboardStats;

exports.getProjectStats = async () => {
  try {
    const total = await projectRepository.count();
    const completed = await projectRepository.count({ status: "completed" });
    const inProgress = await projectRepository.count({ status: "in_progress" });
    
    return response(false, {
      total,
      completed,
      inProgress,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }, "Project statistics fetched successfully");
  } catch (err) {
    return response(true, null, err.message);
  }
};

exports.getUserStats = async () => {
  try {
    const total = await userRepository.count();
    const admins = await userRepository.count({ role: "admin" });
    const faculty = await userRepository.count({ role: "faculty" });
    const students = await userRepository.count({ role: "student" });
    
    return response(false, {
      total,
      roles: {
        admins,
        faculty,
        students
      }
    }, "User statistics fetched successfully");
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Generate dashboard metrics for a specific faculty member
 * @param {string} facultyId - Faculty identifier
 * @returns {Promise<Object>} Formatted service response with faculty stats
 */
exports.getFacultyDashboardStats = async (facultyId) => {
  try {
    const totalProjectsCount = await projectRepository.count();
    const myProjectsCount = await projectRepository.count({ guide: facultyId });
    const activeStudents = await userRepository.count({
      role: "student",
      status: "active",
    });
    const pendingReviewsCount = await projectRepository.count({
      guide: facultyId,
      status: "planning",
    });
    const todayMeetingsCount = await meetingRepository.count({
      guide: facultyId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    const recentProjects = await projectRepository.findAll(
      { guide: facultyId },
      {
        sort: { updatedAt: -1 },
        limit: 5,
        populate: "createdBy",
      },
    );

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        activeStudents,
        pendingReviews: pendingReviewsCount,
        todayMeetings: todayMeetingsCount,
        recentActivities: recentProjects.map((p) => ({
          title: p.title,
          updatedAt: p.updatedAt,
          owner: p.createdBy ? { name: p.createdBy.name } : null,
          status: p.status,
        })),
      },
      "Faculty dashboard statistics fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch faculty statistics",
    );
  }
};

/**
 * Generate dashboard metrics for a specific student
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with student stats
 */
exports.getStudentDashboardStats = async (studentId) => {
  try {
    const totalProjectsCount = await projectRepository.count();
    const myProjectsCount = await projectRepository.count({ 
      $or: [
        { createdBy: studentId },
        { members: studentId }
      ]
    });
    const completedAssignmentsCount = await assignmentRepository.count({
      student: studentId,
      status: "completed",
    });
    const upcomingDeadlinesCount = await assignmentRepository.count({
      student: studentId,
      dueDate: { $gte: new Date() },
    });

    const recentProjects = await projectRepository.findAll(
      { 
        $or: [
          { createdBy: studentId },
          { members: studentId }
        ]
      },
      {
        sort: { updatedAt: -1 },
        limit: 5,
      },
    );

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        completedAssignments: completedAssignmentsCount,
        upcomingDeadlines: upcomingDeadlinesCount,
        currentGrade: "A-", // This might still be hardcoded or derived from another service
        recentActivities: recentProjects.map((p) => ({
          title: p.title,
          updatedAt: p.updatedAt,
          status: p.status,
        })),
      },
      "Student dashboard statistics fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch student statistics",
    );
  }
};
