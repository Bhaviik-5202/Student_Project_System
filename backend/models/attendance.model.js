const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },

    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
    },

    status: {
      type: String,
      enum: {
        values: ['present', 'absent', 'late', 'excused'],
        message: 'Invalid attendance status',
      },
      required: [true, 'Attendance status is required'],
      lowercase: true,
      trim: true,
    },

    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      default: null,
    },

    time: {
      type: String,
      trim: true,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, date: 1, meeting: 1 }, { unique: true });

attendanceSchema.index({ date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
