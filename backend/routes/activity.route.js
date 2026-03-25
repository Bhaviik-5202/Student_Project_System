/**
 * Activity Routes
 * Handles CRUD operations for activities.
 */

const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route   POST /api/activities
 * @desc    Create new activity
 * @access  Private (Authenticated Users)
 */
router.post('/', authMiddleware, activityController.createActivity);

/**
 * @route   GET /api/activities
 * @desc    Get all activities
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, activityController.getAllActivities);

/**
 * @route   GET /api/activities/:id
 * @desc    Get single activity by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', authMiddleware, activityController.getActivityById);

/**
 * @route   PUT /api/activities/:id
 * @desc    Update activity by ID
 * @access  Private (Authenticated Users)
 */
router.put('/:id', authMiddleware, activityController.updateActivity);

/**
 * @route   DELETE /api/activities/:id
 * @desc    Delete activity by ID
 * @access  Private (Authenticated Users)
 */
router.delete('/:id', authMiddleware, activityController.deleteActivity);

module.exports = router;
