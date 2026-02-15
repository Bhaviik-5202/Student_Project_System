const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema({
  fileName: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Backup model for MongoDB
module.exports = mongoose.model("Backup", backupSchema);
