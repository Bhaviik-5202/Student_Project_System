const projectService = require("../services/project.service");
const sendResponse = require("../utils/response");

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
          ? "Failed to fetch project members"
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
    const { userId, role } = req.body;

    if (!userId || !role) {
      return sendResponse(
        res,
        {
          success: false,
          message: "userId and role are required",
          data: null,
          error: "Validation error",
        },
        400,
      );
    }

    const result = await projectService.addMember(req.params.id, userId, role);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to add member"
          : "Member added successfully",
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
    const project = await projectService.createProject(req.body);

    sendResponse(
      res,
      {
        success: true,
        message: "Project created successfully",
        data: project,
        error: null,
      },
      201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to create project",
        data: null,
        error: error.message,
      },
      400,
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
    const { page = 1, limit = 10, status, title } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (title) filters.title = { $regex: title, $options: "i" };

    const result = await projectService.getAllProjects({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      filters,
    });

    sendResponse(
      res,
      {
        success: true,
        message: "Projects fetched successfully",
        data: result.projects,
        error: null,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch projects",
        data: null,
        error: error.message,
      },
      400,
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
    const project = await projectService.getProjectById(req.params.id);

    sendResponse(
      res,
      {
        success: true,
        message: "Project fetched successfully",
        data: project,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch project",
        data: null,
        error: error.message,
      },
      400,
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
    const project = await projectService.updateProject(req.params.id, req.body);

    if (!project) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Project not found",
          data: null,
          error: "Invalid project ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Project updated successfully",
        data: project,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to update project",
        data: null,
        error: error.message,
      },
      400,
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
    const project = await projectService.deleteProject(req.params.id);

    if (!project) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Project not found",
          data: null,
          error: "Invalid project ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Project deleted successfully",
        data: project,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to delete project",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};
