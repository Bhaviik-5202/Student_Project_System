/**
 * Discussion Model
 * Defines the schema for forum threads and project discussions, supporting nested reply structures.
 */
const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Discussion title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Discussion content is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Project', 'Technical', 'Announcement', 'General'],
      default: 'General',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

discussionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);
