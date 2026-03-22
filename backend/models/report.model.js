const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: [
        'project-status',
        'student-performance',
        'attendance',
        'resource-utilization',
        'timeline',
        'guide-performance',
      ],
      required: true,
    },
    format: {
      type: String,
      enum: ['pdf', 'excel', 'csv', 'word'],
      required: true,
    },
    size: { type: String, default: '0 KB' },
    status: {
      type: String,
      enum: ['generating', 'ready', 'failed'],
      default: 'ready',
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parameters: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
