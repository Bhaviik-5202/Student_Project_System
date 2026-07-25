/**
 * Resource Routes
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
  roleMiddleware(['admin']),
  upload.any(),
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
 * @route   GET /api/v1/resources/:id/download
 * @desc    Download resource file attachment
 * @access  Private (Authenticated Users)
 */
router.get(
  '/:id/download',
  authMiddleware,
  resourceController.downloadResource
);

/**
 * @route   GET /api/v1/resources/:id/preview
 * @desc    Preview resource file attachment or metadata
 * @access  Private (Authenticated Users)
 */
router.get('/:id/preview', authMiddleware, resourceController.previewResource);

/**
 * @route   PUT /api/v1/resources/:id
 * @desc    Update resource metadata
 * @access  Private (Admin Only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  resourceController.updateResource
);

/**
 * @route   DELETE /api/v1/resources/:id
 * @desc    Delete a resource
 * @access  Private (Admin Only)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  resourceController.deleteResource
);

module.exports = router;
