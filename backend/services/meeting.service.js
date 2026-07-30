/**
 * Meeting Service
 * Business logic layer for scheduling and managing project consultations.
 */
const meetingRepository = require('../repositories/meeting.repository');
const notificationService = require('./notification.service');

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
exports.create = async (data, user) => {
  try {
    const meetingData = { ...data };
    if (!meetingData.organizer && user) {
      meetingData.organizer = user.id || user._id;
    }
    if (!meetingData.status) {
      const now = new Date();
      const meetingDate = new Date(meetingData.date);
      if (meetingDate < now - 60 * 60 * 1000) {
        meetingData.status = 'completed';
      } else if (Math.abs(meetingDate - now) <= 60 * 60 * 1000) {
        meetingData.status = 'ongoing';
      } else {
        meetingData.status = 'scheduled';
      }
    }
    meetingData.isActive = meetingData.status !== 'cancelled';
    const meeting = await meetingRepository.create(meetingData);

    if (meeting.participants && meeting.participants.length > 0) {
      meeting.participants.forEach((participantId) => {
        if (
          user &&
          participantId.toString() !== (user.id || user._id).toString()
        ) {
          notificationService
            .create({
              user: participantId,
              message: `You have been invited to a meeting: ${meeting.title}`,
              type: 'info',
              metadata: {
                type: 'meeting',
                meetingId: meeting._id,
                link: `/meetings`,
              },
            })
            .catch(console.error);
        }
      });
    }

    notificationService.notifyAdmins({
      message: `New meeting scheduled: ${meeting.title}`,
      type: 'info',
      metadata: { type: 'meeting', meetingId: meeting._id, link: `/meetings` },
    });

    return response(false, meeting, 'Meeting created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create meeting');
  }
};

/**
 * Get all meetings
 * @returns {Promise<Object>} Formatted service response with global meeting schedule
 */
exports.getAll = async (params = {}, currentUser = null) => {
  try {
    const queryFilter = {};
    if (currentUser && currentUser.role !== 'admin') {
      const userId = currentUser._id || currentUser.id;
      queryFilter.$or = [{ organizer: userId }, { participants: userId }];
    }

    const meetings = await meetingRepository.findAll(queryFilter, {
      populate: [
        { path: 'organizer', select: 'name email role avatar' },
        { path: 'participants', select: 'name email role avatar' },
        {
          path: 'project',
          select: 'title slug status guide',
          populate: { path: 'guide', select: 'name email role' },
        },
      ],
      sort: { date: 1 },
    });

    const now = new Date();
    const formattedMeetings = (meetings || []).map((m) => {
      const doc = m.toObject ? m.toObject() : m;
      if (doc.status !== 'cancelled') {
        const meetingDate = new Date(doc.date);
        const diffMs = meetingDate - now;
        if (diffMs > 60 * 60 * 1000) {
          doc.status = 'upcoming';
        } else if (diffMs >= -60 * 60 * 1000) {
          doc.status = 'ongoing';
        } else {
          doc.status = 'completed';
        }
      }
      doc.isActive = doc.status !== 'cancelled' && doc.isActive !== false;
      return doc;
    });

    return response(false, formattedMeetings, 'Meetings fetched successfully');
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
        { path: 'organizer', select: 'name email role avatar' },
        { path: 'participants', select: 'name email role avatar' },
        {
          path: 'project',
          select: 'title slug status guide',
          populate: { path: 'guide', select: 'name email role' },
        },
      ],
    });
    if (!meeting) return response(true, null, 'Meeting not found');
    const doc = meeting.toObject ? meeting.toObject() : meeting;
    if (doc.status !== 'cancelled') {
      const now = new Date();
      const meetingDate = new Date(doc.date);
      const diffMs = meetingDate - now;
      if (diffMs > 60 * 60 * 1000) doc.status = 'upcoming';
      else if (diffMs >= -60 * 60 * 1000) doc.status = 'ongoing';
      else doc.status = 'completed';
    }
    doc.isActive = doc.status !== 'cancelled' && doc.isActive !== false;
    return response(false, doc, 'Meeting fetched successfully');
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
    const updateData = { ...data };
    if (updateData.status) {
      updateData.isActive = updateData.status !== 'cancelled';
    }
    const meeting = await meetingRepository.update(id, updateData);
    if (!meeting) return response(true, null, 'Meeting not found');

    if (meeting.participants && meeting.participants.length > 0) {
      meeting.participants.forEach((participantId) => {
        notificationService
          .create({
            user: participantId,
            message: `Meeting '${meeting.title}' has been updated`,
            type: 'info',
            metadata: {
              type: 'meeting',
              meetingId: meeting._id,
              link: `/meetings`,
            },
          })
          .catch(console.error);
      });
    }

    notificationService.notifyAdmins({
      message: `Meeting '${meeting.title}' has been updated`,
      type: 'info',
      metadata: { type: 'meeting', meetingId: meeting._id, link: `/meetings` },
    });

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

    if (meeting.participants && meeting.participants.length > 0) {
      meeting.participants.forEach((participantId) => {
        notificationService
          .create({
            user: participantId,
            message: `Meeting '${meeting.title}' has been cancelled`,
            type: 'warning',
            metadata: {
              type: 'meeting',
              meetingId: meeting._id,
              link: `/meetings`,
            },
          })
          .catch(console.error);
      });
    }

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
