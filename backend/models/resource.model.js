/**
 * Resource Model
 * Represents shared materials like documents, templates, and videos.
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
      enum: ['document', 'template', 'video'],
      required: [true, 'Resource type is required'],
      lowercase: true,
      trim: true,
      index: true,
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
