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
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    type: {
      type: String,
      trim: true,
    },
    abstract: {
      type: String,
      trim: true,
    },
    objectives: {
      type: String,
      trim: true,
    },
    outcomes: {
      type: String,
      trim: true,
    },
    resources: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    teamMembers: {
      type: String,
      trim: true,
    },
    document: {
      type: String,
      default: null,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ createdAt: -1 });
projectSchema.index({ members: 1 });

module.exports = mongoose.model("Project", projectSchema);
