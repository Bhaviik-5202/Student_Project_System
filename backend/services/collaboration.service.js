const discussionRepository = require("../repositories/discussion.repository");
const sharedFileRepository = require("../repositories/sharedFile.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message, success: !error });

/**
 * Fetch all discussions with optional filtering
 * @param {Object} filter - Filtering criteria
 * @returns {Promise<Object>} Formatted service response
 */
exports.getDiscussions = async (filter = {}) => {
  try {
    const discussions = await discussionRepository.findAll(filter, {
      populate: { path: "author", select: "name avatar" },
    });
    return response(false, discussions, "Discussions fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch discussions");
  }
};

/**
 * Fetch a specific discussion with populated replies
 * @param {string} id - Discussion ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.getDiscussionById = async (id) => {
  try {
    const discussion = await discussionRepository.findById(id, {
      populate: [
        { path: "author", select: "name avatar" },
        { path: "replies.author", select: "name avatar" },
      ],
    });
    if (!discussion) return response(true, null, "Discussion not found");
    return response(false, discussion, "Discussion fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch discussion");
  }
};

/**
 * Create a new discussion thread
 * @param {Object} data - Discussion data
 * @returns {Promise<Object>} Formatted service response
 */
exports.createDiscussion = async (data) => {
  try {
    const discussion = await discussionRepository.create(data);
    return response(false, discussion, "Discussion created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create discussion");
  }
};

/**
 * Add a reply to an existing discussion
 * @param {string} discussionId - Target discussion ID
 * @param {Object} replyData - Reply content and author
 * @returns {Promise<Object>} Formatted service response
 */
exports.addReply = async (discussionId, replyData) => {
  try {
    const discussion = await discussionRepository.update(discussionId, {
      $push: { replies: replyData },
    });
    if (!discussion) return response(true, null, "Discussion not found");
    return response(false, discussion, "Reply added successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to add reply");
  }
};

/**
 * Fetch shared files for a specific project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.getSharedFiles = async (projectId) => {
  try {
    const files = await sharedFileRepository.findAll(
      { project: projectId },
      { populate: { path: "sharedBy", select: "name avatar" } }
    );
    return response(false, files, "Shared files fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch shared files");
  }
};

/**
 * Share a new file within a project
 * @param {Object} data - File metadata and link
 * @returns {Promise<Object>} Formatted service response
 */
exports.shareFile = async (data) => {
  try {
    const file = await sharedFileRepository.create(data);
    return response(false, file, "File shared successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to share file");
  }
};

/**
 * Remove a shared file from the project
 * @param {string} id - File ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.deleteSharedFile = async (id) => {
  try {
    const file = await sharedFileRepository.remove(id);
    if (!file) return response(true, null, "File not found");
    return response(false, null, "File deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete file");
  }
};
