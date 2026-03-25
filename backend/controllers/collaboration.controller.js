const collaborationService = require('../services/collaboration.service');
const sendResponse = require('../utils/response');

/**
 * Collaboration Controller
 * Manages shared team resources, project-specific discussions, and collaborative file sharing.
 */

/**
 * Get all discussions
 * @route GET /discussions
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */

exports.getDiscussions = async (req, res) => {
  try {
    const { category, project } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (project) filter.project = project;

    const result = await collaborationService.getDiscussions(filter);
    sendResponse(res, result, result.success ? 200 : 400);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get discussion by ID
 * @route GET /discussions/:id
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */
exports.getDiscussionById = async (req, res) => {
  try {
    const result = await collaborationService.getDiscussionById(req.params.id);
    sendResponse(res, result, result.success ? 200 : 404);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Create a new discussion
 * @route POST /discussions
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */
exports.createDiscussion = async (req, res) => {
  try {
    const data = {
      ...req.body,
      author: req.user.id,
    };
    const result = await collaborationService.createDiscussion(data);
    sendResponse(res, result, result.success ? 201 : 400);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Add a reply to a discussion
 * @route POST /discussions/:id/replies
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */
exports.addReply = async (req, res) => {
  try {
    const replyData = {
      content: req.body.content,
      author: req.user.id,
    };
    const result = await collaborationService.addReply(
      req.params.id,
      replyData
    );
    sendResponse(res, result, result.success ? 201 : 400);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get shared files
 * @route GET /discussions/:id/files
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */
exports.getSharedFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await collaborationService.getSharedFiles(projectId);
    sendResponse(res, result, result.success ? 200 : 400);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Share a file
 * @route POST /discussions/:id/files
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */
exports.shareFile = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(
        res,
        { success: false, message: 'No file uploaded' },
        400
      );
    }

    const { projectId } = req.params;
    const data = {
      name: req.file.originalname,
      url: req.file.path.replace(/\\/g, '/'),
      size: (req.file.size / 1024).toFixed(2) + ' KB',
      type: req.file.mimetype.split('/')[1] || 'other',
      sharedBy: req.user.id,
      project: projectId,
    };

    const result = await collaborationService.shareFile(data);
    sendResponse(res, result, result.success ? 201 : 400);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Delete a shared file
 * @route DELETE /discussions/:id/files/:fileId
 * @access Authenticated, Admin
 * @param {*} req
 * @param {*} res
 */
exports.deleteSharedFile = async (req, res) => {
  try {
    const result = await collaborationService.deleteSharedFile(req.params.id);
    sendResponse(res, result, result.success ? 200 : 404);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};
