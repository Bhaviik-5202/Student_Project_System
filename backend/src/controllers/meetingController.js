const meetingService = require("../services/meetingService");
const ApiError = require("../utils/ApiError");

// Get all meetings
exports.getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await meetingService.findAll();
    return res.json({ success: true, data: meetings });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch meetings", [err.message]));
  }
};

// Get meeting by ID
exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await meetingService.findById(req.params.id);
    if (!meeting) {
      return next(new ApiError(404, "Meeting not found"));
    }
    return res.json({ success: true, data: meeting });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch meeting", [err.message]));
  }
};

// Create meeting
exports.createMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.create(req.body);
    return res.status(201).json({ success: true, data: meeting });
  } catch (err) {
    return next(new ApiError(400, "Failed to create meeting", [err.message]));
  }
};

// Update meeting
exports.updateMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.update(req.params.id, req.body);
    if (!meeting) {
      return next(new ApiError(404, "Meeting not found"));
    }
    return res.json({ success: true, data: meeting });
  } catch (err) {
    return next(new ApiError(400, "Failed to update meeting", [err.message]));
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res, next) => {
  try {
    const deleted = await meetingService.delete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Meeting not found"));
    }
    return res.json({ success: true, message: "Meeting deleted successfully" });
  } catch (err) {
    return next(new ApiError(400, "Failed to delete meeting", [err.message]));
  }
};
const Meeting = require("../models/Meeting");

// Join meeting
exports.joinMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    const userId = req.body.userId;
    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      await meeting.save();
    }
    res.json(meeting);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to join meeting", error: err.message });
  }
};
