/**
 * Admin Routes
 * Handles administrative operations and system management.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All admin routes are protected and require admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

/**
 * @route   GET /api/v1/admin/users
 * @desc    Retrieve all users (reusing user controller)
 * @access  Private (Admin Only)
 */
router.get('/users', userController.getAllUsers);

/**
 * @route   GET /api/v1/admin/roles
 * @desc    Get system roles
 * @access  Private (Admin Only)
 */
router.get('/roles', adminController.getRoles);

/**
 * @route   GET /api/v1/admin/permissions/:role
 * @desc    Get permissions for a role
 * @access  Private (Admin Only)
 */
router.get('/permissions/:role', adminController.getPermissions);

/**
 * @route   GET /api/v1/admin/backups
 * @desc    Get system backups
 * @access  Private (Admin Only)
 */
router.get('/backups', adminController.getBackups);

/**
 * @route   POST /api/v1/admin/backups
 * @desc    Create a system backup
 * @access  Private (Admin Only)
 */
router.post('/backups', adminController.createBackup);

/**
 * @route   POST /api/v1/admin/backups/:id/restore
 * @desc    Restore a system backup
 * @access  Private (Admin Only)
 */
router.post('/backups/:id/restore', adminController.restoreBackup);

/**
 * @route   DELETE /api/v1/admin/backups/:id
 * @desc    Delete a system backup
 * @access  Private (Admin Only)
 */
router.delete('/backups/:id', adminController.deleteBackup);

/**
 * @route   POST /api/v1/admin/batch-operation
 * @desc    Perform a batch operation
 * @access  Private (Admin Only)
 */
router.post('/batch-operation', adminController.batchOperation);

module.exports = router;
