const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

knowledgeBaseSchema.index({ createdAt: -1 });
knowledgeBaseSchema.index({ title: 1 });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
