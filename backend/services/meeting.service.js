/**
 * Meeting Service
 * Business logic layer for scheduling and managing project consultations.
 */
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
 * Create meeting
 * @param {Object} data - Meeting details (title, time, participants)
 * @returns {Promise<Object>} Formatted service response with new meeting instance
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
 * Get all meetings
 * @returns {Promise<Object>} Formatted service response with global meeting schedule
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
 * Get meeting by ID
 * @param {string} id - Meeting identifier
 * @returns {Promise<Object>} Formatted service response with detailed consultation data
 */
exports.getById = async (id) => {
  try {
    const meeting = await meetingRepository.findById(id, {
      populate: [
        { path: 'participants', select: 'name email role' },
        {
          path: 'project',
          select: 'title slug status guide',
          populate: { path: 'guide', select: 'name email role' },
        },
      ],
    });
    if (!meeting) return response(true, null, 'Meeting not found');
    return response(false, meeting, 'Meeting fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch meeting');
  }
};

/**
 * Update meeting details
 * @param {string} id - Meeting identifier
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with modified meeting data
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
 * Delete meeting record
 * @param {string} id - Meeting identifier
 * @returns {Promise<Object>} Formatted service response with cancellation status
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
 * Participant join meeting
 * @param {string} id - Meeting identifier
 * @param {Object} user - User profile data
 * @returns {Promise<Object>} Formatted service response with confirmation
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
