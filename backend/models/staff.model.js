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

    department: {
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
