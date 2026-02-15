
// Controller for project-related endpoints
const projectService = require("../services/project.service");
const sendResponse = require("../utils/response");


/**
 * Create a new project
 * @route POST /projects
 * @access Admin, Faculty
 */
exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    sendResponse(res, { error: false, data: project, message: "Project created" }, 201);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to create project" }, 400);
  }
};


/**
 * Get all projects with pagination and filtering
 * @route GET /projects
 * @access Authenticated
 * @query page, limit, status, title
 */
exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, title } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (title) filters.title = { $regex: title, $options: 'i' };
    const result = await projectService.getAllProjects({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      filters
    });
    sendResponse(res, {
      error: false,
      data: result.projects,
      message: "Projects fetched",
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to fetch projects" }, 400);
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
    sendResponse(res, { error: false, data: project, message: "Project fetched" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to fetch project" }, 400);
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
      return sendResponse(res, { error: true, data: null, message: "Project not found" }, 404);
    }
    sendResponse(res, { error: false, data: project, message: "Project updated" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to update project" }, 400);
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
      return sendResponse(res, { error: true, data: null, message: "Project not found" }, 404);
    }
    sendResponse(res, { error: false, data: project, message: "Project deleted" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to delete project" }, 400);
  }
};
