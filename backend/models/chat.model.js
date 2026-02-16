const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [150, "Chat name cannot exceed 150 characters"],
      default: null,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  },
);

chatSchema.index({ members: 1 });
chatSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
