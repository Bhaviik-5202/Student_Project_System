const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String },
    rating: { type: Number },
    category: { type: String },
    role: { type: String, default: 'Guest' },
    type: { type: String, enum: ['Inquiry', 'Feedback'], default: 'Inquiry' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
