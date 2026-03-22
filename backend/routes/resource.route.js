/**
 * Resource Routes
 * ------------------------------------------------------------------
 * Handles resource management (documents, templates, videos).
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const resourceController = require('../controllers/resource.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const upload = require('../utils/upload');

/**
 * @route   POST /api/v1/resources
 * @desc    Create a new resource
 * @access  Private (Authenticated Users)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  upload.array('files'),
  [
    body('title')
      .optional()
      .notEmpty()
      .withMessage('Title cannot be empty if provided'),

    body('type')
      .notEmpty()
      .isIn(['document', 'template', 'video'])
      .withMessage('Type must be document, template, or video'),
  ],
  validateRequest,
  resourceController.createResource
);

/**
 * @route   GET /api/v1/resources
 * @desc    Retrieve all resources
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, resourceController.getAllResources);

/**
 * @route   GET /api/v1/resources/:id
 * @desc    Retrieve a specific resource by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', authMiddleware, resourceController.getResourceById);

/**
 * @route   DELETE /api/v1/resources/:id
 * @desc    Delete a resource
 * @access  Private (Authenticated Users)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  resourceController.deleteResource
);

module.exports = router;
