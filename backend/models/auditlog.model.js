const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
      maxlength: [200, "Action cannot exceed 200 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: false,
      default: null,
    },
    details: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "Warning"],
      default: "Success",
    },
    ip: {
      type: String,
      trim: true,
      default: "127.0.0.1",
    },
  },
  {
    timestamps: true,
  },
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
