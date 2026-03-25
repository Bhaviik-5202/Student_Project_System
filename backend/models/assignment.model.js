/**
 * Assignment Model
 * Defines the schema for academic assignments, including instructions, due dates, and rubrics.
 */
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },
    instructions: {
      type: String,
      trim: true,
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },

    attachments: [
      {
        type: String,
      },
    ],

    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
      },
    ],

    rubric: {
      name: { type: String, default: 'Evaluation Rubric' },
      criteria: [
        {
          id: { type: Number },
          criterion: { type: String },
          maxPoints: { type: Number },
          description: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ course: 1, dueDate: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
