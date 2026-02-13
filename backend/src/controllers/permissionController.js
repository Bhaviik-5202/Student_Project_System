const permissionService = require("../services/permissionService");
const ApiError = require("../utils/ApiError");

// Get all permissions
exports.getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await permissionService.findAll();
    return res.json({ success: true, data: permissions });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch permissions", [err.message]),
    );
  }
};

// Get permissions by user
exports.getPermissionsByUser = async (req, res, next) => {
  try {
    const permissions = await permissionService.findByUser(req.params.userId);
    return res.json({ success: true, data: permissions });
  } catch (err) {
    return next(
      new ApiError(500, "Failed to fetch permissions by user", [err.message]),
    );
  }
};

// Set permission
exports.setPermission = async (req, res, next) => {
  try {
    const permission = await permissionService.set(req.body);
    return res.status(201).json({ success: true, data: permission });
  } catch (err) {
    return next(new ApiError(400, "Failed to set permission", [err.message]));
  }
};
