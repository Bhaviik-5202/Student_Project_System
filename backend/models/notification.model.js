/**
 * Notification Model
 * Defines the schema for system alerts and user notifications, supporting rich metadata and read-state management.
 */
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
      lowercase: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    /**
     * Optional metadata
     * Example: { meetingId, link, etc. }
     */
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
