const Meeting = require("../models/Meeting");

exports.findAll = async (filter = {}) => {
  return Meeting.find(filter).populate("participants project");
};

exports.findById = async (id) => {
  return Meeting.findById(id).populate("participants project");
};

exports.create = async (data) => {
  const meeting = new Meeting(data);
  return meeting.save();
};

exports.update = async (id, data) => {
  return Meeting.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Meeting.findByIdAndDelete(id);
};

exports.join = async (id, userId) => {
  const meeting = await Meeting.findById(id);
  if (!meeting) return null;
  if (!meeting.participants.includes(userId)) {
    meeting.participants.push(userId);
    await meeting.save();
  }
  return meeting;
};
