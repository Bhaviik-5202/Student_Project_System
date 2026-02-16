const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
      index: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment is required"],
      index: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },
    grade: {
      type: String,
      trim: true,
      maxlength: [5, "Grade cannot exceed 5 characters"],
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({ student: 1, assignment: 1 }, { unique: true });
submissionSchema.index({ assignment: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);
