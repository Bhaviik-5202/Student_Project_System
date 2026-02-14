const User = require("../models/User");

exports.findAll = async (filter = {}) => {
  return User.find(filter);
};

exports.findById = async (id) => {
  return User.findById(id);
};

exports.create = async (data) => {
  const user = new User(data);
  return user.save();
};

exports.update = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return User.findByIdAndDelete(id);
};

exports.getUserProjects = async (userId) => {
  const user = await User.findById(userId).populate("projects");
  return user ? user.projects : null;
};

exports.addProject = async (userId, projectId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.projects.push(projectId);
  await user.save();
  return user;
};

exports.removeProject = async (userId, projectId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.projects.pull(projectId);
  await user.save();
  return user;
};

exports.getUserMeetings = async (userId) => {
  const user = await User.findById(userId).populate("meetings");
  return user ? user.meetings : null;
};

exports.joinMeeting = async (userId, meetingId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.meetings.push(meetingId);
  await user.save();
  return user;
};

exports.leaveMeeting = async (userId, meetingId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.meetings.pull(meetingId);
  await user.save();
  return user;
};

exports.getUserResources = async (userId) => {
  const user = await User.findById(userId).populate("resources");
  return user ? user.resources : null;
};

exports.uploadResource = async (userId, resourceId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.resources.push(resourceId);
  await user.save();
  return user;
};

exports.removeResource = async (userId, resourceId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.resources.pull(resourceId);
  await user.save();
  return user;
};

exports.getUserChats = async (userId) => {
  const user = await User.findById(userId).populate("chats");
  return user ? user.chats : null;
};

exports.getUserNotifications = async (userId) => {
  const user = await User.findById(userId).populate("notifications");
  return user ? user.notifications : null;
};
