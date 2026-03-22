const projectRepository = require("../repositories/project.repository");
const userRepository = require("../repositories/user.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const meetingRepository = require("../repositories/meeting.repository");
const evaluationRepository = require("../repositories/evaluation.repository");
const attendanceRepository = require("../repositories/attendance.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Calculate growth percentage comparing current month to last month
 */
const calculateGrowth = async (repository, filter = {}) => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const currentMonthCount = await repository.count({
    ...filter,
    createdAt: { $gte: startOfCurrentMonth }
  });

  const lastMonthCount = await repository.count({
    ...filter,
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
  });

  if (lastMonthCount === 0) return currentMonthCount > 0 ? "+100%" : "+0%";
  const growth = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
  return `${growth >= 0 ? "+" : ""}${Math.round(growth)}%`;
};

/**
 * Get meetings for today
 */
const getTodayMeetings = async (filter = {}) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return await meetingRepository.findAll({
    ...filter,
    date: { $gte: start, $lte: end }
  });
};

/**
 * Generate high-level system dashboard metrics
 * @returns {Promise<Object>} Formatted service response with system stats
 */
exports.getDashboardStats = async () => {
  try {
    const totalStudents = await userRepository.count({ role: "student" });
    const totalProjects = await projectRepository.count();
    const activeProjects = await projectRepository.count({ status: "in_progress" });
    const completedProjects = await projectRepository.count({ status: "completed" });
    const pendingApprovals = await projectRepository.count({ status: "planning" });

    // Calculate Completion Rate
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Monthly Performance Data (Last 6 Months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const performanceData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const count = await projectRepository.count({
        createdAt: { $gte: start, $lte: end }
      });
      const completedCount = await projectRepository.count({
        status: "completed",
        updatedAt: { $gte: start, $lte: end }
      });

      const monthEvaluations = await evaluationRepository.findAll({
        createdAt: { $gte: start, $lte: end },
        type: "faculty"
      });
      let monthTotalScore = 0;
      let monthScoreCount = 0;
      monthEvaluations.forEach(ev => {
        ev.criteria.forEach(c => {
          monthTotalScore += c.score;
          monthScoreCount++;
        });
      });
      const monthAvgGrade = monthScoreCount > 0 ? (monthTotalScore / monthScoreCount).toFixed(1) : "N/A";

      performanceData.push({
        month: monthLabel,
        projects: count,
        submissions: count,
        completions: completedCount,
        grades: monthAvgGrade
      });
    }

    // Activity Breakdown Data
    const activityData = [
      { label: "Active", status: "Active", count: activeProjects, value: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0, percentage: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0, color: "bg-green-500" },
      { label: "Completed", status: "Completed", count: completedProjects, value: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0, percentage: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0, color: "bg-blue-500" },
      { label: "Planning", status: "Pending", count: pendingApprovals, value: totalProjects > 0 ? Math.round((pendingApprovals / totalProjects) * 100) : 0, percentage: totalProjects > 0 ? Math.round((pendingApprovals / totalProjects) * 100) : 0, color: "bg-yellow-500" }
    ];

    const recentActivities = await projectRepository.findAll(
      {},
      {
        sort: { updatedAt: -1 },
        limit: 5,
        populate: "createdBy",
      },
    );

    const projectGrowth = await calculateGrowth(projectRepository);
    const userGrowth = await calculateGrowth(userRepository);
    const todayMeetings = await getTodayMeetings();

    // Calculate Avg Grade Dynamically
    const evaluations = await evaluationRepository.findAll({ type: "faculty" });
    let totalScore = 0;
    let scoreCount = 0;
    
    evaluations.forEach(ev => {
      ev.criteria.forEach(c => {
        totalScore += c.score;
        scoreCount++;
      });
    });
    
    const avgGradeValue = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : "N/A";

    return response(
      false,
      {
        totalUsers: await userRepository.count(),
        totalProjects,
        activeProjects,
        pendingApprovals,
        completionRate,
        projectGrowth,
        userGrowth,
        systemHealth: 98,
        systemPerformance: 94,
        responseTime: 112,
        activeUsers: await userRepository.count({ status: "active" }),
        dataAccuracy: "99.9%",
        todayMeetings: todayMeetings.map(m => ({
          id: m._id,
          title: m.title,
          time: m.time,
          location: m.location,
          type: m.type,
          participants: m.participants?.length || 0
        })),
        recentActivities: recentActivities.map((p) => ({
          id: p._id,
          title: p.title,
          updatedAt: p.updatedAt,
          owner: p.createdBy ? { name: p.createdBy.name } : null,
          status: p.status,
          icon: p.status === "completed" ? "check-circle" : "file-text",
          color: p.status === "completed" ? "green" : "blue",
          description: `Project "${p.title}" was ${p.status.replace("_", " ")}${p.createdBy ? ` by ${p.createdBy.name}` : ""}.`
        })),
        stats: {
          totalStudents,
          activeProjects,
          avgGrade: avgGradeValue,
          completionRate
        },
        performanceData,
        activityData,
        projectProgress: (await exports._getProjectProgressData({})),
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

exports.getGradeDistribution = async () => {
  try {
    const projects = await projectRepository.findAll();
    // Simplified grade mapping for demonstration
    const distribution = [
      { id: 1, name: "Core Projects", a: 12, b: 18, c: 8, d: 2, f: 0, avgGrade: 84 },
      { id: 2, name: "Elective Projects", a: 15, b: 10, c: 5, d: 0, f: 0, avgGrade: 88 }
    ];
    return response(false, distribution, "Grade distribution fetched successfully");
  } catch (err) {
    return response(true, null, err.message);
  }
};

exports.getPerformanceMetrics = async () => {
  try {
    const totalProjects = await projectRepository.count();
    const completedProjects = await projectRepository.count({ status: "completed" });
    
    const attendanceRecords = await attendanceRepository.findAll();
    const presentCount = attendanceRecords.filter(r => r.status === "present").length;
    const totalAttendance = attendanceRecords.length;
    
    const totalAssignments = await assignmentRepository.count();
    const totalSubmissions = await submissionRepository.count();
    
    const projectRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
    const assignmentRate = totalAssignments > 0 ? Math.round((totalSubmissions / totalAssignments) * 100) : 0;
    
    const overallRate = Math.round((projectRate + attendanceRate + assignmentRate) / 3);

    // Historical Trends (Last 5 Months)
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const now = new Date();
    const performanceTrends = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const pCount = await projectRepository.count({ createdAt: { $lte: end } });
      const cCount = await projectRepository.count({ status: "completed", updatedAt: { $lte: end } });
      const pRate = pCount > 0 ? Math.round((cCount / pCount) * 100) : 0;

      const attRecords = await attendanceRepository.findAll({ date: { $gte: start, $lte: end } });
      const attRate = attRecords.length > 0 ? Math.round((attRecords.filter(r => r.status === "present").length / attRecords.length) * 100) : 0;

      const subCount = await submissionRepository.count({ createdAt: { $lte: end } });
      const assCount = await assignmentRepository.count({ createdAt: { $lte: end } });
      const assRate = assCount > 0 ? Math.round((subCount / assCount) * 100) : 0;

      performanceTrends.push({
        month: monthLabel,
        overall: Math.round((pRate + attRate + assRate) / 3),
        attendance: attRate,
        assignments: assRate
      });
    }

    const metrics = {
      overall: { current: overallRate, target: 90, trend: overallRate >= 80 ? "up" : "stable" },
      attendance: { current: attendanceRate, target: 95, trend: "stable" },
      assignments: { current: assignmentRate, target: 85, trend: "up" },
      projects: { current: projectRate, target: 80, trend: "up" },
      participation: { current: attendanceRate > 50 ? 82 : 65, target: 75, trend: "stable" },
      trends: performanceTrends
    };
    return response(false, metrics, "Performance metrics fetched successfully");
  } catch (err) {
    return response(true, null, err.message);
  }
};

exports.getProgressAnalytics = async (filter = {}) => {
  try {
    const projects = await projectRepository.findAll(filter, { limit: 20, populate: "createdBy" });
    const formatted = projects.map(p => {
      let timelineStatus = "On Track";
      if (p.endDate && new Date(p.endDate) < new Date() && p.progress < 100) {
        timelineStatus = "Behind Schedule";
      } else if (p.progress > 80 && p.status !== "completed") {
        timelineStatus = "Ahead";
      } else if (p.progress < 30 && p.status === "in_progress") {
        timelineStatus = "Slightly Behind";
      }

      return {
        id: p._id,
        title: p.title,
        progress: p.progress || 0,
        timeline: timelineStatus,
        teamSize: p.members?.length || 1
      };
    });
    return response(false, formatted, "Progress analytics fetched successfully");
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Internal helper to get formatted progress data
 */
exports._getProjectProgressData = async (filter) => {
  try {
    const projects = await projectRepository.findAll(filter, { limit: 5, sort: { updatedAt: -1 } });
    return projects.map(p => ({
      id: p._id,
      name: p.title,
      progress: p.progress || 0,
      status: p.status,
      color: p.status === "completed" ? "green" : p.progress > 50 ? "blue" : "yellow",
      students: p.members?.length || 0
    }));
  } catch (err) {
    return [];
  }
};

exports.getUsageStatistics = async () => {
  try {
    const userCount = await userRepository.count();
    const activeUserCount = await userRepository.count({ status: "active" });
    const projectCount = await projectRepository.count();
    const assignmentCount = await assignmentRepository.count();
    
    // Growth calculation (simplified for now)
    const stats = {
      activeUsers: { current: activeUserCount, change: "+2%" },
      dailyLogins: { current: Math.round(activeUserCount * 0.4), change: "+5%" },
      pageViews: { current: "N/A", change: "0%" },
      storageUsed: { current: (projectCount * 0.5).toFixed(1) + " MB", change: "+1%" },
      usageData: [
        { feature: "Projects", usage: 100, users: userCount },
        { feature: "Assignments", usage: Math.round((assignmentCount / (projectCount || 1)) * 100), users: activeUserCount },
        { feature: "Communications", usage: 45, users: Math.round(activeUserCount * 0.3) }
      ],
      dailyUsers: [
        { day: "Mon", users: Math.round(activeUserCount * 0.6), trend: "up" },
        { day: "Tue", users: Math.round(activeUserCount * 0.7), trend: "up" },
        { day: "Wed", users: Math.round(activeUserCount * 0.65), trend: "stable" },
        { day: "Thu", users: Math.round(activeUserCount * 0.8), trend: "up" },
        { day: "Fri", users: Math.round(activeUserCount * 0.5), trend: "down" }
      ]
    };
    return response(false, stats, "Usage statistics fetched successfully");
  } catch (err) {
    return response(true, null, err.message);
  }
};

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

    const todayMeetings = await getTodayMeetings({ guide: facultyId });

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        activeStudents,
        pendingReviews: pendingReviewsCount,
        todayMeetings: todayMeetings.map(m => ({
          id: m._id,
          title: m.title,
          time: m.time,
          location: m.location,
          type: m.type,
          participants: m.participants?.length || 0
        })),
        recentActivities: recentProjects.map((p) => ({
          id: p._id,
          title: p.title,
          updatedAt: p.updatedAt,
          owner: p.createdBy ? { name: p.createdBy.name } : null,
          status: p.status,
          icon: "file-text",
          color: "blue",
          description: `Project update for ${p.title}${p.createdBy ? ` by ${p.createdBy.name}` : ""}`,
        })),
        projectProgress: await exports._getProjectProgressData({ guide: facultyId }),
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

    const todayMeetings = await getTodayMeetings({ 
      $or: [
        { participants: studentId },
        { guide: { $exists: true } } // Fallback for general meetings if needed
      ] 
    });

    const upcomingDeadlines = await assignmentRepository.findAll({
      student: studentId,
      status: { $ne: "completed" },
      dueDate: { $gte: new Date() }
    }, { limit: 5, sort: { dueDate: 1 } });

    // Calculate Student Grade Dynamically
    const studentEvaluations = await evaluationRepository.findAll({ 
      evaluatee: studentId,
      type: "faculty" 
    });
    let studentTotalScore = 0;
    let studentScoreCount = 0;
    studentEvaluations.forEach(ev => {
      ev.criteria.forEach(c => {
        studentTotalScore += c.score;
        studentScoreCount++;
      });
    });
    const currentGradeValue = studentScoreCount > 0 ? (studentTotalScore / studentScoreCount).toFixed(1) : "N/A";

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        completedAssignments: completedAssignmentsCount,
        upcomingDeadlines: upcomingDeadlines.map(a => ({
          id: a._id,
          title: a.title,
          due: new Date(a.dueDate).toLocaleDateString(),
          time: new Date(a.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          priority: new Date(a.dueDate) - new Date() < 86400000 * 2 ? "high" : "medium"
        })),
        todayMeetings: todayMeetings.map(m => ({
          id: m._id,
          title: m.title,
          time: m.time,
          location: m.location,
          type: m.type,
          participants: m.participants?.length || 0
        })),
        currentGrade: currentGradeValue,
        recentActivities: recentProjects.map((p) => ({
          id: p._id,
          title: p.title,
          updatedAt: p.updatedAt,
          status: p.status,
          icon: "file-text",
          color: "blue",
          description: `You updated ${p.title}`,
        })),
        projectProgress: await exports._getProjectProgressData({ 
          $or: [{ createdBy: studentId }, { members: studentId }] 
        }),
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
