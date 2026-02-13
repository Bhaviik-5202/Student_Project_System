const resourceService = require("../services/resourceService");
const ApiError = require("../utils/ApiError");

// Get all resources
exports.getAllResources = async (req, res, next) => {
  try {
    const resources = await resourceService.findAll();
    return res.json({ success: true, data: resources });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch resources", [err.message]));
  }
};

// Get resource by ID
exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await resourceService.findById(req.params.id);
    if (!resource) return next(new ApiError(404, "Resource not found"));
    return res.json({ success: true, data: resource });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch resource", [err.message]));
  }
};

// Upload resource
exports.uploadResource = async (req, res, next) => {
  try {
    const resource = await resourceService.create(req.body);
    return res.status(201).json({ success: true, data: resource });
  } catch (err) {
    return next(new ApiError(400, "Failed to upload resource", [err.message]));
  }
};

// Delete resource
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await resourceService.remove(req.params.id);
    if (!resource) return next(new ApiError(404, "Resource not found"));
    return res.json({ success: true, message: "Resource deleted" });
  } catch (err) {
    return next(new ApiError(500, "Failed to delete resource", [err.message]));
  }
};
