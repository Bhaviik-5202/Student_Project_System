/**
 * Student Model
 * Defines the schema for students, tracking academic enrollment, project participation, and performance grades.
 */
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
    enrollmentNumber: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Computer Engineering',
    },
    year: {
      type: Number,
      default: 1,
      min: [1, 'Year must be at least 1'],
      max: [5, 'Year cannot exceed 5'],
      index: true,
    },
    semester: {
      type: String,
      trim: true,
      default: 'Sem 1',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'active', 'inactive'],
      default: 'Active',
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
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
