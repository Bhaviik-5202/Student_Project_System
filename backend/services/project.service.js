const projectRepository = require("../repositories/project.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create a new project record
 * @param {Object} data - Project data payload
 * @returns {Promise<Object>} Formatted service response with new project data
 */
exports.create = async (data) => {
  try {
    const project = await projectRepository.create(data);
    return response(false, project, "Project created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create project");
  }
};

/**
 * Retrieve all projects with pagination and active filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Current page number
 * @param {number} params.limit - Records per page
 * @param {Object} params.filters - Mongoose filter object
 * @returns {Promise<Object>} Formatted service response with paginated results
 */
exports.getAll = async ({ page = 1, limit = 10, filters = {} } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      projectRepository.findAll(filters, {
        skip,
        limit,
        sort: { createdAt: -1 },
        populate: "guide members",
      }),
      projectRepository.count(filters),
    ]);
    return response(
      false,
      {
        projects,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Projects fetched successfully",
    );
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch projects");
  }
};

/**
 * Fetch a single project by its unique ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Formatted service response with project details
 */
exports.getById = async (idOrSlug) => {
  try {
    let project;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

    if (isValidObjectId) {
      project = await projectRepository.findById(idOrSlug, {
        populate: "guide members",
      });
    }

    if (!project) {
      project = await projectRepository.findOne({ slug: idOrSlug }, {
        populate: "guide members",
      });
    }

    if (!project) return response(true, null, "Project not found");
    return response(false, project, "Project fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch project");
  }
};

/**
 * Helper to resolve an ID or Slug to a Project document
 */
const resolveProject = async (idOrSlug) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  if (isValidObjectId) {
    const project = await projectRepository.findById(idOrSlug);
    if (project) return project;
  }
  return await projectRepository.findOne({ slug: idOrSlug });
};

/**
 * Update existing project metadata or state
 * @param {string} id - Project ID
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with updated project
 */
exports.update = async (idOrSlug, data) => {
  try {
    const project = await resolveProject(idOrSlug);
    if (!project) return response(true, null, "Project not found");

    const updated = await projectRepository.update(project._id, data);
    
    // Populate the updated project record
    const populated = await projectRepository.findById(project._id, {
      populate: "guide members",
    });
    
    return response(false, populated, "Project updated successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to update project");
  }
};

/**
 * Permanently remove a project from the system
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (idOrSlug) => {
  try {
    const project = await resolveProject(idOrSlug);
    if (!project) return response(true, null, "Project not found");
    
    await projectRepository.remove(project._id);
    return response(false, null, "Project deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete project");
  }
};

/**
 * Retrieve a list of all members associated with a project
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Formatted service response with members list
 */
exports.getMembers = async (id) => {
  try {
    const project = await projectRepository.findById(id, {
      populate: "members",
    });
    if (!project) return response(true, null, "Project not found");
    return response(false, project.members, "Members fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch members");
  }
};

/**
 * Add a user to the project's member list
 * @param {string} id - Project ID
 * @param {string} userId - User ID to add
 * @returns {Promise<Object>} Formatted service response with updated project details
 */
exports.addMember = async (id, userId) => {
  try {
    const project = await projectRepository.update(id, {
      $addToSet: { members: userId },
    });
    if (!project) return response(true, null, "Project not found");
    // Re-populate members
    const updatedProject = await projectRepository.findById(id, {
      populate: "members",
    });
    return response(false, updatedProject, "Member added successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to add member");
  }
};
