const Timeline = require("../models/Timeline");

// Get timeline by project
exports.getTimelineByProject = async (req, res) => {
  try {
    const timeline = await Timeline.findOne({
      project: req.params.projectId,
    }).populate("project");
    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });
    res.json(timeline);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch timeline", error: err.message });
  }
};

// Create or update timeline
exports.saveTimeline = async (req, res) => {
  try {
    const { project, milestones, sprints } = req.body;
    let timeline = await Timeline.findOne({ project });
    if (timeline) {
      timeline.milestones = milestones;
      timeline.sprints = sprints;
      await timeline.save();
    } else {
      timeline = new Timeline({ project, milestones, sprints });
      await timeline.save();
    }
    res.status(201).json(timeline);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to save timeline", error: err.message });
  }
};
