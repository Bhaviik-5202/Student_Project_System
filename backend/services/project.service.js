/**
 * Project Service
 * Clean Architecture service layer encapsulating all business logic for Project Management.
 */
const projectRepository = require('../repositories/project.repository');
const User = require('../models/user.model');
const notificationService = require('./notification.service');

class ProjectService {
  /**
   * Create a new project
   */
  async createProject(projectData, currentUser) {
    // Validate project title
    if (!projectData.title || !projectData.title.trim()) {
      throw new Error('Project title is required');
    }

    // Auto-generate project code if not provided
    if (!projectData.code) {
      const year = new Date().getFullYear();
      const count = await projectRepository.count({});
      projectData.code = `PRJ-${year}-${String(count + 1).padStart(3, '0')}`;
    } else {
      // Check for code conflict
      const existingCode = await projectRepository.findOne({
        code: projectData.code.trim().toUpperCase(),
      });
      if (existingCode) {
        throw new Error(`Project code '${projectData.code}' is already in use`);
      }
    }

    // Process members if provided
    let memberIds = [];
    if (Array.isArray(projectData.members) && projectData.members.length > 0) {
      memberIds = projectData.members.filter(Boolean);
    } else if (currentUser.role === 'student') {
      memberIds = [currentUser._id || currentUser.id];
    }

    // Set project leader
    const leaderId =
      projectData.leader ||
      (memberIds.length > 0 ? memberIds[0] : currentUser._id);

    // Initial activity timeline
    const initialTimeline = [
      {
        action: 'Project Created',
        details: `Created by ${currentUser.name || 'User'} (${currentUser.role})`,
        performedBy: currentUser._id || currentUser.id,
        timestamp: new Date(),
      },
    ];

    const payload = {
      ...projectData,
      code: projectData.code.trim().toUpperCase(),
      members: memberIds,
      leader: leaderId,
      createdBy: currentUser._id || currentUser.id,
      lastUpdatedBy: currentUser._id || currentUser.id,
      activityTimeline: initialTimeline,
      status: projectData.status || 'assigned',
      progress: Number(projectData.progress) || 0,
    };

    const newProject = await projectRepository.create(payload);

    if (memberIds.length > 0) {
      memberIds.forEach(memberId => {
        if (memberId.toString() !== (currentUser._id || currentUser.id).toString()) {
          notificationService.create({
            user: memberId,
            message: `You have been added to a new project: ${projectData.title}`,
            type: 'info',
            metadata: { type: 'project', projectId: newProject._id, link: `/projects/${newProject._id}` }
          }).catch(err => console.error('Notification failed:', err));
        }
      });
    }

    notificationService.notifyAdmins({
      message: `New project created: ${newProject.title}`,
      type: 'success',
      metadata: { type: 'project', projectId: newProject._id, link: `/projects/${newProject._id}` }
    });

    return newProject;
  }

  /**
   * Retrieve projects with search, filtering, and role-based scoping
   */
  async getAllProjects(queryParams = {}, currentUser = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      category,
      projectType,
      department,
      semester,
      academicYear,
      guide,
      student,
      isArchived,
      sort = '-createdAt',
    } = queryParams;

    // Build filter object
    const filter = {};

    // Archival state
    if (isArchived === 'true' || isArchived === true) {
      filter.isArchived = true;
    } else if (isArchived === 'false' || isArchived === false || !isArchived) {
      filter.isArchived = { $ne: true };
    }

    // Role-based visibility scoping
    if (currentUser.role === 'student') {
      // Students see projects where they are a member or leader or createdBy
      filter.$or = [
        { members: currentUser._id || currentUser.id },
        { leader: currentUser._id || currentUser.id },
        { createdBy: currentUser._id || currentUser.id },
      ];
    } else if (currentUser.role === 'faculty') {
      const facultyId = currentUser._id || currentUser.id;
      filter.$or = [
        { guide: facultyId },
        { coGuide: facultyId },
      ];
    }

    // Specific filters
    if (status && status !== 'All') filter.status = status.toLowerCase();
    if (category && category !== 'All') filter.category = category;
    if (projectType && projectType !== 'All') filter.projectType = projectType;
    if (department && department !== 'All') filter.department = department;
    if (semester && semester !== 'All') filter.semester = semester;
    if (academicYear && academicYear !== 'All')
      filter.academicYear = academicYear;
    if (guide) filter.guide = guide;
    if (student) filter.members = student;

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { title: searchRegex },
        { code: searchRegex },
        { category: searchRegex },
        { projectType: searchRegex },
        { technologies: searchRegex },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    // Sorting format
    let sortObj = { createdAt: -1 };
    if (sort) {
      if (sort === 'title_asc') sortObj = { title: 1 };
      else if (sort === 'title_desc') sortObj = { title: -1 };
      else if (sort === 'progress_asc') sortObj = { progress: 1 };
      else if (sort === 'progress_desc') sortObj = { progress: -1 };
      else if (sort === 'oldest') sortObj = { createdAt: 1 };
    }

    return await projectRepository.findAll(filter, {
      page: Number(page),
      limit: Number(limit),
      sort: sortObj,
    });
  }

  /**
   * Get single project details by ID or Slug
   */
  async getProjectById(idOrSlug, currentUser = {}) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  /**
   * Update project
   */
  async updateProject(idOrSlug, updateData, currentUser) {
    const existing = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!existing) {
      throw new Error('Project not found');
    }

    // Check code conflict if code is modified
    if (
      updateData.code &&
      updateData.code.trim().toUpperCase() !== existing.code
    ) {
      const codeCheck = await projectRepository.findOne({
        code: updateData.code.trim().toUpperCase(),
        _id: { $ne: existing._id },
      });
      if (codeCheck) {
        throw new Error(`Project code '${updateData.code}' is already in use`);
      }
      updateData.code = updateData.code.trim().toUpperCase();
    }

    // Prepare timeline entry
    const newTimelineEntry = {
      action: 'Project Updated',
      details: `Updated attributes by ${currentUser.name || 'User'}`,
      performedBy: currentUser._id || currentUser.id,
      timestamp: new Date(),
    };

    const payload = {
      ...updateData,
      lastUpdatedBy: currentUser._id || currentUser.id,
      $push: { activityTimeline: newTimelineEntry },
    };

    const updatedProject = await projectRepository.update(existing._id, payload);

    const membersToNotify = [
      ...(updatedProject.members || []),
      ...(updatedProject.guide ? [updatedProject.guide] : [])
    ];
    membersToNotify.forEach(userId => {
      if (userId && userId.toString() !== (currentUser._id || currentUser.id).toString()) {
        notificationService.create({
          user: userId,
          message: `Project '${updatedProject.title}' has been updated`,
          type: 'info',
          metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
        }).catch(err => console.error('Notification failed:', err));
      }
    });

    notificationService.notifyAdmins({
      message: `Project '${updatedProject.title}' has been updated`,
      type: 'info',
      metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
    });

    return updatedProject;
  }

  /**
   * Delete project
   */
  async deleteProject(idOrSlug, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) {
      throw new Error('Project not found');
    }

    if (currentUser.role !== 'admin' && currentUser.role !== 'faculty') {
      throw new Error('Only faculty or administrators can delete projects');
    }

    return await projectRepository.delete(project._id);
  }

  /**
   * Archive project
   */
  async archiveProject(idOrSlug, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    const payload = {
      isArchived: true,
      archivedAt: new Date(),
      status: 'archived',
      lastUpdatedBy: currentUser._id || currentUser.id,
      $push: {
        activityTimeline: {
          action: 'Project Archived',
          details: `Archived by ${currentUser.name || 'User'}`,
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
    };

    return await projectRepository.update(project._id, payload);
  }

  /**
   * Restore archived project
   */
  async restoreProject(idOrSlug, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    const payload = {
      isArchived: false,
      archivedAt: null,
      status: 'in_progress',
      lastUpdatedBy: currentUser._id || currentUser.id,
      $push: {
        activityTimeline: {
          action: 'Project Restored',
          details: `Restored from archives by ${currentUser.name || 'User'}`,
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
    };

    return await projectRepository.update(project._id, payload);
  }

  /**
   * Assign or update student members
   */
  async assignStudents(idOrSlug, studentIds = [], currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    // Deduplicate student IDs
    const uniqueStudentIds = [...new Set(studentIds.filter(Boolean))];

    // Verify active students
    if (uniqueStudentIds.length > 0) {
      const validStudents = await User.find({
        _id: { $in: uniqueStudentIds },
        role: 'student',
        status: 'active',
      });

      if (validStudents.length !== uniqueStudentIds.length) {
        throw new Error(
          'One or more selected students are invalid or inactive'
        );
      }
    }

    const payload = {
      members: uniqueStudentIds,
      leader: uniqueStudentIds.length > 0 ? uniqueStudentIds[0] : null,
      lastUpdatedBy: currentUser._id || currentUser.id,
      $push: {
        activityTimeline: {
          action: 'Team Members Updated',
          details: `Assigned ${uniqueStudentIds.length} student members`,
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
    };

    const updatedProject = await projectRepository.update(project._id, payload);

    uniqueStudentIds.forEach(studentId => {
      if (studentId.toString() !== (currentUser._id || currentUser.id).toString()) {
        notificationService.create({
          user: studentId,
          message: `You have been assigned to project: ${updatedProject.title}`,
          type: 'info',
          metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
        }).catch(console.error);
      }
    });

    return updatedProject;
  }

  /**
   * Assign or update faculty guide
   */
  async assignGuide(idOrSlug, guideId, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    if (guideId) {
      const guideUser = await User.findOne({
        _id: guideId,
        role: 'faculty',
        status: 'active',
      });
      if (!guideUser) {
        throw new Error('Selected faculty guide is invalid or inactive');
      }
    }

    const payload = {
      guide: guideId || null,
      lastUpdatedBy: currentUser._id || currentUser.id,
      $push: {
        activityTimeline: {
          action: 'Guide Assigned',
          details: guideId
            ? 'Faculty mentor allocated'
            : 'Faculty mentor unassigned',
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
    };

    const updatedProject = await projectRepository.update(project._id, payload);

    if (guideId) {
      notificationService.create({
        user: guideId,
        message: `You have been allocated as guide for project: ${updatedProject.title}`,
        type: 'info',
        metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
      }).catch(console.error);
    }
    if (updatedProject.members) {
      updatedProject.members.forEach(memberId => {
        notificationService.create({
          user: memberId,
          message: guideId ? `A faculty guide has been allocated to your project: ${updatedProject.title}` : `Faculty guide has been unassigned from project: ${updatedProject.title}`,
          type: 'info',
          metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
        }).catch(console.error);
      });
    }

    notificationService.notifyAdmins({
      message: guideId ? `Faculty guide allocated to project: ${updatedProject.title}` : `Faculty guide unassigned from project: ${updatedProject.title}`,
      type: 'info',
      metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
    });

    return updatedProject;
  }

  /**
   * Update progress percentage & status
   */
  async updateProgress(idOrSlug, { progress, status, note }, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    const newProgress = Math.min(100, Math.max(0, Number(progress) || 0));
    let newStatus = status || project.status;

    if (newProgress === 100 && newStatus !== 'completed') {
      newStatus = 'completed';
    }

    const payload = {
      progress: newProgress,
      status: newStatus,
      lastUpdatedBy: currentUser._id || currentUser.id,
      $push: {
        activityTimeline: {
          action: 'Progress Updated',
          details: `Progress set to ${newProgress}%. Status: ${newStatus}.${note ? ` Note: ${note}` : ''}`,
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
    };

    if (newProgress === 100) {
      payload.completionDate = new Date();
    }

    const updatedProject = await projectRepository.update(project._id, payload);

    const notifyUsers = [
      ...(updatedProject.members || []),
      ...(updatedProject.guide ? [updatedProject.guide] : [])
    ];
    notifyUsers.forEach(userId => {
      if (userId && userId.toString() !== (currentUser._id || currentUser.id).toString()) {
        notificationService.create({
          user: userId,
          message: `Project '${updatedProject.title}' progress updated to ${newProgress}%`,
          type: newProgress === 100 ? 'success' : 'info',
          metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
        }).catch(console.error);
      }
    });

    return updatedProject;
  }

  /**
   * Add file to project
   */
  async addProjectFile(idOrSlug, fileData, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    const fileObj = {
      name: fileData.name,
      url: fileData.url,
      fileType: fileData.fileType || 'Document',
      size: fileData.size || 'N/A',
      uploadedBy: currentUser._id || currentUser.id,
      uploadedAt: new Date(),
    };

    const payload = {
      $push: {
        files: fileObj,
        activityTimeline: {
          action: 'File Uploaded',
          details: `Uploaded file '${fileData.name}'`,
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
      lastUpdatedBy: currentUser._id || currentUser.id,
    };

    const updatedProject = await projectRepository.update(project._id, payload);

    const notifyUsers = [
      ...(updatedProject.members || []),
      ...(updatedProject.guide ? [updatedProject.guide] : [])
    ];
    notifyUsers.forEach(userId => {
      if (userId && userId.toString() !== (currentUser._id || currentUser.id).toString()) {
        notificationService.create({
          user: userId,
          message: `New file '${fileData.name}' uploaded to project '${updatedProject.title}'`,
          type: 'info',
          metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
        }).catch(console.error);
      }
    });

    return updatedProject;
  }

  /**
   * Delete file from project
   */
  async removeProjectFile(idOrSlug, fileId, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    const payload = {
      $pull: { files: { _id: fileId } },
      $push: {
        activityTimeline: {
          action: 'File Removed',
          details: 'A project document was removed',
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
      lastUpdatedBy: currentUser._id || currentUser.id,
    };

    return await projectRepository.update(project._id, payload);
  }

  /**
   * Add faculty evaluation review
   */
  async addProjectReview(idOrSlug, reviewData, currentUser) {
    const project = await projectRepository.findByIdOrSlug(idOrSlug);
    if (!project) throw new Error('Project not found');

    const reviewObj = {
      reviewer: currentUser._id || currentUser.id,
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || 'Review recorded.',
      milestone: reviewData.milestone || 'General Evaluation',
      date: new Date(),
    };

    const payload = {
      $push: {
        reviews: reviewObj,
        activityTimeline: {
          action: 'Review Added',
          details: `Review rated ${reviewData.rating}/5 stars for ${reviewData.milestone || 'Evaluation'}`,
          performedBy: currentUser._id || currentUser.id,
          timestamp: new Date(),
        },
      },
      lastUpdatedBy: currentUser._id || currentUser.id,
    };

    const updatedProject = await projectRepository.update(project._id, payload);

    if (updatedProject.members) {
      updatedProject.members.forEach(memberId => {
        notificationService.create({
          user: memberId,
          message: `New faculty review added to your project '${updatedProject.title}'`,
          type: 'info',
          metadata: { type: 'project', projectId: updatedProject._id, link: `/projects/${updatedProject._id}` }
        }).catch(console.error);
      });
    }

    return updatedProject;
  }

  /**
   * Get project stats
   */
  async getDashboardStats(currentUser) {
    const filter = {};
    if (currentUser.role === 'student') {
      filter.$or = [
        { members: currentUser._id || currentUser.id },
        { leader: currentUser._id || currentUser.id },
      ];
    } else if (currentUser.role === 'faculty') {
      filter.guide = currentUser._id || currentUser.id;
    }

    return await projectRepository.getDashboardStats(filter);
  }

  /**
   * Active student dropdown selector query
   */
  async getActiveStudents(search = '') {
    const filter = { role: 'student', status: 'active' };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { studentId: new RegExp(search, 'i') },
        { department: new RegExp(search, 'i') },
      ];
    }
    return await User.find(filter)
      .select('name email avatar studentId department rollNumber status')
      .limit(30)
      .lean();
  }

  /**
   * Active faculty dropdown selector query
   */
  async getActiveFaculty(search = '') {
    const filter = { role: 'faculty', status: 'active' };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { department: new RegExp(search, 'i') },
      ];
    }
    return await User.find(filter)
      .select('name email avatar designation department status')
      .limit(30)
      .lean();
  }
}

module.exports = new ProjectService();
