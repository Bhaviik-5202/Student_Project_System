const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxlength: [150, "Course name cannot exceed 150 characters"],
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      uppercase: true,
      maxlength: [20, "Course code cannot exceed 20 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Faculty is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.index({ code: 1 }, { unique: true });
courseSchema.index({ faculty: 1 });

module.exports = mongoose.model("Course", courseSchema);
