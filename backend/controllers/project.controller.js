const projectService = require("../services/project.service");
const sendResponse = require("../utils/response");

/**
 * Project Controller
 * Manages student projects, including creation, listing, updates, and member management.
 */

/**
 * Get all members of a project
 * @route GET /projects/:id/members
 * @access Authenticated
 */
exports.getProjectMembers = async (req, res) => {
  try {
    const result = await projectService.getMembers(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : "Project members fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Add a member to a project
 * @route POST /projects/:id/members
 * @access Admin, Faculty
 */
exports.addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "userId is required",
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const result = await projectService.addMember(req.params.id, userId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Member added successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Create a new project
 * @route POST /projects
 * @access Admin, Faculty
 */
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user.id,
      document: req.file ? req.file.path : undefined,
    };

    const result = await projectService.create(projectData);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Project created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get all projects with pagination and filtering
 * @route GET /projects
 * @access Authenticated
 */
exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const result = await projectService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      filters,
    });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : "Projects fetched successfully",
        data: result.data ? result.data.projects : null,
        error: result.error || null,
        pagination: result.data
          ? {
              total: result.data.total,
              page: result.data.page,
              limit: result.data.limit,
              totalPages: result.data.totalPages,
            }
          : null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get a project by its ID
 * @route GET /projects/:id
 * @access Authenticated
 */
exports.getProjectById = async (req, res) => {
  try {
    const result = await projectService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Project fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Update a project by its ID
 * @route PUT /projects/:id
 * @access Admin, Faculty
 */
exports.updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.document = req.file.path;
    }
    const result = await projectService.update(req.params.id, updateData);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Project updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Delete a project by its ID
 * @route DELETE /projects/:id
 * @access Admin, Faculty
 */
exports.deleteProject = async (req, res) => {
  try {
    const result = await projectService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Project deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
