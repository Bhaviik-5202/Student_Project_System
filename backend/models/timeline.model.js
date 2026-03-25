/**
 * Timeline Model
 * Defines the schema for project management timelines, tracking milestones, development sprints, and task completion.
 */
const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    milestones: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, 'Milestone title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          default: null,
        },
        dueDate: {
          type: Date,
          default: null,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    sprints: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: [150, 'Sprint name cannot exceed 150 characters'],
        },
        startDate: {
          type: Date,
          default: null,
        },
        endDate: {
          type: Date,
          default: null,
        },
        tasks: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

timelineSchema.index({ project: 1 }, { unique: true });
timelineSchema.index({ 'milestones.completed': 1 });

module.exports = mongoose.model('Timeline', timelineSchema);
