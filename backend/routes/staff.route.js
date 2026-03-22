/**
 * Staff Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for staff members.
 */

const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const staffController = require('../controllers/staff.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @route   POST /api/v1/staff
 * @desc    Create a new staff member
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  staffController.createStaff
);

/**
 * @route   GET /api/v1/staff
 * @desc    Retrieve all staff members
 * @access  Private (Authenticated Users)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  staffController.getAllStaff
);

/**
 * @route   GET /api/v1/staff/:id
 * @desc    Retrieve a specific staff member by ID
 * @access  Private (Authenticated Users)
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  staffController.getStaffById
);

/**
 * @route   PUT /api/v1/staff/:id
 * @desc    Update an existing staff member
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  staffController.updateStaff
);

/**
 * @route   DELETE /api/v1/staff/:id
 * @desc    Delete a staff member
 * @access  Private (Authenticated Users)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  staffController.deleteStaff
);

module.exports = router;
