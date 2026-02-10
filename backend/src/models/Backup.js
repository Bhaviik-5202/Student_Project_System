const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema({
  fileName: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Backup", backupSchema);
