const meetingRepository = require('../repositories/meeting.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Schedule a new project meeting or consultation
 * @param {Object} data - Meeting details (title, time, participants)
 * @returns {Promise<Object>} Formatted service response with new meeting data
 */
exports.create = async (data) => {
  try {
    const meeting = await meetingRepository.create(data);
    return response(false, meeting, 'Meeting created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create meeting');
  }
};

/**
 * Fetch all scheduled meetings recorded in the system
 * @returns {Promise<Object>} Formatted service response with meeting list
 */
exports.getAll = async () => {
  try {
    const meetings = await meetingRepository.findAll();
    return response(false, meetings, 'Meetings fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch meetings');
  }
};

/**
 * Get detailed information for a specific meeting
 * @param {string} id - Meeting identifier
 * @returns {Promise<Object>} Formatted service response with meeting data
 */
exports.getById = async (id) => {
  try {
    const meeting = await meetingRepository.findById(id);
    if (!meeting) return response(true, null, 'Meeting not found');
    return response(false, meeting, 'Meeting fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch meeting');
  }
};

/**
 * Update meeting details or reschedule
 * @param {string} id - Meeting identifier
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with updated meeting
 */
exports.update = async (id, data) => {
  try {
    const meeting = await meetingRepository.update(id, data);
    if (!meeting) return response(true, null, 'Meeting not found');
    return response(false, meeting, 'Meeting updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update meeting');
  }
};

/**
 * Cancel and remove a meeting record
 * @param {string} id - Meeting identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const meeting = await meetingRepository.remove(id);
    if (!meeting) return response(true, null, 'Meeting not found');
    return response(false, null, 'Meeting deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete meeting');
  }
};

/**
 * Register a user's intent to partipate in a meeting
 * @param {string} id - Meeting identifier
 * @param {Object} user - User profile data
 * @returns {Promise<Object>} Formatted service response with join confirmation
 */
exports.join = async (id, user) => {
  try {
    const meeting = await meetingRepository.findById(id);
    if (!meeting) return response(true, null, 'Meeting not found');

    // Add user to participants if not already present
    const updatedMeeting = await meetingRepository.update(id, {
      $addToSet: { participants: user.id || user._id },
    });

    return response(false, updatedMeeting, 'Joined meeting successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to join meeting');
  }
};
