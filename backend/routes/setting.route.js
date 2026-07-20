/**
 * Setting Routes
 * Handles CRUD operations for settings.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const settingController = require('../controllers/setting.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/settings
 * @desc    Create a new setting
 * @access  Private (Admin)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  settingController.createSetting
);

/**
 * @route   GET /api/v1/settings
 * @desc    Retrieve all settings
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, settingController.getAllSettings);

/**
 * @route   GET /api/v1/settings/:id
 * @desc    Retrieve a specific setting by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', authMiddleware, settingController.getSettingById);

/**
 * @route   PUT /api/v1/settings
 * @desc    Bulk update system settings
 * @access  Private (Admin)
 */
router.put(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  settingController.bulkUpdateSettings
);

/**
 * @route   PUT /api/v1/settings/:id
 * @desc    Update an existing setting
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('key').optional().notEmpty().withMessage('Key cannot be empty'),
    body('value').optional().exists().withMessage('Value is required'),
  ],
  validateRequest,
  settingController.updateSetting
);

/**
 * @route   DELETE /api/v1/settings/:id
 * @desc    Delete a setting
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  settingController.deleteSetting
);

module.exports = router;
