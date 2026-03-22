const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'File URL is required'],
    },
    size: {
      type: String,
      default: '0 KB',
    },
    type: {
      type: String,
      default: 'other',
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

sharedFileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SharedFile', sharedFileSchema);
