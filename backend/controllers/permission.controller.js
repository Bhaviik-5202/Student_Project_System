const permissionService = require("../services/permission.service");
const sendResponse = require("../utils/response");

/**
 * Permission Controller
 * Manages fine-grained access control, role permissions, and security policies.
 */

/**
 * Define a new security permission or role policy
 * @route POST /permissions
 * @access admin
 */
exports.createPermission = async (req, res) => {
  try {
    const result = await permissionService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Permission created successfully",
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
        message: "Failed to create permission",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Fetch all defined permissions and security roles
 * @route GET /permissions
 * @access admin
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
 * Get detailed metadata for a specific security permission
 * @route GET /permissions/:id
 * @access admin
 */
exports.getPermissionById = async (req, res) => {
  try {
    const result = await permissionService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Permission not found" : "Permission fetched successfully",
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
 * Update security permission rules or descriptive metadata
 * @route PUT /permissions/:id
 * @access admin
 */
exports.updatePermission = async (req, res) => {
  try {
    const result = await permissionService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Permission not found" : "Permission updated successfully",
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
 * Revoke and permanently remove a security permission
 * @route DELETE /permissions/:id
 * @access admin
 */
exports.deletePermission = async (req, res) => {
  try {
    const result = await permissionService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? "Permission not found" : "Permission deleted successfully",
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
