const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
      index: true,
    },

    date: {
      type: Date,
      required: [true, "Attendance date is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["present", "absent", "late", "excused"],
        message: "Invalid attendance status",
      },
      required: [true, "Attendance status is required"],
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

attendanceSchema.index({ date: -1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
