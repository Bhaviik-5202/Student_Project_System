// Timeline Controller
const Timeline = require("../models/Timeline");
const ApiError = require("../utils/ApiError");

// Get all timelines
exports.getAllTimelines = async (req, res, next) => {
  try {
    const timelines = await Timeline.find().populate("project");
    return res.json({ success: true, data: timelines });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch timelines", [err.message]));
  }
};

// Get timeline by project
exports.getTimelineByProject = async (req, res, next) => {
  try {
    const timeline = await Timeline.findOne({
      project: req.params.projectId,
    }).populate("project");
    if (!timeline) return next(new ApiError(404, "Timeline not found"));
    return res.json({ success: true, data: timeline });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch timeline", [err.message]));
  }
};

// Create or update timeline
exports.saveTimeline = async (req, res, next) => {
  try {
    const { project, milestones, sprints } = req.body;
    if (!project) return next(new ApiError(400, "Project is required"));
    let timeline = await Timeline.findOne({ project });
    if (timeline) {
      timeline.milestones = milestones || timeline.milestones;
      timeline.sprints = sprints || timeline.sprints;
      await timeline.save();
    } else {
      timeline = new Timeline({ project, milestones, sprints });
      await timeline.save();
    }
    return res.status(201).json({ success: true, data: timeline });
  } catch (err) {
    return next(new ApiError(400, "Failed to save timeline", [err.message]));
  }
};

// Update timeline (PATCH)
exports.updateTimeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const timeline = await Timeline.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!timeline) return next(new ApiError(404, "Timeline not found"));
    return res.json({ success: true, data: timeline });
  } catch (err) {
    return next(new ApiError(400, "Failed to update timeline", [err.message]));
  }
};

// Delete timeline
exports.deleteTimeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeline = await Timeline.findByIdAndDelete(id);
    if (!timeline) return next(new ApiError(404, "Timeline not found"));
    return res.json({ success: true, message: "Timeline deleted" });
  } catch (err) {
    return next(new ApiError(400, "Failed to delete timeline", [err.message]));
  }
};
