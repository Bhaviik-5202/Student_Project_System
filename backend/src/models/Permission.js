const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: String, required: true },
  canRead: { type: Boolean, default: false },
  canWrite: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Permission", permissionSchema);
