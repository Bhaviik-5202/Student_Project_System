/**
 * Project Controller
 * HTTP Request Handler delegating to ProjectService using standardized response helpers.
 */
const projectService = require('../services/project.service');
const sendResponse = require('../utils/response');

class ProjectController {
  /**
   * Create new project
   */
  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.body, req.user);
      return sendResponse(
        res,
        {
          success: true,
          message: 'Project created successfully',
          data: project,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get list of projects with pagination, filters & search
   */
  async getAllProjects(req, res, next) {
    try {
      const result = await projectService.getAllProjects(req.query, req.user);
      return sendResponse(res, {
        success: true,
        message: 'Projects retrieved successfully',
        data: result.projects,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single project by ID or Slug
   */
  async getProjectById(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.id, req.user);
      return sendResponse(res, {
        success: true,
        message: 'Project details retrieved',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update project
   */
  async updateProject(req, res, next) {
    try {
      const updated = await projectService.updateProject(
        req.params.id,
        req.body,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Project updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete project
   */
  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.params.id, req.user);
      return sendResponse(res, {
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Archive project
   */
  async archiveProject(req, res, next) {
    try {
      const archived = await projectService.archiveProject(
        req.params.id,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Project archived successfully',
        data: archived,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restore archived project
   */
  async restoreProject(req, res, next) {
    try {
      const restored = await projectService.restoreProject(
        req.params.id,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Project restored from archives',
        data: restored,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign or update students
   */
  async assignStudents(req, res, next) {
    try {
      const { studentIds } = req.body;
      const updated = await projectService.assignStudents(
        req.params.id,
        studentIds || [],
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Student team updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign or update faculty guide
   */
  async assignGuide(req, res, next) {
    try {
      const { guideId } = req.body;
      const updated = await projectService.assignGuide(
        req.params.id,
        guideId,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Faculty guide updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update project progress & status
   */
  async updateProgress(req, res, next) {
    try {
      const updated = await projectService.updateProgress(
        req.params.id,
        req.body,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Project progress updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add project file
   */
  async addProjectFile(req, res, next) {
    try {
      const updated = await projectService.addProjectFile(
        req.params.id,
        req.body,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'File uploaded successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove project file
   */
  async removeProjectFile(req, res, next) {
    try {
      const updated = await projectService.removeProjectFile(
        req.params.id,
        req.params.fileId,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'File removed successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add review / evaluation
   */
  async addProjectReview(req, res, next) {
    try {
      const updated = await projectService.addProjectReview(
        req.params.id,
        req.body,
        req.user
      );
      return sendResponse(res, {
        success: true,
        message: 'Evaluation review recorded successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardStats(req, res, next) {
    try {
      const stats = await projectService.getDashboardStats(req.user);
      return sendResponse(res, {
        success: true,
        message: 'Project dashboard metrics retrieved',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Active students list for dropdown assignment
   */
  async getActiveStudents(req, res, next) {
    try {
      const students = await projectService.getActiveStudents(req.query.search);
      return sendResponse(res, {
        success: true,
        message: 'Active students retrieved',
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Active faculty list for guide dropdown
   */
  async getActiveFaculty(req, res, next) {
    try {
      const faculty = await projectService.getActiveFaculty(req.query.search);
      return sendResponse(res, {
        success: true,
        message: 'Active faculty guides retrieved',
        data: faculty,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get projects formatted as groups
   */
  async getProjectGroups(req, res, next) {
    try {
      const result = await projectService.getAllProjects(req.query, req.user);
      return sendResponse(res, {
        success: true,
        message: 'Project groups retrieved successfully',
        data: result.projects || result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
