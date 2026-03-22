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
 */
router.get('/users', userController.getAllUsers);

/**
 * @route   GET /api/v1/admin/roles
 * @desc    Get system roles
 */
router.get('/roles', adminController.getRoles);

/**
 * @route   GET /api/v1/admin/permissions/:role
 * @desc    Get permissions for a role
 */
router.get('/permissions/:role', adminController.getPermissions);

/**
 * @route   GET /api/v1/admin/backups
 * @desc    Get system backups
 */
router.get('/backups', adminController.getBackups);

/**
 * @route   POST /api/v1/admin/backups
 * @desc    Create a system backup
 */
router.post('/backups', adminController.createBackup);

/**
 * @route   POST /api/v1/admin/batch-operation
 * @desc    Perform a batch operation
 */
router.post('/batch-operation', adminController.batchOperation);

module.exports = router;
