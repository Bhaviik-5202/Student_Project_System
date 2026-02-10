const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  milestones: [
    {
      title: String,
      description: String,
      dueDate: Date,
      completed: { type: Boolean, default: false },
    },
  ],
  sprints: [
    {
      name: String,
      startDate: Date,
      endDate: Date,
      tasks: [String],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timeline", timelineSchema);
