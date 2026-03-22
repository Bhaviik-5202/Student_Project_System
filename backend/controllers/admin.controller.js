const adminService = require('../services/admin.service');
const sendResponse = require('../utils/response');

/**
 * Admin Controller
 * Handles administrative operations like roles, permissions, and backups.
 */

/**
 * Get all roles
 * @param {*} req
 * @param {*} res
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

exports.getBackups = async (req, res) => {
  try {
    const { success, data, message } = await adminService.getBackups();
    if (!success) throw new Error(message);

    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

exports.createBackup = async (req, res) => {
  try {
    // Simulated backup process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendResponse(
      res,
      { success: true, message: 'Backup created successfully' },
      201
    );
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

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
