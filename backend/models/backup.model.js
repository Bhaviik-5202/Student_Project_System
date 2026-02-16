const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
      maxlength: [255, "File name cannot exceed 255 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy user is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

backupSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Backup", backupSchema);
