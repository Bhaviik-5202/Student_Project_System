const Meeting = require("../models/meeting.model");

function response(error, data = null, message = "") {
  return { error, data, message };
}

/**
 * Create a new meeting
 * @param {Object} data
 */
exports.create = async (data) => {
  try {
    const meeting = await Meeting.create(data);
    return response(false, meeting, "Meeting created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create meeting");
  }
};

/**
 * Get all meetings
 */
exports.getAll = async () => {
  try {
    const meetings = await Meeting.find();
    return response(false, meetings, "Meetings fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch meetings");
  }
};

/**
 * Get meeting by ID
 * @param {string} id
 */
exports.getById = async (id) => {
  try {
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return response(true, null, "Meeting not found");
    }

    return response(false, meeting, "Meeting fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch meeting");
  }
};

/**
 * Update meeting by ID
 * @param {string} id
 * @param {Object} data
 */
exports.update = async (id, data) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!meeting) {
      return response(true, null, "Meeting not found");
    }

    return response(false, meeting, "Meeting updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update meeting");
  }
};

/**
 * Delete meeting by ID
 * @param {string} id
 */
exports.remove = async (id) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return response(true, null, "Meeting not found");
    }

    return response(false, meeting, "Meeting deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete meeting");
  }
};

/**
 * Join a meeting (stub)
 * @param {string} id
 * @param {Object} user
 */
exports.join = async (id, user) => {
  try {
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return response(true, null, "Meeting not found");
    }

    // Stub logic — extend later with participants array
    return response(false, { meetingId: id, user }, "Joined meeting");
  } catch (err) {
    return response(true, null, err.message || "Failed to join meeting");
  }
};
