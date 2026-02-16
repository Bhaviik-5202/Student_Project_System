const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: [500, "Question cannot exceed 500 characters"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

faqSchema.index({ createdAt: -1 });

module.exports = mongoose.model("FAQ", faqSchema);
