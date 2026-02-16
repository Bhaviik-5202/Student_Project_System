const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    module: {
      type: String,
      required: [true, "Module name is required"],
      trim: true,
      maxlength: [100, "Module name cannot exceed 100 characters"],
    },
    canRead: {
      type: Boolean,
      default: false,
    },
    canWrite: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

permissionSchema.index({ user: 1, module: 1 }, { unique: true });

module.exports = mongoose.model("Permission", permissionSchema);
