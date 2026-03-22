const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: [150, 'Course name cannot exceed 150 characters'],
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Course code cannot exceed 20 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: [true, 'Faculty is required'],
    },
    semester: {
      type: String,
      trim: true,
      default: 'Fall 2024',
    },
    credits: {
      type: Number,
      default: 3,
    },
    schedule: {
      type: String,
      trim: true,
      default: 'TBA',
    },
    room: {
      type: String,
      trim: true,
      default: 'TBA',
    },
    syllabus: [
      {
        week: Number,
        topic: String,
        description: String,
      },
    ],
    materials: [
      {
        title: String,
        url: String,
        type: { type: String, default: 'PDF' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ code: 1 }, { unique: true });
courseSchema.index({ faculty: 1 });

module.exports = mongoose.model('Course', courseSchema);
