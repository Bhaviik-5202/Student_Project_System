/**
 * Evaluation Model
 * Defines the schema for assessment scores and feedback across students, projects, and academic assignments.
 */
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Evaluator is required'],
      index: true,
    },
    evaluatee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Evaluatee is required'],
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      default: null,
    },
    criteria: [
      {
        criterion: {
          type: String,
          trim: true,
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: [0, 'Score cannot be less than 0'],
        },
        feedback: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
    type: {
      type: String,
      enum: ['self', 'peer', 'faculty'],
      default: 'peer',
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

evaluationSchema.index({ evaluator: 1, evaluatee: 1 });
evaluationSchema.index({ project: 1 });
evaluationSchema.index({ assignment: 1 });

module.exports = mongoose.model('Evaluation', evaluationSchema);
