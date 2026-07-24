/**
 * Meeting Model
 * Defines the schema for scheduled meetings, tracking participants, locations, and project associations.
 */
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    date: {
      type: Date,
      required: [true, 'Meeting date is required'],
    },
    time: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: ['team', 'project', 'one_on_one', 'client', 'review', 'faculty'],
      default: 'review',
      lowercase: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    location: {
      type: String,
      trim: true,
      default: 'Online',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    status: {
      type: String,
      enum: ['scheduled', 'upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

meetingSchema.index({ date: 1 });
meetingSchema.index({ project: 1 });
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ participants: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);
