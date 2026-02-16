const resourceService = require("../services/resource.service");
const sendResponse = require("../utils/response");

/**
 * Create a new resource
 * @route POST /resources
 */
exports.createResource = async (req, res) => {
  try {
    const resource = await resourceService.createResource(req.body);

    sendResponse(
      res,
      {
        success: true,
        message: "Resource created successfully",
        data: resource,
        error: null,
      },
      201,
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
 * Get all resources with pagination and filtering
 * @route GET /resources
 */
exports.getAllResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, title } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (title) filters.title = { $regex: title, $options: "i" };

    const result = await resourceService.getAllResources({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      filters,
    });

    sendResponse(
      res,
      {
        success: true,
        message: "Resources fetched successfully",
        data: result.resources,
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
        message: "Failed to fetch resources",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Get a resource by its ID
 * @route GET /resources/:id
 */
exports.getResourceById = async (req, res) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);

    sendResponse(
      res,
      {
        success: true,
        message: "Resource fetched successfully",
        data: resource,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch resource",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Delete a resource by its ID
 * @route DELETE /resources/:id
 */
exports.deleteResource = async (req, res) => {
  try {
    const resource = await resourceService.deleteResource(req.params.id);

    sendResponse(
      res,
      {
        success: true,
        message: "Resource deleted successfully",
        data: resource,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to delete resource",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};
