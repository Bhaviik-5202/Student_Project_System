/**
 * Project Routes
 * Defines API endpoints for Project Module operations and Project Types management.
 */
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const projectTypeController = require('../controllers/projectType.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Apply authentication to all project routes
router.use(authMiddleware);

/**
 * Project Types Management Routes
 */
router.get('/types', (req, res, next) =>
  projectTypeController.getAllProjectTypes(req, res, next)
);
router.get('/types/:id', (req, res, next) =>
  projectTypeController.getProjectTypeById(req, res, next)
);
router.post('/types', roleMiddleware(['admin']), (req, res, next) =>
  projectTypeController.createProjectType(req, res, next)
);
router.put('/types/:id', roleMiddleware(['admin']), (req, res, next) =>
  projectTypeController.updateProjectType(req, res, next)
);
router.delete('/types/:id', roleMiddleware(['admin']), (req, res, next) =>
  projectTypeController.deleteProjectType(req, res, next)
);

/**
 * Stats & Dropdown Selector Routes
 */
router.get('/stats', (req, res, next) =>
  projectController.getDashboardStats(req, res, next)
);
router.get('/students/active', (req, res, next) =>
  projectController.getActiveStudents(req, res, next)
);
router.get('/faculty/active', (req, res, next) =>
  projectController.getActiveFaculty(req, res, next)
);
router.get('/groups', (req, res, next) =>
  projectController.getProjectGroups(req, res, next)
);

/**
 * Main Project Collection Endpoints
 */
router
  .route('/')
  .get((req, res, next) => projectController.getAllProjects(req, res, next))
  .post((req, res, next) => projectController.createProject(req, res, next));

/**
 * Single Project Specific Operations
 */
router
  .route('/:id')
  .get((req, res, next) => projectController.getProjectById(req, res, next))
  .put((req, res, next) => projectController.updateProject(req, res, next))
  .delete((req, res, next) => projectController.deleteProject(req, res, next));

/**
 * Archival Controls
 */
router.patch('/:id/archive', (req, res, next) =>
  projectController.archiveProject(req, res, next)
);
router.patch('/:id/restore', (req, res, next) =>
  projectController.restoreProject(req, res, next)
);

/**
 * Assignments (Students / Guide)
 */
router.put('/:id/students', (req, res, next) =>
  projectController.assignStudents(req, res, next)
);
router.put('/:id/guide', (req, res, next) =>
  projectController.assignGuide(req, res, next)
);

/**
 * Progress & Status Lifecycle
 */
router.patch('/:id/progress', (req, res, next) =>
  projectController.updateProgress(req, res, next)
);

/**
 * Files & Resources
 */
router.post('/:id/files', (req, res, next) =>
  projectController.addProjectFile(req, res, next)
);
router.delete('/:id/files/:fileId', (req, res, next) =>
  projectController.removeProjectFile(req, res, next)
);

/**
 * Faculty Evaluation & Reviews
 */
router.post(
  '/:id/reviews',
  roleMiddleware(['faculty', 'admin']),
  (req, res, next) => projectController.addProjectReview(req, res, next)
);

module.exports = router;
