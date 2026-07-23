/**
 * Staff Model
 * Defines the schema for faculty and administrative staff members, managing professional profiles and departmental roles.
 */
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
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

    facultyId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'Computer Engineering',
    },
    designation: {
      type: String,
      trim: true,
      default: 'Assistant Professor',
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
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: ['faculty', 'admin', 'coordinator', 'hod'],
      default: 'faculty',
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Staff', staffSchema);
