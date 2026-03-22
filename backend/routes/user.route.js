/**
 * User Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for users.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  userController.createUser
);

/**
 * @route   GET /api/v1/users
 * @desc    Retrieve all users
 * @access  Private (Authenticated Users)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  userController.getAllUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Retrieve a specific user by ID
 * @access  Private (Authenticated Users)
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  userController.getUserById
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update an existing user
 * @access  Private (Authenticated Users)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),

    body('email').optional().isEmail().withMessage('Valid email is required'),

    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    body('role')
      .optional()
      .isIn(['admin', 'faculty', 'student'])
      .withMessage('Invalid role'),
  ],
  validateRequest,
  userController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user
 * @access  Private (Authenticated Users)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  userController.deleteUser
);

module.exports = router;
