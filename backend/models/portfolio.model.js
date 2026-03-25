/**
 * Portfolio Model
 * Defines the schema for student project showcases, tracking skill sets, earned badges, and academic transcripts.
 */
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    badges: [
      {
        type: String,
        trim: true,
      },
    ],
    transcriptUrl: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ student: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
