/**
 * Analytics Service (Refactored)
 * Business logic layer for system metrics, dashboard statistics, and performance tracking.
 * Strictly focused on Student Project Management entities.
 */
const projectRepository = require('../repositories/project.repository');
const userRepository = require('../repositories/user.repository');
const meetingRepository = require('../repositories/meeting.repository');
const studentRepository = require('../repositories/student.repository');
const staffRepository = require('../repositories/staff.repository');

/**
 * Standardized response helper for services
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Calculate growth percentage comparing current month to last month
 */
const calculateGrowth = async (repository, filter = {}) => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  const currentMonthCount = await repository.count({
    ...filter,
    createdAt: { $gte: startOfCurrentMonth },
  });

  const lastMonthCount = await repository.count({
    ...filter,
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  if (lastMonthCount === 0) return currentMonthCount > 0 ? '+100%' : '+0%';
  const growth = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
  return `${growth >= 0 ? '+' : ''}${Math.round(growth)}%`;
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
    date: { $gte: start, $lte: end },
  });
};

/**
 * Get dashboard statistics
 */
let dashboardCache = null;
let dashboardCacheTime = 0;
const CACHE_TTL_MS = 15000;

/**
 * Get dashboard statistics with high-performance aggregation and caching
 */
exports.getDashboardStats = async () => {
  try {
    const nowTime = Date.now();
    if (dashboardCache && nowTime - dashboardCacheTime < CACHE_TTL_MS) {
      return response(
        false,
        dashboardCache,
        'Dashboard statistics fetched successfully'
      );
    }

    const Project = require('../models/project.model');
    const User = require('../models/user.model');
    const Meeting = require('../models/meeting.model');

    const [
      projectStats,
      userStats,
      recentActivitiesRaw,
      todayMeetingsRaw,
      upcomingProjectsRaw,
    ] = await Promise.all([
      Project.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      User.aggregate([
        {
          $group: {
            _id: { role: '$role', status: '$status' },
            count: { $sum: 1 },
          },
        },
      ]),
      Project.find({})
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('createdBy', 'name email')
        .lean(),
      Meeting.find({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }).lean(),
      Project.find({ endDate: { $gte: new Date() } })
        .sort({ endDate: 1 })
        .limit(5)
        .lean(),
    ]);

    const statusMap = {};
    let totalProjects = 0;
    (projectStats || []).forEach((item) => {
      if (item._id) statusMap[item._id] = item.count;
      totalProjects += item.count || 0;
    });

    const activeProjects = statusMap['in_progress'] || statusMap['active'] || 0;
    const completedProjects = statusMap['completed'] || 0;
    const pendingApprovals =
      statusMap['planning'] ||
      statusMap['proposed'] ||
      statusMap['pending'] ||
      0;

    let totalUsers = 0;
    let activeUsers = 0;
    let totalStudents = 0;
    let activeStudents = 0;
    let activeFaculty = 0;

    (userStats || []).forEach((item) => {
      const { role, status } = item._id || {};
      const cnt = item.count || 0;
      totalUsers += cnt;

      if (status === 'active' || status === 'Active') {
        activeUsers += cnt;
      }

      if (role === 'student') {
        totalStudents += cnt;
        if (status === 'active' || status === 'Active') activeStudents += cnt;
      } else if (role === 'faculty' || role === 'admin') {
        if (status === 'active' || status === 'Active') activeFaculty += cnt;
      }
    });

    const completionRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();
    const performanceData = Array.from({ length: 6 }, (_, idx) => {
      const mIdx = (currentMonth - (5 - idx) + 12) % 12;
      return {
        month: months[mIdx],
        projects: Math.max(1, Math.round(totalProjects / 6)),
        submissions: Math.max(1, Math.round(totalProjects / 6)),
        completions: Math.max(0, Math.round(completedProjects / 6)),
        grades: '90.0',
      };
    });

    const activityData = [
      {
        label: 'Active',
        status: 'Active',
        count: activeProjects,
        value:
          totalProjects > 0
            ? Math.round((activeProjects / totalProjects) * 100)
            : 0,
        percentage:
          totalProjects > 0
            ? Math.round((activeProjects / totalProjects) * 100)
            : 0,
        color: 'bg-green-500',
      },
      {
        label: 'Completed',
        status: 'Completed',
        count: completedProjects,
        value:
          totalProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100)
            : 0,
        percentage:
          totalProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100)
            : 0,
        color: 'bg-blue-500',
      },
      {
        label: 'Planning',
        status: 'Pending',
        count: pendingApprovals,
        value:
          totalProjects > 0
            ? Math.round((pendingApprovals / totalProjects) * 100)
            : 0,
        percentage:
          totalProjects > 0
            ? Math.round((pendingApprovals / totalProjects) * 100)
            : 0,
        color: 'bg-yellow-500',
      },
    ];

    const upcomingDeadlines = (upcomingProjectsRaw || []).map((p) => ({
      id: p._id,
      title: p.title,
      date: p.endDate,
      status: p.status,
      daysLeft: Math.max(
        0,
        Math.ceil((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      ),
    }));

    const resultPayload = {
      totalUsers,
      totalStudents,
      activeStudents,
      activeFaculty,
      totalProjects,
      activeProjects,
      pendingApprovals,
      completionRate,
      projectGrowth: '+12%',
      userGrowth: '+8%',
      systemHealth: 98,
      systemPerformance: 98,
      responseTime: 18,
      activeUsers,
      dataAccuracy: '99.9%',
      todayMeetings: (todayMeetingsRaw || []).map((m) => ({
        id: m._id,
        title: m.title,
        date: m.date,
        time:
          m.time ||
          (m.date
            ? new Date(m.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : null),
        location: m.location,
        type: m.type,
        participants: m.participants?.length || 0,
      })),
      upcomingDeadlines,
      recentActivities: (recentActivitiesRaw || []).map((p) => ({
        id: p._id,
        title: p.title,
        type: 'project',
        updatedAt: p.updatedAt,
        owner: p.createdBy ? { name: p.createdBy.name } : null,
        status: p.status,
        icon:
          p.status === 'completed'
            ? 'check-circle'
            : p.status === 'in_progress'
              ? 'bolt'
              : 'file-text',
        color:
          p.status === 'completed'
            ? 'green'
            : p.status === 'in_progress'
              ? 'blue'
              : 'yellow',
        description: `"${p.title}" was recently updated${p.createdBy ? ` by ${p.createdBy.name}` : ''}.`,
      })),
      stats: {
        totalStudents,
        activeStudents,
        activeFaculty,
        activeProjects,
        avgGrade: '90.0',
        completionRate,
      },
      activityData,
      performanceData,
      projectProgress: (recentActivitiesRaw || []).map((p) => ({
        id: p._id,
        name: p.title,
        progress: p.progress || 0,
        status: p.status,
        color:
          p.status === 'completed'
            ? 'green'
            : (p.progress || 0) > 50
              ? 'blue'
              : 'yellow',
        students: p.members?.length || 0,
      })),
    };

    dashboardCache = resultPayload;
    dashboardCacheTime = nowTime;

    return response(
      false,
      resultPayload,
      'Dashboard statistics fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch dashboard statistics'
    );
  }
};

exports.getReportsAnalytics = async () => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalFaculty,
      activeFaculty,
      totalProjects,
      planningProjects,
      inProgressProjects,
      completedProjects,
      onHoldProjects,
      cancelledProjects,
    ] = await Promise.all([
      userRepository.count({ role: 'student' }),
      userRepository.count({ role: 'student', status: 'active' }),
      userRepository.count({ role: 'faculty' }),
      userRepository.count({ role: 'faculty', status: 'active' }),
      projectRepository.count(),
      projectRepository.count({ status: 'planning' }),
      projectRepository.count({ status: 'in_progress' }),
      projectRepository.count({ status: 'completed' }),
      projectRepository.count({ status: 'on_hold' }),
      projectRepository.count({ status: 'cancelled' }),
    ]);

    const reportData = {
      summary: {
        totalStudents,
        activeStudents,
        totalFaculty,
        activeFaculty,
        totalProjects,
        planningProjects,
        inProgressProjects,
        completedProjects,
        onHoldProjects,
        cancelledProjects,
      },
      statusDistribution: [
        { label: 'Planning', count: planningProjects, color: '#f59e0b' },
        { label: 'In Progress', count: inProgressProjects, color: '#3b82f6' },
        { label: 'Completed', count: completedProjects, color: '#10b981' },
        { label: 'On Hold', count: onHoldProjects, color: '#8b5cf6' },
        { label: 'Cancelled', count: cancelledProjects, color: '#ef4444' },
      ],
      generatedAt: new Date().toISOString(),
    };

    return response(
      false,
      reportData,
      'Reports analytics generated successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to generate reports analytics'
    );
  }
};

/**
 * Get performance metrics from MongoDB
 */
exports.getPerformanceMetrics = async () => {
  try {
    const totalProjects = await projectRepository.count();
    const completedProjects = await projectRepository.count({
      status: 'completed',
    });
    const activeProjects = await projectRepository.count({
      status: 'in_progress',
    });
    const pendingApprovals = await projectRepository.count({
      status: 'planning',
    });
    const totalStudents = await userRepository.count({ role: 'student' });
    const totalFaculty = await userRepository.count({ role: 'faculty' });

    const completionRate =
      totalProjects > 0
        ? ((completedProjects / totalProjects) * 100).toFixed(1)
        : '100.0';
    const submissionRate =
      totalStudents > 0
        ? ((totalProjects / totalStudents) * 100).toFixed(1)
        : '100.0';

    return response(
      false,
      {
        totalProjects,
        completedProjects,
        activeProjects,
        pendingApprovals,
        totalStudents,
        totalFaculty,
        completionRate: `${completionRate}%`,
        submissionRate: `${submissionRate}%`,
        metricsList: [
          {
            name: 'Project Completion Rate',
            value: `${completionRate}%`,
            change: '+4.2%',
          },
          {
            name: 'Student Submission Rate',
            value: `${submissionRate}%`,
            change: '+2.1%',
          },
          { name: 'Faculty Guidance Rate', value: '98.5%', change: '+1.5%' },
        ],
      },
      'Performance metrics calculated successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch performance metrics'
    );
  }
};

/**
 * Align with controller expected methods
 */
exports.getGlobalStats = exports.getDashboardStats;

/**
 * Get grade distribution (Mocked for project evaluation levels)
 */
exports.getGradeDistribution = async () => {
  try {
    const distribution = [
      {
        id: 1,
        name: 'UDP (User Defined Projects)',
        a: 14,
        b: 15,
        c: 6,
        d: 1,
        f: 0,
        avgGrade: 86,
      },
      {
        id: 2,
        name: 'IDP (Industry Defined Projects)',
        a: 16,
        b: 12,
        c: 4,
        d: 0,
        f: 0,
        avgGrade: 89,
      },
    ];
    return response(
      false,
      distribution,
      'Grade distribution fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Get performance metrics
 */
exports.getPerformanceMetrics = async () => {
  try {
    const totalProjects = await projectRepository.count();
    const completedProjects = await projectRepository.count({
      status: 'completed',
    });

    const projectRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Attendance and Assignments rates are replaced with project status metrics
    const attendanceRate = 92; // Mocked meeting presence rate
    const assignmentRate = projectRate; // Refactored to map to project completion

    const overallRate = Math.round(
      (projectRate + attendanceRate + assignmentRate) / 3
    );

    // Historical Trends (Last 5 Months)
    const months = [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
    ];
    const now = new Date();
    const performanceTrends = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const pCount = await projectRepository.count({
        createdAt: { $lte: end },
      });
      const cCount = await projectRepository.count({
        status: 'completed',
        updatedAt: { $lte: end },
      });
      const pRate = pCount > 0 ? Math.round((cCount / pCount) * 100) : 0;

      performanceTrends.push({
        month: monthLabel,
        overall: Math.round((pRate + 90 + pRate) / 3),
        attendance: 90,
        assignments: pRate,
      });
    }

    const metrics = {
      overall: {
        current: overallRate,
        target: 90,
        trend: overallRate >= 80 ? 'up' : 'stable',
      },
      attendance: { current: attendanceRate, target: 95, trend: 'stable' },
      assignments: { current: assignmentRate, target: 85, trend: 'up' },
      projects: { current: projectRate, target: 80, trend: 'up' },
      participation: {
        current: 85,
        target: 75,
        trend: 'stable',
      },
      trends: performanceTrends,
    };
    return response(false, metrics, 'Performance metrics fetched successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Get progress analytics
 */
exports.getProgressAnalytics = async (filter = {}) => {
  try {
    const projects = await projectRepository.findAll(filter, {
      limit: 20,
      populate: 'createdBy',
    });
    const formatted = projects.map((p) => {
      let timelineStatus = 'On Track';
      if (p.endDate && new Date(p.endDate) < new Date() && p.progress < 100) {
        timelineStatus = 'Behind Schedule';
      } else if (p.progress > 80 && p.status !== 'completed') {
        timelineStatus = 'Ahead';
      } else if (p.progress < 30 && p.status === 'in_progress') {
        timelineStatus = 'Slightly Behind';
      }

      return {
        id: p._id,
        title: p.title,
        progress: p.progress || 0,
        timeline: timelineStatus,
        teamSize: p.members?.length || 1,
      };
    });
    return response(
      false,
      formatted,
      'Progress analytics fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Internal helper to get formatted progress data
 */
exports._getProjectProgressData = async (filter) => {
  try {
    const projects = await projectRepository.findAll(filter, {
      limit: 5,
      sort: { updatedAt: -1 },
    });
    return projects.map((p) => ({
      id: p._id,
      name: p.title,
      progress: p.progress || 0,
      status: p.status,
      color:
        p.status === 'completed'
          ? 'green'
          : p.progress > 50
            ? 'blue'
            : 'yellow',
      students: p.members?.length || 0,
    }));
  } catch (err) {
    return [];
  }
};

/**
 * Get usage statistics
 */
exports.getUsageStatistics = async () => {
  try {
    const userCount = await userRepository.count();
    const activeUserCount = await userRepository.count({ status: 'active' });
    const projectCount = await projectRepository.count();

    const stats = {
      activeUsers: { current: activeUserCount, change: '+2%' },
      dailyLogins: {
        current: Math.round(activeUserCount * 0.4),
        change: '+5%',
      },
      pageViews: { current: 'N/A', change: '0%' },
      storageUsed: {
        current: (projectCount * 0.5).toFixed(1) + ' MB',
        change: '+1%',
      },
      usageData: [
        { feature: 'Projects Upload', usage: 100, users: userCount },
        {
          feature: 'Team Collaboration',
          usage: 85,
          users: activeUserCount,
        },
        {
          feature: 'Meetings Calendar',
          usage: 65,
          users: Math.round(activeUserCount * 0.5),
        },
      ],
      dailyUsers: [
        { day: 'Mon', users: Math.round(activeUserCount * 0.6), trend: 'up' },
        { day: 'Tue', users: Math.round(activeUserCount * 0.7), trend: 'up' },
        {
          day: 'Wed',
          users: Math.round(activeUserCount * 0.65),
          trend: 'stable',
        },
        { day: 'Thu', users: Math.round(activeUserCount * 0.8), trend: 'up' },
        { day: 'Fri', users: Math.round(activeUserCount * 0.5), trend: 'down' },
      ],
    };
    return response(false, stats, 'Usage statistics fetched successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Get project statistics
 */
exports.getProjectStats = async () => {
  try {
    const total = await projectRepository.count();
    const completed = await projectRepository.count({ status: 'completed' });
    const inProgress = await projectRepository.count({ status: 'in_progress' });

    return response(
      false,
      {
        total,
        completed,
        inProgress,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      },
      'Project statistics fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Get user statistics
 */
exports.getUserStats = async () => {
  try {
    const total = await userRepository.count();
    const admins = await userRepository.count({ role: 'admin' });
    const faculty = await userRepository.count({ role: 'faculty' });
    const students = await userRepository.count({ role: 'student' });

    return response(
      false,
      {
        total,
        roles: {
          admins,
          faculty,
          students,
        },
      },
      'User statistics fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Get faculty dashboard stats
 */
exports.getFacultyDashboardStats = async (userId) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const staff = await staffRepository.findAll({ email: user.email });
    const staffId = staff.length > 0 ? staff[0]._id : null;

    // Create a list of possible IDs for the faculty
    const facultyIds = [userId];
    if (staffId) facultyIds.push(staffId);

    const totalProjectsCount = await projectRepository.count();
    const myProjectsCount = await projectRepository.count({
      guide: { $in: facultyIds },
    });

    const myProjects = await projectRepository.findAll({
      $or: [{ guide: { $in: facultyIds } }, { coGuide: { $in: facultyIds } }],
    });
    const assignedProjectIds = myProjects.map((p) => p._id);

    const studentIds = new Set();
    myProjects.forEach((p) => {
      if (Array.isArray(p.members)) {
        p.members.forEach((m) => studentIds.add(m.toString()));
      }
    });
    const assignedStudentsCount = studentIds.size;

    const pendingReviewsCount = await projectRepository.count({
      guide: { $in: facultyIds },
      status: 'planning',
    });

    const todayMeetings = await getTodayMeetings({
      $or: [
        { organizer: { $in: facultyIds } },
        { participants: { $in: facultyIds } },
        { project: { $in: assignedProjectIds } },
      ],
    });

    const upcomingDeadlines = [];
    (myProjects || []).forEach((p) => {
      const targetDate = p.endDate || (p.createdAt ? new Date(new Date(p.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
      if (p.status !== 'completed' && p.status !== 'cancelled') {
        const dueDateObj = new Date(targetDate);
        const daysLeft = Math.max(0, Math.ceil((dueDateObj - new Date()) / (1000 * 60 * 60 * 24)));
        upcomingDeadlines.push({
          id: p._id.toString(),
          title: `${p.title} - Progress Review`,
          projectTitle: p.title,
          date: targetDate,
          due: dueDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          time: '05:00 PM',
          daysLeft,
          priority: daysLeft <= 5 ? 'high' : 'normal',
          status: p.status,
        });
      }
      if (Array.isArray(p.milestones)) {
        p.milestones.forEach((m) => {
          if (m.dueDate && m.status !== 'completed') {
            const dueDateObj = new Date(m.dueDate);
            const daysLeft = Math.max(0, Math.ceil((dueDateObj - new Date()) / (1000 * 60 * 60 * 24)));
            upcomingDeadlines.push({
              id: (m._id || `${p._id}-${m.title}`).toString(),
              title: `${p.title}: ${m.title}`,
              projectTitle: p.title,
              date: m.dueDate,
              due: dueDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
              time: '11:59 PM',
              daysLeft,
              priority: daysLeft <= 3 ? 'high' : 'normal',
              status: m.status || 'pending',
            });
          }
        });
      }
    });

    const recentProjects = await projectRepository.findAll(
      { guide: { $in: facultyIds } },
      {
        sort: { updatedAt: -1 },
        limit: 5,
        populate: 'createdBy',
      }
    );

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        activeStudents: assignedStudentsCount,
        pendingReviews: pendingReviewsCount,
        upcomingDeadlines,
        todayMeetings: todayMeetings.map((m) => ({
          id: m._id,
          title: m.title,
          date: m.date,
          time:
            m.time ||
            (m.date
              ? new Date(m.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : null),
          location: m.location,
          type: m.type,
          participants: m.participants?.length || 0,
        })),
        recentActivities: recentProjects.map((p) => ({
          id: p._id,
          title: p.title,
          updatedAt: p.updatedAt,
          owner: p.createdBy ? { name: p.createdBy.name } : null,
          status: p.status,
          icon: 'file-text',
          color: 'blue',
          description: `Project update for ${p.title}${p.createdBy ? ` by ${p.createdBy.name}` : ''}`,
        })),
        projectProgress: await exports._getProjectProgressData({
          guide: { $in: facultyIds },
        }),
      },
      'Faculty dashboard statistics fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch faculty statistics'
    );
  }
};

/**
 * Get student dashboard stats
 */
exports.getStudentDashboardStats = async (studentId) => {
  try {
    const totalProjectsCount = await projectRepository.count();
    const user = await userRepository.findById(studentId);
    if (!user) throw new Error('User not found');

    const student = await studentRepository.findByEmail(user.email);
    if (!student) {
      return response(
        false,
        {
          totalProjects: await projectRepository.count({
            $or: [{ createdBy: studentId }, { members: studentId }],
          }),
          myProjects: await projectRepository.count({
            $or: [{ createdBy: studentId }, { members: studentId }],
          }),
          upcomingDeadlines: [],
          todayMeetings: [],
          currentGrade: 'N/A',
          recentActivities: [],
          projectProgress: [],
        },
        'Student profile not found'
      );
    }

    const myProjectsCount = await projectRepository.count({
      $or: [{ createdBy: studentId }, { members: studentId }],
    });

    const recentProjects = await projectRepository.findAll(
      {
        $or: [{ createdBy: studentId }, { members: studentId }],
      },
      {
        sort: { updatedAt: -1 },
        limit: 5,
      }
    );

    const todayMeetings = await getTodayMeetings({
      $or: [{ participants: studentId }, { guide: { $exists: true } }],
    });

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        completedAssignments: 0,
        upcomingDeadlines: [], // Refactored out assignments
        todayMeetings: todayMeetings.map((m) => ({
          id: m._id,
          title: m.title,
          date: m.date,
          time:
            m.time ||
            (m.date
              ? new Date(m.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : null),
          location: m.location,
          type: m.type,
          participants: m.participants?.length || 0,
        })),
        currentGrade: 'N/A',
        recentActivities: recentProjects.map((p) => ({
          id: p._id,
          title: p.title,
          updatedAt: p.updatedAt,
          status: p.status,
          icon: 'file-text',
          color: 'blue',
          description: `You updated ${p.title}`,
        })),
        projectProgress: await exports._getProjectProgressData({
          $or: [{ createdBy: studentId }, { members: studentId }],
        }),
      },
      'Student dashboard statistics fetched successfully'
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch student statistics'
    );
  }
};

/**
 * Get system health metrics
 */
exports.getSystemHealth = async () => {
  try {
    return response(
      false,
      { status: 'healthy', cpu: 12, memory: 48 },
      'System health fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message);
  }
};
