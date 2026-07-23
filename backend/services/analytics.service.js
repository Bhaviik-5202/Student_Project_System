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
exports.getDashboardStats = async () => {
  try {
    const [
      totalStudents,
      activeStudents,
      activeFaculty,
      totalProjects,
      activeProjects,
      completedProjects,
      pendingApprovals,
      totalUsers,
      activeUsers,
      recentActivities,
      projectGrowth,
      userGrowth,
      todayMeetings,
      upcomingProjects,
    ] = await Promise.all([
      userRepository.count({ role: 'student' }),
      userRepository.count({ role: 'student', status: 'active' }),
      userRepository.count({ role: 'faculty', status: 'active' }),
      projectRepository.count(),
      projectRepository.count({ status: 'in_progress' }),
      projectRepository.count({ status: 'completed' }),
      projectRepository.count({ status: 'planning' }),
      userRepository.count(),
      userRepository.count({ status: 'active' }),
      projectRepository.findAll(
        {},
        {
          sort: { updatedAt: -1 },
          limit: 5,
          populate: 'createdBy',
        }
      ),
      calculateGrowth(projectRepository),
      calculateGrowth(userRepository),
      getTodayMeetings(),
      projectRepository.findAll(
        { endDate: { $gte: new Date() } },
        { sort: { endDate: 1 }, limit: 5 }
      ),
    ]);

    // Calculate Completion Rate
    const completionRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Monthly Performance Data (Last 6 Months) in parallel
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
    const now = new Date();

    const monthPromises = Array.from({ length: 6 }, (_, idx) => {
      const i = 5 - idx;
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

      return Promise.all([
        projectRepository.count({
          createdAt: { $gte: start, $lte: end },
        }),
        projectRepository.count({
          status: 'completed',
          updatedAt: { $gte: start, $lte: end },
        }),
      ]).then(([count, completedCount]) => ({
        month: monthLabel,
        projects: count,
        submissions: count,
        completions: completedCount,
        grades: '90.0',
      }));
    });

    const performanceData = await Promise.all(monthPromises);

    // Activity Breakdown Data
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

    const upcomingDeadlines = upcomingProjects.map((p) => ({
      id: p._id,
      title: p.title,
      date: p.endDate,
      status: p.status,
      daysLeft: Math.ceil(
        (new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return response(
      false,
      {
        totalUsers,
        totalStudents,
        activeStudents,
        activeFaculty,
        totalProjects,
        activeProjects,
        pendingApprovals,
        completionRate,
        projectGrowth,
        userGrowth,
        systemHealth: 98,
        systemPerformance: 94,
        responseTime: 112,
        activeUsers,
        dataAccuracy: '99.9%',
        todayMeetings: todayMeetings.map((m) => ({
          id: m._id,
          title: m.title,
          time: m.time,
          location: m.location,
          type: m.type,
          participants: m.participants?.length || 0,
        })),
        upcomingDeadlines,
        recentActivities: recentActivities
          .slice()
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map((p) => ({
            id: p._id,
            title: p.title,
            type: 'project',
            updatedAt: p.updatedAt,
            owner: p.createdBy ? { name: p.createdBy.name } : null,
            status: p.status,
            icon: p.status === 'completed' ? 'check-circle' : p.status === 'in_progress' ? 'bolt' : 'file-text',
            color: p.status === 'completed' ? 'green' : p.status === 'in_progress' ? 'blue' : 'yellow',
            description: p.status === 'completed'
              ? `"${p.title}" has been marked as completed${p.createdBy ? ` by ${p.createdBy.name}` : ''}.`
              : p.status === 'in_progress'
                ? `"${p.title}" is currently in progress${p.createdBy ? ` — ${p.createdBy.name}` : ''}.`
                : `"${p.title}" was recently updated${p.createdBy ? ` by ${p.createdBy.name}` : ''}.`,
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
        projectProgress: await exports._getProjectProgressData({}),
      },
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

    return response(false, reportData, 'Reports analytics generated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to generate reports analytics');
  }
};

/**
 * Get performance metrics from MongoDB
 */
exports.getPerformanceMetrics = async () => {
  try {
    const totalProjects = await projectRepository.count();
    const completedProjects = await projectRepository.count({ status: 'completed' });
    const activeProjects = await projectRepository.count({ status: 'in_progress' });
    const pendingApprovals = await projectRepository.count({ status: 'planning' });
    const totalStudents = await userRepository.count({ role: 'student' });
    const totalFaculty = await userRepository.count({ role: 'faculty' });

    const completionRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : '100.0';
    const submissionRate = totalStudents > 0 ? ((totalProjects / totalStudents) * 100).toFixed(1) : '100.0';

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
          { name: 'Project Completion Rate', value: `${completionRate}%`, change: '+4.2%' },
          { name: 'Student Submission Rate', value: `${submissionRate}%`, change: '+2.1%' },
          { name: 'Faculty Guidance Rate', value: '98.5%', change: '+1.5%' },
        ],
      },
      'Performance metrics calculated successfully'
    );
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch performance metrics');
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
      guide: { $in: facultyIds },
    });
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
    const todayMeetingsCount = await meetingRepository.count({
      guide: { $in: facultyIds },
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    const recentProjects = await projectRepository.findAll(
      { guide: { $in: facultyIds } },
      {
        sort: { updatedAt: -1 },
        limit: 5,
        populate: 'createdBy',
      }
    );

    const todayMeetings = await getTodayMeetings({
      guide: { $in: facultyIds },
    });

    return response(
      false,
      {
        totalProjects: totalProjectsCount,
        myProjects: myProjectsCount,
        activeStudents: assignedStudentsCount,
        pendingReviews: pendingReviewsCount,
        todayMeetings: todayMeetings.map((m) => ({
          id: m._id,
          title: m.title,
          time: m.time,
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
          time: m.time,
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
