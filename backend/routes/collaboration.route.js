/**
 * Collaboration Routes
 * Handles project discussions and file sharing collaborations.
 */
const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaboration.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../utils/upload');

/**
 * Collaboration Router
 * Mounted at /api/v1/collaboration
 */

router.use(authMiddleware);

/**
 * @route   GET /api/v1/collaboration/discussions
 * @desc    Get all discussions
 * @access  Private (Authenticated Users)
 */
router.get('/discussions', collaborationController.getDiscussions);

/**
 * @route   GET /api/v1/collaboration/discussions/:id
 * @desc    Get discussion by ID
 * @access  Private (Authenticated Users)
 */
router.get('/discussions/:id', collaborationController.getDiscussionById);

/**
 * @route   POST /api/v1/collaboration/discussions
 * @desc    Create a new discussion
 * @access  Private (Authenticated Users)
 */
router.post('/discussions', collaborationController.createDiscussion);

/**
 * @route   POST /api/v1/collaboration/discussions/:id/replies
 * @desc    Add a reply to a discussion
 * @access  Private (Authenticated Users)
 */
router.post('/discussions/:id/replies', collaborationController.addReply);

/**
 * @route   GET /api/v1/collaboration/projects/:projectId/files
 * @desc    Get shared files for a project
 * @access  Private (Authenticated Users)
 */
router.get(
  '/projects/:projectId/files',
  collaborationController.getSharedFiles
);

/**
 * @route   POST /api/v1/collaboration/projects/:projectId/files
 * @desc    Share a file for a project
 * @access  Private (Authenticated Users)
 */
router.post(
  '/projects/:projectId/files',
  upload.single('file'),
  collaborationController.shareFile
);

/**
 * @route   DELETE /api/v1/collaboration/files/:id
 * @desc    Delete a shared file
 * @access  Private (Authenticated Users)
 */
router.delete('/files/:id', collaborationController.deleteSharedFile);

module.exports = router;
