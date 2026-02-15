// services/project.service.js
const Project = require("../models/project.model");

/**
 * Create a new project
 * @param {Object} data - Project data
 * @returns {Promise<Object>} Created project
 */
exports.createProject = async (data) => {
  const project = new Project(data);
  return await project.save();
};

/**
 * Get all projects with pagination and filters
 * @param {Object} params - Pagination and filter params
 * @returns {Promise<Object>} Paginated projects
 */
exports.getAllProjects = async ({ page = 1, limit = 10, filters = {} }) => {
  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    Project.find(filters).skip(skip).limit(limit),
    Project.countDocuments(filters),
  ]);
  return {
    projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Project or null
 */
exports.getProjectById = async (id) => {
  return await Project.findById(id);
};

/**
 * Update a project by ID
 * @param {string} id - Project ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated project or null
 */
exports.updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete a project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Deleted project or null
 */
exports.deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};
