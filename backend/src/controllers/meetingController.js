const Meeting = require("../models/Meeting");

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("participants project");
    res.json(meetings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch meetings", error: err.message });
  }
};

// Get meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate(
      "participants project",
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch meeting", error: err.message });
  }
};

// Create meeting
exports.createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create meeting", error: err.message });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update meeting", error: err.message });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json({ message: "Meeting deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete meeting", error: err.message });
  }
};

// Join meeting
exports.joinMeeting = async (req, res) => {
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
