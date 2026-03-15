const resourceService = require("../services/resource.service");
const sendResponse = require("../utils/response");

/**
 * Resource Controller
 * Manages shared learning materials, project documentation, and digital assets.
 */

/**
 * Register a new learning resource or document
 * @route POST /resources
 * @access Admin, Faculty
 */
exports.createResource = async (req, res) => {
  try {
    const result = await resourceService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : "Resource created successfully",
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
        message: "Failed to create resource",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Fetch all available resources across all categories
 * @route GET /resources
 * @access Authenticated
 */
exports.getAllResources = async (req, res) => {
  try {
    const result = await resourceService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch resources"
          : "Resources fetched successfully",
        data: result.data || null,
        error: result.error || null,
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
 * Get detailed information for a specific resource
 * @route GET /resources/:id
 * @access Authenticated
 */
exports.getResourceById = async (req, res) => {
  try {
    const result = await resourceService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Resource not found"
          : "Resource fetched successfully",
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
 * Update resource metadata or download link
 * @route PUT /resources/:id
 * @access Admin, Faculty
 */
exports.updateResource = async (req, res) => {
  try {
    const result = await resourceService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Resource not found"
          : "Resource updated successfully",
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
 * Permanently remove a resource
 * @route DELETE /resources/:id
 * @access Admin
 */
exports.deleteResource = async (req, res) => {
  try {
    const result = await resourceService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Resource not found"
          : "Resource deleted successfully",
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
