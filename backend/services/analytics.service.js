const projectRepository = require("../repositories/project.repository");
const userRepository = require("../repositories/user.repository");

/**
 * Standardized response helper
 */
const response = (error, data, message) => ({ error, data, message });

exports.getDashboardStats = async () => {
  try {
    const totalUsers = await userRepository.count();
    const activeProjects = await projectRepository.findAll({ status: "active" });
    const pendingApprovals = await projectRepository.findAll({ status: "pending" });
    
    // Recent activities (mapped from projects)
    const recentProjects = await projectRepository.findAll({}, {
        sort: { updatedAt: -1 },
        limit: 5,
        populate: "owner"
    });

    return response(false, {
      totalUsers,
      activeProjects: activeProjects.length,
      pendingApprovals: pendingApprovals.length,
      systemHealth: 99,
      recentActivities: recentProjects.map(p => ({
          title: p.title,
          updatedAt: p.updatedAt,
          owner: p.owner ? { name: p.owner.name } : null,
          status: p.status
      }))
    }, "Dashboard statistics fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch dashboard statistics");
  }
};

exports.getFacultyDashboardStats = async (facultyId) => {
    try {
        const myProjects = await projectRepository.findAll({ faculty: facultyId });
        const activeStudents = await userRepository.count({ role: "student", status: "active" });
        const pendingReviews = await projectRepository.findAll({ faculty: facultyId, status: "submitted" });

        const recentProjects = await projectRepository.findAll({ faculty: facultyId }, {
            sort: { updatedAt: -1 },
            limit: 5,
            populate: "owner"
        });

        return response(false, {
            myProjects: myProjects.length,
            activeStudents,
            pendingReviews: pendingReviews.length,
            todayMeetings: 2,
            recentActivities: recentProjects.map(p => ({
                title: p.title,
                updatedAt: p.updatedAt,
                owner: p.owner ? { name: p.owner.name } : null,
                status: p.status
            }))
        }, "Faculty dashboard statistics fetched successfully");
    } catch (err) {
        return response(true, null, err.message || "Failed to fetch faculty statistics");
    }
};

exports.getStudentDashboardStats = async (studentId) => {
    try {
        const myProjects = await projectRepository.findAll({ owner: studentId });
        
        const recentProjects = await projectRepository.findAll({ owner: studentId }, {
            sort: { updatedAt: -1 },
            limit: 5
        });

        return response(false, {
            myProjects: myProjects.length,
            completedAssignments: 15,
            upcomingDeadlines: 3,
            currentGrade: "A-",
            recentActivities: recentProjects.map(p => ({
                title: p.title,
                updatedAt: p.updatedAt,
                status: p.status
            }))
        }, "Student dashboard statistics fetched successfully");
    } catch (err) {
        return response(true, null, err.message || "Failed to fetch student statistics");
    }
};
