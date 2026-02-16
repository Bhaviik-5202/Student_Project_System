const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    date: {
      type: Date,
      required: [true, "Meeting date is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["team", "project"],
      default: "team",
      lowercase: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

meetingSchema.index({ date: 1 });
meetingSchema.index({ project: 1 });
meetingSchema.index({ participants: 1 });

module.exports = mongoose.model("Meeting", meetingSchema);
