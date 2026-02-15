const Project = require("../models/project.model");

/**
 * Create a new project
 * @param {Object} data - Project data
 * @returns {Promise<Object>} Created project
 */
exports.createProject = async (data) => {
  try {
    const project = new Project(data);
    const savedProject = await project.save();
    return savedProject;
  } catch (err) {
    throw new Error(err.message || "Failed to create project");
  }
};

/**
 * Get all projects with pagination and filters
 * @param {Object} params - Pagination and filter params
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @param {Object} params.filters - Filter object
 * @returns {Promise<Object>} Paginated projects
 */
exports.getAllProjects = async ({ page = 1, limit = 10, filters = {} }) => {
  try {
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
  } catch (err) {
    throw new Error(err.message || "Failed to fetch projects");
  }
};

/**
 * Get a project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Project or null
 */
exports.getProjectById = async (id) => {
  try {
    return await Project.findById(id);
  } catch (err) {
    throw new Error(err.message || "Failed to fetch project");
  }
};

/**
 * Update a project by ID
 * @param {string} id - Project ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated project or null
 */
exports.updateProject = async (id, data) => {
  try {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    throw new Error(err.message || "Failed to update project");
  }
};

/**
 * Delete a project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Deleted project or null
 */
exports.deleteProject = async (id) => {
  try {
    return await Project.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err.message || "Failed to delete project");
  }
};
