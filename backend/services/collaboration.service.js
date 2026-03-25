/**
 * Collaboration Service
 * Business logic layer for discussions and file sharing operations.
 */
const discussionRepository = require('../repositories/discussion.repository');
const sharedFileRepository = require('../repositories/sharedFile.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({
  error,
  data,
  message,
  success: !error,
});

/**
 * Get all discussions
 * @param {Object} filter - Filtering criteria
 * @returns {Promise<Object>} Formatted service response with discussion list
 */
exports.getDiscussions = async (filter = {}) => {
  try {
    const discussions = await discussionRepository.findAll(filter, {
      populate: { path: 'author', select: 'name avatar' },
    });
    return response(false, discussions, 'Discussions fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch discussions');
  }
};

/**
 * Get discussion by ID
 * @param {string} id - Discussion ID
 * @returns {Promise<Object>} Formatted service response with original post and replies
 */
exports.getDiscussionById = async (id) => {
  try {
    const discussion = await discussionRepository.findById(id, {
      populate: [
        { path: 'author', select: 'name avatar' },
        { path: 'replies.author', select: 'name avatar' },
      ],
    });
    if (!discussion) return response(true, null, 'Discussion not found');
    return response(false, discussion, 'Discussion fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch discussion');
  }
};

/**
 * Create discussion thread
 * @param {Object} data - Discussion data
 * @returns {Promise<Object>} Formatted service response with new thread instance
 */
exports.createDiscussion = async (data) => {
  try {
    const discussion = await discussionRepository.create(data);
    return response(false, discussion, 'Discussion created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create discussion');
  }
};

/**
 * Add reply to discussion
 * @param {string} discussionId - Target discussion ID
 * @param {Object} replyData - Reply content and author
 * @returns {Promise<Object>} Formatted service response with updated thread
 */
exports.addReply = async (discussionId, replyData) => {
  try {
    const discussion = await discussionRepository.update(discussionId, {
      $push: { replies: replyData },
    });
    if (!discussion) return response(true, null, 'Discussion not found');
    return response(false, discussion, 'Reply added successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to add reply');
  }
};

/**
 * Get shared project files
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Formatted service response with repository documents
 */
exports.getSharedFiles = async (projectId) => {
  try {
    const files = await sharedFileRepository.findAll(
      { project: projectId },
      { populate: { path: 'sharedBy', select: 'name avatar' } }
    );
    return response(false, files, 'Shared files fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch shared files');
  }
};

/**
 * Share project file
 * @param {Object} data - File metadata and link
 * @returns {Promise<Object>} Formatted service response with shared file record
 */
exports.shareFile = async (data) => {
  try {
    const file = await sharedFileRepository.create(data);
    return response(false, file, 'File shared successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to share file');
  }
};

/**
 * Remove shared file
 * @param {string} id - File ID
 * @returns {Promise<Object>} Formatted service response with deletion status
 */
exports.deleteSharedFile = async (id) => {
  try {
    const file = await sharedFileRepository.remove(id);
    if (!file) return response(true, null, 'File not found');
    return response(false, null, 'File deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete file');
  }
};
