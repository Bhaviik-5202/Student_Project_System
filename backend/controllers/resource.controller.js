const resourceService = require("../services/resource.service");
const sendResponse = require("../utils/response");

/**
 * Create a new resource
 * @route POST /resources
 */
exports.createResource = async (req, res) => {
  try {
    const resource = await resourceService.createResource(req.body);
    sendResponse(res, { error: false, data: resource, message: "Resource created" }, 201);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to create resource" }, 400);
  }
};

/**
 * Get all resources with pagination and filtering
 * @route GET /resources
 * @access Authenticated
 * @query page, limit, type, title
 */
exports.getAllResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, title } = req.query;
    const filters = {};
    if (type) filters.type = type;
    if (title) filters.title = { $regex: title, $options: 'i' };
    const result = await resourceService.getAllResources({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      filters
    });
    sendResponse(res, {
      error: false,
      data: result.resources,
      message: "Resources fetched",
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to fetch resources" }, 400);
  }
};

/**
 * Get a resource by its ID
 * @route GET /resources/:id
 * @access Authenticated
 */
exports.getResourceById = async (req, res) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    sendResponse(res, { error: false, data: resource, message: "Resource fetched" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to fetch resource" }, 400);
  }
};

/**
 * Delete a resource by its ID
 * @route DELETE /resources/:id
 * @access Authenticated
 */
exports.deleteResource = async (req, res) => {
  try {
    const resource = await resourceService.deleteResource(req.params.id);
    sendResponse(res, { error: false, data: resource, message: "Resource deleted" }, 200);
  } catch (err) {
    sendResponse(res, { error: err.message, data: null, message: "Failed to delete resource" }, 400);
  }
};
