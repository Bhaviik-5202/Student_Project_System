const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [200, 'Email cannot exceed 200 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [50, 'Roll number cannot exceed 50 characters'],
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
    },

    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1, 'Year must be at least 1'],
      max: [5, 'Year cannot exceed 5'],
      index: true,
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],

    grades: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Project',
          required: true,
        },
        grade: {
          type: String,
          trim: true,
          maxlength: [5, 'Grade cannot exceed 5 characters'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ department: 1, year: 1 });

module.exports = mongoose.model('Student', studentSchema);
