/**
 * Project Routes
 * Handles CRUD operations for projects.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Controllers and Middlewares
const projectController = require('../controllers/project.controller');
const projectTypeController = require('../controllers/projectType.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const upload = require('../utils/upload');

/**
 * Validation rules for creating/updating a project
 */
const projectValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('status')
    .optional()
    .isIn(['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'])
    .withMessage('Invalid status'),
];

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private (Admin/Faculty)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  upload.single('document'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    ...projectValidation.slice(1),
  ],
  validateRequest,
  projectController.createProject
);

/**
 * @route   GET /api/v1/projects
 * @desc    Retrieve all projects
 * @access  Private (Authenticated Users)
 */
router.get('/', authMiddleware, projectController.getAllProjects);

/**
 * @route   GET /api/v1/projects/types
 * @desc    Retrieve all project types
 * @access  Private (Authenticated Users)
 */
router.get('/types', authMiddleware, projectTypeController.getAllProjectTypes);

/**
 * @route   GET /api/v1/projects/types/:id
 * @desc    Retrieve a single project type
 * @access  Private (Authenticated Users)
 */
router.get(
  '/types/:id',
  authMiddleware,
  projectTypeController.getProjectTypeById
);

/**
 * @route   POST /api/v1/projects/types
 * @desc    Create a new project type
 * @access  Private (Admin/Faculty)
 */
router.post(
  '/types',
  authMiddleware,
  roleMiddleware(['admin']),
  projectTypeController.createProjectType
);

/**
 * @route   PUT /api/v1/projects/types/:id
 * @desc    Update a project type
 * @access  Private (Admin/Faculty)
 */
router.put(
  '/types/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  projectTypeController.updateProjectType
);

/**
 * @route   DELETE /api/v1/projects/types/:id
 * @desc    Delete a project type
 * @access  Private (Admin/Faculty)
 */
router.delete(
  '/types/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  projectTypeController.deleteProjectType
);

/**
 * @route   GET /api/v1/projects/groups
 * @desc    Retrieve all projects formatted as groups
 * @access  Private (Authenticated Users)
 */
router.get('/groups', authMiddleware, projectController.getProjectGroups);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Retrieve a single project by ID
 * @access  Private (Authenticated Users)
 */
router.get('/:id', authMiddleware, projectController.getProjectById);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update an existing project
 * @access  Private (Admin/Faculty)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'faculty']),
  upload.single('document'),
  projectValidation,
  validateRequest,
  projectController.updateProject
);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete a project
 * @access  Private (Admin/Faculty)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  projectController.deleteProject
);

module.exports = router;
