const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
      maxlength: [255, "File name cannot exceed 255 characters"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

fileSchema.index({ uploader: 1, createdAt: -1 });

module.exports = mongoose.model("File", fileSchema);
