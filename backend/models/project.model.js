const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["planning", "in_progress", "completed", "on_hold", "cancelled"],
      default: "planning",
      lowercase: true,
      trim: true,
      index: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ createdAt: -1 });
projectSchema.index({ members: 1 });

module.exports = mongoose.model("Project", projectSchema);
