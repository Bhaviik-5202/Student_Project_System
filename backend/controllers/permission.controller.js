const permissionService = require("../services/permission.service");
const sendResponse = require("../utils/response");

/**
 * Create a new permission
 * @route POST /permissions
 * @access Admin
 */
exports.createPermission = async (req, res) => {
  try {
    const result = await permissionService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create permission"
          : "Permission created successfully",
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
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get all permissions
 * @route GET /permissions
 * @access Admin
 */
exports.getAllPermissions = async (req, res) => {
  try {
    const result = await permissionService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch permissions"
          : "Permissions fetched successfully",
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
 * Get a permission by ID
 * @route GET /permissions/:id
 * @access Admin
 */
exports.getPermissionById = async (req, res) => {
  try {
    const result = await permissionService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Permission not found"
          : "Permission fetched successfully",
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
 * Update a permission by ID
 * @route PUT /permissions/:id
 * @access Admin
 */
exports.updatePermission = async (req, res) => {
  try {
    const result = await permissionService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update permission"
          : "Permission updated successfully",
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
 * Delete a permission by ID
 * @route DELETE /permissions/:id
 * @access Admin
 */
exports.deletePermission = async (req, res) => {
  try {
    const result = await permissionService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete permission"
          : "Permission deleted successfully",
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
