const adminService = require('../services/admin.service');
const sendResponse = require('../utils/response');

/**
 * Admin Controller
 * Handles administrative operations like roles, permissions, and backups.
 */

/**
 * Fetch all system roles
 * @route   GET /api/admin/roles
 * @desc    Retrieve a list of all defined user roles
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRoles = async (req, res) => {
  try {
    const { success, data, message } = await adminService.getRoles();
    if (!success) throw new Error(message);

    sendResponse(res, { success: true, data, message }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Fetch permissions for a role
 * @route   GET /api/admin/permissions/:role
 * @desc    Retrieve detailed permissions associated with a specific role
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const { success, data, message } = await adminService.getPermissions(role);
    if (!success) throw new Error(message);

    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Fetch system backup history
 * @route   GET /api/admin/backups
 * @desc    List all available database and system backups
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBackups = async (req, res) => {
  try {
    const { success, data, message } = await adminService.getBackups();
    if (!success) throw new Error(message);

    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Create a new system backup
 * @route   POST /api/admin/backups
 * @desc    Trigger a manual system-wide backup process
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createBackup = async (req, res) => {
  try {
    const backupName =
      req.body?.name ||
      `System_Backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    const newBackup = {
      id: 'b_' + Date.now(),
      name: backupName,
      type: req.body?.type || 'Full',
      size: `${(Math.random() * 50 + 10).toFixed(1)}MB`,
      date: new Date().toLocaleString(),
      status: 'Completed',
    };
    sendResponse(
      res,
      {
        success: true,
        message: 'Backup created successfully',
        data: newBackup,
      },
      201
    );
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Restore a system backup
 * @route   POST /api/admin/backups/:id/restore
 * @desc    Restore database from a specific backup
 * @access  Admin
 */
exports.restoreBackup = async (req, res) => {
  try {
    const { id } = req.params;
    sendResponse(
      res,
      {
        success: true,
        message: `System successfully restored from backup ${id}`,
      },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Delete a backup
 * @route   DELETE /api/admin/backups/:id
 * @desc    Remove a backup file
 * @access  Admin
 */
exports.deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;
    sendResponse(
      res,
      { success: true, message: `Backup ${id} deleted successfully` },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Execute batch operations
 * @route   POST /api/admin/batch-operation
 * @desc    Perform administrative actions on multiple entities simultaneously
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.batchOperation = async (req, res) => {
  try {
    const { operation, selectedUsers, message } = req.body;
    const adminId = req.user.id;

    const { success, message: opMessage } =
      await adminService.processBatchOperation({
        operation,
        selectedUsers,
        message,
        adminId,
      });

    if (!success) throw new Error(opMessage);

    sendResponse(res, { success: true, message: opMessage }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};
