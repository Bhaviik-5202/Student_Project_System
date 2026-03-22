const mongoose = require('mongoose');

const projectTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project type name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    maxStudents: {
      type: Number,
      required: [true, 'Maximum students is required'],
      min: [1, 'At least 1 student is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProjectType', projectTypeSchema);
