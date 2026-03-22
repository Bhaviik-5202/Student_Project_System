const ProjectType = require("../models/projectType.model");
const sendResponse = require("../utils/response");

/**
 * ProjectType COntroller
 * Manages project types, including creation, listing, updates, and deletion.
 */

/**
 * Get all project types
 * @route GET /api/v1/projects/types
 * @access Authenticated
 */
exports.getAllProjectTypes = async (req, res) => {
  try {
    const types = await ProjectType.find({ status: "Active" }).sort({ createdAt: -1 });
    
    sendResponse(res, {
      success: true,
      message: "Project types fetched successfully",
      data: types
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Failed to fetch project types",
      error: error.message
    }, 500);
  }
};

/**
 * Get project type by id
 * @route GET /api/v1/projects/types/:id
 * @access Authenticated
 */
exports.getProjectTypeById = async (req, res) => {
  try {
    const type = await ProjectType.findById(req.params.id);
    
    if (!type) {
      return sendResponse(res, {
        success: false,
        message: "Project type not found"
      }, 404);
    }
    
    sendResponse(res, {
      success: true,
      message: "Project type fetched successfully",
      data: type
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Failed to fetch project type",
      error: error.message
    }, 500);
  }
};

/**
 * Create a new project type
 * @route POST /api/v1/projects/types
 * @access Private (Admin/Faculty)
 */
exports.createProjectType = async (req, res) => {
  try {
    const projectType = new ProjectType(req.body);
    await projectType.save();
    
    sendResponse(res, {
      success: true,
      message: "Project type created successfully",
      data: projectType
    }, 201);
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: error.code === 11000 ? "Project type already exists" : "Failed to create project type",
      error: error.message
    }, 400);
  }
};

/**
 * Update a project type
 * @route PUT /api/v1/projects/types/:id
 * @access Private (Admin/Faculty)
 */
exports.updateProjectType = async (req, res) => {
  try {
    const projectType = await ProjectType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!projectType) {
      return sendResponse(res, {
        success: false,
        message: "Project type not found"
      }, 404);
    }
    
    sendResponse(res, {
      success: true,
      message: "Project type updated successfully",
      data: projectType
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: error.code === 11000 ? "Project type already exists" : "Failed to update project type",
      error: error.message
    }, 400);
  }
};

/**
 * Delete a project type
 * @route DELETE /api/v1/projects/types/:id
 * @access Private (Admin/Faculty)
 */
exports.deleteProjectType = async (req, res) => {
  try {
    const projectType = await ProjectType.findByIdAndDelete(req.params.id);
    
    if (!projectType) {
      return sendResponse(res, {
        success: false,
        message: "Project type not found"
      }, 404);
    }
    
    sendResponse(res, {
      success: true,
      message: "Project type deleted successfully"
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Failed to delete project type",
      error: error.message
    }, 500);
  }
};
