/**
 * Resource Model
 * Defines the schema for shared academic materials, including documents, templates, and video resources.
 */
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      lowercase: true,
      trim: true,
      index: true,
      default: 'document',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    fileSize: {
      type: String,
      trim: true,
      default: '1.2 MB',
    },
    fileType: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'pdf',
    },
    downloadsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'draft'],
      default: 'active',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ uploadedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);
